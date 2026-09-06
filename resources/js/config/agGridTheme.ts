
import { themeQuartz, ColDef } from "ag-grid-community";

export const gridTheme = themeQuartz.withParams({
    accentColor: "#2563eb",
    borderColor: "#e5e7eb",
    headerBackgroundColor: "#f9fafb",
    headerTextColor: "#6b7280",
    headerFontWeight: 600,
    rowHoverColor: "#f9fafb50",
    fontFamily: "outfit, sans-serif",
    fontSize: 14,
    rowVerticalPaddingScale: 1.0,
});

export const defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
};