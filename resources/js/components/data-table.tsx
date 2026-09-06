import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ==========================================================
 *  DataTable — generic, reusable, dengan filter per kolom & bulk action
 * ==========================================================
 * Butuh komponen shadcn berikut (install kalau belum ada):
 *   npx shadcn@latest add table checkbox input select skeleton button
 *
 * Contoh pakai lengkap — lihat users-index.tsx
 * ==========================================================
 */

export type ColumnFilter =
    | { type: 'text'; paramName: string; placeholder?: string }
    | {
          type: 'select';
          paramName: string;
          placeholder?: string;
          options: { label: string; value: string }[];
      };

export interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => ReactNode);
    className?: string;
    headerClassName?: string;
    /** Aktifkan filter di bawah header kolom ini (text atau select) */
    filter?: ColumnFilter;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

/** Bentuk data dari Laravel `$model->paginate()` yang di-pass via Inertia */
export interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[] | PaginatedData<T>;
    keyExtractor: (row: T) => string | number;
    emptyMessage?: string;
    /** Render aksi per baris (dianjurkan pakai <DataTableActions />) */
    actions?: (row: T) => ReactNode;
    /** Konten bebas di atas tabel: search global, tombol tambah, dsb */
    toolbar?: ReactNode;
    loading?: boolean;

    // ---- Bulk selection ----
    /** Aktifkan checkbox pilih baris */
    selectable?: boolean;
    /**
     * Render toolbar aksi massal. Tampil otomatis menggantikan `toolbar`
     * saat ada baris terpilih. Dikasih baris yang terpilih + fungsi clear.
     */
    bulkActions?: (selectedRows: T[], clearSelection: () => void) => ReactNode;
    onSelectionChange?: (selectedRows: T[]) => void;
}

function isPaginatedData<T>(
    data: T[] | PaginatedData<T>,
): data is PaginatedData<T> {
    return !Array.isArray(data);
}

