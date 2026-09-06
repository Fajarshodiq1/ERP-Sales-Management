import React from "react";
import { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface IconInputProps extends React.ComponentProps<typeof Input> {
    /** Komponen icon dari lucide-react, mis. Mail, Phone, Tag */
    icon: LucideIcon;
    /** Beri border merah saat field ini sedang error */
    hasError?: boolean;
}

/**
 * Input dengan icon di kiri. Menggantikan pola berulang:
 * <div className="relative"><Icon .../><Input className="pl-9" /></div>
 *
 * <IconInput icon={Mail} hasError={!!errors.email} value={...} onChange={...} />
 */
export function IconInput({
    icon: Icon,
    hasError,
    className,
    ...props
}: IconInputProps) {
    return (
        <div className="relative">
            <Icon className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
            <Input
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
