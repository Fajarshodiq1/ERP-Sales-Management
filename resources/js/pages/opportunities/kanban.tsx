import React, { ReactNode, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Kanban,
    KanbanBoard,
    KanbanColumn,
    KanbanColumnContent,
    KanbanColumnHandle,
    KanbanItem,
    KanbanItemHandle,
    KanbanOverlay,
} from "@/components/reui/kanban";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table2, Building2, Calendar, GripVerticalIcon } from "lucide-react";

export interface Opportunity {
    id: number;
    opportunity_name: string;
    potential_value: number;
    probability: number;
    estimated_gp: number | null;
    stage:
        | "prospecting"
        | "qualification"
        | "proposal"
        | "negotiation"
        | "closed_won"
        | "closed_lost";
    expected_closing_date?: string | null;
    account?: { company_name: string };
    contact?: { contact_name?: string; name?: string };
    user?: { name: string };
}

interface Props {
    opportunities: Opportunity[];
}

type StageKey = Opportunity["stage"];

const STAGE_COLUMNS: { key: StageKey; label: string }[] = [
    { key: "prospecting", label: "Prospecting" },
    { key: "qualification", label: "Qualification" },
    { key: "proposal", label: "Proposal" },
    { key: "negotiation", label: "Negotiation" },
    { key: "closed_won", label: "Closed Won" },
    { key: "closed_lost", label: "Closed Lost" },
];

const formatCurrency = (value?: number | null) => {
    if (value === undefined || value === null) return "-";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
};

// Badge variant berdasarkan probability, mirip pola "priority" di doc 1
function probabilityVariant(probability: number) {
    if (probability >= 70) return "primary-light";
    if (probability >= 40) return "warning-light";
    return "destructive-light";
}

function buildColumns(
    opportunities: Opportunity[],
): Record<StageKey, Opportunity[]> {
    const grouped = STAGE_COLUMNS.reduce(
        (acc, col) => {
            acc[col.key] = [];
            return acc;
        },
        {} as Record<StageKey, Opportunity[]>,
    );

    opportunities.forEach((item) => {
        grouped[item.stage]?.push(item);
    });

    return grouped;
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
    const contactName =
        opportunity.contact?.contact_name ?? opportunity.contact?.name;

    return (
        <Card
            onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                router.visit(`/opportunities/${opportunity.id}`);
            }}
            className="cursor-pointer hover:border-primary/40 transition-colors"
        >
            <CardContent className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                    <span className="line-clamp-2 text-sm font-medium">
                        {opportunity.opportunity_name}
                    </span>
                    <Badge
                        variant={probabilityVariant(opportunity.probability)}
                        className="pointer-events-none h-5 shrink-0 rounded-sm px-1.5 text-xs"
                    >
                        {opportunity.probability}%
                    </Badge>
                </div>

                {opportunity.account?.company_name && (
                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Building2 size={12} />
                        <span className="line-clamp-1">
                            {opportunity.account.company_name}
                        </span>
                    </div>
                )}

                <div className="text-muted-foreground flex items-center justify-between text-xs">
                    {opportunity.user?.name || contactName ? (
                        <div className="flex items-center gap-1">
                            <Avatar className="size-4">
                                <AvatarFallback>
                                    {(
                                        opportunity.user?.name ??
                                        contactName ??
                                        "?"
                                    ).charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="line-clamp-1">
                                {opportunity.user?.name ?? contactName}
                            </span>
                        </div>
                    ) : (
                        <span />
                    )}
                    {opportunity.expected_closing_date && (
                        <time className="flex items-center gap-1 text-[10px] whitespace-nowrap tabular-nums">
                            <Calendar size={11} />
                            {new Date(
                                opportunity.expected_closing_date,
                            ).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                            })}
                        </time>
                    )}
                </div>

                <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-sm font-bold">
                        {formatCurrency(opportunity.potential_value)}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

interface StageColumnProps {
    value: StageKey;
    label: string;
    tasks: Opportunity[];
    isOverlay?: boolean;
}

