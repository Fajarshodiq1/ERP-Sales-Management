import { ReactNode } from "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    backHref?: string;
    children?: ReactNode; // <-- tambahkan ini
}

export function PageHeader({
    icon: Icon,
    title,
    description,
    backHref,
    children,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
                {backHref && (
                    <Link
                        href={backHref}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition mt-0.5"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                )}
                <div className="flex items-start gap-3">
                    {Icon && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Icon className="h-4 w-4" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-sm text-gray-500 mt-0.5">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Slot untuk tombol aksi, contoh: Edit / Convert to Opportunity */}
            {children && (
                <div className="flex items-center gap-2 shrink-0">
                    {children}
                </div>
            )}
        </div>
    );
}
