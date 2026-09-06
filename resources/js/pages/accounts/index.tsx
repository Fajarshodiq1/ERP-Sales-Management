import React, { ReactNode, useMemo, useCallback, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { Plus, LayoutDashboard, Building2 } from "lucide-react";

import PageHeader from "@/components/data-table/PageHeader";
import BulkActionBar from "@/components/data-table/BulkActionBar";
import ActionButtons from "@/components/data-table/ActionButtons";
import { DataTable } from "@/components/data-table/DataTable";
import {
    CellStyles,
    StatusBadge,
    PillarBadge,
} from "@/components/data-table/cellRenderers";
import { Account, PaginatedData } from "@/types/crm";

interface Props {
    accounts: PaginatedData<Account>;
}

function AccountIndex({ accounts }: Props) {
    const [selectedRows, setSelectedRows] = useState<Account[]>([]);
    const [search, setSearch] = useState("");

    // Filter data lokal berdasarkan kata kunci pencarian
    const filteredAccounts = useMemo(() => {
        if (!search.trim()) return accounts.data;
        const keyword = search.toLowerCase();
        return accounts.data.filter(
            (acc) =>
                acc.company_name?.toLowerCase().includes(keyword) ||
                acc.industry?.toLowerCase().includes(keyword) ||
                acc.email?.toLowerCase().includes(keyword) ||
                acc.phone?.toLowerCase().includes(keyword),
        );
    }, [accounts.data, search]);

    // Handler Hapus Single Data
    const handleDelete = useCallback((id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus account ini?")) {
            router.delete(`/accounts/${id}`);
        }
    }, []);

    // Handler Hapus Masal (Bulk Delete)
    const handleBulkDelete = useCallback(() => {
        if (selectedRows.length === 0) return;
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus ${selectedRows.length} account terpilih?`,
            )
        ) {
            const ids = selectedRows.map((row) => row.id);
            router.post("/accounts/bulk-delete", { ids });
        }
    }, [selectedRows]);

    // Handler Export
    const handleExport = useCallback(() => {
        window.location.href = "/accounts/export";
    }, []);

    // Definisi Kolom Tabel
    const columnDefs = useMemo<ColDef<Account>[]>(
        () => [
            {
                headerName: "Perusahaan",
                field: "company_name",
                flex: 1.4,
                minWidth: 200,
                cellStyle: CellStyles.left,
                cellRenderer: ({ data }: ICellRendererParams<Account>) => {
                    if (!data) return null;
                    return (
                        <div className="flex flex-col justify-center py-1 leading-tight">
                            <span className="font-medium text-gray-900 truncate">
                                {data.company_name || "-"}
                            </span>
                            {data.website && (
                                <a
                                    href={
                                        data.website.startsWith("http")
                                            ? data.website
                                            : `https://${data.website}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-600 hover:underline truncate"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {data.website}
                                </a>
                            )}
                        </div>
                    );
                },
            },
            {
                headerName: "Kontak",
                flex: 1.2,
                minWidth: 180,
                cellStyle: CellStyles.left,
                cellRenderer: ({ data }: ICellRendererParams<Account>) => {
                    if (!data) return null;
                    return (
                        <div className="flex flex-col justify-center py-1 leading-tight text-xs text-gray-600">
                            <span className="font-medium text-gray-800 truncate">
                                {data.email || "-"}
                            </span>
                            {data.phone && (
                                <span className="text-gray-500 truncate">
                                    {data.phone}
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                headerName: "Pillar",
                valueGetter: (params) =>
                    params.data?.business_pillar?.name || "-",
                flex: 1,
                minWidth: 130,
                cellStyle: CellStyles.center,
                cellRenderer: (params: { value: string }) => (
                    <PillarBadge value={params.value} />
                ),
            },
            {
                headerName: "Industri & Alamat",
                flex: 1.3,
                minWidth: 180,
                cellStyle: CellStyles.left,
                cellRenderer: ({ data }: ICellRendererParams<Account>) => {
                    if (!data) return null;
                    return (
                        <div className="flex flex-col justify-center py-1 leading-tight text-xs">
                            <span className="font-medium text-gray-700 truncate">
                                {data.industry || "-"}
                            </span>
                            {data.address && (
                                <span
                                    className="text-gray-400 truncate"
                                    title={data.address}
                                >
                                    {data.address}
                                </span>
                            )}
                        </div>
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
                headerClass: "text-right",
                cellRenderer: (params: ICellRendererParams<Account>) => (
                    <ActionButtons
                        viewHref={`/accounts/${params.data!.id}`}
                        editHref={`/accounts/${params.data!.id}/edit`}
                        onDelete={() => handleDelete(params.data!.id)}
                    />
                ),
            },
        ],
        [handleDelete],
    );

    return (
        <>
            <Head title="Accounts (Master Data)" />
            <div className="mx-auto w-full space-y-6 px-6">
                <PageHeader
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Cari perusahaan, industri, email, atau telepon..."
                    onExport={handleExport}
                    actionLabel="Add Account"
                    actionHref="/accounts/create"
                    actionIcon={<Plus size={16} />}
                />

                <BulkActionBar
                    count={selectedRows.length}
                    label="account"
                    onDelete={handleBulkDelete}
                />

                <DataTable<Account>
                    rowData={filteredAccounts}
                    columnDefs={columnDefs}
                    onSelectionChanged={setSelectedRows}
                />
            </div>
        </>
    );
}

// Konfigurasi Layout & Breadcrumbs dengan Ikon
AccountIndex.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                title: "Accounts",
                href: "/accounts",
                icon: Building2,
            },
        ]}
    >
        {page}
    </AppLayout>
);

export default AccountIndex;
