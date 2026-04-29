"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadContentImageAction } from "@/app/actions/admin/posts";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// MD Editor uses browser-only APIs; load it client-side only.
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-50 border border-gray-200 rounded animate-pulse" />
  ),
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
}

/** Filename → markdown-safe alt text (no brackets/parens that break syntax). */
function altFromFilename(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, "") // drop extension
      .replace(/[-_]+/g, " ") // dashes/underscores → spaces
      .replace(/[\[\]()<>]/g, "") // strip markdown-fragile chars
      .trim() || "image"
  );
}

/**
 * Markdown editor with two power-user behaviors layered on top of
 * @uiw/react-md-editor:
 *
 *  1. Paste preserves structure. When the clipboard contains HTML
 *     (Google Docs, Notion, Word, web pages), it's converted to
 *     GitHub-Flavored Markdown via turndown + turndown-plugin-gfm
 *     and inserted at the caret. Plain-text pastes fall through to
 *     the editor's default behavior.
 *
 *  2. Inline image upload. An "Upload image" button, drag-drop onto
 *     the editor, and paste-image from the clipboard (screenshots)
 *     all funnel through the same server action that pushes the file
 *     into Appwrite Storage and inserts `![alt](url)` markdown at
 *     the caret. Loading + error states are surfaced inline.
 *
 * The source-of-truth content stays markdown — `react-markdown +
 * remark-gfm` renders the post on /blog/[slug] — so authors can
 * still hand-edit the content later without fighting an HTML blob.
 */
