import React, { ReactNode, useMemo, useCallback, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { Plus } from "lucide-react";

import PageHeader from "@/components/data-table/PageHeader";
import BulkActionBar from "@/components/data-table/BulkActionBar";
import ActionButtons from "@/components/data-table/ActionButtons";
import { DataTable } from "@/components/data-table/DataTable";
import { CellStyles, StatusBadge } from "@/components/data-table/cellRenderers";
import { TargetAccount, PaginatedData } from "@/types/crm";

interface Props {
    targetAccounts: PaginatedData<TargetAccount>;
    salesList: { id: number; name: string }[];
}

// Custom Priority Badge Component
const PriorityBadge = ({
    priority,
}: {
    priority?: TargetAccount["priority"];
}) => {
    const priorityMap: Record<string, { label: string; class: string }> = {
        high: {
            label: "High",
            class: "bg-red-50 text-red-700 ring-red-600/10",
        },
        medium: {
            label: "Medium",
            class: "bg-amber-50 text-amber-700 ring-amber-600/20",
        },
        low: {
            label: "Low",
            class: "bg-blue-50 text-blue-700 ring-blue-700/10",
        },
    };

    const config = priority ? priorityMap[priority.toLowerCase()] : null;

    if (!config) {
        return <span className="text-gray-400">-</span>;
    }

    return (
        <span
            className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${config.class}`}
        >
            {config.label}
        </span>
    );
};

function TargetAccountIndex({ targetAccounts }: Props) {
    const [selectedRows, setSelectedRows] = useState<TargetAccount[]>([]);
    const [search, setSearch] = useState("");

    // Filter pencarian lokal berdasarkan relasi account, businessPillar, assignedSales, priority & status
    const filteredAccounts = useMemo(() => {
        if (!search.trim()) return targetAccounts.data;
        const keyword = search.toLowerCase();
        return targetAccounts.data.filter(
            (item) =>
                item.account?.company_name?.toLowerCase().includes(keyword) ||
                item.business_pillar?.name?.toLowerCase().includes(keyword) ||
                item.assigned_sales?.name?.toLowerCase().includes(keyword) ||
                item.priority?.toLowerCase().includes(keyword) ||
                item.status?.toLowerCase().includes(keyword),
        );
    }, [targetAccounts.data, search]);

    // Single Delete
    const handleDelete = useCallback((id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus Target Account ini?")) {
            router.delete(`/target-accounts/${id}`);
        }
    }, []);

    // Bulk Delete
    const handleBulkDelete = useCallback(() => {
        if (selectedRows.length === 0) return;
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus ${selectedRows.length} Target Account terpilih?`,
            )
        ) {
            const ids = selectedRows.map((row) => row.id);
            router.post("/target-accounts/bulk-delete", { ids });
        }
    }, [selectedRows]);

    // Export Handler
    const handleExport = useCallback(() => {
        window.location.href = "/target-accounts/export";
    }, []);

    // Definisi Kolom AG Grid
    const columnDefs = useMemo<ColDef<TargetAccount>[]>(
        () => [
            {
                headerName: "Perusahaan (Account)",
                valueGetter: (params) =>
                    params.data?.account?.company_name || "-",
                flex: 1.4,
                minWidth: 200,
                cellStyle: CellStyles.left,
                cellRenderer: (params: { value: string }) => (
                    <span className="font-medium text-gray-900 truncate">
                        {params.value}
                    </span>
                ),
            },
            {
                headerName: "Business Pillar",
                valueGetter: (params) =>
                    params.data?.business_pillar?.name || "-",
                flex: 1.2,
                minWidth: 160,
                cellStyle: CellStyles.left,
                cellRenderer: (params: { value: string }) => (
                    <span className="text-xs text-gray-700 truncate">
                        {params.value}
                    </span>
                ),
            },
            {
                headerName: "Assigned Sales",
                valueGetter: (params) =>
                    params.data?.assigned_sales?.name || "-",
                flex: 1.2,
                minWidth: 160,
                cellStyle: CellStyles.left,
                cellRenderer: (params: { value: string }) => (
                    <span className="font-medium text-gray-700 truncate">
                        {params.value}
                    </span>
                ),
            },
            {
                headerName: "Priority",
                field: "priority",
                width: 110,
                cellStyle: CellStyles.center,
                cellRenderer: (params: {
                    value?: TargetAccount["priority"];
                }) => <PriorityBadge priority={params.value} />,
            },
            {
                headerName: "Status",
                field: "status",
                width: 140,
                cellStyle: CellStyles.center,
                cellRenderer: (params: ICellRendererParams<TargetAccount>) => {
                    const status = params.data?.status;
                    if (!status) return null;

                    const statusMap: Record<
                        TargetAccount["status"],
                        { label: string; class: string }
                    > = {
                        prospect: {
                            label: "Prospect",
                            class: "bg-blue-50 text-blue-700 ring-blue-700/10",
                        },
                        engaged: {
                            label: "Engaged",
                            class: "bg-purple-50 text-purple-700 ring-purple-700/10",
                        },
                        qualified: {
                            label: "Qualified",
                            class: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
                        },
                        closed: {
                            label: "Closed",
                            class: "bg-gray-100 text-gray-800 ring-gray-600/20",
                        },
                        lost: {
                            label: "Lost",
                            class: "bg-red-50 text-red-700 ring-red-600/10",
                        },
                    };

                    const style = statusMap[status];
                    if (!style)
                        return <span className="text-gray-400">{status}</span>;

                    return (
                        <span
                            className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${style.class}`}
                        >
                            {style.label}
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
                cellRenderer: (params: ICellRendererParams<TargetAccount>) => (
                    <ActionButtons
                        viewHref={`/target-accounts/${params.data!.id}`}
                        editHref={`/target-accounts/${params.data!.id}/edit`}
                        onDelete={() => handleDelete(params.data!.id)}
                    />
                ),
            },
        ],
        [handleDelete],
    );

    return (
        <>
            <Head title="Target Accounts" />
            <div className="mx-auto w-full space-y-6 p-6">
                <PageHeader
                    title="Target Accounts"
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Cari perusahaan, pillar, atau assigned sales..."
                    onExport={handleExport}
                    actionLabel="Add Target Account"
                    actionHref="/target-accounts/create"
                    actionIcon={<Plus size={16} />}
                />

                <BulkActionBar
                    count={selectedRows.length}
                    label="target account"
                    onDelete={handleBulkDelete}
                />

                <DataTable<TargetAccount>
                    rowData={filteredAccounts}
                    columnDefs={columnDefs}
                    onSelectionChanged={setSelectedRows}
                />
            </div>
        </>
    );
}

TargetAccountIndex.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Target Accounts", href: "/target-accounts" },
        ]}
    >
        {page}
    </AppLayout>
);

export default TargetAccountIndex;
