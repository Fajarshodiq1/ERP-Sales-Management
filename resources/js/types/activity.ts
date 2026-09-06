export interface Activity {
    id: string;
    user_id: string;
    account_id: string;
    contact_id?: string;
    type: string;
    performed_at: string;
    result: string;
    notes?: string;
    next_action?: string;
    follow_up_date?: string;
    user?: { id: string; name: string };
    account?: { id: string; company_name: string };
    contact?: { id: string; name: string };
}