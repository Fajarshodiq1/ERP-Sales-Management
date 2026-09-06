import React, { ReactNode, useMemo } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { Account, BusinessPillar } from "@/types/crm";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Building2,
    Briefcase,
    MapPin,
    Phone,
    Mail,
    Globe,
    Layers,
    CheckCircle2,
    Clock,
    XCircle,
} from "lucide-react";

import {
    PageHeader,
    FormCard,
    FormSection,
    FormField,
    FormActions,
    IconInput,
    RichTextEditor,
} from "@/components/form";

interface Props {
    account?: Account;
    businessPillars: Pick<BusinessPillar, "id" | "name">[];
}

const STATUS_OPTIONS = [
    {
        value: "active",
        label: "Active",
        icon: CheckCircle2,
        activeClass:
            "border-green-600 bg-green-500/10 text-green-600 dark:border-green-500 dark:text-green-400",
    },
    {
        value: "pending",
        label: "Pending",
        icon: Clock,
        activeClass:
            "border-yellow-600 bg-yellow-500/10 text-yellow-600 dark:border-yellow-500 dark:text-yellow-400",
    },
    {
        value: "inactive",
        label: "Inactive",
        icon: XCircle,
        activeClass:
            "border-red-600 bg-red-500/10 text-red-600 dark:border-red-500 dark:text-red-400",
    },
];

