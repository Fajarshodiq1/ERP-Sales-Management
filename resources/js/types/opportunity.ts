import { Activity } from "./activity";
import { User } from "./auth";
import { Account, BusinessPillar, Contact } from "./crm";
import { FollowUp } from "./FollowUp";
import { Lead } from "./lead";

export interface Opportunity {
    id: number;
    opportunity_name: string;
    lead_id?: number;
    account_id: number;
    contact_id?: number;
    business_pillar_id: number;
    user_id: number;
    potential_value?: number;
    probability?: number;
    estimated_gp?: number;
    stage: 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost' | string;
    expected_closing_date?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;

    // Relasi
    account?: Account;
    contact?: Contact;
    business_pillar?: BusinessPillar;
    user?: Pick<User, 'id' | 'name'>;
    lead?: Lead;
    activities?: Activity[];
    follow_ups?: FollowUp[];
}