import React, { ReactNode, useMemo, useCallback, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { Plus, Kanban } from "lucide-react";

import PageHeader from "@/components/data-table/PageHeader";
import BulkActionBar from "@/components/data-table/BulkActionBar";
import ActionButtons from "@/components/data-table/ActionButtons";
import { DataTable } from "@/components/data-table/DataTable";
import { CellStyles } from "@/components/data-table/cellRenderers";
import { PaginatedData } from "@/types/crm";
import type { Opportunity } from "@/types/opportunity";
interface Props {
    opportunities: PaginatedData<Opportunity>;
}

// Custom Badge untuk Stage Opportunity
const StageBadge = ({ stage }: { stage?: string }) => {
    if (!stage) return <span className="text-gray-400">-</span>;

    const stageMap: Record<string, { label: string; class: string }> = {
        discovery: {
            label: "Discovery",
            class: "bg-blue-50 text-blue-700 ring-blue-700/10",
        },
        proposal: {
            label: "Proposal",
            class: "bg-purple-50 text-purple-700 ring-purple-700/10",
        },
        negotiation: {
            label: "Negotiation",
            class: "bg-amber-50 text-amber-700 ring-amber-600/20",
        },
        closed_won: {
            label: "Closed Won",
            class: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        },
        closed_lost: {
            label: "Closed Lost",
            class: "bg-red-50 text-red-700 ring-red-600/10",
        },
    };

    const config = stageMap[stage.toLowerCase()] || {
        label: stage.replace("_", " "),
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

// Formatter Rupiah
const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "-";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(val);
};

function OpportunityIndex({ opportunities }: Props) {
    const [selectedRows, setSelectedRows] = useState<Opportunity[]>([]);
    const [search, setSearch] = useState("");

    // Filter lokal berdasarkan nama opportunity, perusahaan, stage, pillar, atau sales
    const filteredOpportunities = useMemo(() => {
        if (!search.trim()) return opportunities.data;
        const keyword = search.toLowerCase();
        return opportunities.data.filter(
            (item) =>
                item.opportunity_name?.toLowerCase().includes(keyword) ||
                item.account?.company_name?.toLowerCase().includes(keyword) ||
                item.business_pillar?.name?.toLowerCase().includes(keyword) ||
                item.user?.name?.toLowerCase().includes(keyword) ||
                item.stage?.toLowerCase().includes(keyword),
        );
    }, [opportunities.data, search]);

    // Single Delete
    const handleDelete = useCallback((id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus opportunity ini?")) {
            router.delete(`/opportunities/${id}`);
        }
    }, []);

    // Bulk Delete
    const handleBulkDelete = useCallback(() => {
        if (selectedRows.length === 0) return;
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus ${selectedRows.length} opportunity terpilih?`,
            )
        ) {
            const ids = selectedRows.map((row) => row.id);
            router.post("/opportunities/bulk-delete", { ids });
        }
    }, [selectedRows]);

    // Export Handler
    const handleExport = useCallback(() => {
        window.location.href = "/opportunities/export";
    }, []);

    // Definisi Kolom AG Grid
    const columnDefs = useMemo<ColDef<Opportunity>[]>(
        () => [
            {
                headerName: "Opportunity & Perusahaan",
                flex: 1.5,
                minWidth: 220,
                cellStyle: CellStyles.left,
                cellRenderer: ({ data }: ICellRendererParams<Opportunity>) => {
                    if (!data) return null;
                    return (
                        <div className="flex flex-col justify-center py-1 leading-tight">
                            <span className="font-medium text-gray-900 truncate">
                                {data.opportunity_name}
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
                headerName: "Value",
                field: "potential_value",
                flex: 1.2,
                minWidth: 150,
                cellStyle: CellStyles.right,
                cellRenderer: (params: { value?: number }) => (
                    <span className="font-semibold text-gray-900">
                        {formatCurrency(params.value)}
                    </span>
                ),
            },
            {
                headerName: "Stage",
                field: "stage",
                width: 130,
                cellStyle: CellStyles.center,
                cellRenderer: (params: { value?: string }) => (
                    <StageBadge stage={params.value} />
                ),
            },
            {
                headerName: "Sales Rep",
                valueGetter: (params) => params.data?.user?.name || "-",
                flex: 1.1,
                minWidth: 140,
                cellStyle: CellStyles.left,
                cellRenderer: (params: { value: string }) => (
                    <span className="font-medium text-gray-700 truncate">
                        {params.value}
                    </span>
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
                cellRenderer: (params: ICellRendererParams<Opportunity>) => (
                    <ActionButtons
                        viewHref={`/opportunities/${params.data!.id}`}
                        editHref={`/opportunities/${params.data!.id}/edit`}
                        onDelete={() => handleDelete(params.data!.id)}
                    />
                ),
            },
        ],
        [handleDelete],
    );

    return (
        <>
            <Head title="Opportunities" />
            <div className="mx-auto w-full space-y-6 p-6">
                <PageHeader
                    title="Opportunities"
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Cari opportunity, perusahaan, stage..."
                    onExport={handleExport}
                    actionLabel="Add Opportunity"
                    actionHref="/opportunities/create"
                    actionIcon={<Plus size={16} />}
                >
                    <button
                        type="button"
                        onClick={() => router.get("/opportunities/board")}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <Kanban size={16} />
                        Kanban Board
                    </button>
                </PageHeader>

                <BulkActionBar
                    count={selectedRows.length}
                    label="opportunity"
                    onDelete={handleBulkDelete}
                />

                <DataTable<Opportunity>
                    rowData={filteredOpportunities}
                    columnDefs={columnDefs}
                    onSelectionChanged={setSelectedRows}
                />
            </div>
        </>
    );
}

OpportunityIndex.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Opportunities", href: "/opportunities" },
        ]}
    >
        {page}
    </AppLayout>
);

export default OpportunityIndex;
