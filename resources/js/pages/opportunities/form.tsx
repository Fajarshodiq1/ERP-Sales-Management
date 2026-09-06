import React, { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    TrendingUp,
    Building2,
    Users,
    Layers,
    DollarSign,
    Percent,
    Calendar,
    AlertCircle,
} from "lucide-react";

import {
    PageHeader,
    FormCard,
    FormSection,
    FormField,
    FormActions,
} from "@/components/form";

interface LeadSummary {
    id: number;
    lead_name: string;
    account?: { id: number; company_name: string };
    contact?: { id: number; name: string };
    business_pillar?: { id: number; name: string };
}

interface Props {
    lead: LeadSummary | null;
}

function Form({ lead }: Props) {
    const { data, setData, post, errors, processing } = useForm({
        lead_id: lead?.id ?? "",
        opportunity_name: lead ? `Opportunity - ${lead.lead_name}` : "",
        potential_value: "",
        probability: "10",
        estimated_gp: "",
        expected_closing_date: "",
        description: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/opportunities");
    };

    return (
        <>
            <Head title="Konversi ke Opportunity" />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                <PageHeader
                    icon={TrendingUp}
                    title="Konversi ke Opportunity"
                    description="Ubah lead terkualifikasi menjadi opportunity untuk mulai ditindaklanjuti sales."
                    backHref="/opportunities"
                />

                {!lead && (
                    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>
                            Halaman ini idealnya diakses dari halaman detail
                            Lead (tombol &quot;Convert to Opportunity&quot;)
                            supaya data lead ikut ter-load otomatis.
                        </span>
                    </div>
                )}

                <FormCard
                    title="Informasi Opportunity"
                    description="Lengkapi estimasi nilai dan target closing untuk opportunity ini."
                    onSubmit={handleSubmit}
                    className="lg:col-span-2"
                >
                    {lead && (
                        <FormSection title="Sumber Lead">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg bg-gray-50 border border-gray-200 p-4">
                                <div className="flex items-start gap-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Perusahaan
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {lead.account?.company_name ?? "-"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Contact Person
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {lead.contact?.name ?? "-"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Layers className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Pilar Bisnis
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {lead.business_pillar?.name ?? "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </FormSection>
                    )}

                    <FormSection title="Detail Opportunity">
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
                                    placeholder="Contoh: Digitalisasi Gudang PT Maju Jaya"
                                    className={
                                        errors.opportunity_name
                                            ? "border-destructive"
                                            : ""
                                    }
                                />
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
                                        placeholder="0"
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
                                        placeholder="0"
                                        className={`pl-9 ${
                                            errors.estimated_gp
                                                ? "border-destructive"
                                                : ""
                                        }`}
                                    />
                                </div>
                            </FormField>

                            <FormField
                                label="Probabilitas (%)"
                                htmlFor="probability"
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
                                        placeholder="10"
                                        className={`pl-9 ${
                                            errors.probability
                                                ? "border-destructive"
                                                : ""
                                        }`}
                                    />
                                </div>
                            </FormField>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                                placeholder="Jelaskan ruang lingkup, tantangan, atau catatan penting terkait opportunity ini..."
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
                        cancelHref="/opportunities"
                        submitLabel="Simpan Opportunity"
                        processing={processing}
                    />
                </FormCard>
            </div>
        </>
    );
}

Form.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Opportunity", href: "/opportunities" },
            { title: "Konversi Lead", href: "#" },
        ]}
    >
        {page}
    </AppLayout>
);

export default Form;
