import React, { ReactNode, useMemo, useCallback, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { Plus } from "lucide-react";

import PageHeader from "@/components/data-table/PageHeader";
import BulkActionBar from "@/components/data-table/BulkActionBar";
import ActionButtons from "@/components/data-table/ActionButtons";
import { DataTable } from "@/components/data-table/DataTable";
import { CellStyles } from "@/components/data-table/cellRenderers";
import { Activity, PaginatedData } from "@/types/crm";

interface Props {
    activities: PaginatedData<Activity>;
}

// Custom Badge untuk Type Activity
const ActivityTypeBadge = ({ type }: { type?: string }) => {
    if (!type) return <span className="text-gray-400">-</span>;

    const typeMap: Record<string, { label: string; class: string }> = {
        call: {
            label: "Call",
            class: "bg-purple-50 text-purple-700 ring-purple-700/10",
        },
        email: {
            label: "Email",
            class: "bg-blue-50 text-blue-700 ring-blue-700/10",
        },
        meeting: {
            label: "Meeting",
            class: "bg-amber-50 text-amber-700 ring-amber-600/20",
        },
        whatsapp: {
            label: "WhatsApp",
            class: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        },
        presentation: {
            label: "Presentation",
            class: "bg-indigo-50 text-indigo-700 ring-indigo-700/10",
        },
    };

    const config = typeMap[type.toLowerCase()] || {
        label: type,
        class: "bg-gray-50 text-gray-700 ring-gray-600/20",
    };

    return (
        <span
            className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${config.class}`}
        >
            {config.label}
        </span>
    );
};

function ActivityIndex({ activities }: Props) {
    const [selectedRows, setSelectedRows] = useState<Activity[]>([]);
    const [search, setSearch] = useState("");

    // Filter lokal berdasarkan Perusahaan, Contact, User, Type, Result, atau Notes
    const filteredActivities = useMemo(() => {
        if (!search.trim()) return activities.data;
        const keyword = search.toLowerCase();
        return activities.data.filter(
            (item) =>
                item.account?.company_name?.toLowerCase().includes(keyword) ||
                item.contact?.name?.toLowerCase().includes(keyword) ||
                item.user?.name?.toLowerCase().includes(keyword) ||
                item.type?.toLowerCase().includes(keyword) ||
                item.result?.toLowerCase().includes(keyword) ||
                item.notes?.toLowerCase().includes(keyword),
        );
    }, [activities.data, search]);

    // Single Delete
    const handleDelete = useCallback((id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus aktivitas ini?")) {
            router.delete(`/activities/${id}`);
        }
    }, []);

    // Bulk Delete
    const handleBulkDelete = useCallback(() => {
        if (selectedRows.length === 0) return;
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus ${selectedRows.length} aktivitas terpilih?`,
            )
        ) {
            const ids = selectedRows.map((row) => row.id);
            router.post("/activities/bulk-delete", { ids });
        }
    }, [selectedRows]);

    // Export Handler
    const handleExport = useCallback(() => {
        window.location.href = "/activities/export";
    }, []);

    // Definisi Kolom AG Grid
    const columnDefs = useMemo<ColDef<Activity>[]>(
        () => [
            {
                headerName: "Perusahaan & Contact",
                flex: 1.4,
                minWidth: 200,
                cellStyle: CellStyles.left,
                cellRenderer: ({ data }: ICellRendererParams<Activity>) => {
                    if (!data) return null;
                    return (
                        <div className="flex flex-col justify-center py-1 leading-tight">
                            <span className="font-medium text-gray-900 truncate">
                                {data.account?.company_name || "-"}
                            </span>
                            {data.contact && (
                                <span className="text-xs text-gray-500 truncate">
                                    {data.contact.name}
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                headerName: "Type",
                field: "type",
                width: 130,
                cellStyle: CellStyles.center,
                cellRenderer: (params: { value?: string }) => (
                    <ActivityTypeBadge type={params.value} />
                ),
            },
            {
                headerName: "Sales / User",
                valueGetter: (params) => params.data?.user?.name || "-",
                flex: 1.1,
                minWidth: 150,
                cellStyle: CellStyles.left,
                cellRenderer: (params: { value: string }) => (
                    <span className="font-medium text-gray-700 truncate">
                        {params.value}
                    </span>
                ),
            },
            {
                headerName: "Waktu Pelaksanaan",
                field: "performed_at",
                flex: 1,
                minWidth: 160,
                cellStyle: CellStyles.left,
                cellRenderer: (params: { value: string }) => {
                    if (!params.value) return "-";
                    return (
                        <span className="text-xs text-gray-700">
                            {new Date(params.value).toLocaleDateString(
                                "id-ID",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                },
                            )}
                        </span>
                    );
                },
            },
            {
                headerName: "Result / OutCome",
                field: "result",
                flex: 1.3,
                minWidth: 180,
                cellStyle: CellStyles.left,
                cellRenderer: ({ data }: ICellRendererParams<Activity>) => {
                    if (!data) return null;
                    return (
                        <span
                            className="text-xs text-gray-700 truncate"
                            title={data.result}
                        >
                            {data.result || "-"}
                        </span>
                    );
                },
            },
            {
                headerName: "Aksi",
                field: "id",
                width: 130,
                sortable: false,
                filter: false,
                cellStyle: CellStyles.right,
                headerClass: "[&_.ag-header-cell-label]:justify-center",
                cellRenderer: (params: ICellRendererParams<Activity>) => (
                    <ActionButtons
                        viewHref={`/activities/${params.data!.id}`}
                        editHref={`/activities/${params.data!.id}/edit`}
                        onDelete={() => handleDelete(params.data!.id)}
                    />
                ),
            },
        ],
        [handleDelete],
    );

    return (
        <>
            <Head title="Activities" />
            <div className="mx-auto w-full space-y-6 p-6">
                <PageHeader
                    title="Activities"
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Cari perusahaan, kontak, tipe, atau hasil aktivitas..."
                    onExport={handleExport}
                    actionLabel="Log Activity"
                    actionHref="/activities/create"
                    actionIcon={<Plus size={16} />}
                />

                <BulkActionBar
                    count={selectedRows.length}
                    label="aktivitas"
                    onDelete={handleBulkDelete}
                />

                <DataTable<Activity>
                    rowData={filteredActivities}
                    columnDefs={columnDefs}
                    onSelectionChanged={setSelectedRows}
                />
            </div>
        </>
    );
}

ActivityIndex.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Activities", href: "/activities" },
        ]}
    >
        {page}
    </AppLayout>
);

export default ActivityIndex;
