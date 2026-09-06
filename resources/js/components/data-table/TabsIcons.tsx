import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Building2,
    Contact2,
    Layers,
    Users,
    LayoutGrid,
    Target,
    PhoneCall,
    Activity as ActivityIcon,
    UserCheck,
    Briefcase,
    Kanban,
    CalendarCheck,
    BarChart3,
    Database,
    type LucideIcon,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NavItem {
    title: string;
    href?: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: NavItem[];
}

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutGrid,
    },
    {
        title: "Sales",
        icon: Target,
        isActive: true,
        items: [
            {
                title: "Target Accounts",
                href: "/target-accounts",
                icon: Target,
            },
            { title: "Outreach", href: "/outreach", icon: PhoneCall },
            { title: "Activities", href: "/activities", icon: ActivityIcon },
            { title: "Leads", href: "/leads", icon: UserCheck },
            { title: "Opportunities", href: "/opportunities", icon: Briefcase },
        ],
    },
    {
        title: "Sales Management",
        icon: Kanban,
        isActive: false,
        items: [
            { title: "Pipeline", href: "/pipeline/dashboard", icon: Kanban },
            { title: "Follow-ups", href: "/follow-ups", icon: CalendarCheck },
            { title: "Performance", href: "/performance", icon: BarChart3 },
            { title: "Board", href: "/opportunities/board", icon: BarChart3 },
        ],
    },
    {
        title: "Master Data",
        icon: Database,
        isActive: false,
        items: [
            {
                title: "Business Pillars",
                href: "/business-pillars",
                icon: Layers,
            },
            { title: "Accounts", href: "/accounts", icon: Building2 },
            { title: "Contacts", href: "/contacts", icon: Contact2 },
            { title: "Sales Users", href: "/users", icon: Users },
        ],
    },
];

interface TabsIconsProps {
    categoryTitle?: string; // Opsional: paksa grup tertentu jika ingin dikunci
}

export function TabsIcons({ categoryTitle }: TabsIconsProps) {
    const { url } = usePage();

    // 1. Cari grup yang sesuai berdasarkan URL saat ini (atau berdasarkan prop `categoryTitle` jika diisi)
    const activeGroup =
        mainNavItems.find((group) => {
            if (categoryTitle) {
                return (
                    group.title.toLowerCase() === categoryTitle.toLowerCase()
                );
            }
            return group.items?.some(
                (item) => item.href && url.startsWith(item.href),
            );
        }) || mainNavItems.find((group) => group.title === "Sales"); // Default ke Sales jika tidak ketemu

    const currentItems = activeGroup?.items || [];

    // 2. Tentukan item mana yang aktif di dalam grup tersebut
    const activeTab =
        currentItems.find((item) => item.href && url.startsWith(item.href))
            ?.href || currentItems[0]?.href;

    if (currentItems.length === 0) return null;

    return (
        <Tabs value={activeTab} className="w-full">
            <TabsList
                className="grid w-full"
                style={{
                    gridTemplateColumns: `repeat(${currentItems.length}, minmax(0, 1fr))`,
                }}
            >
                {currentItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <TabsTrigger key={item.href} value={item.href!} asChild>
                            <Link
                                href={item.href!}
                                className="flex items-center"
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.title}</span>
                            </Link>
                        </TabsTrigger>
                    );
                })}
            </TabsList>
        </Tabs>
    );
}