function getInitials(name: string) {
    if (!name.trim()) return "?";
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function Form({ account, businessPillars }: Props) {
    const isEdit = !!account;

    const { data, setData, post, put, errors, processing } = useForm({
        business_pillar_id: account?.business_pillar_id?.toString() || "",
        company_name: account?.company_name || "",
        industry: account?.industry || "",
        address: account?.address || "",
        phone: account?.phone || "",
        email: account?.email || "",
        website: account?.website || "",
        status: account?.status || "active",
        notes: account?.notes || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (account) {
            put(`/accounts/${account.id}`);
        } else {
            post("/accounts");
        }
    };

    const selectedPillar = useMemo(
        () =>
            businessPillars.find(
                (p) => p.id.toString() === data.business_pillar_id,
            ),
        [businessPillars, data.business_pillar_id],
    );

    return (
        <>
            <Head title={account ? "Edit Account" : "Create Account"} />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                <PageHeader
                    title={account ? "Edit Account" : "Create Account"}
                    description={
                        account
                            ? "Perbarui informasi akun perusahaan yang sudah ada."
                            : "Tambahkan akun perusahaan baru ke dalam sistem."
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <FormCard
                        title={
                            isEdit
                                ? "Edit Informasi Akun Perusahaan"
                                : "Detail Informasi Akun Perusahaan"
                        }
                        description={
                            isEdit
                                ? "Perbarui detail akun perusahaan di bawah ini."
                                : "Lengkapi bidang di bawah ini untuk menambahkan akun baru."
                        }
                        onSubmit={handleSubmit}
                        className="lg:col-span-2"
                    >
                        <FormSection title="Informasi Utama & Klasifikasi">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    label="Nama Perusahaan"
                                    htmlFor="company_name"
                                    required
                                    error={errors.company_name}
                                >
                                    <IconInput
                                        id="company_name"
                                        icon={Building2}
                                        hasError={!!errors.company_name}
                                        placeholder="Contoh: PT Technology Nusantara"
                                        value={data.company_name}
                                        onChange={(e) =>
                                            setData(
                                                "company_name",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Business Pillar"
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
                                            <SelectValue placeholder="Pilih Pilar Bisnis" />
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
                                    label="Industri"
                                    htmlFor="industry"
                                    error={errors.industry}
                                >
                                    <IconInput
                                        id="industry"
                                        icon={Briefcase}
                                        hasError={!!errors.industry}
                                        placeholder="Contoh: Teknologi Informasi, Keuangan"
                                        value={data.industry}
                                        onChange={(e) =>
                                            setData("industry", e.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Status"
                                    htmlFor="status"
                                    required
                                    error={errors.status}
                                >
                                    <div className="grid grid-cols-3 gap-2">
                                        {STATUS_OPTIONS.map((opt) => {
                                            const Icon = opt.icon;
                                            const isSelected =
                                                data.status === opt.value;

                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            "status",
                                                            opt.value,
                                                        )
                                                    }
                                                    className={`flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-sm font-medium transition-colors ${
                                                        isSelected
                                                            ? opt.activeClass
                                                            : "border-input text-muted-foreground hover:bg-muted/50"
                                                    }`}
                                                >
                                                    <Icon className="h-4 w-4 shrink-0" />
                                                    <span>{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Kontak & Lokasi">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    label="Email Perusahaan"
                                    htmlFor="email"
                                    error={errors.email}
                                >
                                    <IconInput
                                        id="email"
                                        type="email"
                                        icon={Mail}
                                        hasError={!!errors.email}
                                        placeholder="contoh@perusahaan.com"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Nomor Telepon"
                                    htmlFor="phone"
                                    error={errors.phone}
                                >
                                    <IconInput
                                        id="phone"
                                        icon={Phone}
                                        hasError={!!errors.phone}
                                        placeholder="Contoh: +62 21 555 1234"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Website"
                                    htmlFor="website"
                                    error={errors.website}
                                    className="md:col-span-2"
                                >
                                    <IconInput
                                        id="website"
                                        icon={Globe}
                                        hasError={!!errors.website}
                                        placeholder="https://www.perusahaan.com"
                                        value={data.website}
                                        onChange={(e) =>
                                            setData("website", e.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Alamat Perusahaan"
                                    htmlFor="address"
                                    error={errors.address}
                                    className="md:col-span-2"
                                >
                                    <IconInput
                                        id="address"
                                        icon={MapPin}
                                        hasError={!!errors.address}
                                        placeholder="Jl. Jendral Sudirman No. 12, Jakarta"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData("address", e.target.value)
                                        }
                                    />
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Catatan Tambahan">
                            <FormField
                                label="Catatan (Notes)"
                                htmlFor="notes"
                                error={errors.notes}
                            >
                                <RichTextEditor
                                    value={data.notes}
                                    onChange={(html) => setData("notes", html)}
                                    hasError={!!errors.notes}
                                    placeholder="Tambahkan catatan penting terkait akun perusahaan ini..."
                                    minHeight="120px"
                                />
                            </FormField>
                        </FormSection>

                        <FormActions
                            cancelHref="/accounts"
                            submitLabel={
                                isEdit ? "Perbarui Account" : "Simpan Account"
                            }
                            processing={processing}
                        />
                    </FormCard>

                    {/* Live preview sidebar */}
                    <div className="lg:col-span-1 lg:sticky lg:top-6">
                        <div className="rounded-xl border border-border bg-card p-6">
                            <p className="text-xs font-medium text-muted-foreground mb-4">
                                Pratinjau Akun
                            </p>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                                    {getInitials(data.company_name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-foreground">
                                        {data.company_name || "Nama Perusahaan"}
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {data.industry ||
                                            "Industri belum diisi"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-5">
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                        data.status === "active"
                                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                            : data.status === "pending" ||
                                                data.status === "prospect"
                                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                              : "bg-red-500/10 text-red-600 dark:text-red-400"
                                    }`}
                                >
                                    {(data.status === "pending" ||
                                        data.status === "prospect") && (
                                        <Clock className="h-3.5 w-3.5 shrink-0" />
                                    )}
                                    {data.status === "active" && (
                                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                    )}
                                    {data.status !== "active" &&
                                        data.status !== "pending" &&
                                        data.status !== "prospect" && (
                                            <XCircle className="h-3.5 w-3.5 shrink-0" />
                                        )}

                                    {STATUS_OPTIONS.find(
                                        (o) => o.value === data.status,
                                    )?.label ?? data.status}
                                </span>

                                {selectedPillar && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                        <Layers className="h-3 w-3" />
                                        {selectedPillar.name}
                                    </span>
                                )}
                            </div>

                            <dl className="space-y-3 text-sm">
                                <div className="flex items-start gap-2.5">
                                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground text-xs">
                                            Email
                                        </dt>
                                        <dd className="truncate text-foreground">
                                            {data.email || "—"}
                                        </dd>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Phone className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground text-xs">
                                            Telepon
                                        </dt>
                                        <dd className="truncate text-foreground">
                                            {data.phone || "—"}
                                        </dd>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Globe className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground text-xs">
                                            Website
                                        </dt>
                                        <dd className="truncate text-foreground">
                                            {data.website || "—"}
                                        </dd>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground text-xs">
                                            Alamat
                                        </dt>
                                        <dd className="text-foreground line-clamp-2">
                                            {data.address || "—"}
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
            { title: "Accounts", href: "/accounts" },
            { title: "Form", href: "#" },
        ]}
    >
        {page}
    </AppLayout>
);

export default Form;