export default function MarkdownEditor({
  value,
  onChange,
  height = 500,
}: MarkdownEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stable refs so async callbacks always see the latest props/state
  // without re-binding the textarea listeners on every render.
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  useEffect(() => {
    onChangeRef.current = onChange;
    valueRef.current = value;
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Insertion helpers
  // ---------------------------------------------------------------------------

  /**
   * Find the editor's underlying textarea (it lazy-mounts via next/dynamic
   * so this can return null on first render — callers handle that).
   */
  const getTextarea = useCallback((): HTMLTextAreaElement | null => {
    return wrapperRef.current?.querySelector("textarea") ?? null;
  }, []);

  /**
   * Splice `text` into the current value at the textarea's caret position
   * (or append, if the textarea isn't mounted yet). Caret is restored to
   * the end of the inserted block on the next animation frame.
   */
  const insertAtCaret = useCallback(
    (text: string) => {
      if (!text) return;
      const textarea = getTextarea();
      const current = valueRef.current ?? "";

      if (!textarea) {
        // No textarea yet (editor hasn't mounted) — append with a leading
        // newline so the inserted block doesn't collide with prior content.
        const sep = current.length > 0 && !current.endsWith("\n") ? "\n\n" : "";
        onChangeRef.current(current + sep + text);
        return;
      }

      const start = textarea.selectionStart ?? current.length;
      const end = textarea.selectionEnd ?? current.length;
      const before = current.slice(0, start);
      const after = current.slice(end);
      const next = before + text + after;
      onChangeRef.current(next);

      const caret = start + text.length;
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(caret, caret);
      });
    },
    [getTextarea]
  );

  // ---------------------------------------------------------------------------
  // Upload pipeline (shared by button / drag / paste)
  // ---------------------------------------------------------------------------

  const uploadAndInsert = useCallback(
    async (file: File) => {
      setUploadError(null);
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("image", file, file.name || "image");
        const result = await uploadContentImageAction(fd);
        if (!result.ok || !result.url) {
          setUploadError(result.message || "Upload failed.");
          return;
        }
        const alt = altFromFilename(result.filename || file.name || "image");
        // Wrap with newlines so the image renders on its own line
        // regardless of where the caret was.
        insertAtCaret(`\n\n![${alt}](${result.url})\n\n`);
      } catch (err) {
        setUploadError(
          err instanceof Error ? err.message : "Unknown upload error."
        );
      } finally {
        setUploading(false);
      }
    },
    [insertAtCaret]
  );

  /** Sequentially upload a list of files (paste/drop can include several). */
  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      for (const f of list) {
        await uploadAndInsert(f);
      }
    },
    [uploadAndInsert]
  );

  // ---------------------------------------------------------------------------
  // HTML → Markdown (turndown), used by the paste handler
  // ---------------------------------------------------------------------------

  const htmlToMarkdown = useCallback(async (html: string): Promise<string> => {
    const [{ default: TurndownService }, gfmModule] = await Promise.all([
      import("turndown"),
      import("turndown-plugin-gfm"),
    ]);

    const turndown = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
      emDelimiter: "_",
      hr: "---",
    });
    turndown.use(gfmModule.gfm);

    const cleaned = html
      .replace(/<b[^>]*id="docs-internal-guid-[^"]*"[^>]*>/gi, "")
      .replace(/<\/b>(?=\s*$|\s*<)/gi, "")
      .replace(/<o:p>[\s\S]*?<\/o:p>/gi, "")
      .replace(/<\/?xml[^>]*>/gi, "")
      .replace(/<!\[if[^\]]*\][^]*?<!\[endif\]>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "");

    return turndown.turndown(cleaned).trim();
  }, []);

  // ---------------------------------------------------------------------------
  // Paste listener (HTML preservation + image-from-clipboard)
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let detach: (() => void) | null = null;

    const attach = () => {
      const textarea = wrapper.querySelector(
        "textarea"
      ) as HTMLTextAreaElement | null;
      if (!textarea) return false;

      const handler = async (e: ClipboardEvent) => {
        const cb = e.clipboardData;
        if (!cb) return;

        // 1) Image on the clipboard (screenshot, "copy image", etc.) —
        //    upload + insert as markdown image.
        const fileList: File[] = [];
        for (const item of Array.from(cb.items)) {
          if (item.kind === "file" && item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) fileList.push(file);
          }
        }
        if (fileList.length > 0) {
          e.preventDefault();
          e.stopPropagation();
          await uploadFiles(fileList);
          return;
        }

        // 2) Structured HTML on the clipboard — convert to markdown.
        const html = cb.getData("text/html");
        if (!html || html.trim().length === 0) return;
        e.preventDefault();
        e.stopPropagation();

        let markdown = "";
        try {
          markdown = await htmlToMarkdown(html);
        } catch (err) {
          console.error(
            "[MarkdownEditor] HTML→MD failed; falling back to plain text:",
            err
          );
          markdown = cb.getData("text/plain");
        }
        if (markdown) insertAtCaret(markdown);
      };

      textarea.addEventListener("paste", handler);
      detach = () => textarea.removeEventListener("paste", handler);
      return true;
    };

    if (attach()) return () => detach?.();

    const observer = new MutationObserver(() => {
      if (attach()) observer.disconnect();
    });
    observer.observe(wrapper, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      detach?.();
    };
  }, [htmlToMarkdown, insertAtCaret, uploadFiles]);

  // ---------------------------------------------------------------------------
  // Drag & drop
  // ---------------------------------------------------------------------------

  const [dragOver, setDragOver] = useState(false);

  const onDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer?.types.includes("Files")) {
      e.preventDefault();
      setDragOver(true);
    }
  };
  const onDragLeave = () => setDragOver(false);
  const onDrop = async (e: React.DragEvent) => {
    if (!e.dataTransfer?.files || e.dataTransfer.files.length === 0) return;
    e.preventDefault();
    setDragOver(false);
    await uploadFiles(e.dataTransfer.files);
  };

  // ---------------------------------------------------------------------------
  // Button + file picker
  // ---------------------------------------------------------------------------

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await uploadFiles(files);
    // Reset so picking the same file twice still triggers onChange
    e.target.value = "";
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 border border-gray-300 px-3 py-1.5 rounded hover:border-black hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <ImagePlus size={12} />
              Upload image
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        {uploadError && (
          <p className="text-xs text-red-600" role="status">
            {uploadError}
          </p>
        )}
      </div>

      {/* Editor */}
      <div
        ref={wrapperRef}
        data-color-mode="light"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={
          dragOver
            ? "ring-2 ring-black ring-offset-2 rounded transition-shadow"
            : ""
        }
      >
        <MDEditor
          value={value}
          onChange={(v) => onChange(v || "")}
          height={height}
          preview="live"
        />
      </div>

      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
        Paste from Google Docs, Notion, Word, or any webpage — headings,
        lists, tables, links, and bold/italic come through as markdown
        automatically. To add an image: click <b>Upload image</b>, drag a
        file onto the editor, or paste a screenshot from your clipboard.
      </p>
    </div>
  );
}
