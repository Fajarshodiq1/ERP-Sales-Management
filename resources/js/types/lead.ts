import { User } from "./auth";
import { Account, BusinessPillar, Contact } from "./crm";

export interface Lead {
    id: number;
    lead_name: string;
    account_id?: number;
    contact_id?: number;
    business_pillar_id: number;
    user_id: number;
    sourceable_type?: string;
    sourceable_id?: number;
    lead_source?: string;
    status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted' | string;
    potential_need?: string;
    notes?: string;
    qualified_at?: string;
    created_at?: string;
    updated_at?: string;

    // Relasi
    account?: Account;
    contact?: Contact;
    business_pillar?: BusinessPillar;
    user?: Pick<User, 'id' | 'name'>;
    sourceable?: any;
}