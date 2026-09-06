import React, { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { BusinessPillar } from "@/types/crm";

import { Layers, Tag, CircleCheck, CircleX } from "lucide-react";

import {
    PageHeader,
    FormCard,
    FormSection,
    FormField,
    FormActions,
    IconInput,
    RichTextEditor,
} from "@/components/form";

interface Props {
    pillar?: BusinessPillar;
}

function Form({ pillar }: Props) {
    const isEdit = !!pillar;

    const { data, setData, post, put, errors, processing } = useForm({
        name: pillar?.name || "",
        description: pillar?.description || "",
        status: pillar?.status || "active",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pillar) {
            put(`/business-pillars/${pillar.id}`);
        } else {
            post("/business-pillars");
        }
    };

    return (
        <>
            <Head
                title={
                    pillar ? "Edit Business Pillar" : "Create Business Pillar"
                }
            />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                <PageHeader
                    // icon={Layers}
                    title={
                        pillar
                            ? "Edit Business Pillar"
                            : "Create Business Pillar"
                    }
                    description={
                        pillar
                            ? "Perbarui informasi pilar bisnis yang sudah ada."
                            : "Tambahkan pilar bisnis baru ke dalam sistem master data."
                    }
                    // backHref="/business-pillars"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <FormCard
                        title={
                            isEdit
                                ? "Edit Informasi Pilar Bisnis"
                                : "Detail Informasi Pilar Bisnis"
                        }
                        description={
                            isEdit
                                ? "Perbarui detail pilar bisnis di bawah ini."
                                : "Lengkapi bidang di bawah ini untuk menambahkan pilar baru."
                        }
                        onSubmit={handleSubmit}
                        className="lg:col-span-2"
                    >
                        <FormSection title="Informasi Utama">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    label="Nama Pilar"
                                    htmlFor="name"
                                    required
                                    error={errors.name}
                                >
                                    <IconInput
                                        id="name"
                                        icon={Tag}
                                        hasError={!!errors.name}
                                        placeholder="Contoh: SIKA Ruang Izin, Inotekta"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Status"
                                    htmlFor="status"
                                    required
                                    error={errors.status}
                                >
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData("status", "active")
                                            }
                                            className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                                                data.status === "active"
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-input text-muted-foreground hover:bg-muted/50"
                                            }`}
                                        >
                                            <CircleCheck className="h-4 w-4" />
                                            Aktif
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData("status", "inactive")
                                            }
                                            className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                                                data.status === "inactive"
                                                    ? "border-destructive bg-destructive/10 text-destructive"
                                                    : "border-input text-muted-foreground hover:bg-muted/50"
                                            }`}
                                        >
                                            <CircleX className="h-4 w-4" />
                                            Nonaktif
                                        </button>
                                    </div>
                                </FormField>
                            </div>

                            <FormField
                                label="Deskripsi"
                                htmlFor="description"
                                error={errors.description}
                            >
                                <RichTextEditor
                                    value={data.description}
                                    onChange={(html) =>
                                        setData("description", html)
                                    }
                                    hasError={!!errors.description}
                                    placeholder="Jelaskan secara singkat mengenai pilar bisnis ini..."
                                    minHeight="120px"
                                />
                            </FormField>
                        </FormSection>

                        <FormActions
                            cancelHref="/business-pillars"
                            submitLabel={
                                isEdit ? "Perbarui Pilar" : "Simpan Pilar"
                            }
                            processing={processing}
                        />
                    </FormCard>

                    {/* Live preview sidebar */}
                    <div className="lg:col-span-1 lg:sticky lg:top-6">
                        <div className="rounded-xl border border-border bg-card p-6">
                            <p className="text-xs font-medium text-muted-foreground mb-4">
                                Pratinjau Pilar
                            </p>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Layers className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-foreground">
                                        {data.name || "Nama Pilar Bisnis"}
                                    </p>
                                    <span
                                        className={`inline-flex items-center gap-1 mt-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                                            data.status === "active"
                                                ? "bg-primary/10 text-primary"
                                                : "bg-destructive/10 text-destructive"
                                        }`}
                                    >
                                        {data.status === "active"
                                            ? "Aktif"
                                            : "Nonaktif"}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <p className="text-xs text-muted-foreground mb-2">
                                    Deskripsi
                                </p>
                                {data.description ? (
                                    <div
                                        className="prose prose-sm max-w-none text-foreground [&>*]:my-1 line-clamp-6"
                                        dangerouslySetInnerHTML={{
                                            __html: data.description,
                                        }}
                                    />
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        Belum ada deskripsi.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Form.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Business Pillars", href: "/business-pillars" },
            { title: "Form", href: "#" },
        ]}
    >
        {page}
    </AppLayout>
);

export default Form;
