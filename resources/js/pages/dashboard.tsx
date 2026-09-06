import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { dashboard } from "@/routes";
import { format, subDays } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import {
    TrendingUp,
    TrendingDown,
    Users,
    Target,
    Wallet,
    Trophy,
    CalendarIcon,
    Filter,
    X,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Area,
    AreaChart,
    Pie,
    PieChart,
    Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Option {
    id: number;
    name: string;
}

interface TrendInfo {
    percent: number;
    direction: "up" | "down";
}

interface KPI {
    totalAccounts: number;
    totalLeads: number;
    totalOpportunities: number;
    pipelineValue: number;
    wonValue: number;
    trends: {
        leads: TrendInfo;
        opportunities: TrendInfo;
        pipelineValue: TrendInfo;
        wonValue: TrendInfo;
    };
}

interface StageRow {
    stage: string;
    total: number;
    value: number;
}

interface LeadStatusRow {
    status: string;
    total: number;
}

interface DailyRow {
    date: string;
    value: number;
    total: number;
}

interface TopSalesRow {
    name: string;
    total: number;
    value: number;
}

interface ActivityRow {
    id: number;
    type: string;
    result: string | null;
    performed_at: string | null;
    account: string | null;
    user: string | null;
}

interface DashboardProps {
    filters: {
        from: string;
        to: string;
        business_pillar_id: string | null;
        sales_rep_id: string | null;
    };
    canFilterByRep: boolean;
    businessPillars: Option[];
    salesReps: Option[];
    kpi: KPI;
    opportunitiesByStage: StageRow[];
    leadsByStatus: LeadStatusRow[];
    dailyTrend: DailyRow[];
    topSales: TopSalesRow[];
    recentActivities: ActivityRow[];
}

const currency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        notation: value >= 1_000_000 ? "compact" : "standard",
        maximumFractionDigits: 1,
    }).format(value);

