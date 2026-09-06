import React from "react";
import { CellStyle } from "ag-grid-community";

export class CellStyles {
    static left: CellStyle = { display: "flex", alignItems: "center" };
    static center: CellStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };
    static right: CellStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
    };
}

export const StatusBadge = ({ value }: { value: string }) => {
    const isActive = value === "active";
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
};

export const PillarBadge = ({ value }: { value: string }) => (
    <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        {value}
    </span>
);
