import AppLayout from "@/layouts/app-layout";
import { Head, router, Link } from "@inertiajs/react";
import { useMemo, useCallback, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
    ColDef,
    CellStyle,
    ICellRendererParams,
    ModuleRegistry,
    AllCommunityModule,
    themeQuartz,
} from "ag-grid-community";
import { Plus, Eye, CheckCircle2, MoreVertical, Ban } from "lucide-react";
import type { ReactNode } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import PageHeader from "@/components/data-table/PageHeader";
import { PaginatedData } from "@/types/crm";

ModuleRegistry.registerModules([AllCommunityModule]);

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

const statusConfig: Record<
    FollowUp["status"],
    { label: string; className: string }
> = {
    pending: {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 ring-amber-600/20",
    },
    completed: {
        label: "Selesai",
        className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    },
    cancelled: {
        label: "Dibatalkan",
        className: "bg-gray-50 text-gray-500 ring-gray-500/20",
    },
};

const isOverdue = (dueDate: string, status: FollowUp["status"]) => {
    if (status !== "pending") return false;
    return new Date(dueDate).getTime() < Date.now();
};

function FollowUpActions({ followUp }: { followUp: FollowUp }) {
    const handleUpdateStatus = useCallback(
        (status: "completed" | "cancelled") => {
            const label = status === "completed" ? "selesai" : "dibatalkan";
            if (
                confirm(
                    `Tandai follow-up "${followUp.title}" sebagai ${label}?`,
                )
            ) {
                router.patch(
                    `/follow-ups/${followUp.id}/status`,
                    { status },
                    { preserveScroll: true },
                );
            }
        },
        [followUp],
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition">
                    <MoreVertical size={16} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                    <Link
                        href={`/follow-ups/${followUp.id}`}
                        className="flex items-center gap-2"
                    >
                        <Eye size={14} />
                        Lihat Detail
                    </Link>
                </DropdownMenuItem>
                {followUp.status === "pending" && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => handleUpdateStatus("completed")}
                            className="flex items-center gap-2 text-emerald-600 focus:text-emerald-600"
                        >
                            <CheckCircle2 size={14} />
                            Tandai Selesai
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleUpdateStatus("cancelled")}
                            className="flex items-center gap-2 text-red-600 focus:text-red-600"
                        >
                            <Ban size={14} />
                            Batalkan
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface Props {
    followUps: PaginatedData<FollowUp> | FollowUp[];
}

export default function FollowUpIndex({ followUps }: Props) {
    const rowData = useMemo(() => {
        return Array.isArray(followUps) ? followUps : followUps?.data || [];
    }, [followUps]);

    const [search, setSearch] = useState("");

    const handleExport = useCallback(() => {
        window.location.href = "/follow-ups/export";
    }, []);

    const columnDefs = useMemo<ColDef<FollowUp>[]>(
        () => [
            {
                headerName: "Judul",
                field: "title",
                minWidth: 220,
                flex: 1.3,
                cellStyle: leftCellStyle,
                cellRenderer: (params: ICellRendererParams<FollowUp>) => {
                    const data = params.data;
                    return (
                        <div className="flex flex-col justify-center py-1 overflow-hidden">
                            <span className="font-medium text-gray-900 truncate">
                                {data?.title}
                            </span>
                            {data?.account?.company_name && (
                                <span className="text-xs text-gray-500 truncate">
                                    {data.account.company_name}
                                </span>
                            )}
                        </div>
                    );
                },
                getQuickFilterText: (params) =>
                    `${params.data?.title ?? ""} ${
                        params.data?.account?.company_name ?? ""
                    }`,
            },
            {
                headerName: "Jatuh Tempo",
                field: "due_date",
                width: 170,
                minWidth: 150,
                cellStyle: leftCellStyle,
                cellRenderer: (params: ICellRendererParams<FollowUp>) => {
                    const data = params.data;
                    if (!data?.due_date)
                        return <span className="text-gray-400">-</span>;

                    const parsedDate = new Date(data.due_date);
                    const overdue = isOverdue(data.due_date, data.status);

                    return (
                        <div className="flex flex-col justify-center py-1">
                            <span
                                className={`font-medium leading-tight ${
                                    overdue ? "text-red-600" : "text-gray-900"
                                }`}
                            >
                                {parsedDate.toLocaleDateString("id-ID", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </span>
                            {overdue && (
                                <span className="text-xs text-red-500 font-medium">
                                    Terlambat
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                headerName: "Status",
                field: "status",
                width: 140,
                minWidth: 120,
                cellStyle: centeredCellStyle,
                cellRenderer: (params: ICellRendererParams<FollowUp>) => {
                    const status = params.data?.status;
                    if (!status) return null;
                    const item = statusConfig[status];
                    return (
                        <span
                            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${item.className}`}
                        >
                            {item.label}
                        </span>
                    );
                },
            },
            {
                headerName: "Perusahaan",
                field: "account.company_name",
                width: 190,
                minWidth: 170,
                flex: 1,
                cellStyle: leftCellStyle,
                valueGetter: (params) =>
                    params.data?.account?.company_name ?? "-",
                cellRenderer: (params: ICellRendererParams<FollowUp>) => (
                    <span className="text-gray-700 truncate">
                        {params.value}
                    </span>
                ),
            },
            {
                headerName: "Kontak",
                field: "contact.name",
                width: 170,
                minWidth: 150,
                cellStyle: leftCellStyle,
                valueGetter: (params) => params.data?.contact?.name ?? "-",
                cellRenderer: (params: ICellRendererParams<FollowUp>) => (
                    <span className="text-gray-700 truncate">
                        {params.value}
                    </span>
                ),
            },
            {
                headerName: "PIC",
                field: "user.name",
                width: 150,
                minWidth: 130,
                cellStyle: leftCellStyle,
                valueGetter: (params) => params.data?.user?.name ?? "-",
                getQuickFilterText: (params) => params.data?.user?.name ?? "",
                cellRenderer: (params: ICellRendererParams<FollowUp>) => (
                    <span className="text-gray-700 font-medium truncate">
                        {params.value}
                    </span>
                ),
            },
            {
                headerName: "",
                field: "id",
                width: 60,
                minWidth: 60,
                pinned: "right",
                sortable: false,
                filter: false,
                resizable: false,
                cellStyle: centeredCellStyle,
                cellRenderer: (params: ICellRendererParams<FollowUp>) => {
                    const data = params.data;
                    if (!data) return null;
                    return <FollowUpActions followUp={data} />;
                },
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
            <Head title="Follow-Up" />
            <div className="mx-auto w-full space-y-5 p-6">
                <PageHeader
                    title="Follow-Up"
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Cari judul, perusahaan, kontak..."
                    onExport={handleExport}
                    actionLabel="Jadwalkan Follow-Up"
                    actionHref="/follow-ups/create"
                    actionIcon={<Plus size={16} />}
                />

                <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <AgGridReact<FollowUp>
                        theme={gridTheme}
                        rowData={rowData}
                        quickFilterText={search}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        columnMenu="new"
                        pagination={true}
                        paginationPageSize={10}
                        paginationPageSizeSelector={[10, 25, 50, 100]}
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

FollowUpIndex.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Follow-Up", href: "/follow-ups" },
        ]}
    >
        {page}
    </AppLayout>
);
