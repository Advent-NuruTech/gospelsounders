"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // ✅ FIXES SSR HYDRATION ERROR
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
      }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-[#2A1A10]">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
        >
          Bold
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
        >
          Italic
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
        >
          Strike
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
        >
          H1
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
        >
          H2
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
        >
          Bullet List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
        >
          Ordered List
        </button>

        <button
          onClick={() => {
            const url = prompt("Enter link URL");
            if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }
          }}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
        >
          Link
        </button>

        <button
          onClick={() => {
            const url = prompt("Enter image URL");
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
        >
          Image
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="min-h-[200px] p-2 bg-white dark:bg-[#2A1A10] text-black dark:text-white rounded-lg"
      />
    </div>
  );
}
