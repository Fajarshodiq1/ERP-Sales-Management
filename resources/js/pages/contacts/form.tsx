import React, { ReactNode, useMemo } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { Contact, Account } from "@/types/crm";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    User,
    Briefcase,
    Mail,
    Phone,
    Building2,
    CircleCheck,
    CircleX,
} from "lucide-react";

import {
    FormCard,
    FormSection,
    FormField,
    FormActions,
    IconInput,
    RichTextEditor,
} from "@/components/form";

interface Props {
    contact?: Contact;
    accounts: Pick<Account, "id" | "company_name">[];
}

function getInitials(name: string) {
    if (!name.trim()) return "?";
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function Form({ contact, accounts }: Props) {
    const isEdit = !!contact;

    const { data, setData, post, put, errors, processing } = useForm({
        account_id: contact?.account_id?.toString() || "",
        name: contact?.name || "",
        position: contact?.position || "",
        phone: contact?.phone || "",
        email: contact?.email || "",
        status: contact?.status || "active",
        notes: contact?.notes || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (contact) {
            put(`/contacts/${contact.id}`);
        } else {
            post("/contacts");
        }
    };

    const selectedAccount = useMemo(
        () => accounts.find((a) => a.id.toString() === data.account_id),
        [accounts, data.account_id],
    );

    return (
        <>
            <Head title={contact ? "Edit Contact" : "Create Contact"} />

            <div className="mx-auto w-full max-w-7xl p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        {isEdit ? "Edit Kontak" : "Tambah Kontak Baru"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isEdit
                            ? "Perbarui detail kontak di bawah ini."
                            : "Lengkapi bidang di bawah ini untuk menambahkan kontak baru."}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <FormCard
                        title="Detail Informasi Kontak"
                        onSubmit={handleSubmit}
                        className="lg:col-span-2"
                    >
                        <FormSection title="Informasi Utama">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    label="Perusahaan (Account)"
                                    htmlFor="account_id"
                                    required
                                    error={errors.account_id}
                                    className="md:col-span-2"
                                >
                                    <Select
                                        value={data.account_id}
                                        onValueChange={(value) =>
                                            setData("account_id", value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="account_id"
                                            className={`w-full ${errors.account_id ? "border-destructive" : ""}`}
                                        >
                                            <SelectValue placeholder="Pilih Perusahaan / Account" />
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
                                    label="Nama Kontak"
                                    htmlFor="name"
                                    required
                                    error={errors.name}
                                >
                                    <IconInput
                                        id="name"
                                        icon={User}
                                        hasError={!!errors.name}
                                        placeholder="Contoh: Budi Santoso"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Status"
                                    htmlFor="status"
                                    required
                                    error={errors.status}
                                >
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData("status", "active")
                                            }
                                            className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                                                data.status === "active"
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-input text-muted-foreground hover:bg-muted/50"
                                            }`}
                                        >
                                            <CircleCheck className="h-4 w-4" />
                                            Aktif
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData("status", "inactive")
                                            }
                                            className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                                                data.status === "inactive"
                                                    ? "border-destructive bg-destructive/10 text-destructive"
                                                    : "border-input text-muted-foreground hover:bg-muted/50"
                                            }`}
                                        >
                                            <CircleX className="h-4 w-4" />
                                            Nonaktif
                                        </button>
                                    </div>
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Jabatan & Kontak">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    label="Jabatan (Position)"
                                    htmlFor="position"
                                    error={errors.position}
                                    className="md:col-span-2"
                                >
                                    <IconInput
                                        id="position"
                                        icon={Briefcase}
                                        hasError={!!errors.position}
                                        placeholder="Contoh: Chief Technology Officer (CTO)"
                                        value={data.position}
                                        onChange={(e) =>
                                            setData("position", e.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Email"
                                    htmlFor="email"
                                    error={errors.email}
                                >
                                    <IconInput
                                        id="email"
                                        type="email"
                                        icon={Mail}
                                        hasError={!!errors.email}
                                        placeholder="budi.santoso@perusahaan.com"
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
                                        placeholder="Contoh: +62 812 3456 7890"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
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
                                    placeholder="Tambahkan catatan khusus mengenai kontak ini..."
                                    minHeight="120px"
                                />
                            </FormField>
                        </FormSection>

                        <FormActions
                            cancelHref="/contacts"
                            submitLabel={
                                isEdit ? "Perbarui Contact" : "Simpan Contact"
                            }
                            processing={processing}
                        />
                    </FormCard>

                    {/* Live preview sidebar */}
                    <div className="lg:col-span-1 lg:sticky lg:top-6">
                        <div className="rounded-xl border border-border bg-card p-6">
                            <p className="text-xs font-medium text-muted-foreground mb-4">
                                Pratinjau Kontak
                            </p>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                                    {getInitials(data.name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-foreground">
                                        {data.name || "Nama Kontak"}
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {data.position || "Jabatan belum diisi"}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-5">
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                                        data.status === "active"
                                            ? "bg-primary/10 text-primary"
                                            : "bg-destructive/10 text-destructive"
                                    }`}
                                >
                                    {data.status === "active" ? (
                                        <CircleCheck className="h-3 w-3" />
                                    ) : (
                                        <CircleX className="h-3 w-3" />
                                    )}
                                    {data.status === "active"
                                        ? "Aktif"
                                        : "Nonaktif"}
                                </span>
                            </div>

                            <dl className="space-y-3 text-sm">
                                <div className="flex items-start gap-2.5">
                                    <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground text-xs">
                                            Perusahaan
                                        </dt>
                                        <dd className="truncate text-foreground">
                                            {selectedAccount?.company_name ||
                                                "—"}
                                        </dd>
                                    </div>
                                </div>
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
            { title: "Contacts", href: "/contacts" },
            { title: "Form", href: "#" },
        ]}
    >
        {page}
    </AppLayout>
);

export default Form;