const stageChartConfig = {
    total: { label: "Jumlah Opportunity", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const trendChartConfig = {
    value: { label: "Nilai Pipeline", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const leadChartConfig = {
    total: { label: "Leads" },
} satisfies ChartConfig;

const PIE_COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

function TrendBadge({ trend }: { trend: TrendInfo }) {
    const isUp = trend.direction === "up";
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                isUp
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
            )}
        >
            {isUp ? (
                <TrendingUp className="h-3 w-3" />
            ) : (
                <TrendingDown className="h-3 w-3" />
            )}
            {trend.percent}%
        </span>
    );
}

function KpiCard({
    title,
    value,
    icon: Icon,
    trend,
    // accent,
}: {
    title: string;
    value: string;
    icon: React.ElementType;
    trend?: TrendInfo;
    // accent: string;
}) {
    return (
        <Card className="relative overflow-hidden">
            {/* <div className={cn("absolute inset-x-0 top-0 h-1", accent)} /> */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>{title}</CardDescription>
                <div
                    className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        // accent.replace("bg-", "bg-") + "/10",
                    )}
                >
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between">
                    <CardTitle className="text-2xl font-semibold tracking-tight">
                        {value}
                    </CardTitle>
                    {trend && <TrendBadge trend={trend} />}
                </div>
                {trend && (
                    <p className="text-muted-foreground mt-1 text-xs">
                        dibanding periode sebelumnya
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

export default function Dashboard({
    filters,
    canFilterByRep,
    businessPillars,
    salesReps,
    kpi,
    opportunitiesByStage,
    leadsByStatus,
    dailyTrend,
    topSales,
    recentActivities,
}: DashboardProps) {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(filters.from),
        to: new Date(filters.to),
    });
    const [businessPillarId, setBusinessPillarId] = useState<string>(
        filters.business_pillar_id ?? "all",
    );
    const [salesRepId, setSalesRepId] = useState<string>(
        filters.sales_rep_id ?? "all",
    );

    const applyFilters = (
        overrides?: Partial<{
            from: string;
            to: string;
            bp: string;
            rep: string;
        }>,
    ) => {
        router.get(
            dashboard().url,
            {
                from:
                    overrides?.from ??
                    (date?.from ? format(date.from, "yyyy-MM-dd") : undefined),
                to:
                    overrides?.to ??
                    (date?.to ? format(date.to, "yyyy-MM-dd") : undefined),
                business_pillar_id:
                    (overrides?.bp ?? businessPillarId) === "all"
                        ? undefined
                        : (overrides?.bp ?? businessPillarId),
                sales_rep_id:
                    (overrides?.rep ?? salesRepId) === "all"
                        ? undefined
                        : (overrides?.rep ?? salesRepId),
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        const from = subDays(new Date(), 29);
        const to = new Date();
        setDate({ from, to });
        setBusinessPillarId("all");
        setSalesRepId("all");
        router.get(
            dashboard().url,
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const hasActiveFilters = businessPillarId !== "all" || salesRepId !== "all";

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Sales Dashboard
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Ringkasan performa CRM secara real-time
                        </p>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="justify-start gap-2 text-left font-normal"
                                >
                                    <CalendarIcon className="h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(
                                                    date.from,
                                                    "d MMM yyyy",
                                                    { locale: localeId },
                                                )}{" "}
                                                –{" "}
                                                {format(date.to, "d MMM yyyy", {
                                                    locale: localeId,
                                                })}
                                            </>
                                        ) : (
                                            format(date.from, "d MMM yyyy", {
                                                locale: localeId,
                                            })
                                        )
                                    ) : (
                                        <span>Pilih tanggal</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    mode="range"
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                    locale={localeId}
                                    onDayClick={() => {}}
                                />
                                <div className="flex justify-end gap-2 border-t p-3">
                                    <Button
                                        size="sm"
                                        onClick={() => applyFilters()}
                                    >
                                        Terapkan
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Select
                            value={businessPillarId}
                            onValueChange={(v) => {
                                setBusinessPillarId(v);
                                applyFilters({ bp: v });
                            }}
                        >
                            <SelectTrigger size="sm" className="w-[170px]">
                                <SelectValue placeholder="Business Pillar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua Pillar
                                </SelectItem>
                                {businessPillars.map((bp) => (
                                    <SelectItem
                                        key={bp.id}
                                        value={String(bp.id)}
                                    >
                                        {bp.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {canFilterByRep && (
                            <Select
                                value={salesRepId}
                                onValueChange={(v) => {
                                    setSalesRepId(v);
                                    applyFilters({ rep: v });
                                }}
                            >
                                <SelectTrigger size="sm" className="w-[170px]">
                                    <SelectValue placeholder="Sales Rep" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Sales
                                    </SelectItem>
                                    {salesReps.map((rep) => (
                                        <SelectItem
                                            key={rep.id}
                                            value={String(rep.id)}
                                        >
                                            {rep.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                                className="gap-1"
                            >
                                <X className="h-3.5 w-3.5" />
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <KpiCard
                        title="Total Leads"
                        value={String(kpi.totalLeads)}
                        icon={Users}
                        trend={kpi.trends.leads}
                        // accent="bg-blue-500"
                    />
                    <KpiCard
                        title="Opportunities"
                        value={String(kpi.totalOpportunities)}
                        icon={Target}
                        trend={kpi.trends.opportunities}
                        // accent="bg-violet-500"
                    />
                    <KpiCard
                        title="Open Pipeline Value"
                        value={currency(kpi.pipelineValue)}
                        icon={Wallet}
                        trend={kpi.trends.pipelineValue}
                        // accent="bg-amber-500"
                    />
                    <KpiCard
                        title="Closed Won Value"
                        value={currency(kpi.wonValue)}
                        icon={Trophy}
                        trend={kpi.trends.wonValue}
                        // accent="bg-emerald-500"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid gap-4 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                        <CardHeader>
                            <CardTitle>Opportunities by Stage</CardTitle>
                            <CardDescription>
                                Jumlah opportunity per stage pipeline
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {opportunitiesByStage.length > 0 ? (
                                <ChartContainer
                                    config={stageChartConfig}
                                    className="h-[280px] w-full"
                                >
                                    <BarChart data={opportunitiesByStage}>
                                        <CartesianGrid
                                            vertical={false}
                                            strokeDasharray="3 3"
                                        />
                                        <XAxis
                                            dataKey="stage"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            width={30}
                                        />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                            cursor={{
                                                fill: "hsl(var(--muted))",
                                            }}
                                        />
                                        <Bar
                                            dataKey="total"
                                            fill="var(--color-total)"
                                            radius={[6, 6, 0, 0]}
                                            maxBarSize={48}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            ) : (
                                <EmptyState />
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Leads by Status</CardTitle>
                            <CardDescription>
                                Distribusi status leads
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {leadsByStatus.length > 0 ? (
                                <ChartContainer
                                    config={leadChartConfig}
                                    className="mx-auto h-[280px] w-full"
                                >
                                    <PieChart>
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    hideLabel
                                                />
                                            }
                                        />
                                        <Pie
                                            data={leadsByStatus}
                                            dataKey="total"
                                            nameKey="status"
                                            innerRadius={55}
                                            outerRadius={85}
                                            strokeWidth={4}
                                        >
                                            {leadsByStatus.map((_, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={
                                                        PIE_COLORS[
                                                            index %
                                                                PIE_COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <ChartLegend
                                            content={
                                                <ChartLegendContent nameKey="status" />
                                            }
                                        />
                                    </PieChart>
                                </ChartContainer>
                            ) : (
                                <EmptyState />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Trend + Top Sales */}
                <div className="grid gap-4 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                        <CardHeader>
                            <CardTitle>Pipeline Trend</CardTitle>
                            <CardDescription>
                                Nilai potensi opportunity harian pada periode
                                terpilih
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {dailyTrend.length > 0 ? (
                                <ChartContainer
                                    config={trendChartConfig}
                                    className="h-[260px] w-full"
                                >
                                    <AreaChart data={dailyTrend}>
                                        <defs>
                                            <linearGradient
                                                id="fillValue"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="var(--color-value)"
                                                    stopOpacity={0.35}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="var(--color-value)"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            vertical={false}
                                            strokeDasharray="3 3"
                                        />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(v) =>
                                                format(new Date(v), "d MMM")
                                            }
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(v) => currency(v)}
                                            width={70}
                                        />
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    formatter={(v) =>
                                                        currency(Number(v))
                                                    }
                                                />
                                            }
                                        />
                                        <Area
                                            dataKey="value"
                                            type="monotone"
                                            fill="url(#fillValue)"
                                            stroke="var(--color-value)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            ) : (
                                <EmptyState />
                            )}
                        </CardContent>
                    </Card>

                    {topSales.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Sales</CardTitle>
                                <CardDescription>
                                    Berdasarkan nilai opportunity
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {topSales.map((rep, index) => (
                                    <div
                                        key={rep.name}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {rep.name}
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                {rep.total} opportunity
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            {currency(rep.value)}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Recent Activities */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                        <CardDescription>
                            Aktivitas terbaru pada periode terpilih
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentActivities.length === 0 ? (
                            <EmptyState label="Belum ada aktivitas pada periode ini." />
                        ) : (
                            <div className="flex flex-col">
                                {recentActivities.map((activity, i) => (
                                    <div key={activity.id}>
                                        <div className="flex items-center justify-between py-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {activity.type} —{" "}
                                                    {activity.account ?? "-"}
                                                </p>
                                                <p className="text-muted-foreground text-xs">
                                                    oleh {activity.user ?? "-"}{" "}
                                                    •{" "}
                                                    {activity.performed_at ??
                                                        "-"}
                                                </p>
                                            </div>
                                            {activity.result && (
                                                <Badge
                                                    variant="outline"
                                                    className="shrink-0"
                                                >
                                                    {activity.result}
                                                </Badge>
                                            )}
                                        </div>
                                        {i < recentActivities.length - 1 && (
                                            <Separator />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function EmptyState({
    label = "Belum ada data pada periode ini.",
}: {
    label?: string;
}) {
    return (
        <div className="text-muted-foreground flex h-[220px] items-center justify-center text-sm">
            {label}
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => page;
