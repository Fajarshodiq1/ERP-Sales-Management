import { ElementType } from "react";
import { FollowUp } from "./FollowUp";

export interface BusinessPillar {
    id: number;
    name: string;
    description?: string;
    status: string;
}
export interface BreadcrumbItem {
    title: string;
    href?: string;
    icon?: ElementType; 
}
export interface Account {
    id: number;
    business_pillar_id: number;
    company_name: string;
    industry?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    status: string;
    notes?: string;
    business_pillar?: BusinessPillar;
    contacts?: Contact[];
    created_at?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    roles: string[];
    permissions: string[];
}
export interface Activity {
    id: number;
    user_id: number;
    account_id: number;
    contact_id?: number;
    subject_type?: string;
    subject_id?: number;
    type: 'call' | 'email' | 'meeting' | 'whatsapp' | 'presentation' | 'other' | string;
    performed_at: string;
    result?: string;
    notes?: string;
    next_action?: string;
    follow_up_date?: string;
    created_at?: string;
    updated_at?: string;

    // Relasi
    user?: Pick<User, 'id' | 'name'>;
    account?: Account;
    contact?: Contact;
    follow_up?: FollowUp;
    subject?: any;
}

export interface Contact {
    id: number;
    account_id: number;
    name: string;
    position?: string;
    phone?: string;
    email?: string;
    status: string;
    notes?: string;
    account?: Account;
    created_at?: string;
}

export interface PaginatedData<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}
export interface TargetAccount {
    id: number;
    account_id: number;
    business_pillar_id: number;
    assigned_sales_id?: number;
    priority: 'low' | 'medium' | 'high';
    status: 'prospect' | 'engaged' | 'qualified' | 'lost' | 'closed';
    notes?: string;
    account?: Account;
    business_pillar?: BusinessPillar;
    assigned_sales?: { id: number; name: string };
    created_at?: string;
}

export interface Outreach {
    id: number;
    target_account_id: number;
    contact_id?: number;
    user_id: number;
    channel: string;
    outreach_date: string;
    result?: string;
    notes?: string;
    target_account?: TargetAccount;
    contact?: Contact;
    user?: Pick<User, 'id' | 'name'>;
    created_at?: string;
}