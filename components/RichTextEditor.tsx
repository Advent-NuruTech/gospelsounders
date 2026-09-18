"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ChangeEvent, type ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyleKit } from "@tiptap/extension-text-style";
import {
  Bold,
  ChevronDown,
  Code2,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Palette,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  Unlink,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

type BlockStyle = "paragraph" | "h1" | "h2" | "h3" | "quote";

const MAX_IMAGE_SIZE = 6 * 1024 * 1024;

const FONT_OPTIONS = [
  { label: "Default", value: "" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times", value: "'Times New Roman', Times, serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Mono", value: "'Courier New', Courier, monospace" },
];

const FONT_SIZE_OPTIONS = [
  { label: "Size", value: "" },
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "24", value: "24px" },
  { label: "32", value: "32px" },
];

const LINE_HEIGHT_OPTIONS = [
  { label: "Line", value: "" },
  { label: "1.0", value: "1" },
  { label: "1.15", value: "1.15" },
  { label: "1.5", value: "1.5" },
  { label: "2.0", value: "2" },
];

const editorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
    link: false,
  }),
  TextStyleKit.configure({
    backgroundColor: {},
    color: {},
    fontFamily: {},
    fontSize: {},
    lineHeight: {},
    textStyle: {},
  }),
  Link.configure({
    autolink: true,
    defaultProtocol: "https",
    enableClickSelection: true,
    linkOnPaste: true,
    openOnClick: false,
    HTMLAttributes: {
      class: "rich-text-link",
      rel: "noopener noreferrer nofollow",
      target: "_blank",
    },
  }),
  Image.configure({
    allowBase64: false,
    HTMLAttributes: {
      class: "rich-text-image",
    },
    resize: {
      enabled: true,
      minWidth: 80,
      alwaysPreserveAspectRatio: true,
    },
  }),
];

function getHexColor(value: unknown, fallback: string) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)
    ? value
    : fallback;
}

function normalizeUrl(url: string) {
  const trimmed = url.trim();

  if (!trimmed) return "";
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return `mailto:${trimmed}`;

  return `https://${trimmed}`;
}

function ToolbarDivider() {
  return <span className="h-8 w-px shrink-0 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />;
}

function ToolButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-[#C9A24D]/40 disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-[#C9A24D] bg-[#C9A24D]/20 text-[#6B4A2E] dark:text-[#F6E3C4]"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}

function ToolbarSelect({
  label,
  value,
  widthClass,
  onChange,
  children,
}: {
  label: string;
  value: string;
  widthClass: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label
      title={label}
      className={`relative inline-flex h-10 shrink-0 items-center rounded-lg border border-slate-200 bg-white text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${widthClass}`}
    >
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full min-w-0 appearance-none bg-transparent pl-3 pr-8 text-sm font-semibold outline-none"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-slate-500" aria-hidden="true" />
    </label>
  );
}

function ColorControl({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label
      title={label}
      className="inline-flex h-10 w-14 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      {children}
      <input
        aria-label={label}
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
      />
    </label>
  );
}

export default function RichTextEditor({ value, onChange, label = "Rich text editor" }: RichTextEditorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const blurTimerRef = useRef<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: editorExtensions,
    content: value,
    editorProps: {
      attributes: {
        "aria-label": label,
        class:
          "rich-text-prosemirror min-h-[260px] w-full max-w-full px-4 py-4 text-base leading-7 text-slate-900 outline-none dark:text-slate-100",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onFocus: () => setIsFocused(true),
  });

  useEffect(() => {
    if (!editor) return;

    const incoming = value || "";
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [editor, value]);

  const clearBlurTimer = useCallback(() => {
    if (blurTimerRef.current !== null) {
      window.clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
  }, []);

  const scheduleFocusCheck = useCallback(() => {
    clearBlurTimer();
    blurTimerRef.current = window.setTimeout(() => {
      const activeElement = document.activeElement;

      if (!activeElement || !rootRef.current?.contains(activeElement)) {
        setIsFocused(false);
      }
    }, 120);
  }, [clearBlurTimer]);

  useEffect(() => clearBlurTimer, [clearBlurTimer]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handleFocusIn = () => {
      clearBlurTimer();
      setIsFocused(true);
    };

    root.addEventListener("focusin", handleFocusIn);
    root.addEventListener("focusout", scheduleFocusCheck);

    return () => {
      root.removeEventListener("focusin", handleFocusIn);
      root.removeEventListener("focusout", scheduleFocusCheck);
    };
  }, [clearBlurTimer, scheduleFocusCheck]);

  useEffect(() => {
    if (!isFocused) {
      setKeyboardInset(0);
      return;
    }

    const updateKeyboardInset = () => {
      const viewport = window.visualViewport;

      if (!viewport) {
        setKeyboardInset(0);
        return;
      }

      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setKeyboardInset(Math.round(inset));
    };

    updateKeyboardInset();
    window.visualViewport?.addEventListener("resize", updateKeyboardInset);
    window.visualViewport?.addEventListener("scroll", updateKeyboardInset);
    window.addEventListener("resize", updateKeyboardInset);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateKeyboardInset);
      window.visualViewport?.removeEventListener("scroll", updateKeyboardInset);
      window.removeEventListener("resize", updateKeyboardInset);
    };
  }, [isFocused]);

  if (!editor) return null;

  const textStyle = editor.getAttributes("textStyle");
  const selectedFontFamily = FONT_OPTIONS.some((font) => font.value === textStyle.fontFamily)
    ? String(textStyle.fontFamily ?? "")
    : "";
  const selectedFontSize = FONT_SIZE_OPTIONS.some((fontSize) => fontSize.value === textStyle.fontSize)
    ? String(textStyle.fontSize ?? "")
    : "";
  const selectedLineHeight = LINE_HEIGHT_OPTIONS.some((lineHeight) => lineHeight.value === textStyle.lineHeight)
    ? String(textStyle.lineHeight ?? "")
    : "";
  const textColor = getHexColor(textStyle.color, "#1f2937");
  const highlightColor = getHexColor(textStyle.backgroundColor, "#fff3bf");
  const blockStyle: BlockStyle = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
    ? "h2"
    : editor.isActive("heading", { level: 3 })
    ? "h3"
    : editor.isActive("blockquote")
    ? "quote"
    : "paragraph";

  const setBlockStyle = (style: string) => {
    const chain = editor.chain().focus();

    if (style === "h1") chain.toggleHeading({ level: 1 }).run();
    else if (style === "h2") chain.toggleHeading({ level: 2 }).run();
    else if (style === "h3") chain.toggleHeading({ level: 3 }).run();
    else if (style === "quote") chain.toggleBlockquote().run();
    else chain.setParagraph().run();
  };

  const applyLink = () => {
    const currentHref = String(editor.getAttributes("link").href ?? "");
    const input = window.prompt("Paste link URL", currentHref || "https://");

    if (input === null) return;

    const href = normalizeUrl(input);

    if (!href) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const selectionIsEmpty = editor.state.selection.empty;

    if (selectionIsEmpty) {
      const label = window.prompt("Text to display", href);
      if (!label) return;

      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: label,
          marks: [{ type: "link", attrs: { href } }],
        })
        .run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      window.alert("Image must be 6MB or smaller.");
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });
      const data: { url?: string; secure_url?: string; error?: string } = await response.json();
      const imageUrl = data.url ?? data.secure_url;

      if (!response.ok || !imageUrl) {
        throw new Error(data.error || "Image upload failed");
      }

      editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className="rich-text-editor min-w-0 overflow-visible"
      style={{ "--rte-keyboard-inset": `${keyboardInset}px` } as CSSProperties}
      onFocusCapture={() => {
        clearBlurTimer();
        setIsFocused(true);
      }}
      onBlurCapture={scheduleFocusCheck}
    >
      <div className="min-h-14">
        <div
          className="rich-text-toolbar sticky top-3 z-40 flex w-full max-w-full items-center gap-1 overflow-x-auto overflow-y-hidden rounded-xl border border-slate-200 bg-white/95 p-1.5 text-slate-900 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-950/95 dark:text-slate-100"
          role="toolbar"
          aria-label={`${label} formatting toolbar`}
        >
          <ToolbarSelect label="Block style" value={blockStyle} widthClass="w-36" onChange={setBlockStyle}>
            <option value="paragraph">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="quote">Quote</option>
          </ToolbarSelect>

          <ToolbarSelect
            label="Font family"
            value={selectedFontFamily}
            widthClass="w-32"
            onChange={(fontFamily) => {
              if (fontFamily) editor.chain().focus().setFontFamily(fontFamily).run();
              else editor.chain().focus().unsetFontFamily().run();
            }}
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.label} value={font.value}>
                {font.label}
              </option>
            ))}
          </ToolbarSelect>

          <ToolbarSelect
            label="Font size"
            value={selectedFontSize}
            widthClass="w-24"
            onChange={(fontSize) => {
              if (fontSize) editor.chain().focus().setFontSize(fontSize).run();
              else editor.chain().focus().unsetFontSize().run();
            }}
          >
            {FONT_SIZE_OPTIONS.map((fontSize) => (
              <option key={fontSize.label} value={fontSize.value}>
                {fontSize.label}
              </option>
            ))}
          </ToolbarSelect>

          <ToolbarDivider />

          <ToolButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <Undo2 className="h-4 w-4" aria-hidden="true" />
          </ToolButton>
          <ToolButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <Redo2 className="h-4 w-4" aria-hidden="true" />
          </ToolButton>

          <ToolbarDivider />

          <ToolButton label="Paragraph" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
            <Pilcrow className="h-4 w-4" aria-hidden="true" />
          </ToolButton>
          <ToolButton label="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 className="h-4 w-4" aria-hidden="true" />
          </ToolButton>
          <ToolButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="h-4 w-4" aria-hidden="true" />
          </ToolButton>
          <ToolButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 className="h-4 w-4" aria-hidden="true" />
          </ToolButton>

          <ToolbarDivider />

          <ToolButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className="h-4 w-4" aria-hidden="true" />
          </ToolButton>
          <ToolButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="h-4 w-4" aria-hidden="true" />
          </ToolButton>
          <ToolButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <Underline className="h-4 w-4" aria-hidden="true" />
          </ToolButton>
          <ToolButton label="Strike" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Strikethrough className="h-4 w-4" aria-hidden="true" />
          </ToolButton>
          <ToolButton label="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
            <Code2 className="h-4 w-4" aria-hidden="true" />
          </ToolButton>

          <ColorControl label="Text color" value={textColor} onChange={(color) => editor.chain().focus().setColor(color).run()}>
            <Palette className="h-4 w-4" aria-hidden="true" />
          </ColorControl>
          <ColorControl label="Highlight color" value={highlightColor} onChange={(color) => editor.chain().focus().setBackgroundColor(color).run()}>
            <Highlighter className="h-4 w-4" aria-hidden="true" />
          </ColorControl>

          <ToolbarDivider />

          <ToolButton label="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="h-4 w-4" aria-hidden="true" />
          </ToolButton>
          <ToolButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="h-4 w-4" aria-hidden="true" />
          </ToolButton>
          <ToolButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote className="h-4 w-4" aria-hidden="true" />
          </ToolButton>

          <ToolbarSelect
            label="Line height"
            value={selectedLineHeight}
            widthClass="w-24"
            onChange={(lineHeight) => {
              if (lineHeight) editor.chain().focus().setLineHeight(lineHeight).run();
              else editor.chain().focus().unsetLineHeight().run();
            }}
          >
            {LINE_HEIGHT_OPTIONS.map((lineHeight) => (
              <option key={lineHeight.label} value={lineHeight.value}>
                {lineHeight.label}
              </option>
            ))}
          </ToolbarSelect>

          <ToolbarDivider />

          <ToolButton label="Add link" active={editor.isActive("link")} onClick={applyLink}>
            <LinkIcon className="h-4 w-4" aria-hidden="true" />
          </ToolButton>
          <ToolButton label="Remove link" disabled={!editor.isActive("link")} onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}>
            <Unlink className="h-4 w-4" aria-hidden="true" />
          </ToolButton>
          <ToolButton label={uploadingImage ? "Uploading image" : "Upload image"} disabled={uploadingImage} onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className={`h-4 w-4 ${uploadingImage ? "animate-pulse" : ""}`} aria-hidden="true" />
          </ToolButton>
          <ToolbarDivider />

          <ToolButton
            label="Clear formatting"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          >
            <Eraser className="h-4 w-4" aria-hidden="true" />
          </ToolButton>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleImageUpload}
      />

      <EditorContent
        editor={editor}
        className="rich-text-content min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950"
      />
    </div>
  );
}
