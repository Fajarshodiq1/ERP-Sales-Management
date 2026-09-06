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
import { PaginatedData } from "@/types/crm";
import type { Lead } from "@/types/lead";
interface Props {
    leads: PaginatedData<Lead>;
}

// Custom Badge untuk Status Lead
const LeadStatusBadge = ({ status }: { status?: string }) => {
    if (!status) return <span className="text-gray-400">-</span>;

    const statusMap: Record<string, { label: string; class: string }> = {
        new: {
            label: "New",
            class: "bg-blue-50 text-blue-700 ring-blue-700/10",
        },
        contacted: {
            label: "Contacted",
            class: "bg-purple-50 text-purple-700 ring-purple-700/10",
        },
        qualified: {
            label: "Qualified",
            class: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        },
        unqualified: {
            label: "Unqualified",
            class: "bg-red-50 text-red-700 ring-red-600/10",
        },
        converted: {
            label: "Converted",
            class: "bg-indigo-50 text-indigo-700 ring-indigo-700/10",
        },
    };

    const config = statusMap[status.toLowerCase()] || {
        label: status,
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

function LeadIndex({ leads }: Props) {
    const [selectedRows, setSelectedRows] = useState<Lead[]>([]);
    const [search, setSearch] = useState("");

    // Filter pencarian lokal
    const filteredLeads = useMemo(() => {
        if (!search.trim()) return leads.data;
        const keyword = search.toLowerCase();
        return leads.data.filter(
            (item) =>
                item.lead_name?.toLowerCase().includes(keyword) ||
                item.account?.company_name?.toLowerCase().includes(keyword) ||
                item.contact?.name?.toLowerCase().includes(keyword) ||
                item.business_pillar?.name?.toLowerCase().includes(keyword) ||
                item.user?.name?.toLowerCase().includes(keyword) ||
                item.lead_source?.toLowerCase().includes(keyword) ||
                item.status?.toLowerCase().includes(keyword),
        );
    }, [leads.data, search]);

    // Single Delete
    const handleDelete = useCallback((id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus lead ini?")) {
            router.delete(`/leads/${id}`);
        }
    }, []);

    // Bulk Delete
    const handleBulkDelete = useCallback(() => {
        if (selectedRows.length === 0) return;
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus ${selectedRows.length} lead terpilih?`,
            )
        ) {
            const ids = selectedRows.map((row) => row.id);
            router.post("/leads/bulk-delete", { ids });
        }
    }, [selectedRows]);

    // Export Handler
    const handleExport = useCallback(() => {
        window.location.href = "/leads/export";
    }, []);

    // Definisi Kolom AG Grid
    const columnDefs = useMemo<ColDef<Lead>[]>(
        () => [
            {
                headerName: "Lead & Perusahaan",
                flex: 1.4,
                minWidth: 200,
                cellStyle: CellStyles.left,
                cellRenderer: ({ data }: ICellRendererParams<Lead>) => {
                    if (!data) return null;
                    return (
                        <div className="flex flex-col justify-center py-1 leading-tight">
                            <span className="font-medium text-gray-900 truncate">
                                {data.lead_name}
                            </span>
                            {data.account && (
                                <span className="text-xs text-gray-500 truncate">
                                    {data.account.company_name}
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                headerName: "Business Pillar",
                valueGetter: (params) =>
                    params.data?.business_pillar?.name || "-",
                flex: 1.1,
                minWidth: 150,
                cellStyle: CellStyles.left,
                cellRenderer: (params: { value: string }) => (
                    <span className="text-xs text-gray-700 truncate">
                        {params.value}
                    </span>
                ),
            },
            {
                headerName: "Assigned User",
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
                headerName: "Source",
                field: "lead_source",
                flex: 1,
                minWidth: 130,
                cellStyle: CellStyles.left,
                cellRenderer: (params: { value?: string }) => (
                    <span className="text-xs text-gray-700 capitalize">
                        {params.value || "-"}
                    </span>
                ),
            },
            {
                headerName: "Status",
                field: "status",
                width: 130,
                cellStyle: CellStyles.center,
                cellRenderer: (params: { value?: string }) => (
                    <LeadStatusBadge status={params.value} />
                ),
            },
            {
                headerName: "Aksi",
                field: "id",
                width: 130,
                sortable: false,
                filter: false,
                cellStyle: CellStyles.right,
                headerClass: "[&_.ag-header-cell-label]:justify-center",
                cellRenderer: (params: ICellRendererParams<Lead>) => (
                    <ActionButtons
                        viewHref={`/leads/${params.data!.id}`}
                        editHref={`/leads/${params.data!.id}/edit`}
                        onDelete={() => handleDelete(params.data!.id)}
                    />
                ),
            },
        ],
        [handleDelete],
    );

    return (
        <>
            <Head title="Leads" />
            <div className="mx-auto w-full space-y-6 p-6">
                <PageHeader
                    title="Leads"
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Cari nama lead, perusahaan, pilar, atau user..."
                    onExport={handleExport}
                    actionLabel="Add Lead"
                    actionHref="/leads/create"
                    actionIcon={<Plus size={16} />}
                />

                <BulkActionBar
                    count={selectedRows.length}
                    label="lead"
                    onDelete={handleBulkDelete}
                />

                <DataTable<Lead>
                    rowData={filteredLeads}
                    columnDefs={columnDefs}
                    onSelectionChanged={setSelectedRows}
                />
            </div>
        </>
    );
}

LeadIndex.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Leads", href: "/leads" },
        ]}
    >
        {page}
    </AppLayout>
);

export default LeadIndex;
