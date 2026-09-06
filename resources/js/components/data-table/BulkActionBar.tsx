interface BulkActionBarProps {
    count: number;
    label?: string;
    onDelete: () => void;
}

export default function BulkActionBar({
    count,
    label = 'user',
    onDelete,
}: BulkActionBarProps) {
    if (count === 0) return null;

    return (
        <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5">
            <span className="text-sm font-medium text-blue-800">
                {count} {label} terpilih
            </span>
            <button
                onClick={onDelete}
                className="text-sm font-medium text-red-600 hover:text-red-800"
            >
                Hapus Terpilih
            </button>
        </div>
    );
}
