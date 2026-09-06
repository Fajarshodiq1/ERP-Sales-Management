import { CheckCircle2, ShieldAlert, UserPlus } from "lucide-react";

interface UserSidebarInfoProps {
    title?: string;
    description?: string;
}

export function UserSidebarInfo({
    title = "Tambah User Baru",
    description = "Buat kredensial akses baru untuk anggota tim atau pengguna sistem.",
}: UserSidebarInfoProps) {
    return (
        <div className="space-y-4 lg:col-span-1 sticky top-0">
            <div className="bg-card text-card-foreground space-y-4 rounded-xl border p-5 shadow-sm">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                    <UserPlus className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {description}
                    </p>
                </div>

                <div className="space-y-3 border-t pt-4">
                    <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Ketentuan Akun
                    </h4>
                    <ul className="text-muted-foreground space-y-2 text-xs">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            <span>
                                Pastikan email yang digunakan masih aktif.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                            <span>
                                Password minimal 8 karakter untuk keamanan.
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
