import React, { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pencil,
    DollarSign,
    Percent,
    Calendar,
    Layers,
    UserCheck,
    GitBranch,
} from "lucide-react";

import {
    PageHeader,
    FormCard,
    FormSection,
    FormField,
    FormActions,
} from "@/components/form";

interface OpportunityData {
    id: number;
    opportunity_name: string;
    potential_value: number;
    probability: number;
    estimated_gp: number | null;
    stage: string;
    expected_closing_date: string | null;
    description: string | null;
    business_pillar_id: number | null;
    user_id: number | null;
    account?: { company_name: string };
    contact?: { name: string };
}

interface Props {
    opportunity: OpportunityData;
    businessPillars: { id: number; name: string }[];
    users: { id: number; name: string }[];
}

const STAGE_OPTIONS = [
    { value: "prospecting", label: "Prospecting" },
    { value: "qualification", label: "Qualification" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed_won", label: "Closed Won" },
    { value: "closed_lost", label: "Closed Lost" },
];

function Edit({ opportunity, businessPillars = [], users = [] }: Props) {
    const { data, setData, patch, errors, processing } = useForm({
        opportunity_name: opportunity.opportunity_name ?? "",
        potential_value: opportunity.potential_value?.toString() ?? "",
        estimated_gp: opportunity.estimated_gp?.toString() ?? "",
        probability: opportunity.probability?.toString() ?? "0",
        stage: opportunity.stage ?? "prospecting",
        expected_closing_date: opportunity.expected_closing_date ?? "",
        description: opportunity.description ?? "",
        business_pillar_id: opportunity.business_pillar_id?.toString() ?? "",
        user_id: opportunity.user_id?.toString() ?? "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/opportunities/${opportunity.id}`);
    };

    return (
        <>
            <Head title={`Edit Opportunity: ${opportunity.opportunity_name}`} />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                <PageHeader
                    icon={Pencil}
                    title="Edit Opportunity"
                    description={
                        opportunity.account?.company_name
                            ? `${opportunity.opportunity_name} — ${opportunity.account.company_name}`
                            : opportunity.opportunity_name
                    }
                    backHref={`/opportunities/${opportunity.id}`}
                />

                <FormCard
                    title="Detail Opportunity"
                    description="Perbarui informasi opportunity di bawah ini."
                    onSubmit={handleSubmit}
                    className="lg:col-span-2"
                >
                    <FormSection title="Informasi Utama">
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                label="Nama Opportunity"
                                htmlFor="opportunity_name"
                                required
                                error={errors.opportunity_name}
                            >
                                <Input
                                    id="opportunity_name"
                                    value={data.opportunity_name}
                                    onChange={(e) =>
                                        setData(
                                            "opportunity_name",
                                            e.target.value,
                                        )
                                    }
                                    className={
                                        errors.opportunity_name
                                            ? "border-destructive"
                                            : ""
                                    }
                                />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <FormField
                                label="Pilar Bisnis"
                                htmlFor="business_pillar_id"
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

                    <FormSection title="Tahapan & Estimasi">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label="Tahapan (Stage)"
                                htmlFor="stage"
                                required
                                error={errors.stage}
                            >
                                <Select
                                    value={data.stage}
                                    onValueChange={(value) =>
                                        setData("stage", value)
                                    }
                                >
                                    <SelectTrigger
                                        id="stage"
                                        className={`w-full ${errors.stage ? "border-destructive" : ""}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <GitBranch className="h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Pilih Tahapan" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STAGE_OPTIONS.map((opt) => (
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
                                label="Probabilitas (%)"
                                htmlFor="probability"
                                required
                                error={errors.probability}
                            >
                                <div className="relative">
                                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="probability"
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={data.probability}
                                        onChange={(e) =>
                                            setData(
                                                "probability",
                                                e.target.value,
                                            )
                                        }
                                        className={`pl-9 ${
                                            errors.probability
                                                ? "border-destructive"
                                                : ""
                                        }`}
                                    />
                                </div>
                            </FormField>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <FormField
                                label="Potensi Nilai (Rp)"
                                htmlFor="potential_value"
                                required
                                error={errors.potential_value}
                            >
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="potential_value"
                                        type="number"
                                        min={0}
                                        value={data.potential_value}
                                        onChange={(e) =>
                                            setData(
                                                "potential_value",
                                                e.target.value,
                                            )
                                        }
                                        className={`pl-9 ${
                                            errors.potential_value
                                                ? "border-destructive"
                                                : ""
                                        }`}
                                    />
                                </div>
                            </FormField>

                            <FormField
                                label="Estimasi GP (Rp)"
                                htmlFor="estimated_gp"
                                error={errors.estimated_gp}
                            >
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="estimated_gp"
                                        type="number"
                                        min={0}
                                        value={data.estimated_gp}
                                        onChange={(e) =>
                                            setData(
                                                "estimated_gp",
                                                e.target.value,
                                            )
                                        }
                                        className={`pl-9 ${
                                            errors.estimated_gp
                                                ? "border-destructive"
                                                : ""
                                        }`}
                                    />
                                </div>
                            </FormField>

                            <FormField
                                label="Target Closing Date"
                                htmlFor="expected_closing_date"
                                error={errors.expected_closing_date}
                            >
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <Input
                                        id="expected_closing_date"
                                        type="date"
                                        value={data.expected_closing_date}
                                        onChange={(e) =>
                                            setData(
                                                "expected_closing_date",
                                                e.target.value,
                                            )
                                        }
                                        className={`pl-9 ${
                                            errors.expected_closing_date
                                                ? "border-destructive"
                                                : ""
                                        }`}
                                    />
                                </div>
                            </FormField>
                        </div>
                    </FormSection>

                    <FormSection title="Deskripsi">
                        <FormField
                            label="Deskripsi Opportunity"
                            htmlFor="description"
                            error={errors.description}
                        >
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={4}
                                className={
                                    errors.description
                                        ? "border-destructive"
                                        : ""
                                }
                            />
                        </FormField>
                    </FormSection>

                    <FormActions
                        cancelHref={`/opportunities/${opportunity.id}`}
                        submitLabel="Simpan Perubahan"
                        processing={processing}
                    />
                </FormCard>
            </div>
        </>
    );
}

Edit.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Opportunity", href: "/opportunities" },
            { title: "Edit Opportunity", href: "#" },
        ]}
    >
        {page}
    </AppLayout>
);

export default Edit;
