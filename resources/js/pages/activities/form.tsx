import React, { ReactNode, useMemo } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import {
    Calendar,
    PhoneCall,
    Users,
    Mail,
    MapPin,
    Presentation,
    CheckCircle2,
    CalendarClock,
    FileText,
    Building2,
} from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    PageHeader,
    FormCard,
    FormSection,
    FormField,
    FormActions,
    IconInput,
    RichTextEditor,
} from "@/components/form";

export interface Activity {
    id: string;
    user_id: string;
    account_id: string;
    contact_id?: string;
    type: string;
    performed_at: string;
    result: string;
    notes?: string;
    next_action?: string;
    follow_up_date?: string;
}

interface AccountOption {
    id: string | number;
    company_name: string;
}

interface ContactOption {
    id: string | number;
    name: string;
    account_id: string | number;
}

interface UserOption {
    id: string | number;
    name: string;
}

interface Props {
    activity?: Activity;
    accounts: AccountOption[];
    contacts: ContactOption[];
    users: UserOption[];
}

const activityTypes = [
    { value: "call", label: "Phone Call", icon: PhoneCall },
    { value: "meeting", label: "Meeting", icon: Users },
    { value: "email", label: "Email", icon: Mail },
    { value: "site_visit", label: "Site Visit", icon: MapPin },
    { value: "demo", label: "Product Demo", icon: Presentation },
];

const formatLocalDateTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatReadableDate = (localDateTime: string) => {
    if (!localDateTime) return null;
    const date = new Date(localDateTime);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

function FormActivity({
    activity,
    accounts = [],
    contacts = [],
    users = [],
}: Props) {
    const isEdit = !!activity;

    const { data, setData, post, put, errors, processing } = useForm({
        user_id: activity?.user_id ? String(activity.user_id) : "",
        account_id: activity?.account_id ? String(activity.account_id) : "",
        contact_id: activity?.contact_id ? String(activity.contact_id) : "",
        type: activity?.type || "call",
        performed_at: activity?.performed_at
            ? formatLocalDateTime(activity.performed_at)
            : formatLocalDateTime(new Date().toISOString()),
        result: activity?.result || "",
        notes: activity?.notes || "",
        next_action: activity?.next_action || "",
        follow_up_date: activity?.follow_up_date
            ? formatLocalDateTime(activity.follow_up_date)
            : "",
    });

    const filteredContacts = data.account_id
        ? contacts.filter(
              (c) => String(c.account_id) === String(data.account_id),
          )
        : contacts;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (activity) {
            put(`/activities/${activity.id}`);
        } else {
            post("/activities");
        }
    };

    const selectedAccount = useMemo(
        () => accounts.find((a) => String(a.id) === data.account_id),
        [accounts, data.account_id],
    );
    const selectedContact = useMemo(
        () => contacts.find((c) => String(c.id) === data.contact_id),
        [contacts, data.contact_id],
    );
    const selectedUser = useMemo(
        () => users.find((u) => String(u.id) === data.user_id),
        [users, data.user_id],
    );
    const selectedType = useMemo(
        () => activityTypes.find((t) => t.value === data.type),
        [data.type],
    );
    const TypeIcon = selectedType?.icon ?? Calendar;
    const performedReadable = formatReadableDate(data.performed_at);
    const followUpReadable = formatReadableDate(data.follow_up_date);

    return (
        <>
            <Head title={isEdit ? "Edit Activity" : "Create Activity"} />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                <PageHeader
                    // icon={Calendar}
                    title={isEdit ? "Edit Activity" : "Create Activity"}
                    description={
                        isEdit
                            ? "Perbarui detail aktivitas penjualan yang telah dicatat."
                            : "Catat aktivitas interaksi baru dengan klien atau prospek."
                    }
                    // backHref="/activities"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <FormCard
                        title={
                            isEdit
                                ? "Edit Detail Aktivitas"
                                : "Formulir Aktivitas Sales"
                        }
                        description={
                            isEdit
                                ? "Perbarui informasi aktivitas di bawah ini."
                                : "Lengkapi bidang di bawah ini untuk mencatat aktivitas baru."
                        }
                        onSubmit={handleSubmit}
                        className="lg:col-span-2"
                    >
                        <FormSection title="Informasi Utama">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    label="Sales / User"
                                    htmlFor="user_id"
                                    required
                                    error={errors.user_id}
                                >
                                    <Select
                                        value={data.user_id}
                                        onValueChange={(value) =>
                                            setData("user_id", value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="user_id"
                                            className={`w-full ${
                                                errors.user_id
                                                    ? "border-destructive"
                                                    : ""
                                            }`}
                                        >
                                            <SelectValue placeholder="Pilih Sales Person" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((u) => (
                                                <SelectItem
                                                    key={u.id}
                                                    value={String(u.id)}
                                                >
                                                    {u.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField
                                    label="Account / Perusahaan"
                                    htmlFor="account_id"
                                    required
                                    error={errors.account_id}
                                >
                                    <Select
                                        value={data.account_id}
                                        onValueChange={(value) => {
                                            setData((prev) => ({
                                                ...prev,
                                                account_id: value,
                                                contact_id: "",
                                            }));
                                        }}
                                    >
                                        <SelectTrigger
                                            id="account_id"
                                            className={`w-full ${
                                                errors.account_id
                                                    ? "border-destructive"
                                                    : ""
                                            }`}
                                        >
                                            <SelectValue placeholder="Pilih Perusahaan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map((acc) => (
                                                <SelectItem
                                                    key={acc.id}
                                                    value={String(acc.id)}
                                                >
                                                    {acc.company_name}
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
                                        disabled={!data.account_id}
                                    >
                                        <SelectTrigger
                                            id="contact_id"
                                            className="w-full"
                                        >
                                            <SelectValue
                                                placeholder={
                                                    !data.account_id
                                                        ? "Pilih Account Terlebih Dahulu"
                                                        : filteredContacts.length ===
                                                            0
                                                          ? "Tidak ada kontak"
                                                          : "Pilih Contact Person"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredContacts.map((contact) => (
                                                <SelectItem
                                                    key={contact.id}
                                                    value={String(contact.id)}
                                                >
                                                    {contact.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField
                                    label="Tipe Aktivitas"
                                    htmlFor="type"
                                    required
                                    error={errors.type}
                                >
                                    <Select
                                        value={data.type}
                                        onValueChange={(value) =>
                                            setData("type", value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="type"
                                            className={`w-full ${
                                                errors.type
                                                    ? "border-destructive"
                                                    : ""
                                            }`}
                                        >
                                            <SelectValue placeholder="Pilih Tipe Aktivitas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {activityTypes.map((item) => {
                                                const Icon = item.icon;
                                                return (
                                                    <SelectItem
                                                        key={item.value}
                                                        value={item.value}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Icon className="w-4 h-4 text-muted-foreground" />
                                                            <span>
                                                                {item.label}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField
                                    label="Waktu Pelaksanaan"
                                    htmlFor="performed_at"
                                    required
                                    error={errors.performed_at}
                                    className="md:col-span-2"
                                >
                                    <IconInput
                                        id="performed_at"
                                        type="datetime-local"
                                        icon={CalendarClock}
                                        hasError={!!errors.performed_at}
                                        value={data.performed_at}
                                        onChange={(e) =>
                                            setData(
                                                "performed_at",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Hasil & Catatan">
                            <div className="space-y-4">
                                <FormField
                                    label="Hasil Utama / Summary"
                                    htmlFor="result"
                                    required
                                    error={errors.result}
                                >
                                    <IconInput
                                        id="result"
                                        icon={CheckCircle2}
                                        hasError={!!errors.result}
                                        placeholder="Contoh: Klien setuju dengan draf penawaran"
                                        value={data.result}
                                        onChange={(e) =>
                                            setData("result", e.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Catatan Detail"
                                    htmlFor="notes"
                                    error={errors.notes}
                                >
                                    <RichTextEditor
                                        value={data.notes}
                                        onChange={(html) =>
                                            setData("notes", html)
                                        }
                                        hasError={!!errors.notes}
                                        placeholder="Detail diskusikan dan poin-poin penting..."
                                        minHeight="120px"
                                    />
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Tindak Lanjut (Follow Up)">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    label="Next Action"
                                    htmlFor="next_action"
                                    error={errors.next_action}
                                >
                                    <IconInput
                                        id="next_action"
                                        icon={FileText}
                                        hasError={!!errors.next_action}
                                        placeholder="Contoh: Kirim draf kontrak revisi"
                                        value={data.next_action}
                                        onChange={(e) =>
                                            setData(
                                                "next_action",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Jadwal Follow Up"
                                    htmlFor="follow_up_date"
                                    error={errors.follow_up_date}
                                >
                                    <IconInput
                                        id="follow_up_date"
                                        type="datetime-local"
                                        icon={CalendarClock}
                                        hasError={!!errors.follow_up_date}
                                        value={data.follow_up_date}
                                        onChange={(e) =>
                                            setData(
                                                "follow_up_date",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </FormField>
                            </div>
                        </FormSection>

                        <FormActions
                            cancelHref="/activities"
                            submitLabel={
                                isEdit
                                    ? "Perbarui Aktivitas"
                                    : "Simpan Aktivitas"
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
                                    <TypeIcon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-foreground">
                                        {selectedAccount?.company_name ||
                                            "Account belum dipilih"}
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {selectedContact?.name ||
                                            "Tanpa contact person"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                    {selectedType?.label ||
                                        "Tipe belum dipilih"}
                                </span>
                                {selectedUser && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                        {selectedUser.name}
                                    </span>
                                )}
                            </div>

                            {/* Mini timeline: activity -> follow up */}
                            <div className="relative pl-5 space-y-4">
                                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

                                <div className="relative">
                                    <span className="absolute -left-5 top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                                    <p className="text-xs text-muted-foreground">
                                        Dilaksanakan
                                    </p>
                                    <p className="text-sm text-foreground">
                                        {performedReadable || "Belum diatur"}
                                    </p>
                                </div>

                                <div className="relative">
                                    <span
                                        className={`absolute -left-5 top-1 h-2.5 w-2.5 rounded-full ${
                                            data.follow_up_date
                                                ? "bg-amber-500"
                                                : "bg-border"
                                        }`}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Follow Up
                                    </p>
                                    <p className="text-sm text-foreground">
                                        {followUpReadable ||
                                            "Belum dijadwalkan"}
                                    </p>
                                    {data.next_action && (
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {data.next_action}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

FormActivity.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Activities", href: "/activities" },
            { title: "Form", href: "#" },
        ]}
    >
        {page}
    </AppLayout>
);

export default FormActivity;
