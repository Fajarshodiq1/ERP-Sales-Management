import React, { ReactNode, useMemo } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { Outreach, TargetAccount, Contact } from "@/types/crm";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    Send,
    Target,
    Users,
    Radio,
    Phone,
    Mail,
    Linkedin,
    MapPin,
    CalendarClock,
    CheckCircle2,
} from "lucide-react";

import {
    PageHeader,
    FormCard,
    FormSection,
    FormField,
    FormActions,
    RichTextEditor,
} from "@/components/form";

interface Props {
    outreach?: Outreach;
    targetAccounts: (Pick<TargetAccount, "id" | "account_id"> & {
        account?: { company_name: string };
    })[];
    contacts: Pick<Contact, "id" | "name">[];
    selectedTargetAccountId?: number | null;
    selectedContactId?: number | null;
}

const CHANNEL_OPTIONS = [
    { value: "phone", label: "Telepon", icon: Phone },
    { value: "email", label: "Email", icon: Mail },
    { value: "linkedin", label: "LinkedIn", icon: Linkedin },
    {
        value: "offline_visit",
        label: "Kunjungan Langsung (Offline)",
        icon: MapPin,
    },
];

const RESULT_OPTIONS = [
    { value: "no_answer", label: "Tidak Diangkat / Tidak Dibalas" },
    { value: "busy", label: "Sedang Sibuk" },
    { value: "not_interested", label: "Tidak Tertarik" },
    { value: "follow_up_requested", label: "Diminta Follow-up" },
    { value: "interested", label: "Tertarik" },
];

const RESULT_STYLES: Record<string, string> = {
    no_answer: "bg-muted text-muted-foreground",
    busy: "bg-muted text-muted-foreground",
    not_interested: "bg-destructive/10 text-destructive",
    follow_up_requested: "bg-amber-500/10 text-amber-600",
    interested: "bg-primary/10 text-primary",
};

