import React, { ReactNode, useMemo } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { TargetAccount, Account, BusinessPillar, User } from "@/types/crm";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Target, Building2, Layers, UserCheck, Activity } from "lucide-react";

import {
    PageHeader,
    FormCard,
    FormSection,
    FormField,
    FormActions,
    RichTextEditor,
} from "@/components/form";

interface Props {
    targetAccount?: TargetAccount;
    accounts: Pick<Account, "id" | "company_name">[];
    businessPillars: Pick<BusinessPillar, "id" | "name">[];
    salesList: Pick<User, "id" | "name">[];
}

const PRIORITY_OPTIONS: {
    value: TargetAccount["priority"];
    label: string;
}[] = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
];

const STATUS_LABELS: Record<TargetAccount["status"], string> = {
    prospect: "Prospect",
    engaged: "Engaged",
    qualified: "Qualified",
    closed: "Closed",
    lost: "Lost",
};

const STATUS_STYLES: Record<TargetAccount["status"], string> = {
    prospect: "bg-muted text-muted-foreground",
    engaged: "bg-blue-500/10 text-blue-600",
    qualified: "bg-primary/10 text-primary",
    closed: "bg-emerald-500/10 text-emerald-600",
    lost: "bg-destructive/10 text-destructive",
};

const PRIORITY_STYLES: Record<TargetAccount["priority"], string> = {
    low: "border-input text-muted-foreground data-[active=true]:border-slate-400 data-[active=true]:bg-slate-400/10 data-[active=true]:text-slate-600",
    medium: "border-input text-muted-foreground data-[active=true]:border-amber-500 data-[active=true]:bg-amber-500/10 data-[active=true]:text-amber-600",
    high: "border-input text-muted-foreground data-[active=true]:border-destructive data-[active=true]:bg-destructive/10 data-[active=true]:text-destructive",
};

