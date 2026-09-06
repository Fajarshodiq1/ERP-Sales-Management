import React from "react";
import { Link } from "@inertiajs/react";
import { Loader2, LucideIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormActionsProps {
    /** Link tombol Batal, mis. "/business-pillars" */
    cancelHref: string;
    cancelLabel?: string;
    /** Teks tombol submit saat tidak sedang loading, mis. "Simpan Pilar" */
    submitLabel: string;
    /** Teks tombol submit saat processing=true */
    submittingLabel?: string;
    /** Sambungkan ke `processing` dari useForm() */
    processing: boolean;
    /** Icon di tombol submit saat tidak loading (default: Save) */
    submitIcon?: LucideIcon;
    className?: string;
}

/**
 * Baris tombol Batal/Submit di bagian bawah form, lengkap dengan
 * spinner otomatis saat processing. Dipakai di semua form create/edit.
 *
 * <FormActions
 *   cancelHref="/business-pillars"
 *   submitLabel={isEdit ? "Perbarui Pilar" : "Simpan Pilar"}
 *   processing={processing}
 * />
 */
export function FormActions({
    cancelHref,
    cancelLabel = "Batal",
    submitLabel,
    submittingLabel = "Menyimpan...",
    processing,
    submitIcon: SubmitIcon = Save,
    className,
}: FormActionsProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-end gap-3 border-t pt-4",
                className,
            )}
        >
            <Button type="button" variant="outline" asChild>
                <Link href={cancelHref}>{cancelLabel}</Link>
            </Button>

            <Button
                type="submit"
                disabled={processing}
                className="min-w-[130px]"
            >
                {processing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {submittingLabel}
                    </>
                ) : (
                    <>
                        <SubmitIcon className="mr-2 h-4 w-4" />
                        {submitLabel}
                    </>
                )}
            </Button>
        </div>
    );
}
