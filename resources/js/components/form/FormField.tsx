import React, { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
    /** Teks label yang ditampilkan */
    label: string;
    /** Harus sama dengan id elemen input di dalamnya */
    htmlFor: string;
    /** Menampilkan tanda (*) merah bila field wajib diisi */
    required?: boolean;
    /** Pesan error dari backend/validasi (mis. errors.name) */
    error?: string;
    className?: string;
    children: ReactNode;
}

/**
 * Bungkus setiap field form dengan ini supaya label, tanda wajib,
 * dan pesan error selalu konsisten di semua form.
 *
 * <FormField label="Nama" htmlFor="name" required error={errors.name}>
 *   <Input id="name" ... />
 * </FormField>
 */
export function FormField({
    label,
    htmlFor,
    required,
    error,
    className,
    children,
}: FormFieldProps) {
    return (
        <div className={cn("space-y-2", className)}>
            <Label htmlFor={htmlFor}>
                {label}
                {required && <span className="text-destructive"> *</span>}
            </Label>
            {children}
            {error && <p className="text-destructive text-xs">{error}</p>}
        </div>
    );
}
