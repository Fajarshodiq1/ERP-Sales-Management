import { ReactNode } from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface UserFormLayoutProps {
    children: ReactNode;
    backUrl?: string;
    backText?: string;
}

export function UserFormLayout({
    children,
    backUrl = "/users",
    backText = "Kembali ke daftar user",
}: UserFormLayoutProps) {
    return (
        <div className="mx-auto p-4 sm:px-6">
            <div className="mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-muted-foreground hover:text-foreground gap-2"
                >
                    <Link href={backUrl}>
                        <ArrowLeft className="h-4 w-4" />
                        {backText}
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                {children}
            </div>
        </div>
    );
}
