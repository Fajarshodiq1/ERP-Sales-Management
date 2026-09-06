import React from "react";
import { Link } from "@inertiajs/react";
import { TargetAccount } from "@/types/crm";

interface Props {
    targetAccount: TargetAccount;
}

export default function Show({ targetAccount }: Props) {
    return (
        <div className="p-6 space-y-6 max-w-4xl">
            {/* Header & Quick Action Buttons */}
            <div className="flex justify-between items-center bg-white p-4 rounded border">
                <div>
                    <h1 className="text-2xl font-bold">
                        {targetAccount.account?.company_name}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Pillar: {targetAccount.business_pillar?.name} |
                        Priority:{" "}
                        <span className="uppercase font-semibold">
                            {targetAccount.priority}
                        </span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={route("activities.create", {
                            target_account_id: targetAccount.id,
                        })}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700"
                    >
                        + Add Activity
                    </Link>
                    <Link
                        href={route("leads.create", {
                            target_account_id: targetAccount.id,
                        })}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700"
                    >
                        + Create Lead
                    </Link>
                </div>
            </div>

            {/* Target Account Overview */}
            <div className="bg-white p-4 rounded border text-sm space-y-3">
                <h2 className="font-bold border-b pb-2">Target Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <strong>Assigned Sales:</strong>{" "}
                        {targetAccount.assigned_sales?.name || "Unassigned"}
                    </div>
                    <div>
                        <strong>Status:</strong> {targetAccount.status}
                    </div>
                    <div>
                        <strong>Industry:</strong>{" "}
                        {targetAccount.account?.industry || "-"}
                    </div>
                    <div>
                        <strong>Phone / Email:</strong>{" "}
                        {targetAccount.account?.phone} |{" "}
                        {targetAccount.account?.email}
                    </div>
                </div>
                <div>
                    <strong>Notes:</strong> {targetAccount.notes || "-"}
                </div>
            </div>

            {/* Contacts PIC Section */}
            <div className="bg-white p-4 rounded border text-sm space-y-3">
                <h2 className="font-bold border-b pb-2">Key Contacts (PIC)</h2>
                {targetAccount.account?.contacts &&
                targetAccount.account.contacts.length > 0 ? (
                    <ul className="divide-y">
                        {targetAccount.account.contacts.map((contact) => (
                            <li
                                key={contact.id}
                                className="py-2 flex justify-between items-center"
                            >
                                <div>
                                    <span className="font-medium">
                                        {contact.name}
                                    </span>{" "}
                                    ({contact.position || "No Position"})
                                    <div className="text-xs text-gray-500">
                                        {contact.phone} | {contact.email}
                                    </div>
                                </div>
                                <Link
                                    href={route("outreach.create", {
                                        target_account_id: targetAccount.id,
                                        contact_id: contact.id,
                                    })}
                                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                                >
                                    Log Outreach
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">
                        Belum ada PIC contact yang terdaftar pada perusahaan
                        ini.
                    </p>
                )}
            </div>
        </div>
    );
}
