import React, { ReactNode } from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { UserFormLayout } from "@/components/users/user-form-layout";
import { UserSidebarInfo } from "@/components/users/user-sidebar-info";
import { UserForm } from "@/components/users/user-form";

interface UserData {
    id: number;
    name: string;
    email: string;
    status: string;
    role: string;
    permissions: string[];
}

interface UserEditProps {
    user: UserData;
    roles?: string[];
    permissions?: string[];
}

function UserEdit({ user, roles = [], permissions = [] }: UserEditProps) {
    // Inisialisasi useForm dengan data awal user dari controller
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || "",
        email: user.email || "",
        password: "", // Kosongkan password saat edit (opsional)
        status: user.status || "active",
        role: user.role || (roles.length > 0 ? roles[0] : ""),
        permissions: user.permissions || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mengirimkan request PUT /users/{id}
        put(`/users/${user.id}`);
    };

    return (
        <>
            <Head title={`Edit User - ${user.name}`} />
            <UserFormLayout>
                <UserSidebarInfo />
                <UserForm
                    data={data}
                    roles={roles}
                    permissions={permissions}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    isEdit={true}
                />
            </UserFormLayout>
        </>
    );
}

UserEdit.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "User Management", href: "/users" },
            { title: "Edit User" },
        ]}
    >
        {page}
    </AppLayout>
);

export default UserEdit;
