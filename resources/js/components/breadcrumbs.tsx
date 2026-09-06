import { Link } from "@inertiajs/react";
import { Fragment } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/types";
import { ChevronDown, Home } from "lucide-react";

export function Breadcrumbs({
    breadcrumbs = [],
}: {
    breadcrumbs: BreadcrumbItemType[];
}) {
    if (breadcrumbs.length === 0) return null;

    const currentPage = breadcrumbs[breadcrumbs.length - 1];
    const CurrentIcon = currentPage?.icon;

    return (
        <>
            {/* Mobile View */}
            <div className="flex items-center md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger className="text-foreground xs:max-w-[180px] flex max-w-[140px] items-center gap-1.5 text-sm font-medium hover:opacity-80 focus:outline-none">
                        {CurrentIcon && (
                            <CurrentIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <span className="truncate">{currentPage?.title}</span>
                        <ChevronDown className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem asChild>
                            <Link
                                href="/dashboard"
                                className="flex cursor-pointer items-center gap-2"
                            >
                                <Home className="h-4 w-4 shrink-0" />
                                <span>Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                        {breadcrumbs.map((item, index) => {
                            const Icon = item.icon;
                            const isLast = index === breadcrumbs.length - 1;

                            return (
                                <DropdownMenuItem
                                    key={index}
                                    asChild
                                    disabled={isLast}
                                >
                                    {item.href && !isLast ? (
                                        <Link
                                            href={item.href}
                                            className="flex cursor-pointer items-center gap-2"
                                        >
                                            {Icon && (
                                                <Icon className="h-4 w-4 shrink-0" />
                                            )}
                                            <span>{item.title}</span>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-2 font-medium text-foreground">
                                            {Icon && (
                                                <Icon className="h-4 w-4 shrink-0" />
                                            )}
                                            <span>{item.title}</span>
                                        </div>
                                    )}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex">
                <Breadcrumb>
                    <BreadcrumbList className="flex-nowrap">
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-1.5"
                                >
                                    <Home className="h-4 w-4" />
                                    <span className="sr-only">Dashboard</span>
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />

                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            const Icon = item.icon;

                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem className="whitespace-nowrap">
                                        {isLast || !item.href ? (
                                            <BreadcrumbPage className="inline-flex items-center gap-1.5">
                                                {Icon && (
                                                    <Icon className="h-4 w-4 shrink-0" />
                                                )}
                                                <span>{item.title}</span>
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link
                                                    href={item.href}
                                                    className="inline-flex items-center gap-1.5"
                                                >
                                                    {Icon && (
                                                        <Icon className="h-4 w-4 shrink-0" />
                                                    )}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </>
    );
}
