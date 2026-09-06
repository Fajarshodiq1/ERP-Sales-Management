import { Link } from "@inertiajs/react";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface ActionButtonsProps {
    viewHref?: string;
    editHref?: string;
    onDelete: () => void;
}

const btnClass =
    "flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-900 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition";

export default function ActionButtons({
    viewHref,
    editHref,
    onDelete,
}: ActionButtonsProps) {
    return (
        <div className="flex h-full items-center justify-end gap-2">
            {viewHref && (
                <Link href={viewHref} title="Lihat" className={btnClass}>
                    <Eye size={16} />
                </Link>
            )}
            {editHref && (
                <Link href={editHref} title="Edit" className={btnClass}>
                    <Pencil size={16} />
                </Link>
            )}
            <button onClick={onDelete} title="Hapus" className={btnClass}>
                <Trash2 size={16} />
            </button>
        </div>
    );
}
