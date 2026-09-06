export interface FollowUp {
    id: number;
    activity_id: number | null;
    user_id: number;
    account_id: number | null;
    contact_id: number | null;
    subject_type: string | null;
    subject_id: number | null;
    title: string;
    due_date: string;
    status: "pending" | "completed" | "cancelled";
    notes?: string;
    completed_at: string | null;
    account?: { company_name: string };
    contact?: { name: string };
    user?: { name: string };
    activity?: { type: string; subject?: string } | null;
}
