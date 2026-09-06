import React, { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Lead } from "@/types/lead";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    UserPlus,
    Building2,
    User as UserIcon,
    Layers,
    UserCheck,
    Radio,
    CalendarClock,
    Pencil,
    Search,
    CircleCheck,
    CircleX,
    Check,
    TrendingUp,
} from "lucide-react";

import { PageHeader, FormField } from "@/components/form";

interface Props {
    lead: Lead;
}

const STATUS_VARIANT: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
> = {
    new: "secondary",
    unqualified: "secondary",
    in_qualification: "outline",
    qualified: "default",
    disqualified: "destructive",
};

const STATUS_LABEL: Record<string, string> = {
    new: "New",
    unqualified: "Belum Dikualifikasi",
    in_qualification: "Sedang Dikualifikasi",
    qualified: "Qualified",
    disqualified: "Disqualified",
};

// Opsi kualifikasi — harus sinkron dengan QualifyLeadData::status (in:qualified,disqualified,in_qualification)
const QUALIFY_OPTIONS: {
    value: "in_qualification" | "qualified" | "disqualified";
    label: string;
    description: string;
    icon: React.ElementType;
    accent: string; // dipakai untuk border + bg saat terpilih
    iconColor: string;
}[] = [
    {
        value: "in_qualification",
        label: "Sedang Dikualifikasi",
        description: "Masih menunggu info atau konfirmasi lebih lanjut.",
        icon: Search,
        accent: "border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800",
        iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
        value: "qualified",
        label: "Qualified",
        description: "Layak ditindaklanjuti ke tahap penawaran.",
        icon: CircleCheck,
        accent: "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800",
        iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
        value: "disqualified",
        label: "Disqualified",
        description: "Tidak sesuai kriteria, tidak akan ditindaklanjuti.",
        icon: CircleX,
        accent: "border-rose-300 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-800",
        iconColor: "text-rose-600 dark:text-rose-400",
    },
];

function DetailRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value?: string | null;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value || "-"}</p>
            </div>
        </div>
    );
}

function Show({ lead }: Props) {
    const { data, setData, patch, errors, processing } = useForm({
        status:
            lead.status === "qualified" || lead.status === "disqualified"
                ? lead.status
                : "in_qualification",
        notes: "",
    });

    const handleQualify = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/leads/${lead.id}/qualify`, {
            preserveScroll: true,
        });
    };

    const selectedOption = QUALIFY_OPTIONS.find(
        (opt) => opt.value === data.status,
    );
    const hasChanged = data.status !== lead.status;

    return (
        <>
            <Head title={`Lead: ${lead.lead_name}`} />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                <PageHeader
                    icon={UserPlus}
                    title={lead.lead_name}
                    description="Detail informasi lead dan status kualifikasi."
                    backHref="/leads"
                >
                    <div className="flex items-center gap-2">
                        {lead.status === "qualified" && (
                            <Link
                                href={`/opportunities/create?lead_id=${lead.id}`}
                            >
                                <Button size="sm">
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    Convert to Opportunity
                                </Button>
                            </Link>
                        )}
                        <Link href={`/leads/${lead.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Lead
                            </Button>
                        </Link>
                    </div>
                </PageHeader>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom kiri: detail lead */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base">
                                    Informasi Lead
                                </CardTitle>
                                <Badge
                                    variant={
                                        STATUS_VARIANT[lead.status] ??
                                        "secondary"
                                    }
                                >
                                    {STATUS_LABEL[lead.status] ?? lead.status}
                                </Badge>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailRow
                                    icon={Building2}
                                    label="Perusahaan / Account"
                                    value={lead.account?.company_name}
                                />
                                <DetailRow
                                    icon={UserIcon}
                                    label="Contact Person"
                                    value={lead.contact?.name}
                                />
                                <DetailRow
                                    icon={Layers}
                                    label="Pilar Bisnis"
                                    value={lead.business_pillar?.name}
                                />
                                <DetailRow
                                    icon={UserCheck}
                                    label="Ditugaskan Kepada"
                                    value={lead.user?.name}
                                />
                                <DetailRow
                                    icon={Radio}
                                    label="Sumber Lead"
                                    value={lead.lead_source}
                                />
                                <DetailRow
                                    icon={CalendarClock}
                                    label="Tanggal Qualified"
                                    value={
                                        lead.qualified_at
                                            ? new Date(
                                                  lead.qualified_at,
                                              ).toLocaleString("id-ID")
                                            : "Belum di-qualify"
                                    }
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Potensi Kebutuhan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm whitespace-pre-line">
                                    {lead.potential_need ||
                                        "Belum ada catatan kebutuhan."}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Catatan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm whitespace-pre-line">
                                    {lead.notes || "Tidak ada catatan."}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom kanan: aksi kualifikasi */}
                    <div className="space-y-6">
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Update Kualifikasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleQualify}
                                    className="space-y-5"
                                >
                                    <div
                                        role="radiogroup"
                                        aria-label="Status kualifikasi"
                                        className="space-y-2"
                                    >
                                        {QUALIFY_OPTIONS.map((opt) => {
                                            const isSelected =
                                                data.status === opt.value;
                                            const Icon = opt.icon;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={isSelected}
                                                    onClick={() =>
                                                        setData(
                                                            "status",
                                                            opt.value,
                                                        )
                                                    }
                                                    className={`w-full flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                                                        isSelected
                                                            ? opt.accent
                                                            : "border-border hover:bg-muted/50"
                                                    }`}
                                                >
                                                    <Icon
                                                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                                                            isSelected
                                                                ? opt.iconColor
                                                                : "text-muted-foreground"
                                                        }`}
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium leading-none">
                                                            {opt.label}
                                                        </p>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {opt.description}
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <Check
                                                            className={`h-4 w-4 shrink-0 ${opt.iconColor}`}
                                                        />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {errors.status && (
                                        <p className="text-xs text-destructive">
                                            {errors.status}
                                        </p>
                                    )}

                                    <FormField
                                        label="Catatan Kualifikasi"
                                        htmlFor="qualify_notes"
                                        error={errors.notes}
                                    >
                                        <Textarea
                                            id="qualify_notes"
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData("notes", e.target.value)
                                            }
                                            placeholder="Alasan perubahan status (opsional)..."
                                            rows={3}
                                        />
                                    </FormField>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing || !hasChanged}
                                    >
                                        {hasChanged && selectedOption
                                            ? `Tandai sebagai ${selectedOption.label}`
                                            : "Perbarui Status"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Leads", href: "/leads" },
            { title: "Detail Lead", href: "#" },
        ]}
    >
        {page}
    </AppLayout>
);

export default Show;
