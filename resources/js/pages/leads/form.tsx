import React, { ReactNode, useMemo } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { Account, BusinessPillar, Contact, User } from "@/types/crm";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    UserPlus,
    Building2,
    Users,
    Layers,
    UserCheck,
    Radio,
    ClipboardList,
} from "lucide-react";

import {
    PageHeader,
    FormCard,
    FormSection,
    FormField,
    FormActions,
} from "@/components/form";

interface Props {
    accounts: Pick<Account, "id" | "company_name">[];
    contacts: Pick<Contact, "id" | "account_id" | "name">[];
    businessPillars: Pick<BusinessPillar, "id" | "name">[];
    users: Pick<User, "id" | "name">[];
}

// Sesuaikan dengan enum/constant lead_source & status yang sebenarnya di project kamu
const LEAD_SOURCE_OPTIONS = [
    { value: "referral", label: "Referral" },
    { value: "cold_call", label: "Cold Call" },
    { value: "event", label: "Event / Pameran" },
    { value: "website", label: "Website" },
    { value: "social_media", label: "Social Media" },
    { value: "other", label: "Lainnya" },
];

const STATUS_OPTIONS = [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "unqualified", label: "Unqualified" },
];

function Form({
    accounts = [],
    contacts = [],
    businessPillars = [],
    users = [],
}: Props) {
    const { data, setData, post, errors, processing } = useForm({
        lead_name: "",
        account_id: "",
        contact_id: "",
        business_pillar_id: "",
        user_id: "",
        lead_source: "",
        status: "new",
        potential_need: "",
        notes: "",
    });

    // Filter contact berdasarkan account yang dipilih, tanpa reload ke server
    const filteredContacts = useMemo(() => {
        if (!data.account_id) return [];
        return contacts.filter(
            (c) => c.account_id.toString() === data.account_id,
        );
    }, [contacts, data.account_id]);

    const handleAccountChange = (value: string) => {
        setData("account_id", value);
        setData("contact_id", ""); // reset contact karena account berubah
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/leads");
    };

    const selectedAccount = useMemo(
        () => accounts.find((a) => a.id.toString() === data.account_id),
        [accounts, data.account_id],
    );
    const selectedContact = useMemo(
        () => contacts.find((c) => c.id.toString() === data.contact_id),
        [contacts, data.contact_id],
    );
    const selectedPillar = useMemo(
        () =>
            businessPillars.find(
                (p) => p.id.toString() === data.business_pillar_id,
            ),
        [businessPillars, data.business_pillar_id],
    );
    const selectedUser = useMemo(
        () => users.find((u) => u.id.toString() === data.user_id),
        [users, data.user_id],
    );
    const selectedSource = useMemo(
        () => LEAD_SOURCE_OPTIONS.find((o) => o.value === data.lead_source),
        [data.lead_source],
    );
    const statusLabel =
        STATUS_OPTIONS.find((o) => o.value === data.status)?.label ??
        data.status;

    return (
        <>
            <Head title="Tambah Lead Baru" />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                <PageHeader
                    // icon={UserPlus}
                    title="Tambah Lead Baru"
                    description="Catat calon prospek baru ke dalam sistem untuk ditindaklanjuti."
                    // backHref="/leads"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <FormCard
                        title="Informasi Lead"
                        description="Lengkapi data di bawah ini untuk mendaftarkan lead baru."
                        onSubmit={handleSubmit}
                        className="lg:col-span-2"
                    >
                        <FormSection title="Identitas Lead">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    label="Nama Lead"
                                    htmlFor="lead_name"
                                    required
                                    error={errors.lead_name}
                                >
                                    <Input
                                        id="lead_name"
                                        value={data.lead_name}
                                        onChange={(e) =>
                                            setData("lead_name", e.target.value)
                                        }
                                        placeholder="Contoh: Proyek Digitalisasi Gudang PT Maju Jaya"
                                        className={
                                            errors.lead_name
                                                ? "border-destructive"
                                                : ""
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Sumber Lead"
                                    htmlFor="lead_source"
                                    required
                                    error={errors.lead_source}
                                >
                                    <Select
                                        value={data.lead_source}
                                        onValueChange={(value) =>
                                            setData("lead_source", value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="lead_source"
                                            className={`w-full ${errors.lead_source ? "border-destructive" : ""}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Radio className="h-4 w-4 text-muted-foreground" />
                                                <SelectValue placeholder="Pilih Sumber Lead" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LEAD_SOURCE_OPTIONS.map((opt) => (
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

                        <FormSection title="Relasi & Entitas Bisnis">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    label="Perusahaan / Account"
                                    htmlFor="account_id"
                                    required
                                    error={errors.account_id}
                                >
                                    <Select
                                        value={data.account_id}
                                        onValueChange={handleAccountChange}
                                    >
                                        <SelectTrigger
                                            id="account_id"
                                            className={`w-full ${errors.account_id ? "border-destructive" : ""}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                                <SelectValue placeholder="Pilih Perusahaan / Account" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map((acc) => (
                                                <SelectItem
                                                    key={acc.id}
                                                    value={acc.id.toString()}
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
                                    required
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
                                            className={`w-full ${errors.contact_id ? "border-destructive" : ""}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <SelectValue
                                                    placeholder={
                                                        data.account_id
                                                            ? "Pilih Contact"
                                                            : "Pilih Account terlebih dahulu"
                                                    }
                                                />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredContacts.map((c) => (
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

                                <FormField
                                    label="Pilar Bisnis"
                                    htmlFor="business_pillar_id"
                                    required
                                    error={errors.business_pillar_id}
                                >
                                    <Select
                                        value={data.business_pillar_id}
                                        onValueChange={(value) =>
                                            setData("business_pillar_id", value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="business_pillar_id"
                                            className={`w-full ${errors.business_pillar_id ? "border-destructive" : ""}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Layers className="h-4 w-4 text-muted-foreground" />
                                                <SelectValue placeholder="Pilih Pilar Bisnis" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {businessPillars.map((pillar) => (
                                                <SelectItem
                                                    key={pillar.id}
                                                    value={pillar.id.toString()}
                                                >
                                                    {pillar.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField
                                    label="Ditugaskan Kepada"
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
                                            className={`w-full ${errors.user_id ? "border-destructive" : ""}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                                                <SelectValue placeholder="Pilih Sales / User" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((u) => (
                                                <SelectItem
                                                    key={u.id}
                                                    value={u.id.toString()}
                                                >
                                                    {u.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Detail Kebutuhan">
                            <div className="grid grid-cols-1 gap-4">
                                <FormField
                                    label="Potensi Kebutuhan"
                                    htmlFor="potential_need"
                                    error={errors.potential_need}
                                >
                                    <Textarea
                                        id="potential_need"
                                        value={data.potential_need}
                                        onChange={(e) =>
                                            setData(
                                                "potential_need",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Jelaskan kebutuhan atau masalah yang berpotensi bisa diselesaikan..."
                                        rows={3}
                                        className={
                                            errors.potential_need
                                                ? "border-destructive"
                                                : ""
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Catatan"
                                    htmlFor="notes"
                                    error={errors.notes}
                                >
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        placeholder="Catatan tambahan mengenai lead ini..."
                                        rows={3}
                                        className={
                                            errors.notes
                                                ? "border-destructive"
                                                : ""
                                        }
                                    />
                                </FormField>
                            </div>
                        </FormSection>

                        <FormActions
                            cancelHref="/leads"
                            submitLabel="Simpan Lead"
                            processing={processing}
                        />
                    </FormCard>

                    {/* Live preview sidebar */}
                    <div className="lg:col-span-1 lg:sticky lg:top-6">
                        <div className="rounded-xl border border-border bg-card p-6">
                            <p className="text-xs font-medium text-muted-foreground mb-4">
                                Pratinjau Lead
                            </p>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <ClipboardList className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-foreground">
                                        {data.lead_name || "Nama Lead"}
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {selectedAccount?.company_name ||
                                            "Perusahaan belum dipilih"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-5">
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                    {statusLabel}
                                </span>
                                {selectedSource && (
                                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                        {selectedSource.label}
                                    </span>
                                )}
                            </div>

                            <dl className="space-y-3 text-sm">
                                <div className="flex items-start gap-2.5">
                                    <Users className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground text-xs">
                                            Contact Person
                                        </dt>
                                        <dd className="truncate text-foreground">
                                            {selectedContact?.name || "—"}
                                        </dd>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Layers className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground text-xs">
                                            Pilar Bisnis
                                        </dt>
                                        <dd className="truncate text-foreground">
                                            {selectedPillar?.name || "—"}
                                        </dd>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <UserCheck className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground text-xs">
                                            Ditugaskan Kepada
                                        </dt>
                                        <dd className="truncate text-foreground">
                                            {selectedUser?.name || "—"}
                                        </dd>
                                    </div>
                                </div>
                            </dl>
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
            { title: "Leads", href: "/leads" },
            { title: "Form Lead", href: "#" },
        ]}
    >
        {page}
    </AppLayout>
);

export default Form;
