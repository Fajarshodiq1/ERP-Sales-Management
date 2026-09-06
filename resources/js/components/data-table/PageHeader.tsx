import { Link } from "@inertiajs/react";
import { ReactNode } from "react";
import { Search, Download } from "lucide-react";
import { TabsIcons } from "./TabsIcons";
import { Button, buttonVariants } from "../ui/button";

interface PageHeaderProps {
    // title: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    onExport?: () => void;
    actionLabel?: string;
    actionHref?: string;
    actionIcon?: ReactNode;
}

export default function PageHeader({
    // title,
    searchValue,
    onSearchChange,
    searchPlaceholder = "Cari...",
    onExport,
    actionLabel,
    actionHref,
    actionIcon,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-5">
            {/* <h1 className="text-2xl font-bold tracking-tight">{title}</h1> */}
            <div>
                <TabsIcons />
            </div>
            <div className="flex items-center gap-2">
                {onSearchChange && (
                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full rounded-lg border border-gray-200 py-1.5 pr-3 pl-9 text-sm transition focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 focus:outline-none sm:w-64"
                        />
                    </div>
                )}

                {onExport && (
                    <Button variant="outline" size="sm" onClick={onExport}>
                        <Download data-icon="inline-start" />
                        Export
                    </Button>
                )}

                {actionLabel && actionHref && (
                    <Link
                        href={actionHref}
                        className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                            className: "bg-indigo-600 text-white",
                        })}
                    >
                        {actionIcon}
                        {actionLabel}
                    </Link>
                )}
            </div>
        </div>
    );
}
