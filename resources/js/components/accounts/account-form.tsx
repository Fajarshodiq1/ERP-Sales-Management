import React from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    Building2,
    Globe,
    Mail,
    MapPin,
    Phone,
    ShieldAlert,
    Loader2,
} from "lucide-react";

interface BusinessPillar {
    id: number;
    name: string;
}

interface AccountFormProps {
    data: {
        business_pillar_id: string | number;
        company_name: string;
        industry: string;
        address: string;
        phone: string;
        email: string;
        website: string;
        status: string;
        notes: string;
    };
    setData: (key: string, value: any) => void;
    errors: Partial<Record<keyof AccountFormProps["data"], string>>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    businessPillars: BusinessPillar[];
}

export function AccountForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    businessPillars,
}: AccountFormProps) {
    return (
        <Card className="border-border/60 shadow-sm max-w-7xl mx-auto">
            <CardHeader>
                <CardTitle className="text-lg">
                    Tambah Akun Perusahaan Baru
                </CardTitle>
                <CardDescription>
                    Masukkan rincian informasi perusahaan/klien baru ke dalam
                    sistem CRM.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Informasi Utama Perusahaan */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground border-b pb-2">
                            Informasi Utama
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Business Pillar */}
                            <div className="space-y-2">
                                <Label htmlFor="business_pillar_id">
                                    Pilar Bisnis{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={String(
                                        data.business_pillar_id || "",
                                    )}
                                    onValueChange={(val) =>
                                        setData("business_pillar_id", val)
                                    }
                                >
                                    <SelectTrigger
                                        className={
                                            errors.business_pillar_id
                                                ? "border-destructive"
                                                : ""
                                        }
                                    >
                                        <SelectValue placeholder="Pilih Pilar Bisnis" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {businessPillars.map((pillar) => (
                                            <SelectItem
                                                key={pillar.id}
                                                value={String(pillar.id)}
                                            >
                                                {pillar.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.business_pillar_id && (
                                    <p className="text-destructive text-xs">
                                        {errors.business_pillar_id}
                                    </p>
                                )}
                            </div>

                            {/* Company Name */}
                            <div className="space-y-2">
                                <Label htmlFor="company_name">
                                    Nama Perusahaan{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Building2 className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                                    <Input
                                        id="company_name"
                                        type="text"
                                        placeholder="cth: PT Maju Bersama"
                                        value={data.company_name}
                                        onChange={(e) =>
                                            setData(
                                                "company_name",
                                                e.target.value,
                                            )
                                        }
                                        className={`pl-9 ${errors.company_name ? "border-destructive" : ""}`}
                                    />
                                </div>
                                {errors.company_name && (
                                    <p className="text-destructive text-xs">
                                        {errors.company_name}
                                    </p>
                                )}
                            </div>

                            {/* Industry */}
                            <div className="space-y-2">
                                <Label htmlFor="industry">Industri</Label>
                                <Input
                                    id="industry"
                                    type="text"
                                    placeholder="cth: Teknologi Informasi, Manufaktur"
                                    value={data.industry}
                                    onChange={(e) =>
                                        setData("industry", e.target.value)
                                    }
                                    className={
                                        errors.industry
                                            ? "border-destructive"
                                            : ""
                                    }
                                />
                                {errors.industry && (
                                    <p className="text-destructive text-xs">
                                        {errors.industry}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label htmlFor="status">
                                    Status{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(val) =>
                                        setData("status", val)
                                    }
                                >
                                    <SelectTrigger
                                        className={
                                            errors.status
                                                ? "border-destructive"
                                                : ""
                                        }
                                    >
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="prospect">
                                            Prospect
                                        </SelectItem>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-destructive text-xs">
                                        {errors.status}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Kontak Perusahaan */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground border-b pb-2">
                            Kontak & Lokasi
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Perusahaan</Label>
                                <div className="relative">
                                    <Mail className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="info@perusahaan.com"
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

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">No. Telepon</Label>
                                <div className="relative">
                                    <Phone className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                                    <Input
                                        id="phone"
                                        type="text"
                                        placeholder="021-555xxxx"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        className={`pl-9 ${errors.phone ? "border-destructive" : ""}`}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-destructive text-xs">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Website */}
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <div className="relative">
                                    <Globe className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                                    <Input
                                        id="website"
                                        type="url"
                                        placeholder="https://perusahaan.com"
                                        value={data.website}
                                        onChange={(e) =>
                                            setData("website", e.target.value)
                                        }
                                        className={`pl-9 ${errors.website ? "border-destructive" : ""}`}
                                    />
                                </div>
                                {errors.website && (
                                    <p className="text-destructive text-xs">
                                        {errors.website}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <Label htmlFor="address">Alamat</Label>
                            <div className="relative">
                                <MapPin className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                                <Textarea
                                    id="address"
                                    placeholder="Jl. Jendral Sudirman No. 12..."
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    className={`pl-9 min-h-[80px] ${errors.address ? "border-destructive" : ""}`}
                                />
                            </div>
                            {errors.address && (
                                <p className="text-destructive text-xs">
                                    {errors.address}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Catatan Tambahan */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Catatan Tambahan</Label>
                        <Textarea
                            id="notes"
                            placeholder="Catatan khusus atau riwayat kontak awal..."
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            className="min-h-[100px]"
                        />
                        {errors.notes && (
                            <p className="text-destructive text-xs">
                                {errors.notes}
                            </p>
                        )}
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-center justify-end gap-3 border-t pt-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/accounts">Batal</Link>
                        </Button>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="min-w-[130px]"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Buat Akun"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
