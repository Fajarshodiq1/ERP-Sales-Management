import React, { useEffect } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import PlaceholderExtension from "@tiptap/extension-placeholder";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Link as LinkIcon,
    Undo2,
    Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
    /** Konten HTML saat ini, mis. data.description */
    value: string;
    /** Dipanggil dengan HTML terbaru setiap kali user mengetik/format */
    onChange: (html: string) => void;
    placeholder?: string;
    /** Beri border merah saat field ini sedang error */
    hasError?: boolean;
    /** Tinggi minimum area edit, default "150px" */
    minHeight?: string;
    className?: string;
}

/**
 * Rich text editor ringan berbasis Tiptap. Ganti langsung IconTextarea/Textarea
 * untuk field yang butuh formatting (deskripsi, catatan, dsb).
 *
 * <RichTextEditor
 *   value={data.description}
 *   onChange={(html) => setData("description", html)}
 *   hasError={!!errors.description}
 *   placeholder="Jelaskan secara singkat..."
 * />
 *
 * Perlu paket: @tiptap/react @tiptap/pm @tiptap/starter-kit
 * @tiptap/extension-underline @tiptap/extension-link @tiptap/extension-placeholder
 */
export function RichTextEditor({
    value,
    onChange,
    placeholder,
    hasError,
    minHeight = "150px",
    className,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: false }),
            UnderlineExtension,
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: { class: "underline text-primary" },
            }),
            PlaceholderExtension.configure({
                placeholder: placeholder || "Tulis sesuatu...",
            }),
        ],
        content: value || "",
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                class: cn(
                    "min-w-full focus:outline-none px-3 py-2 text-sm",
                    "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
                    "[&_p]:my-1 [&_a]:underline [&_a]:text-primary",
                ),
            },
        },
    });

    // Sinkronkan kalau `value` berubah dari luar (mis. reset form / load data edit)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || "", false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div
            className={cn(
                "rounded-md border bg-transparent shadow-sm",
                hasError ? "border-destructive" : "border-input",
                className,
            )}
        >
            <Toolbar editor={editor} />
            <EditorContent
                editor={editor}
                style={{ minHeight }}
                className="overflow-y-auto"
            />
        </div>
    );
}

function Toolbar({ editor }: { editor: Editor }) {
    const items: {
        icon: React.ComponentType<{ className?: string }>;
        label: string;
        isActive: () => boolean;
        onClick: () => void;
    }[] = [
        {
            icon: Bold,
            label: "Tebal",
            isActive: () => editor.isActive("bold"),
            onClick: () => editor.chain().focus().toggleBold().run(),
        },
        {
            icon: Italic,
            label: "Miring",
            isActive: () => editor.isActive("italic"),
            onClick: () => editor.chain().focus().toggleItalic().run(),
        },
        {
            icon: UnderlineIcon,
            label: "Garis bawah",
            isActive: () => editor.isActive("underline"),
            onClick: () => editor.chain().focus().toggleUnderline().run(),
        },
        {
            icon: List,
            label: "Daftar bullet",
            isActive: () => editor.isActive("bulletList"),
            onClick: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
            icon: ListOrdered,
            label: "Daftar bernomor",
            isActive: () => editor.isActive("orderedList"),
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
        },
        {
            icon: LinkIcon,
            label: "Tautan",
            isActive: () => editor.isActive("link"),
            onClick: () => {
                const previousUrl = editor.getAttributes("link").href;
                const url = window.prompt("Masukkan URL", previousUrl || "");
                if (url === null) return;
                if (url === "") {
                    editor.chain().focus().unsetLink().run();
                    return;
                }
                editor.chain().focus().setLink({ href: url }).run();
            },
        },
    ];

    return (
        <div className="flex items-center gap-0.5 border-b px-1.5 py-1">
            {items.map(({ icon: Icon, label, isActive, onClick }) => (
                <button
                    key={label}
                    type="button"
                    title={label}
                    onClick={onClick}
                    className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded hover:bg-muted transition-colors",
                        isActive() && "bg-muted text-primary",
                    )}
                >
                    <Icon className="h-3.5 w-3.5" />
                </button>
            ))}

            <span className="mx-1 h-4 w-px bg-border" />

            <button
                type="button"
                title="Urungkan"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-muted disabled:opacity-30 transition-colors"
            >
                <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button
                type="button"
                title="Ulangi"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-muted disabled:opacity-30 transition-colors"
            >
                <Redo2 className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}
