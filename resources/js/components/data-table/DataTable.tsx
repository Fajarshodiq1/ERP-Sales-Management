import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
    ColDef,
    ModuleRegistry,
    AllCommunityModule,
    themeQuartz,
    SelectionChangedEvent,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const gridTheme = themeQuartz.withParams({
    accentColor: "#2563eb",
    borderColor: "#e5e7eb",
    headerBackgroundColor: "#f9fafb",
    headerTextColor: "#6b7280",
    headerFontWeight: 600,
    rowHoverColor: "#f9fafb50",
    fontFamily: "inherit",
    fontSize: 14,
    rowVerticalPaddingScale: 1.0,
});

interface DataTableProps<T> {
    rowData: T[];
    columnDefs: ColDef<T>[];
    onSelectionChanged?: (selectedRows: T[]) => void;
    pageSize?: number;
    pageSizeSelector?: number[];
    rowHeight?: number;
    headerHeight?: number;
}

export function DataTable<T>({
    rowData,
    columnDefs,
    onSelectionChanged,
    pageSize = 10,
    pageSizeSelector = [10, 20, 50, 100],
    rowHeight = 64,
    headerHeight = 48,
}: DataTableProps<T>) {
    const defaultColDef = useMemo<ColDef>(
        () => ({
            resizable: true,
            sortable: true,
            filter: true,
        }),
        [],
    );

    const handleSelectionChange = (event: SelectionChangedEvent<T>) => {
        if (onSelectionChanged) {
            onSelectionChanged(event.api.getSelectedRows());
        }
    };

    return (
        <div className="overflow-hidden">
            <AgGridReact<T>
                theme={gridTheme}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                columnMenu="new"
                rowSelection={{
                    mode: "multiRow",
                    headerCheckbox: true,
                }}
                onSelectionChanged={handleSelectionChange}
                pagination={true}
                paginationPageSize={pageSize}
                paginationPageSizeSelector={pageSizeSelector}
                domLayout="autoHeight"
                rowHeight={rowHeight}
                headerHeight={headerHeight}
                animateRows={true}
            />
        </div>
    );
}
