import React, { ReactNode } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FormCardProps {
    title: string;
    description?: string;
    onSubmit: (e: React.FormEvent) => void;
    className?: string;
    children: ReactNode;
}

/**
 * Card + <form> pembungkus standar untuk semua form create/edit,
 * supaya tidak perlu menulis ulang Card/CardHeader/CardContent tiap kali.
 *
 * <FormCard title="Detail Informasi Pengguna" description="..." onSubmit={handleSubmit}>
 *   <FormSection title="...">...</FormSection>
 *   <FormActions ... />
 * </FormCard>
 */
export function FormCard({
    title,
    description,
    onSubmit,
    className,
    children,
}: FormCardProps) {
    return (
        <Card className={cn("border-border/60 shadow-sm", className)}>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>

            <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                    {children}
                </form>
            </CardContent>
        </Card>
    );
}
