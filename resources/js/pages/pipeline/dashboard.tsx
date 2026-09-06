import React, { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Wallet,
    TrendingUp,
    PiggyBank,
    Building2,
    CheckCircle2,
    Clock,
    CalendarClock,
} from "lucide-react";

interface StageBreakdown {
    stage: string;
    count: number;
    total_value: number;
}

interface Analytics {
    total_pipeline: number;
    weighted_revenue: number;
    estimated_gp: number;
    stage_breakdown: StageBreakdown[];
}

interface PendingFollowUp {
    id: number;
    title: string;
    due_date: string;
    account?: { company_name: string };
}

interface Props {
    analytics: Analytics;
    pendingFollowUps: PendingFollowUp[];
}

const STAGE_META: Record<string, { label: string; className: string }> = {
    prospecting: {
        label: "Prospecting",
        className: "bg-gray-400",
    },
    qualification: {
        label: "Qualification",
        className: "bg-blue-500",
    },
    proposal: {
        label: "Proposal",
        className: "bg-amber-500",
    },
    negotiation: {
        label: "Negotiation",
        className: "bg-purple-500",
    },
    closed_won: {
        label: "Closed Won",
        className: "bg-emerald-500",
    },
    closed_lost: {
        label: "Closed Lost",
        className: "bg-red-500",
    },
};

const formatCurrency = (val: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(val);

const isOverdue = (dueDate: string) => new Date(dueDate).getTime() < Date.now();

function MetricCard({
    icon: Icon,
    iconClass,
    label,
    value,
    description,
}: {
    icon: React.ElementType;
    iconClass: string;
    label: string;
    value: string;
    description: string;
}) {
    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {label}
                        </p>
                        <p className="text-2xl font-bold tracking-tight">
                            {value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function PipelineDashboard({
    analytics,
    pendingFollowUps,
}: Props) {
    const totalBreakdownValue = analytics.stage_breakdown.reduce(
        (sum, row) => sum + row.total_value,
        0,
    );

    const markAsComplete = (id: number) => {
        if (!confirm("Tandai follow-up ini sebagai selesai?")) return;
        router.patch(
            `/follow-ups/${id}/complete`,
            {
                activity_type: "note",
                activity_notes:
                    "Task marked as completed from Pipeline Dashboard.",
            },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Pipeline Analytics" />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Pipeline & Revenue Analytics
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Ringkasan performa pipeline penjualan dan tugas yang
                        perlu ditindaklanjuti.
                    </p>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard
                        icon={Wallet}
                        iconClass="bg-slate-100 text-slate-700"
                        label="Total Active Pipeline"
                        value={formatCurrency(analytics.total_pipeline)}
                        description="Total nilai opportunity yang masih berjalan"
                    />
                    <MetricCard
                        icon={TrendingUp}
                        iconClass="bg-blue-50 text-blue-600"
                        label="Weighted Forecast Revenue"
                        value={formatCurrency(analytics.weighted_revenue)}
                        description="Nilai disesuaikan dengan probabilitas closing"
                    />
                    <MetricCard
                        icon={PiggyBank}
                        iconClass="bg-emerald-50 text-emerald-600"
                        label="Estimated Gross Profit"
                        value={formatCurrency(analytics.estimated_gp)}
                        description="Estimasi margin dari seluruh pipeline aktif"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Stage Breakdown */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Stage Breakdown
                            </CardTitle>
                            <CardDescription>
                                Distribusi jumlah deal dan nilai potensi per
                                tahapan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {analytics.stage_breakdown.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    Belum ada data opportunity.
                                </p>
                            )}
                            {analytics.stage_breakdown.map((row) => {
                                const meta = STAGE_META[row.stage] ?? {
                                    label: row.stage,
                                    className: "bg-gray-400",
                                };
                                const percentage =
                                    totalBreakdownValue > 0
                                        ? (row.total_value /
                                              totalBreakdownValue) *
                                          100
                                        : 0;

                                return (
                                    <div
                                        key={row.stage}
                                        className="space-y-1.5"
                                    >
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`h-2 w-2 rounded-full ${meta.className}`}
                                                />
                                                <span className="font-medium text-gray-900">
                                                    {meta.label}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({row.count} deals)
                                                </span>
                                            </div>
                                            <span className="font-semibold text-gray-900">
                                                {formatCurrency(
                                                    row.total_value,
                                                )}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${meta.className}`}
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Pending Follow-Ups */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <CalendarClock className="h-4 w-4" />
                                Upcoming Follow-Ups
                            </CardTitle>
                            <CardDescription>
                                5 tugas dengan tenggat waktu terdekat.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pendingFollowUps.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Tidak ada follow-up pending.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingFollowUps.map((task, idx) => {
                                        const overdue = isOverdue(
                                            task.due_date,
                                        );
                                        return (
                                            <div key={task.id}>
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {task.title}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                                            <Building2 className="h-3 w-3 shrink-0" />
                                                            <span className="truncate">
                                                                {task.account
                                                                    ?.company_name ||
                                                                    "-"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-1.5">
                                                            {overdue ? (
                                                                <Badge
                                                                    variant="destructive"
                                                                    className="gap-1 text-[10px] px-1.5 py-0"
                                                                >
                                                                    <Clock className="h-2.5 w-2.5" />
                                                                    Terlambat
                                                                </Badge>
                                                            ) : (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="gap-1 text-[10px] px-1.5 py-0 text-amber-700 border-amber-200 bg-amber-50"
                                                                >
                                                                    <Clock className="h-2.5 w-2.5" />
                                                                    {new Date(
                                                                        task.due_date,
                                                                    ).toLocaleDateString(
                                                                        "id-ID",
                                                                        {
                                                                            day: "2-digit",
                                                                            month: "short",
                                                                        },
                                                                    )}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 shrink-0"
                                                        onClick={() =>
                                                            markAsComplete(
                                                                task.id,
                                                            )
                                                        }
                                                    >
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                                {idx <
                                                    pendingFollowUps.length -
                                                        1 && (
                                                    <Separator className="mt-3" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

PipelineDashboard.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Pipeline Analytics", href: "/pipeline" },
        ]}
    >
        {page}
    </AppLayout>
);
