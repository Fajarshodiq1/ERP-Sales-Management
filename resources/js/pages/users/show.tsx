import React, { ReactNode } from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowLeft,
    Edit,
    Mail,
    Shield,
    Lock,
    CheckCircle2,
} from "lucide-react";

interface UserDetail {
    id: number;
    name: string;
    email: string;
    status: string;
    role: string;
    permissions: string[];
    created_at: string;
    updated_at: string;
}

export default function UserShow({ user }: { user: UserDetail }) {
    // Helper untuk mengelompokkan permission berdasarkan modul
    const groupPermissions = (perms: string[] = []) => {
        const groups: Record<string, string[]> = {};
        perms.forEach((perm) => {
            const parts = perm.split(" ");
            const category =
                parts.length > 1 ? parts.slice(1).join(" ") : "General";
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(perm);
        });
        return groups;
    };

    const groupedPermissions = groupPermissions(user.permissions || []);

    return (
        <div className="container mx-auto p-6 space-y-6 max-w-7xl">
            <Head title={`Detail User - ${user.name}`} />

            {/* Header Navigasi */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/users" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Daftar User
                    </Link>
                </Button>

                {/* Button warna Indigo 600 */}
                <Button
                    asChild
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    <Link
                        href={`/users/${user.id}/edit`}
                        className="flex items-center gap-2"
                    >
                        <Edit className="h-4 w-4" />
                        Edit User
                    </Link>
                </Button>
            </div>

            {/* Profil Utama */}
            <Card className="border-border/60 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">
                                {user.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <Mail className="h-3.5 w-3.5" />
                                {user.email}
                            </CardDescription>
                        </div>

                        {/* Badge Warna Hijau (Active) & Merah (Inactive) */}
                        <Badge
                            className={`capitalize px-3 py-1 text-xs border-0 font-medium ${
                                user.status === "active"
                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                    : "bg-rose-100 text-rose-700 hover:bg-rose-100"
                            }`}
                        >
                            {user.status === "active" ? "Aktif" : "Nonaktif"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                    <div>
                        <span className="text-xs text-muted-foreground font-medium block">
                            ID Pengguna
                        </span>
                        <span className="text-sm font-semibold">
                            #{user.id}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground font-medium block">
                            Peran Utama (Role)
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Shield className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm font-semibold">
                                {user.role || "-"}
                            </span>
                        </div>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground font-medium block">
                            Dibuat Pada
                        </span>
                        <span className="text-sm font-semibold">
                            {new Date(user.created_at).toLocaleString("id-ID", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Permissions */}
            <Card className="border-border/60 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <CardTitle className="text-base">
                                    Hak Akses Khusus (Permissions)
                                </CardTitle>
                                <CardDescription>
                                    Daftar izin akses yang dimiliki pengguna ini
                                </CardDescription>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                            {user.permissions?.length || 0} Izin Aktif
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                <TableRow>
                                    <TableHead className="w-[200px]">
                                        Modul / Fitur
                                    </TableHead>
                                    <TableHead>Nama Permission</TableHead>
                                    <TableHead className="text-center w-[120px]">
                                        Status
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.keys(groupedPermissions).length > 0 ? (
                                    Object.entries(groupedPermissions).map(
                                        ([category, perms]) => (
                                            <React.Fragment key={category}>
                                                {perms.map((perm, index) => (
                                                    <TableRow
                                                        key={perm}
                                                        className="hover:bg-muted/20"
                                                    >
                                                        {index === 0 && (
                                                            <TableCell
                                                                rowSpan={
                                                                    perms.length
                                                                }
                                                                className="font-semibold text-xs capitalize align-top bg-muted/10 border-r"
                                                            >
                                                                {category}
                                                            </TableCell>
                                                        )}
                                                        <TableCell className="text-xs font-medium capitalize">
                                                            {perm}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex items-center justify-center text-emerald-600 gap-1 text-xs font-medium">
                                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                                Aktif
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </React.Fragment>
                                        ),
                                    )
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="text-center py-6 text-muted-foreground text-xs"
                                        >
                                            User ini tidak memiliki hak akses
                                            khusus tambahan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

UserShow.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "User Management", href: "/users" },
            { title: "Detail User" },
        ]}
    >
        {page}
    </AppLayout>
);
