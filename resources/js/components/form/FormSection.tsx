import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
    /** Judul kelompok field, mis. "Informasi Utama", "Kontak & Lokasi" */
    title: string;
    className?: string;
    children: ReactNode;
}

/**
 * Pengelompokan field dalam form panjang, dengan heading kecil + garis
 * bawah, mengikuti pola "Informasi Utama" / "Kontak & Lokasi" di AccountForm.
 *
 * <FormSection title="Informasi Utama">
 *   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">...</div>
 * </FormSection>
 */
export function FormSection({ title, className, children }: FormSectionProps) {
    return (
        <div className={cn("space-y-4", className)}>
            <h4 className="text-sm font-semibold text-muted-foreground border-b pb-2">
                {title}
            </h4>
            {children}
        </div>
    );
}
