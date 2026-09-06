import React, { useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { KeyRound, Loader2, Mail, User, Shield, Lock } from "lucide-react";

// Mapping bawaan dari Seeder Laravel Spatie
const ROLE_PERMISSIONS_MAP: Record<string, string[]> = {
    Admin: [
        "manage master data",
        "view target accounts",
        "create target accounts",
        "assign target accounts",
        "log outreach",
        "log activity",
        "manage leads",
        "qualify leads",
        "manage opportunities",
        "view pipeline",
        "view performance analytics",
    ],
    "Sales Manager": [
        "view target accounts",
        "create target accounts",
        "assign target accounts",
        "log outreach",
        "log activity",
        "manage leads",
        "qualify leads",
        "manage opportunities",
        "view pipeline",
        "view performance analytics",
    ],
    "Sales Rep": [
        "view target accounts",
        "create target accounts",
        "log outreach",
        "log activity",
        "manage leads",
        "manage opportunities",
        "view pipeline",
    ],
};

interface UserFormProps {
    data: {
        name: string;
        email: string;
        password?: string;
        status: string;
        role: string;
        permissions: string[];
    };
    roles: string[];
    permissions: string[];
    setData: (key: string, value: any) => void;
    errors: Partial<
        Record<
            "name" | "email" | "password" | "role" | "status" | "permissions",
            string
        >
    >;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
}

export function UserForm({
    data,
    roles = [],
    permissions = [],
    setData,
    errors,
    processing,
    onSubmit,
    isEdit = false,
}: UserFormProps) {
    // Fungsi saat Role diubah dari Dropdown
    const handleRoleChange = (selectedRole: string) => {
        setData("role", selectedRole);

        // Hanya auto-set permissions jika dalam mode Create (Tambah Baru)
        // atau jika user belum memilih permission custom
        if (ROLE_PERMISSIONS_MAP[selectedRole]) {
            setData("permissions", ROLE_PERMISSIONS_MAP[selectedRole]);
        }
    };

    // Toggle manual permission tunggal (User bisa tambah/kurangi permission)
    const handlePermissionToggle = (
        permissionName: string,
        checked: boolean,
    ) => {
        const currentPermissions = [...(data.permissions || [])];
        if (checked) {
            setData("permissions", [...currentPermissions, permissionName]);
        } else {
            setData(
                "permissions",
                currentPermissions.filter((item) => item !== permissionName),
            );
        }
    };

    // Auto select permissions saat pertama kali Role terisi (Mode Create)
    useEffect(() => {
        if (
            !isEdit &&
            data.role &&
            data.permissions.length === 0 &&
            ROLE_PERMISSIONS_MAP[data.role]
        ) {
            setData("permissions", ROLE_PERMISSIONS_MAP[data.role]);
        }
    }, [data.role]);

    // Helper pengelompokan permission berdasarkan modul
    const groupPermissions = (perms: string[]) => {
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

    const groupedPermissions = groupPermissions(permissions);

    return (
        <Card className="border-border/60 shadow-sm lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-base">
                    {isEdit
                        ? "Edit Informasi Pengguna"
                        : "Detail Informasi Pengguna"}
                </CardTitle>
                <CardDescription>
                    {isEdit
                        ? "Perbarui detail pengguna, peran, dan hak akses di bawah ini."
                        : "Lengkapi bidang di bawah ini untuk mendaftarkan akun baru."}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Input Nama & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <div className="relative">
                                <User className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="cth: John Doe"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className={`pl-9 ${errors.name ? "border-destructive" : ""}`}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-destructive text-xs">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Alamat Email</Label>
                            <div className="relative">
                                <Mail className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className={`pl-9 ${errors.email ? "border-destructive" : ""}`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-destructive text-xs">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Grid 3 Kolom: Password, Status, & Peran Utama */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                {isEdit
                                    ? "Password Baru (Opsional)"
                                    : "Password"}
                            </Label>
                            <div className="relative">
                                <KeyRound className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={data.password || ""}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className={`pl-9 ${errors.password ? "border-destructive" : ""}`}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-destructive text-xs">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status Akun</Label>
                            <Select
                                value={data.status}
                                onValueChange={(val) => setData("status", val)}
                            >
                                <SelectTrigger
                                    className={`w-full ${errors.status ? "border-destructive" : ""}`}
                                >
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">
                                        Aktif
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Nonaktif
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-destructive text-xs">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="role"
                                className="flex items-center gap-1.5"
                            >
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                Peran Utama (Role)
                            </Label>
                            <Select
                                value={data.role}
                                onValueChange={handleRoleChange}
                            >
                                <SelectTrigger
                                    className={`w-full ${errors.role ? "border-destructive" : ""}`}
                                >
                                    <SelectValue placeholder="Pilih Peran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((r) => (
                                        <SelectItem key={r} value={r}>
                                            {r}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.role && (
                                <p className="text-destructive text-xs">
                                    {errors.role}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* TABEL PERMISSION DENGAN AUTO TOGGLE */}
                    <div className="space-y-3 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <h4 className="text-sm font-semibold">
                                        Pengaturan Hak Akses (Permissions)
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        Toggle otomatis disesuaikan dengan Role
                                        terpilih. Anda dapat menyesuaikannya
                                        secara manual.
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs bg-muted px-2.5 py-1 rounded-full font-medium text-muted-foreground">
                                {data.permissions?.length || 0} Aktif
                            </span>
                        </div>

                        <div className="border rounded-lg overflow-hidden bg-card">
                            <Table>
                                <TableHeader className="bg-muted/40">
                                    <TableRow>
                                        <TableHead className="w-[200px]">
                                            Modul / Fitur
                                        </TableHead>
                                        <TableHead>Nama Permission</TableHead>
                                        <TableHead className="text-center w-[120px]">
                                            Status Akses
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.keys(groupedPermissions).length >
                                    0 ? (
                                        Object.entries(groupedPermissions).map(
                                            ([category, perms]) => (
                                                <React.Fragment key={category}>
                                                    {perms.map(
                                                        (perm, index) => {
                                                            const isChecked =
                                                                data.permissions?.includes(
                                                                    perm,
                                                                );
                                                            return (
                                                                <TableRow
                                                                    key={perm}
                                                                    className="hover:bg-muted/20"
                                                                >
                                                                    {index ===
                                                                        0 && (
                                                                        <TableCell
                                                                            rowSpan={
                                                                                perms.length
                                                                            }
                                                                            className="font-semibold text-xs capitalize align-top bg-muted/10 border-r"
                                                                        >
                                                                            {
                                                                                category
                                                                            }
                                                                        </TableCell>
                                                                    )}
                                                                    <TableCell>
                                                                        <div className="flex flex-col">
                                                                            <span className="text-xs font-medium capitalize">
                                                                                {
                                                                                    perm
                                                                                }
                                                                            </span>
                                                                            <span className="text-[11px] text-muted-foreground">
                                                                                Memberikan
                                                                                izin
                                                                                untuk
                                                                                melakukan
                                                                                aksi
                                                                                '
                                                                                {
                                                                                    perm
                                                                                }

                                                                                '
                                                                            </span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-center">
                                                                        <div className="flex items-center justify-center">
                                                                            <Switch
                                                                                id={`perm-${perm}`}
                                                                                checked={
                                                                                    isChecked
                                                                                }
                                                                                onCheckedChange={(
                                                                                    checked,
                                                                                ) =>
                                                                                    handlePermissionToggle(
                                                                                        perm,
                                                                                        checked,
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        },
                                                    )}
                                                </React.Fragment>
                                            ),
                                        )
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="text-center py-6 text-muted-foreground text-xs"
                                            >
                                                Tidak ada permission yang
                                                tersedia.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 border-t pt-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/users">Batal</Link>
                        </Button>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="min-w-[120px]"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : isEdit ? (
                                "Perbarui User"
                            ) : (
                                "Simpan User"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
