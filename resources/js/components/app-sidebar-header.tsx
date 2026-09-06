import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BreadcrumbItem as BreadcrumbItemType, User } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import {
    Bell,
    LogOut,
    Moon,
    Settings,
    Sun,
    User as UserIcon,
} from "lucide-react";

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth?.user;

    // State dummy untuk theme (Bisa disesuaikan dengan provider next-themes / custom hook Anda)
    const [isDark, setIsDark] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle("dark");
    };

    const initials = user?.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)
        : "U";

    return (
        <header className="border-sidebar-border/70 flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
            {/* Left Section: Sidebar & Breadcrumb */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Right Section: Theme Toggle, Notifications, Profile */}
            <div className="flex items-center gap-3">
                {/* Modern Theme Switcher Button */}
                <button
                    onClick={toggleTheme}
                    className="border-border/40 bg-background/50 text-foreground hover:bg-accent hover:text-accent-foreground relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 focus:outline-none"
                    title="Toggle Theme"
                >
                    <Sun
                        className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`}
                    />
                    <Moon
                        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"}`}
                    />
                    <span className="sr-only">Toggle theme</span>
                </button>

                {/* Notifications Button */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="border-border/40 relative h-9 w-9 rounded-full border"
                        >
                            <Bell className="h-4 w-4" />
                            {hasUnread && (
                                <span className="absolute top-2 right-2 flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                                </span>
                            )}
                            <span className="sr-only">Notifikasi</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80" align="end">
                        <DropdownMenuLabel className="flex items-center justify-between">
                            <span>Notifikasi</span>
                            <span className="text-muted-foreground text-xs font-normal">
                                {hasUnread ? "1 Baru" : "0 Baru"}
                            </span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="flex flex-col gap-1 p-2 text-sm">
                            <div className="hover:bg-accent cursor-pointer rounded-lg p-2 transition-colors">
                                <p className="text-xs font-medium">
                                    Selamat datang!
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    Akun Anda telah berhasil dikonfigurasi.
                                </p>
                            </div>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Separator orientation="vertical" className="h-4" />

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="ring-offset-background focus:ring-ring flex items-center gap-2 rounded-full transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none">
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={user?.avatar}
                                    alt={user?.name}
                                />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56"
                        align="end"
                        forceMount
                    >
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm leading-none font-medium">
                                    {user?.name}
                                </p>
                                <p className="text-muted-foreground text-xs leading-none">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/profile"
                                    className="flex w-full cursor-pointer items-center"
                                >
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/settings"
                                    className="flex w-full cursor-pointer items-center"
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="text-destructive focus:text-destructive flex w-full cursor-pointer items-center"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
