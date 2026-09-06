import React, { ReactNode, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { UserFormLayout } from "@/components/users/user-form-layout";
import { UserSidebarInfo } from "@/components/users/user-sidebar-info";
import { UserForm } from "@/components/users/user-form";
import { Plus, Users } from "lucide-react";

// 1. Definisikan interface props dari Laravel Inertia
interface UserCreateProps {
    roles?: string[];
    permissions?: string[];
}

function UserCreate({ roles = [], permissions = [] }: UserCreateProps) {
    // 2. Tambahkan role, status, dan permissions ke dalam state useForm
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        status: "active",
        role: roles.length > 0 ? roles[0] : "",
        permissions: [] as string[],
    });

    // 3. Auto-select role pertama jika data roles baru selesai di-load dari server
    useEffect(() => {
        if (roles.length > 0 && !data.role) {
            setData("role", roles[0]);
        }
    }, [roles]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/users");
    };

    return (
        <>
            <Head title="Tambah User" />
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
                    isEdit={false}
                />
            </UserFormLayout>
        </>
    );
}

UserCreate.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "User Management", href: "/users", icon: Users },
            { title: "Create User", href: "/users/create", icon: Plus },
        ]}
    >
        {page}
    </AppLayout>
);

export default UserCreate;
