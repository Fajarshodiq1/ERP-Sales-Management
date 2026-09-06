import React, { ReactNode, useMemo } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { AgGridReact } from "ag-grid-react";
import {
    ColDef,
    CellStyle,
    ICellRendererParams,
    ModuleRegistry,
    AllCommunityModule,
    themeQuartz,
} from "ag-grid-community";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Wallet, PiggyBank, Target } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface SalesPerformance {
    user_id: number;
    user_name: string;
    total_activities: number;
    total_followups: number;
    deals_won: number;
    deals_lost: number;
    win_rate: number;
    total_revenue: number;
    total_gp: number;
}

interface Props {
    performance: {
        sales_performance: SalesPerformance[];
        summary: {
            total_revenue_achieved: number;
            total_gp_achieved: number;
            avg_win_rate: number;
        };
    };
}

const gridTheme = themeQuartz.withParams({
    accentColor: "#2563eb",
    borderColor: "#f3f4f6",
    headerBackgroundColor: "#f8fafc",
    headerTextColor: "#475569",
    headerFontWeight: 600,
    rowHoverColor: "#f1f5f980",
    fontFamily: "inherit",
    fontSize: 14,
    rowVerticalPaddingScale: 1.1,
});

const leftCellStyle: CellStyle = { display: "flex", alignItems: "center" };
const centeredCellStyle: CellStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const formatCurrency = (val: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(val);

const formatCurrencyFull = (val: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(val);

const getInitials = (name: string) =>
    name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

const winRateColor = (rate: number) => {
    if (rate >= 60) return "text-emerald-600 bg-emerald-50";
    if (rate >= 35) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
};

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

function TopPerformerCard({
    rank,
    rep,
}: {
    rank: number;
    rep: SalesPerformance;
}) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-600">
                {rank}
            </span>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                {getInitials(rep.user_name)}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">
                    {rep.user_name}
                </p>
                <p className="text-xs text-muted-foreground">
                    {formatCurrency(rep.total_revenue)} revenue
                </p>
            </div>
            <span
                className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 ${winRateColor(
                    rep.win_rate,
                )}`}
            >
                {rep.win_rate}%
            </span>
        </div>
    );
}

export default function Index({ performance }: Props) {
    const sorted = useMemo(
        () =>
            [...performance.sales_performance].sort(
                (a, b) => b.total_revenue - a.total_revenue,
            ),
        [performance.sales_performance],
    );

    const topThree = sorted.slice(0, 3);

    const columnDefs = useMemo<ColDef<SalesPerformance>[]>(
        () => [
            {
                headerName: "Sales Name",
                field: "user_name",
                minWidth: 200,
                flex: 1.2,
                cellStyle: leftCellStyle,
                cellRenderer: (
                    params: ICellRendererParams<SalesPerformance>,
                ) => {
                    const name = params.data?.user_name ?? "";
                    return (
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600">
                                {getInitials(name)}
                            </div>
                            <span className="font-semibold text-gray-900 truncate">
                                {name}
                            </span>
                        </div>
                    );
                },
            },
            {
                headerName: "Activities",
                field: "total_activities",
                width: 130,
                minWidth: 110,
                cellStyle: centeredCellStyle,
                headerClass: "text-center",
            },
            {
                headerName: "Follow-Ups",
                field: "total_followups",
                width: 130,
                minWidth: 110,
                cellStyle: centeredCellStyle,
                headerClass: "text-center",
            },
            {
                headerName: "Won / Lost",
                field: "deals_won",
                width: 140,
                minWidth: 120,
                cellStyle: centeredCellStyle,
                headerClass: "text-center",
                cellRenderer: (
                    params: ICellRendererParams<SalesPerformance>,
                ) => {
                    const data = params.data;
                    if (!data) return null;
                    return (
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 rounded px-1.5 py-0.5">
                                {data.deals_won}
                            </span>
                            <span className="text-xs font-semibold text-red-600 bg-red-50 rounded px-1.5 py-0.5">
                                {data.deals_lost}
                            </span>
                        </div>
                    );
                },
            },
            {
                headerName: "Win Rate",
                field: "win_rate",
                width: 160,
                minWidth: 140,
                cellStyle: leftCellStyle,
                cellRenderer: (
                    params: ICellRendererParams<SalesPerformance>,
                ) => {
                    const rate = params.data?.win_rate ?? 0;
                    const barColor =
                        rate >= 60
                            ? "bg-emerald-500"
                            : rate >= 35
                              ? "bg-amber-500"
                              : "bg-red-500";
                    const textColor =
                        rate >= 60
                            ? "text-emerald-600"
                            : rate >= 35
                              ? "text-amber-600"
                              : "text-red-600";
                    return (
                        <div className="flex items-center gap-2 w-full">
                            <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${barColor}`}
                                    style={{ width: `${rate}%` }}
                                />
                            </div>
                            <span
                                className={`text-xs font-bold w-9 text-right ${textColor}`}
                            >
                                {rate}%
                            </span>
                        </div>
                    );
                },
            },
            {
                headerName: "Revenue Won",
                field: "total_revenue",
                width: 170,
                minWidth: 150,
                cellStyle: leftCellStyle,
                cellRenderer: (
                    params: ICellRendererParams<SalesPerformance>,
                ) => (
                    <span className="font-semibold text-gray-900">
                        {formatCurrencyFull(params.data?.total_revenue ?? 0)}
                    </span>
                ),
            },
            {
                headerName: "Gross Profit",
                field: "total_gp",
                width: 160,
                minWidth: 140,
                cellStyle: leftCellStyle,
                cellRenderer: (
                    params: ICellRendererParams<SalesPerformance>,
                ) => (
                    <span className="font-semibold text-emerald-600">
                        {formatCurrencyFull(params.data?.total_gp ?? 0)}
                    </span>
                ),
            },
        ],
        [],
    );

    const defaultColDef = useMemo<ColDef>(
        () => ({
            resizable: true,
            sortable: true,
            filter: true,
        }),
        [],
    );

    return (
        <>
            <Head title="Sales Performance" />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Sales Performance & KPI
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Ringkasan performa tim sales berdasarkan revenue, win
                        rate, dan aktivitas.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard
                        icon={Wallet}
                        iconClass="bg-emerald-50 text-emerald-600"
                        label="Total Closed Revenue"
                        value={formatCurrencyFull(
                            performance.summary.total_revenue_achieved,
                        )}
                        description="Total nilai deal yang sudah closed won"
                    />
                    <MetricCard
                        icon={PiggyBank}
                        iconClass="bg-blue-50 text-blue-600"
                        label="Total Gross Profit"
                        value={formatCurrencyFull(
                            performance.summary.total_gp_achieved,
                        )}
                        description="Total margin dari seluruh deal closed"
                    />
                    <MetricCard
                        icon={Target}
                        iconClass="bg-indigo-50 text-indigo-600"
                        label="Average Win Rate"
                        value={`${performance.summary.avg_win_rate}%`}
                        description="Rata-rata tingkat closing seluruh sales"
                    />
                </div>

                {/* Top Performers - simple list, bukan podium */}
                {topThree.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Top Performers
                            </CardTitle>
                            <CardDescription>
                                3 sales dengan revenue tertinggi periode ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {topThree.map((rep, idx) => (
                                <TopPerformerCard
                                    key={rep.user_id}
                                    rank={idx + 1}
                                    rep={rep}
                                />
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Leaderboard Table - AG Grid */}
                <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <AgGridReact<SalesPerformance>
                        theme={gridTheme}
                        rowData={sorted}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        columnMenu="new"
                        domLayout="autoHeight"
                        rowHeight={56}
                        headerHeight={48}
                        animateRows={true}
                    />
                </div>
            </div>
        </>
    );
}

Index.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Sales Performance", href: "#" },
        ]}
    >
        {page}
    </AppLayout>
);
