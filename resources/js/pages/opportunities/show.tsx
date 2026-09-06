import React, { ReactNode, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    TrendingUp,
    Building2,
    User as UserIcon,
    Layers,
    UserCheck,
    Calendar,
    DollarSign,
    Percent,
    Pencil,
    Trash2,
    Mail,
    Phone,
    MessageSquare,
    Video,
    Users as UsersIcon,
    FileText,
    Clock,
} from "lucide-react";

import { PageHeader } from "@/components/form";

interface ActivityItem {
    id: string;
    type: "email" | "call" | "whatsapp" | "meeting" | "linkedin" | "note";
    performed_at: string;
    result?: string;
    notes?: string;
    user?: { name: string };
}

interface FollowUpItem {
    id: string;
    title: string;
    due_date: string;
    status: string;
}

interface OpportunityData {
    id: number;
    opportunity_name: string;
    potential_value: number;
    probability: number;
    estimated_gp: number | null;
    stage:
        | "prospecting"
        | "qualification"
        | "proposal"
        | "negotiation"
        | "closed_won"
        | "closed_lost";
    expected_closing_date: string | null;
    description: string | null;
    account?: { company_name: string };
    contact?: { contact_name?: string; name?: string; email?: string };
    business_pillar?: { name: string };
    user?: { name: string };
    activities?: ActivityItem[];
    follow_ups?: FollowUpItem[];
}

interface Props {
    opportunity: OpportunityData;
}

const STAGE_VARIANT: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
> = {
    prospecting: "secondary",
    qualification: "outline",
    proposal: "outline",
    negotiation: "default",
    closed_won: "default",
    closed_lost: "destructive",
};

const STAGE_LABEL: Record<string, string> = {
    prospecting: "Prospecting",
    qualification: "Qualification",
    proposal: "Proposal",
    negotiation: "Negotiation",
    closed_won: "Closed Won",
    closed_lost: "Closed Lost",
};

const ACTIVITY_ICON: Record<ActivityItem["type"], React.ElementType> = {
    email: Mail,
    call: Phone,
    whatsapp: MessageSquare,
    meeting: Video,
    linkedin: UsersIcon,
    note: FileText,
};

const formatCurrency = (value?: number | null) => {
    if (value === undefined || value === null) return "-";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

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

function Show({ opportunity }: Props) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus opportunity "${opportunity.opportunity_name}"?`,
            )
        ) {
            setDeleting(true);
            router.delete(`/opportunities/${opportunity.id}`, {
                onFinish: () => setDeleting(false),
            });
        }
    };

    const contactName =
        opportunity.contact?.contact_name ?? opportunity.contact?.name ?? "-";

    return (
        <>
            <Head title={opportunity.opportunity_name} />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                <PageHeader
                    icon={TrendingUp}
                    title={opportunity.opportunity_name}
                    description="Detail informasi opportunity dan riwayat aktivitas."
                    backHref="/opportunities"
                >
                    <Link href={`/opportunities/${opportunity.id}/edit`}>
                        <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                    </Button>
                </PageHeader>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom kiri: detail opportunity */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base">
                                    Informasi Opportunity
                                </CardTitle>
                                <Badge
                                    variant={
                                        STAGE_VARIANT[opportunity.stage] ??
                                        "secondary"
                                    }
                                >
                                    {STAGE_LABEL[opportunity.stage] ??
                                        opportunity.stage}
                                </Badge>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailRow
                                    icon={Building2}
                                    label="Perusahaan / Account"
                                    value={opportunity.account?.company_name}
                                />
                                <DetailRow
                                    icon={UserIcon}
                                    label="Contact Person"
                                    value={contactName}
                                />
                                <DetailRow
                                    icon={Layers}
                                    label="Pilar Bisnis"
                                    value={opportunity.business_pillar?.name}
                                />
                                <DetailRow
                                    icon={UserCheck}
                                    label="Sales"
                                    value={opportunity.user?.name}
                                />
                                <DetailRow
                                    icon={Calendar}
                                    label="Target Closing"
                                    value={
                                        opportunity.expected_closing_date
                                            ? new Date(
                                                  opportunity.expected_closing_date,
                                              ).toLocaleDateString("id-ID", {
                                                  day: "2-digit",
                                                  month: "long",
                                                  year: "numeric",
                                              })
                                            : null
                                    }
                                />
                                <DetailRow
                                    icon={Percent}
                                    label="Probabilitas"
                                    value={`${opportunity.probability}%`}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Deskripsi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm whitespace-pre-line">
                                    {opportunity.description ||
                                        "Tidak ada deskripsi."}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Riwayat Aktivitas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {opportunity.activities &&
                                opportunity.activities.length > 0 ? (
                                    <div className="space-y-4">
                                        {opportunity.activities.map(
                                            (activity) => {
                                                const Icon =
                                                    ACTIVITY_ICON[
                                                        activity.type
                                                    ] ?? FileText;
                                                return (
                                                    <div
                                                        key={activity.id}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                                                            <Icon className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-sm font-medium">
                                                                    {activity.result ||
                                                                        activity.type}
                                                                </p>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {new Date(
                                                                        activity.performed_at,
                                                                    ).toLocaleDateString(
                                                                        "id-ID",
                                                                        {
                                                                            day: "2-digit",
                                                                            month: "short",
                                                                        },
                                                                    )}
                                                                </span>
                                                            </div>
                                                            {activity.notes && (
                                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                                    {
                                                                        activity.notes
                                                                    }
                                                                </p>
                                                            )}
                                                            {activity.user && (
                                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                                    oleh{" "}
                                                                    {
                                                                        activity
                                                                            .user
                                                                            .name
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada aktivitas tercatat.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom kanan: nilai & follow-up */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Nilai Opportunity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                                        <DollarSign className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Potensi Nilai
                                        </p>
                                        <p className="text-sm font-semibold">
                                            {formatCurrency(
                                                opportunity.potential_value,
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                                        <DollarSign className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Estimasi GP
                                        </p>
                                        <p className="text-sm font-semibold">
                                            {formatCurrency(
                                                opportunity.estimated_gp,
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <p className="text-xs text-muted-foreground">
                                            Probabilitas Closing
                                        </p>
                                        <p className="text-xs font-medium">
                                            {opportunity.probability}%
                                        </p>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-blue-600"
                                            style={{
                                                width: `${opportunity.probability}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Follow-Up
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {opportunity.follow_ups &&
                                opportunity.follow_ups.length > 0 ? (
                                    <div className="space-y-3">
                                        {opportunity.follow_ups.map((fu) => (
                                            <div
                                                key={fu.id}
                                                className="flex items-start gap-3"
                                            >
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-600">
                                                    <Clock className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium leading-snug">
                                                        {fu.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(
                                                            fu.due_date,
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                day: "2-digit",
                                                                month: "long",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                        {" · "}
                                                        {fu.status}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Tidak ada follow-up terjadwal.
                                    </p>
                                )}
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
            { title: "Opportunity", href: "/opportunities" },
            { title: "Detail Opportunity", href: "#" },
        ]}
    >
        {page}
    </AppLayout>
);

export default Show;
