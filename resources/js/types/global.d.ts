import type { Auth } from '@/types/auth';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

export interface SharedUser {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    roles: string[];
    permissions: string[];
}

export interface FlashMessage {
    success?: string | null;
    error?: string | null;
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: {
                user: SharedUser | null;
            };
            sidebarOpen: boolean;
            flash: FlashMessage;
            [key: string]: unknown;
        };
    }
}