function formatOutreachDate(value: string) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function Form({
    outreach,
    targetAccounts = [],
    contacts = [],
    selectedTargetAccountId = null,
    selectedContactId = null,
}: Props) {
    const isEdit = !!outreach;

    const { data, setData, post, put, errors, processing } = useForm({
        target_account_id:
            outreach?.target_account_id?.toString() ||
            selectedTargetAccountId?.toString() ||
            "",
        contact_id:
            outreach?.contact_id?.toString() ||
            selectedContactId?.toString() ||
            "",
        channel: outreach?.channel || "",
        outreach_date: outreach?.outreach_date
            ? outreach.outreach_date.substring(0, 16) // format datetime-local
            : "",
        result: outreach?.result || "",
        notes: outreach?.notes || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (outreach) {
            put(`/outreach/${outreach.id}`);
        } else {
            post("/outreach");
        }
    };

    const selectedTargetAccount = useMemo(
        () =>
            targetAccounts.find(
                (ta) => ta.id.toString() === data.target_account_id,
            ),
        [targetAccounts, data.target_account_id],
    );
    const selectedContact = useMemo(
        () => contacts.find((c) => c.id.toString() === data.contact_id),
        [contacts, data.contact_id],
    );
    const selectedChannel = useMemo(
        () => CHANNEL_OPTIONS.find((c) => c.value === data.channel),
        [data.channel],
    );
    const formattedDate = useMemo(
        () => formatOutreachDate(data.outreach_date),
        [data.outreach_date],
    );
    const ChannelIcon = selectedChannel?.icon ?? Radio;

    return (
        <>
            <Head title={isEdit ? "Edit Outreach" : "Catat Outreach Baru"} />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                <PageHeader
                    // icon={Send}
                    title={isEdit ? "Edit Outreach" : "Catat Outreach Baru"}
                    description={
                        isEdit
                            ? "Perbarui detail aktivitas outreach ini."
                            : "Catat aktivitas komunikasi dengan target account atau contact."
                    }
                    // backHref="/outreach"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <FormCard
                        title={
                            isEdit
                                ? "Edit Detail Outreach"
                                : "Informasi Outreach"
                        }
                        description={
                            isEdit
                                ? "Perbarui detail outreach di bawah ini."
                                : "Lengkapi data di bawah ini untuk mencatat aktivitas outreach baru."
                        }
                        onSubmit={handleSubmit}
                        className="lg:col-span-2"
                    >
                        <FormSection title="Relasi Target">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    label="Target Account"
                                    htmlFor="target_account_id"
                                    required
                                    error={errors.target_account_id}
                                >
                                    <Select
                                        value={data.target_account_id}
                                        onValueChange={(value) =>
                                            setData("target_account_id", value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="target_account_id"
                                            className={`w-full ${errors.target_account_id ? "border-destructive" : ""}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Target className="h-4 w-4 text-muted-foreground" />
                                                <SelectValue placeholder="Pilih Target Account" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {targetAccounts.map((ta) => (
                                                <SelectItem
                                                    key={ta.id}
                                                    value={ta.id.toString()}
                                                >
                                                    {ta.account?.company_name ??
                                                        `Target Account #${ta.id}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField
                                    label="Contact Person"
                                    htmlFor="contact_id"
                                    error={errors.contact_id}
                                >
                                    <Select
                                        value={data.contact_id}
                                        onValueChange={(value) =>
                                            setData("contact_id", value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="contact_id"
                                            className={`w-full ${errors.contact_id ? "border-destructive" : ""}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <SelectValue placeholder="Pilih Contact (opsional)" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {contacts.map((c) => (
                                                <SelectItem
                                                    key={c.id}
                                                    value={c.id.toString()}
                                                >
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Detail Aktivitas">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    label="Channel"
                                    htmlFor="channel"
                                    required
                                    error={errors.channel}
                                >
                                    <Select
                                        value={data.channel}
                                        onValueChange={(value) =>
                                            setData("channel", value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="channel"
                                            className={`w-full ${errors.channel ? "border-destructive" : ""}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Radio className="h-4 w-4 text-muted-foreground" />
                                                <SelectValue placeholder="Pilih Channel" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CHANNEL_OPTIONS.map((opt) => (
                                                <SelectItem
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField
                                    label="Tanggal & Waktu Outreach"
                                    htmlFor="outreach_date"
                                    required
                                    error={errors.outreach_date}
                                >
                                    <div className="relative">
                                        <CalendarClock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="outreach_date"
                                            type="datetime-local"
                                            value={data.outreach_date}
                                            onChange={(e) =>
                                                setData(
                                                    "outreach_date",
                                                    e.target.value,
                                                )
                                            }
                                            className={`pl-9 ${errors.outreach_date ? "border-destructive" : ""}`}
                                        />
                                    </div>
                                </FormField>

                                <FormField
                                    label="Hasil (Result)"
                                    htmlFor="result"
                                    required
                                    error={errors.result}
                                    className="md:col-span-2"
                                >
                                    <Select
                                        value={data.result}
                                        onValueChange={(value) =>
                                            setData("result", value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="result"
                                            className={`w-full ${errors.result ? "border-destructive" : ""}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                                <SelectValue placeholder="Pilih Hasil" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {RESULT_OPTIONS.map((opt) => (
                                                <SelectItem
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Catatan">
                            <FormField
                                label="Catatan Outreach"
                                htmlFor="notes"
                                error={errors.notes}
                            >
                                <RichTextEditor
                                    value={data.notes}
                                    onChange={(html) => setData("notes", html)}
                                    hasError={!!errors.notes}
                                    placeholder="Tambahkan detail percakapan, respon dari contact, atau rencana tindak lanjut..."
                                    minHeight="150px"
                                />
                            </FormField>
                        </FormSection>

                        <FormActions
                            cancelHref="/outreach"
                            submitLabel={
                                isEdit ? "Perbarui Outreach" : "Simpan Outreach"
                            }
                            processing={processing}
                        />
                    </FormCard>

                    {/* Live preview sidebar */}
                    <div className="lg:col-span-1 lg:sticky lg:top-6">
                        <div className="rounded-xl border border-border bg-card p-6">
                            <p className="text-xs font-medium text-muted-foreground mb-4">
                                Pratinjau Aktivitas
                            </p>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <ChannelIcon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-foreground">
                                        {selectedTargetAccount?.account
                                            ?.company_name ||
                                            "Target account belum dipilih"}
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {selectedContact?.name ||
                                            "Tanpa contact person"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-5">
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                    {selectedChannel?.label ||
                                        "Channel belum dipilih"}
                                </span>
                                {data.result && (
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${RESULT_STYLES[data.result]}`}
                                    >
                                        {
                                            RESULT_OPTIONS.find(
                                                (o) => o.value === data.result,
                                            )?.label
                                        }
                                    </span>
                                )}
                            </div>

                            <div className="flex items-start gap-2.5 text-sm">
                                <CalendarClock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-muted-foreground text-xs">
                                        Waktu Outreach
                                    </p>
                                    <p className="text-foreground">
                                        {formattedDate || "Belum dijadwalkan"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Form.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Outreach", href: "/outreach" },
            { title: "Form Outreach", href: "#" },
        ]}
    >
        {page}
    </AppLayout>
);

export default Form;
