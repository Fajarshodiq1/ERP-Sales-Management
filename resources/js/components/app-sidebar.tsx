import { Link } from "@inertiajs/react";
import {
    LayoutGrid,
    Database,
    Users,
    Building2,
    Contact2,
    Layers,
    Target,
    PhoneCall,
    Activity as ActivityIcon,
    UserCheck,
    Briefcase,
    Kanban,
    CalendarCheck,
    BarChart3,
    FolderGit2,
    BookOpen,
    CalendarClock,
} from "lucide-react";

import AppLogo from "@/components/app-logo";
import { NavFooter } from "@/components/nav-footer";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/types";

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
            {
                title: "Outreach",
                href: "/outreach",
                icon: PhoneCall,
            },
            {
                title: "Activities",
                href: "/activities",
                icon: ActivityIcon,
            },
            {
                title: "Leads",
                href: "/leads",
                icon: UserCheck,
            },
            {
                title: "Opportunities",
                href: "/opportunities",
                icon: Briefcase,
            },
        ],
    },
    {
        title: "Sales Management",
        icon: Kanban,
        isActive: false,
        items: [
            {
                title: "Pipeline",
                href: "/pipeline/dashboard",
                icon: Kanban,
            },
            {
                title: "Follow-ups",
                href: "/follow-ups",
                icon: CalendarCheck,
            },
            {
                title: "Performance",
                href: "/performance",
                icon: BarChart3,
            },
            {
                title: "Board",
                href: "opportunities/board",
                icon: BarChart3,
            },
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
            {
                title: "Accounts",
                href: "/accounts",
                icon: Building2,
            },
            {
                title: "Contacts",
                href: "/contacts",
                icon: Contact2,
            },
            {
                title: "Sales Users",
                href: "/users",
                icon: Users,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: "Repository",
        href: "https://github.com/laravel/react-starter-kit",
        icon: FolderGit2,
    },
    {
        title: "Documentation",
        href: "https://laravel.com/docs/starter-kits#react",
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