function StageColumn({ value, label, tasks, isOverlay }: StageColumnProps) {
    const totalValue = tasks.reduce(
        (sum, o) => sum + (o.potential_value ?? 0),
        0,
    );

    return (
        <KanbanColumn value={value} className="w-72 shrink-0">
            <Card className="mb-2.5 gap-3 py-4">
                <CardHeader className="flex flex-row items-center justify-between px-4">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                                {label}
                            </span>
                            <Badge
                                variant="outline"
                                className="h-5 rounded-full px-2 text-xs"
                            >
                                {tasks.length}
                            </Badge>
                        </div>
                        <span className="text-muted-foreground text-xs">
                            {formatCurrency(totalValue)}
                        </span>
                    </div>
                    <KanbanColumnHandle asChild>
                        <Button
                            size="icon-xs"
                            variant="ghost"
                            className="shrink-0"
                        >
                            <GripVerticalIcon className="size-4" />
                        </Button>
                    </KanbanColumnHandle>
                </CardHeader>
                <CardContent className="px-4">
                    <KanbanColumnContent
                        value={value}
                        className="flex min-h-[80px] flex-col gap-2.5"
                    >
                        {tasks.length === 0 && (
                            <div className="text-muted-foreground flex h-16 items-center justify-center text-xs italic">
                                Tidak ada opportunity
                            </div>
                        )}
                        {tasks.map((opp) => (
                            <KanbanItem key={opp.id} value={opp.id.toString()}>
                                {isOverlay ? (
                                    <OpportunityCard opportunity={opp} />
                                ) : (
                                    <KanbanItemHandle>
                                        <OpportunityCard opportunity={opp} />
                                    </KanbanItemHandle>
                                )}
                            </KanbanItem>
                        ))}
                    </KanbanColumnContent>
                </CardContent>
            </Card>
        </KanbanColumn>
    );
}
function OpportunityKanban({ opportunities }: Props) {
    const [columns, setColumns] = useState<Record<StageKey, Opportunity[]>>(
        () => buildColumns(opportunities),
    );

    const handleValueChange = (newColumns: Record<StageKey, Opportunity[]>) => {
        let movedItem: Opportunity | null = null;
        let newStage: StageKey | null = null;

        (Object.keys(newColumns) as StageKey[]).forEach((stage) => {
            newColumns[stage].forEach((item) => {
                const prevStage = (Object.keys(columns) as StageKey[]).find(
                    (s) => columns[s].some((o) => o.id === item.id),
                );
                if (prevStage && prevStage !== stage) {
                    movedItem = item;
                    newStage = stage;
                }
            });
        });

        setColumns(newColumns);

        if (movedItem && newStage) {
            const opportunityId = (movedItem as Opportunity).id;
            const targetStage = newStage;

            router.patch(
                `/opportunities/${opportunityId}/stage`,
                { stage: targetStage },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onError: () => {
                        setColumns(buildColumns(opportunities));
                        alert("Gagal memperbarui tahapan opportunity.");
                    },
                },
            );
        }
    };

    return (
        <>
            <Head title="Opportunity Board" />
            <div className="w-full max-w-7xl space-y-5 overflow-y-hidden p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Opportunity Board
                        </h1>
                        <p className="text-muted-foreground mt-0.5 text-sm">
                            Drag kartu untuk mengubah tahapan opportunity.
                        </p>
                    </div>
                    <Link
                        href="/opportunities"
                        className="hover:bg-muted flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition"
                    >
                        <Table2 size={16} />
                        Lihat sebagai Tabel
                    </Link>
                </div>

                <Kanban
                    value={columns}
                    onValueChange={handleValueChange}
                    getItemValue={(item: Opportunity) => item.id.toString()}
                >
                    <KanbanBoard className="flex gap-4 overflow-x-auto pb-4">
                        {STAGE_COLUMNS.map((col) => (
                            <StageColumn
                                key={col.key}
                                value={col.key}
                                label={col.label}
                                tasks={columns[col.key] ?? []}
                            />
                        ))}
                    </KanbanBoard>

                    <KanbanOverlay className="bg-muted/10 rounded-md border-2 border-dashed" />
                </Kanban>
            </div>
        </>
    );
}

OpportunityKanban.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Opportunity", href: "/opportunities" },
            { title: "Board", href: "#" },
        ]}
    >
        {page}
    </AppLayout>
);

export default OpportunityKanban;
