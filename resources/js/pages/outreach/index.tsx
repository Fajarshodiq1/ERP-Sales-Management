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
import { Outreach, PaginatedData } from "@/types/crm";

interface Props {
    outreaches: PaginatedData<Outreach>;
}

// Custom Badge untuk Channel Outreach
const ChannelBadge = ({ channel }: { channel?: string }) => {
    if (!channel) return <span className="text-gray-400">-</span>;

    const channelMap: Record<string, { label: string; class: string }> = {
        email: {
            label: "Email",
            class: "bg-blue-50 text-blue-700 ring-blue-700/10",
        },
        phone: {
            label: "Phone / Call",
            class: "bg-purple-50 text-purple-700 ring-purple-700/10",
        },
        whatsapp: {
            label: "WhatsApp",
            class: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        },
        linkedin: {
            label: "LinkedIn",
            class: "bg-sky-50 text-sky-700 ring-sky-600/20",
        },
        meeting: {
            label: "Meeting",
            class: "bg-amber-50 text-amber-700 ring-amber-600/20",
        },
    };

    const config = channelMap[channel.toLowerCase()] || {
        label: channel,
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

function OutreachIndex({ outreaches }: Props) {
    const [selectedRows, setSelectedRows] = useState<Outreach[]>([]);
    const [search, setSearch] = useState("");

    // Filter lokal berdasarkan target account (company name), contact, user, channel, atau result
    const filteredOutreaches = useMemo(() => {
        if (!search.trim()) return outreaches.data;
        const keyword = search.toLowerCase();
        return outreaches.data.filter(
            (item) =>
                item.target_account?.account?.company_name
                    ?.toLowerCase()
                    .includes(keyword) ||
                item.contact?.name?.toLowerCase().includes(keyword) ||
                item.user?.name?.toLowerCase().includes(keyword) ||
                item.channel?.toLowerCase().includes(keyword) ||
                item.result?.toLowerCase().includes(keyword) ||
                item.notes?.toLowerCase().includes(keyword),
        );
    }, [outreaches.data, search]);

    // Single Delete
    const handleDelete = useCallback((id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus log outreach ini?")) {
            router.delete(`/outreach/${id}`);
        }
    }, []);

    // Bulk Delete
    const handleBulkDelete = useCallback(() => {
        if (selectedRows.length === 0) return;
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus ${selectedRows.length} log outreach terpilih?`,
            )
        ) {
            const ids = selectedRows.map((row) => row.id);
            router.post("/outreach/bulk-delete", { ids });
        }
    }, [selectedRows]);

    // Export Handler
    const handleExport = useCallback(() => {
        window.location.href = "/outreach/export";
    }, []);

    // Definisi Kolom AG Grid
    const columnDefs = useMemo<ColDef<Outreach>[]>(
        () => [
            {
                headerName: "Target Account & Contact",
                flex: 1.4,
                minWidth: 200,
                cellStyle: CellStyles.left,
                cellRenderer: ({ data }: ICellRendererParams<Outreach>) => {
                    if (!data) return null;
                    return (
                        <div className="flex flex-col justify-center py-1 leading-tight">
                            <span className="font-medium text-gray-900 truncate">
                                {data.target_account?.account?.company_name ||
                                    "-"}
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
                headerName: "Channel",
                field: "channel",
                width: 130,
                cellStyle: CellStyles.center,
                cellRenderer: (params: { value?: string }) => (
                    <ChannelBadge channel={params.value} />
                ),
            },
            {
                headerName: "Sales Rep",
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
                headerName: "Outreach Date",
                field: "outreach_date",
                flex: 1,
                minWidth: 150,
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
                headerName: "Result",
                field: "result",
                flex: 1.3,
                minWidth: 180,
                cellStyle: CellStyles.left,
                cellRenderer: ({ data }: ICellRendererParams<Outreach>) => {
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
                cellRenderer: (params: ICellRendererParams<Outreach>) => (
                    <ActionButtons
                        editHref={`/outreach/${params.data!.id}/edit`}
                        onDelete={() => handleDelete(params.data!.id)}
                    />
                ),
            },
        ],
        [handleDelete],
    );

    return (
        <>
            <Head title="Outreach Logs" />
            <div className="mx-auto w-full space-y-6 p-6">
                <PageHeader
                    title="Outreach Logs"
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Cari perusahaan, kontak, channel, atau result..."
                    onExport={handleExport}
                    actionLabel="Log Outreach"
                    actionHref="/outreach/create"
                    actionIcon={<Plus size={16} />}
                />

                <BulkActionBar
                    count={selectedRows.length}
                    label="outreach"
                    onDelete={handleBulkDelete}
                />

                <DataTable<Outreach>
                    rowData={filteredOutreaches}
                    columnDefs={columnDefs}
                    onSelectionChanged={setSelectedRows}
                />
            </div>
        </>
    );
}

OutreachIndex.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Outreach", href: "/outreach" },
        ]}
    >
        {page}
    </AppLayout>
);

export default OutreachIndex;
