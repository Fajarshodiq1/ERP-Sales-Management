import { Link } from '@inertiajs/react';
import { LucideIcon, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * Butuh: npx shadcn@latest add button dropdown-menu
 *
 * <DataTableActions
 *   items={[
 *     { label: "Lihat", icon: Eye, href: `/users/${row.id}` },
 *     { label: "Edit", icon: Pencil, href: `/users/${row.id}/edit` },
 *     { label: "Hapus", icon: Trash2, variant: "destructive", separatorBefore: true, onClick: () => handleDelete(row.id) },
 *   ]}
 * />
 */

export interface ActionItem {
    label: string;
    icon?: LucideIcon;
    href?: string;
    onClick?: () => void;
    variant?: 'default' | 'destructive';
    separatorBefore?: boolean;
    disabled?: boolean;
}

export function DataTableActions({ items }: { items: ActionItem[] }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="data-[state=open]:bg-muted h-8 w-8"
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Buka menu aksi</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {items.map((item, i) => {
                    const Icon = item.icon;
                    const itemClassName = cn(
                        item.variant === 'destructive' &&
                            'text-destructive focus:bg-destructive/10 focus:text-destructive',
                    );

                    return (
                        <div key={i}>
                            {item.separatorBefore && <DropdownMenuSeparator />}
                            {item.href ? (
                                <DropdownMenuItem
                                    asChild
                                    disabled={item.disabled}
                                    className={itemClassName}
                                >
                                    <Link
                                        href={item.href}
                                        className="cursor-pointer"
                                    >
                                        {Icon && (
                                            <Icon className="mr-2 h-4 w-4" />
                                        )}
                                        {item.label}
                                    </Link>
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    onClick={item.onClick}
                                    disabled={item.disabled}
                                    className={cn(
                                        'cursor-pointer',
                                        itemClassName,
                                    )}
                                >
                                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                                    {item.label}
                                </DropdownMenuItem>
                            )}
                        </div>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
