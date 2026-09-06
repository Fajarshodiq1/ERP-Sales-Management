import { useMemo } from "react";
import { ColDef, CellStyle, ICellRendererParams } from "ag-grid-community";
import ActionButtons from "@/components/data-table/ActionButtons";

export interface UserData {
    id: number;
    name: string;
    email: string;
    role?: string;
    status?: string;
    created_at: string;
}

const leftCellStyle: CellStyle = { display: "flex", alignItems: "center" };
const centeredCellStyle: CellStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};
const rightCellStyle: CellStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
};

export function useUserColumns(onDelete: (id: number) => void) {
    return useMemo<ColDef<UserData>[]>(
        () => [
            {
                headerName: "Nama",
                field: "name",
                flex: 1,
                minWidth: 160,
                cellClass: "font-medium text-gray-900",
                cellStyle: leftCellStyle,
            },
            {
                headerName: "Email",
                field: "email",
                flex: 1.2,
                minWidth: 200,
                cellClass: "text-gray-600",
                cellStyle: leftCellStyle,
            },
            {
                headerName: "Role",
                field: "role",
                width: 140,
                cellStyle: centeredCellStyle,
                cellRenderer: (params: { value: string }) => (
                    <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {params.value || "User"}
                    </span>
                ),
            },
            {
                headerName: "Status",
                field: "status",
                width: 140,
                cellStyle: centeredCellStyle,
                cellRenderer: (params: { value: string }) => {
                    const isActive = params.value === "active";
                    return (
                        <span
                            className={`inline-flex items-center gap-x-1.5 rounded px-2 py-0.5 text-xs font-medium ${
                                isActive
                                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                    : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10"
                            }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                    isActive ? "bg-emerald-500" : "bg-red-500"
                                }`}
                            />
                            {isActive ? "Aktif" : "Nonaktif"}
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
                cellRenderer: (params: ICellRendererParams<UserData>) => (
                    <ActionButtons
                        viewHref={`/users/${params.data!.id}`}
                        editHref={`/users/${params.data!.id}/edit`}
                        onDelete={() => onDelete(params.data!.id)}
                    />
                ),
                cellStyle: rightCellStyle,
                headerClass: "text-right",
            },
        ],
        [onDelete],
    );
}
