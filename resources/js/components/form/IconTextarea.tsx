import React from "react";
import { LucideIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface IconTextareaProps extends React.ComponentProps<typeof Textarea> {
    icon: LucideIcon;
    hasError?: boolean;
}

/**
 * Textarea dengan icon di kiri-atas (offset top-3, beda dari IconInput
 * yang top-2.5, karena tinggi textarea lebih dari satu baris).
 *
 * <IconTextarea icon={MapPin} hasError={!!errors.address} rows={3} value={...} onChange={...} />
 */
export function IconTextarea({
    icon: Icon,
    hasError,
    className,
    ...props
}: IconTextareaProps) {
    return (
        <div className="relative">
            <Icon className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
            <Textarea
                className={cn(
                    "pl-9",
                    hasError && "border-destructive",
                    className,
                )}
                {...props}
            />
        </div>
    );
}
