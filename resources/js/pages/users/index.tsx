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
import { UserItem } from "@/types/UserItem";

interface Props {
    users: UserItem[];
}

function UserIndex({ users }: Props) {
    const [selectedRows, setSelectedRows] = useState<UserItem[]>([]);
    const [search, setSearch] = useState("");

    const filteredUsers = useMemo(() => {
        if (!search.trim()) return users;
        const keyword = search.toLowerCase();
        return users.filter(
            (user) =>
                user.name?.toLowerCase().includes(keyword) ||
                user.email?.toLowerCase().includes(keyword) ||
                user.role?.toLowerCase().includes(keyword) ||
                user.status?.toLowerCase().includes(keyword),
        );
    }, [users, search]);

    const handleDelete = useCallback((id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            router.delete(`/users/${id}`);
        }
    }, []);

    const handleBulkDelete = useCallback(() => {
        if (selectedRows.length === 0) return;
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus ${selectedRows.length} user terpilih?`,
            )
        ) {
            const ids = selectedRows.map((row) => row.id);
            router.post("/users/bulk-delete", { ids });
        }
    }, [selectedRows]);

    // Export Handler
    const handleExport = useCallback(() => {
        window.location.href = "/users/export";
    }, []);

    // Definisi Kolom AG Grid
    const columnDefs = useMemo<ColDef<UserItem>[]>(
        () => [
            {
                headerName: "Nama & Email",
                field: "name",
                flex: 1.4,
                minWidth: 200,
                cellStyle: CellStyles.left,
                cellRenderer: ({ data }: ICellRendererParams<UserItem>) => {
                    if (!data) return null;
                    return (
                        <div className="flex flex-col justify-center py-1 leading-tight">
                            <span className="font-medium text-gray-900 truncate">
                                {data.name || "-"}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                                {data.email || "-"}
                            </span>
                        </div>
                    );
                },
            },
            {
                headerName: "Role",
                field: "role",
                flex: 1,
                minWidth: 140,
                cellStyle: CellStyles.left,
                cellRenderer: (params: { value: string }) => (
                    <span className="inline-flex items-start rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 capitalize">
                        {params.value || "-"}
                    </span>
                ),
            },
            {
                headerName: "Status",
                field: "status",
                width: 120,
                cellStyle: CellStyles.left,
                cellRenderer: (params: { value: string }) => (
                    <StatusBadge value={params.value} />
                ),
            },
            {
                headerName: "Tanggal Dibuat",
                field: "created_at",
                flex: 1,
                minWidth: 150,
                cellStyle: CellStyles.left,
                cellRenderer: (params: { value: string }) => {
                    if (!params.value) return "-";
                    return (
                        <span className="text-xs text-gray-600">
                            {new Date(params.value).toLocaleDateString(
                                "id-ID",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                },
                            )}
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
                headerClass: "[&_.ag-header-cell-label]:justify-center", // 👈 Mengatur teks header AG Grid tepat di tengah
                cellRenderer: (params: ICellRendererParams<UserItem>) => (
                    <ActionButtons
                        viewHref={`/users/${params.data!.id}`}
                        editHref={`/users/${params.data!.id}/edit`}
                        onDelete={() => handleDelete(params.data!.id)}
                    />
                ),
            },
        ],
        [handleDelete],
    );

    return (
        <>
            <Head title="User Management" />
            <div className="mx-auto w-full space-y-6 px-6">
                <PageHeader
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Cari nama, email, atau role user..."
                    onExport={handleExport}
                    actionLabel="Add User"
                    actionHref="/users/create"
                    actionIcon={<Plus size={16} />}
                />

                <BulkActionBar
                    count={selectedRows.length}
                    label="user"
                    onDelete={handleBulkDelete}
                />

                <DataTable<UserItem>
                    rowData={filteredUsers}
                    columnDefs={columnDefs}
                    onSelectionChanged={setSelectedRows}
                />
            </div>
        </>
    );
}

UserIndex.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Users", href: "/users" },
        ]}
    >
        {page}
    </AppLayout>
);

export default UserIndex;
