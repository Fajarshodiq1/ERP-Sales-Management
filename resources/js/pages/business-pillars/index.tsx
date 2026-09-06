import React, { ReactNode, useMemo, useCallback, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { Home, Layers, LayoutDashboard, Plus } from "lucide-react";

import PageHeader from "@/components/data-table/PageHeader";
import BulkActionBar from "@/components/data-table/BulkActionBar";
import ActionButtons from "@/components/data-table/ActionButtons";
import { DataTable } from "@/components/data-table/DataTable";
import { CellStyles, StatusBadge } from "@/components/data-table/cellRenderers";
import { BusinessPillar, PaginatedData } from "@/types/crm";

interface Props {
    pillars: PaginatedData<BusinessPillar>;
}

function BusinessPillarIndex({ pillars }: Props) {
    const [selectedRows, setSelectedRows] = useState<BusinessPillar[]>([]);
    const [search, setSearch] = useState("");

    // Filter pencarian lokal
    const filteredPillars = useMemo(() => {
        if (!search.trim()) return pillars.data;
        const keyword = search.toLowerCase();
        return pillars.data.filter(
            (item) =>
                item.name?.toLowerCase().includes(keyword) ||
                item.description?.toLowerCase().includes(keyword) ||
                item.status?.toLowerCase().includes(keyword),
        );
    }, [pillars.data, search]);

    // Single Delete
    const handleDelete = useCallback((id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus business pillar ini?")) {
            router.delete(`/business-pillars/${id}`);
        }
    }, []);

    // Bulk Delete
    const handleBulkDelete = useCallback(() => {
        if (selectedRows.length === 0) return;
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus ${selectedRows.length} item terpilih?`,
            )
        ) {
            const ids = selectedRows.map((row) => row.id);
            router.post("/business-pillars/bulk-delete", { ids });
        }
    }, [selectedRows]);

    // Export Handler
    const handleExport = useCallback(() => {
        window.location.href = "/business-pillars/export";
    }, []);

    // Definisi Kolom AG Grid
    const columnDefs = useMemo<ColDef<BusinessPillar>[]>(
        () => [
            {
                headerName: "Nama Pillar",
                field: "name",
                flex: 1.2,
                minWidth: 180,
                cellStyle: CellStyles.left,
                cellRenderer: ({
                    data,
                }: ICellRendererParams<BusinessPillar>) => {
                    if (!data) return null;
                    return (
                        <span className="font-medium text-gray-900 truncate">
                            {data.name || "-"}
                        </span>
                    );
                },
            },
            {
                headerName: "Deskripsi",
                field: "description",
                flex: 2,
                minWidth: 250,
                cellStyle: CellStyles.left,
                cellRenderer: ({
                    data,
                }: ICellRendererParams<BusinessPillar>) => {
                    if (!data) return null;
                    return (
                        <span
                            className="text-xs text-gray-600 truncate"
                            title={data.description}
                        >
                            {data.description || "-"}
                        </span>
                    );
                },
            },
            {
                headerName: "Status",
                field: "status",
                width: 120,
                cellStyle: CellStyles.center,
                cellRenderer: (params: { value: string }) => (
                    <StatusBadge value={params.value} />
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
                cellRenderer: (params: ICellRendererParams<BusinessPillar>) => (
                    <ActionButtons
                        editHref={`/business-pillars/${params.data!.id}/edit`}
                        onDelete={() => handleDelete(params.data!.id)}
                    />
                ),
            },
        ],
        [handleDelete],
    );

    return (
        <>
            <Head title="Business Pillars (Master Data)" />
            <div className="mx-auto w-full space-y-6 px-6">
                <PageHeader
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Cari nama pillar atau deskripsi..."
                    onExport={handleExport}
                    actionLabel="Add Pillar"
                    actionHref="/business-pillars/create"
                    actionIcon={<Plus size={16} />}
                />

                <BulkActionBar
                    count={selectedRows.length}
                    label="business pillar"
                    onDelete={handleBulkDelete}
                />

                <DataTable<BusinessPillar>
                    rowData={filteredPillars}
                    columnDefs={columnDefs}
                    onSelectionChanged={setSelectedRows}
                />
            </div>
        </>
    );
}

BusinessPillarIndex.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            {
                title: "Business Pillars",
                href: "/business-pillars",
                icon: Layers,
            },
        ]}
    >
        {page}
    </AppLayout>
);

export default BusinessPillarIndex;
