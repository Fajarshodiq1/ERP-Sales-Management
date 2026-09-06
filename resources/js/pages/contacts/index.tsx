import React, { ReactNode, useMemo, useCallback, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { Contact2, LayoutDashboard, Plus } from "lucide-react";

import PageHeader from "@/components/data-table/PageHeader";
import BulkActionBar from "@/components/data-table/BulkActionBar";
import ActionButtons from "@/components/data-table/ActionButtons";
import { DataTable } from "@/components/data-table/DataTable";
import { CellStyles, StatusBadge } from "@/components/data-table/cellRenderers";
import { Contact, PaginatedData } from "@/types/crm";

interface Props {
    contacts: PaginatedData<Contact>;
}

function ContactIndex({ contacts }: Props) {
    const [selectedRows, setSelectedRows] = useState<Contact[]>([]);
    const [search, setSearch] = useState("");

    // Filter lokal berdasarkan pencarian nama, jabatan, email, atau telepon
    const filteredContacts = useMemo(() => {
        if (!search.trim()) return contacts.data;
        const keyword = search.toLowerCase();
        return contacts.data.filter(
            (item) =>
                item.name?.toLowerCase().includes(keyword) ||
                item.position?.toLowerCase().includes(keyword) ||
                item.email?.toLowerCase().includes(keyword) ||
                item.phone?.toLowerCase().includes(keyword) ||
                item.account?.company_name?.toLowerCase().includes(keyword),
        );
    }, [contacts.data, search]);

    // Single Delete
    const handleDelete = useCallback((id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus kontak ini?")) {
            router.delete(`/contacts/${id}`);
        }
    }, []);

    // Bulk Delete
    const handleBulkDelete = useCallback(() => {
        if (selectedRows.length === 0) return;
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus ${selectedRows.length} kontak terpilih?`,
            )
        ) {
            const ids = selectedRows.map((row) => row.id);
            router.post("/contacts/bulk-delete", { ids });
        }
    }, [selectedRows]);

    // Export Handler
    const handleExport = useCallback(() => {
        window.location.href = "/contacts/export";
    }, []);

    // Definisi Kolom AG Grid
    const columnDefs = useMemo<ColDef<Contact>[]>(
        () => [
            {
                headerName: "Nama Kontak & Jabatan",
                field: "name",
                flex: 1.4,
                minWidth: 200,
                cellStyle: CellStyles.left,
                cellRenderer: ({ data }: ICellRendererParams<Contact>) => {
                    if (!data) return null;
                    return (
                        <div className="flex flex-col justify-center py-1 leading-tight">
                            <span className="font-medium text-gray-900 truncate">
                                {data.name || "-"}
                            </span>
                            {data.position && (
                                <span className="text-xs text-gray-500 truncate">
                                    {data.position}
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                headerName: "Perusahaan (Account)",
                valueGetter: (params) =>
                    params.data?.account?.company_name || "-",
                flex: 1.2,
                minWidth: 180,
                cellStyle: CellStyles.left,
                cellRenderer: (params: { value: string }) => (
                    <span className="font-medium text-gray-700 truncate">
                        {params.value}
                    </span>
                ),
            },
            {
                headerName: "Kontak",
                flex: 1.3,
                minWidth: 180,
                cellStyle: CellStyles.left,
                cellRenderer: ({ data }: ICellRendererParams<Contact>) => {
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
                cellRenderer: (params: ICellRendererParams<Contact>) => (
                    <ActionButtons
                        viewHref={`/contacts/${params.data!.id}`}
                        editHref={`/contacts/${params.data!.id}/edit`}
                        onDelete={() => handleDelete(params.data!.id)}
                    />
                ),
            },
        ],
        [handleDelete],
    );

    return (
        <>
            <Head title="Contacts (Master Data)" />
            <div className="mx-auto w-full space-y-6 px-6">
                <PageHeader
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Cari nama, jabatan, email, atau perusahaan..."
                    onExport={handleExport}
                    actionLabel="Add Contact"
                    actionHref="/contacts/create"
                    actionIcon={<Plus size={16} />}
                />

                <BulkActionBar
                    count={selectedRows.length}
                    label="kontak"
                    onDelete={handleBulkDelete}
                />

                <DataTable<Contact>
                    rowData={filteredContacts}
                    columnDefs={columnDefs}
                    onSelectionChanged={setSelectedRows}
                />
            </div>
        </>
    );
}

ContactIndex.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { title: "Contacts", href: "/contacts", icon: Contact2 },
        ]}
    >
        {page}
    </AppLayout>
);

export default ContactIndex;
