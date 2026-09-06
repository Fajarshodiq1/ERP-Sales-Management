import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

/**
 * ==========================================================
 *  TableSearchInput & TableFilter — untuk slot `toolbar` DataTable
 * ==========================================================
 * Butuh komponen shadcn berikut (install kalau belum ada):
 *   npx shadcn@latest add input select
 *
 * Keduanya langsung kirim query string ke server (Inertia router.get)
 * dengan preserveState, jadi tinggal baca di controller:
 *   $request->query('search'), $request->query('role'), dst.
 * ==========================================================
 */

export function TableSearchInput({
    placeholder = 'Cari...',
    paramName = 'search',
    debounceMs = 400,
}: {
    placeholder?: string;
    paramName?: string;
    debounceMs?: number;
}) {
    const initial =
        new URLSearchParams(window.location.search).get(paramName) ?? '';
    const [value, setValue] = useState(initial);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                window.location.pathname,
                {
                    ...Object.fromEntries(
                        new URLSearchParams(window.location.search),
                    ),
                    [paramName]: value || undefined,
                },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, debounceMs);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <div className="relative w-full max-w-xs">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="pr-8 pl-8"
            />
            {value && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-9 w-9"
                    onClick={() => setValue('')}
                >
                    <X className="h-3.5 w-3.5" />
                    <span className="sr-only">Hapus pencarian</span>
                </Button>
            )}
        </div>
    );
}

export interface FilterOption {
    label: string;
    value: string;
}

/**
 * Dropdown filter generic — bisa dipasang berkali-kali untuk beberapa
 * kolom filter berbeda (mis. role, status) dalam satu toolbar.
 */
export function TableFilter({
    paramName,
    label,
    options,
}: {
    /** Nama query param, mis. "role" atau "status" */
    paramName: string;
    /** Label yang tampil, mis. "Role" -> placeholder "Semua Role" */
    label: string;
    options: FilterOption[];
}) {
    const current =
        new URLSearchParams(window.location.search).get(paramName) ?? 'all';

    const handleChange = (value: string) => {
        router.get(
            window.location.pathname,
            {
                ...Object.fromEntries(
                    new URLSearchParams(window.location.search),
                ),
                [paramName]: value === 'all' ? undefined : value,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <Select value={current} onValueChange={handleChange}>
            <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Semua {label}</SelectItem>
                {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