function Form({ targetAccount, accounts, businessPillars, salesList }: Props) {
    const isEdit = !!targetAccount;

    const { data, setData, post, put, errors, processing } = useForm({
        account_id: targetAccount?.account_id?.toString() || "",
        business_pillar_id: targetAccount?.business_pillar_id?.toString() || "",
        assigned_sales_id: targetAccount?.assigned_sales_id?.toString() || "",
        priority: targetAccount?.priority || "medium",
        status: targetAccount?.status || "prospect",
        notes: targetAccount?.notes || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (targetAccount) {
            put(`/target-accounts/${targetAccount.id}`);
        } else {
            post("/target-accounts");
        }
    };

    const selectedAccount = useMemo(
        () => accounts.find((a) => a.id.toString() === data.account_id),
        [accounts, data.account_id],
    );
    const selectedPillar = useMemo(
        () =>
            businessPillars.find(
                (p) => p.id.toString() === data.business_pillar_id,
            ),
        [businessPillars, data.business_pillar_id],
    );
    const selectedSales = useMemo(
        () => salesList.find((s) => s.id.toString() === data.assigned_sales_id),
        [salesList, data.assigned_sales_id],
    );

    return (
        <>
            <Head
                title={
                    targetAccount
                        ? "Edit Target Account"
                        : "Create Target Account"
                }
            />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                <PageHeader
                    // icon={Target}
                    title={
                        targetAccount
                            ? "Edit Target Account"
                            : "Create Target Account"
                    }
                    description={
                        targetAccount
                            ? "Perbarui informasi target account dan alokasi sales rep."
                            : "Tambahkan akun target prospek baru ke dalam radar bisnis."
                    }
                    // backHref="/target-accounts"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <FormCard
                        title={
                            isEdit
                                ? "Edit Detail Target Account"
                                : "Informasi Target Account"
                        }
                        description={
                            isEdit
                                ? "Perbarui detail pemetaan target account di bawah ini."
                                : "Lengkapi data di bawah ini untuk mendaftarkan target account baru."
                        }
                        onSubmit={handleSubmit}
                        className="lg:col-span-2"
                    >
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
                                        onValueChange={(value) =>
                                            setData("account_id", value)
                                        }
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
                            </div>
                        </FormSection>

                        <FormSection title="Penugasan & Status Prospek">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    label="Assigned Sales Rep"
                                    htmlFor="assigned_sales_id"
                                    error={errors.assigned_sales_id}
                                >
                                    <Select
                                        value={data.assigned_sales_id}
                                        onValueChange={(value) =>
                                            setData("assigned_sales_id", value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="assigned_sales_id"
                                            className={`w-full ${errors.assigned_sales_id ? "border-destructive" : ""}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                                                <SelectValue placeholder="Pilih Sales Representative" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {salesList.map((sales) => (
                                                <SelectItem
                                                    key={sales.id}
                                                    value={sales.id.toString()}
                                                >
                                                    {sales.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField
                                    label="Status Account"
                                    htmlFor="status"
                                    required
                                    error={errors.status}
                                >
                                    <Select
                                        value={data.status}
                                        onValueChange={(
                                            value: TargetAccount["status"],
                                        ) => setData("status", value)}
                                    >
                                        <SelectTrigger
                                            id="status"
                                            className={`w-full ${errors.status ? "border-destructive" : ""}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Activity className="h-4 w-4 text-muted-foreground" />
                                                <SelectValue placeholder="Pilih Status" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(
                                                Object.keys(
                                                    STATUS_LABELS,
                                                ) as TargetAccount["status"][]
                                            ).map((key) => (
                                                <SelectItem
                                                    key={key}
                                                    value={key}
                                                >
                                                    {STATUS_LABELS[key]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField
                                    label="Tingkat Prioritas"
                                    htmlFor="priority"
                                    required
                                    error={errors.priority}
                                    className="md:col-span-2"
                                >
                                    <div className="grid grid-cols-3 gap-2">
                                        {PRIORITY_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                data-active={
                                                    data.priority === opt.value
                                                }
                                                onClick={() =>
                                                    setData(
                                                        "priority",
                                                        opt.value,
                                                    )
                                                }
                                                className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50 ${PRIORITY_STYLES[opt.value]}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Strategi & Catatan">
                            <FormField
                                label="Catatan & Strategi (Notes)"
                                htmlFor="notes"
                                error={errors.notes}
                            >
                                <RichTextEditor
                                    value={data.notes}
                                    onChange={(html) => setData("notes", html)}
                                    hasError={!!errors.notes}
                                    placeholder="Tambahkan informasi latar belakang, potensi transaksi, atau catatan strategi penanganan account ini..."
                                    minHeight="150px"
                                />
                            </FormField>
                        </FormSection>

                        <FormActions
                            cancelHref="/target-accounts"
                            submitLabel={
                                isEdit
                                    ? "Perbarui Target Account"
                                    : "Simpan Target Account"
                            }
                            processing={processing}
                        />
                    </FormCard>

                    {/* Live preview sidebar */}
                    <div className="lg:col-span-1 lg:sticky lg:top-6">
                        <div className="rounded-xl border border-border bg-card p-6">
                            <p className="text-xs font-medium text-muted-foreground mb-4">
                                Pratinjau Target Account
                            </p>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Target className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-foreground">
                                        {selectedAccount?.company_name ||
                                            "Perusahaan belum dipilih"}
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {selectedPillar?.name ||
                                            "Pilar bisnis belum dipilih"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-5">
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[data.status]}`}
                                >
                                    {STATUS_LABELS[data.status]}
                                </span>
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                        data.priority === "high"
                                            ? "bg-destructive/10 text-destructive"
                                            : data.priority === "medium"
                                              ? "bg-amber-500/10 text-amber-600"
                                              : "bg-slate-400/10 text-slate-600"
                                    }`}
                                >
                                    Prioritas{" "}
                                    {
                                        PRIORITY_OPTIONS.find(
                                            (o) => o.value === data.priority,
                                        )?.label
                                    }
                                </span>
                            </div>

                            <dl className="space-y-3 text-sm">
                                <div className="flex items-start gap-2.5">
                                    <UserCheck className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground text-xs">
                                            Sales Rep
                                        </dt>
                                        <dd className="truncate text-foreground">
                                            {selectedSales?.name ||
                                                "Belum ditugaskan"}
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
            { title: "Target Accounts", href: "/target-accounts" },
            { title: "Form Target", href: "#" },
        ]}
    >
        {page}
    </AppLayout>
);

export default Form;