export function DataTable<T>({
    columns,
    data,
    keyExtractor,
    emptyMessage = 'Belum ada data.',
    actions,
    toolbar,
    loading = false,
    selectable = false,
    bulkActions,
    onSelectionChange,
}: DataTableProps<T>) {
    const paginated = isPaginatedData(data);
    const rows = paginated ? data.data : data;
    const hasColumnFilters = columns.some((c) => c.filter);
    const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(
        new Set(),
    );

    const rowKeysSignature = rows.map(keyExtractor).join('|');
    // Reset seleksi tiap kali data baris berubah (pindah halaman / filter berubah)
    useEffect(() => {
        setSelectedKeys(new Set());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowKeysSignature]);

    useEffect(() => {
        if (!onSelectionChange) return;
        onSelectionChange(
            rows.filter((r) => selectedKeys.has(keyExtractor(r))),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKeys]);

    const selectedRows = rows.filter((r) => selectedKeys.has(keyExtractor(r)));
    const allSelected = rows.length > 0 && selectedRows.length === rows.length;
    const someSelected = selectedRows.length > 0 && !allSelected;

    const toggleAll = () => {
        setSelectedKeys((prev) => {
            if (allSelected) return new Set();
            return new Set(rows.map(keyExtractor));
        });
    };

    const toggleRow = (key: string | number) => {
        setSelectedKeys((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    const clearSelection = () => setSelectedKeys(new Set());

    const extraCols = (selectable ? 1 : 0) + (actions ? 1 : 0);
    const colSpan = columns.length + extraCols;
    const showBulkBar = selectable && selectedRows.length > 0 && bulkActions;

    return (
        <div className="space-y-4">
            {showBulkBar ? (
                <div className="bg-muted/50 flex flex-wrap items-center gap-3 rounded-lg border px-4 py-2.5">
                    <span className="text-sm font-medium">
                        {selectedRows.length} dipilih
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                        {bulkActions!(selectedRows, clearSelection)}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground ml-auto h-7 gap-1"
                        onClick={clearSelection}
                    >
                        <X className="h-3.5 w-3.5" />
                        Batal
                    </Button>
                </div>
            ) : toolbar ? (
                <div className="flex flex-wrap items-center gap-3">
                    {toolbar}
                </div>
            ) : null}

            <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-transparent">
                            {selectable && (
                                <TableHead className="w-[1%] px-4">
                                    <Checkbox
                                        checked={
                                            allSelected
                                                ? true
                                                : someSelected
                                                  ? 'indeterminate'
                                                  : false
                                        }
                                        onCheckedChange={toggleAll}
                                        aria-label="Pilih semua baris"
                                    />
                                </TableHead>
                            )}
                            {columns.map((col, i) => (
                                <TableHead
                                    key={i}
                                    className={cn(
                                        'text-muted-foreground h-11 text-xs font-semibold tracking-wider uppercase',
                                        col.headerClassName,
                                    )}
                                >
                                    {col.header}
                                </TableHead>
                            ))}
                            {actions && (
                                <TableHead className="w-[1%] text-right">
                                    Aksi
                                </TableHead>
                            )}
                        </TableRow>

                        {hasColumnFilters && (
                            <TableRow className="bg-muted/20 hover:bg-transparent">
                                {selectable && <TableHead className="px-4" />}
                                {columns.map((col, i) => (
                                    <TableHead key={i} className="py-2">
                                        {col.filter ? (
                                            <ColumnFilterControl
                                                filter={col.filter}
                                            />
                                        ) : null}
                                    </TableHead>
                                ))}
                                {actions && <TableHead />}
                            </TableRow>
                        )}
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableSkeletonRows rows={5} colSpan={colSpan} />
                        ) : rows.length === 0 ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={colSpan}
                                    className="text-muted-foreground h-32 text-center"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => {
                                const key = keyExtractor(row);
                                const isSelected = selectedKeys.has(key);
                                return (
                                    <TableRow
                                        key={key}
                                        data-state={
                                            isSelected ? 'selected' : undefined
                                        }
                                        className="group"
                                    >
                                        {selectable && (
                                            <TableCell className="px-4">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() =>
                                                        toggleRow(key)
                                                    }
                                                    aria-label={`Pilih baris ${key}`}
                                                />
                                            </TableCell>
                                        )}
                                        {columns.map((col, i) => (
                                            <TableCell
                                                key={i}
                                                className={cn(
                                                    'text-muted-foreground',
                                                    col.className,
                                                )}
                                            >
                                                {typeof col.accessor ===
                                                'function'
                                                    ? col.accessor(row)
                                                    : String(
                                                          row[col.accessor] ??
                                                              '-',
                                                      )}
                                            </TableCell>
                                        ))}
                                        {actions && (
                                            <TableCell className="text-right">
                                                <div className="flex justify-end">
                                                    {actions(row)}
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                {paginated && !loading && rows.length > 0 && (
                    <DataTablePagination pagination={data} />
                )}
            </div>
        </div>
    );
}

/** Ambil semua query param aktif di URL supaya filter lain tidak ke-reset */
function currentQuery(): Record<string, string> {
    return Object.fromEntries(new URLSearchParams(window.location.search));
}

function pushQuery(params: Record<string, string | undefined>) {
    router.get(
        window.location.pathname,
        { ...currentQuery(), ...params },
        { preserveState: true, preserveScroll: true, replace: true },
    );
}

/** Input/Select kecil di baris filter bawah header, langsung update query string */
function ColumnFilterControl({ filter }: { filter: ColumnFilter }) {
    if (filter.type === 'select') {
        const current = currentQuery()[filter.paramName] ?? 'all';
        return (
            <Select
                value={current}
                onValueChange={(v) =>
                    pushQuery({
                        [filter.paramName]: v === 'all' ? undefined : v,
                    })
                }
            >
                <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder={filter.placeholder ?? 'Semua'} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {filter.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    return (
        <ColumnTextFilter
            paramName={filter.paramName}
            placeholder={filter.placeholder}
        />
    );
}

function ColumnTextFilter({
    paramName,
    placeholder,
}: {
    paramName: string;
    placeholder?: string;
}) {
    const [value, setValue] = useState(currentQuery()[paramName] ?? '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            pushQuery({ [paramName]: value || undefined });
        }, 400);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder ?? 'Filter...'}
            className="h-8 text-xs"
        />
    );
}

function TableSkeletonRows({
    rows,
    colSpan,
}: {
    rows: number;
    colSpan: number;
}) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                    <TableCell colSpan={colSpan} className="py-3.5">
                        <Skeleton className="h-4 w-full" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}

function DataTablePagination<T>({
    pagination,
}: {
    pagination: PaginatedData<T>;
}) {
    if (pagination.links.length <= 3) return null;

    return (
        <div className="text-muted-foreground flex flex-col items-center justify-between gap-3 border-t px-4 py-3 text-sm sm:flex-row">
            <span>
                Menampilkan{' '}
                <span className="text-foreground font-medium">
                    {pagination.from ?? 0}
                </span>
                –
                <span className="text-foreground font-medium">
                    {pagination.to ?? 0}
                </span>{' '}
                dari{' '}
                <span className="text-foreground font-medium">
                    {pagination.total}
                </span>{' '}
                data
            </span>
            <div className="flex flex-wrap gap-1">
                {pagination.links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url ?? '#'}
                        preserveScroll
                        preserveState
                        className={cn(
                            'flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors',
                            link.active
                                ? 'bg-primary text-primary-foreground'
                                : link.url
                                  ? 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                  : 'text-muted-foreground/40 pointer-events-none',
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}
