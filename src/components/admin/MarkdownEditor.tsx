"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadContentImageAction } from "@/app/actions/admin/posts";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

/**
 * MDXEditor is a heavy client-only editor that pulls in lexical and a
 * stack of lazy-loaded plugins. Loading it via next/dynamic keeps it out
 * of the server bundle entirely and prevents SSR-time crashes from its
 * use of browser-only APIs (matchMedia, document.execCommand, etc.).
 *
 * The wrapper module below re-exports the configured editor — keeping
 * the dynamic import to a single arrow function (recommended by the
 * MDXEditor docs for stable HMR + Suspense behavior).
 */
const Editor = dynamic(() => import("./_MdxEditorInner"), {
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
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/[\[\]()<>]/g, "")
      .trim() || "image"
  );
}

/**
 * Single-pane WYSIWYG markdown editor — the markdown source IS the rendered
 * output, no split-pane preview. Headings, lists, tables, links, blockquotes,
 * code blocks, and bold/italic all render inline as you type or paste.
 *
 * Three image-insertion paths converge on the same Appwrite upload action:
 *   - "Upload image" button (file picker, multi-select)
 *   - Drag-and-drop onto the editor surface
 *   - Paste-from-clipboard images (screenshots, "copy image" from any app)
 *
 * The HTML→Markdown paste handler from the previous editor is preserved for
 * pastes from sources MDXEditor's built-in paste doesn't fully clean up
 * (Google Docs <b id="docs-internal-guid-…"> wrappers, MS Word <o:p> tags,
 * <style> blocks). On detection of HTML on the clipboard, we convert via
 * turndown and call onChange with the cleaned markdown appended at the end.
 */
export default function MarkdownEditor({
  value,
  onChange,
  height = 500,
}: MarkdownEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Ref into the underlying MDXEditor so we can push fresh markdown into
  // its Lexical state when the value changes from outside the editor
  // (paste interceptor, drag-drop, image upload). MDXEditor's `markdown`
  // prop is only consumed at mount time — without this ref, external
  // updates would update parent state but the editor surface would stay
  // visually stale.
  const editorRef = useRef<MDXEditorMethods | null>(null);
  // Tracks the last markdown the editor itself emitted, so the sync
  // effect below can tell "this update originated inside the editor"
  // (do nothing — Lexical already has it) from "this update came from
  // outside" (push it in via setMarkdown).
  const lastEmittedRef = useRef(value);

  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  useEffect(() => {
    onChangeRef.current = onChange;
    valueRef.current = value;
  });

  // Push external value changes into the editor's Lexical state.
  useEffect(() => {
    if (value !== lastEmittedRef.current && editorRef.current) {
      editorRef.current.setMarkdown(value);
      lastEmittedRef.current = value;
    }
  }, [value]);

  /** onChange wrapper that records what the editor emitted before
   *  bubbling it up — keeps the sync effect from echoing back. */
  const handleEditorChange = useCallback(
    (md: string) => {
      lastEmittedRef.current = md;
      onChangeRef.current(md);
    },
    []
  );

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Append helper — used by drag/paste/button paths since we can't reach into
  // MDXEditor's internal selection state from outside React.
  // ---------------------------------------------------------------------------

  const appendBlock = useCallback((text: string) => {
    if (!text) return;
    const current = valueRef.current ?? "";
    const sep = current.length > 0 && !current.endsWith("\n\n") ? "\n\n" : "";
    onChangeRef.current(current + sep + text + "\n\n");
  }, []);

  // ---------------------------------------------------------------------------
  // Upload pipeline
  // ---------------------------------------------------------------------------

  const uploadAndInsert = useCallback(
    async (file: File): Promise<string | null> => {
      setUploadError(null);
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("image", file, file.name || "image");
        const result = await uploadContentImageAction(fd);
        if (!result.ok || !result.url) {
          setUploadError(result.message || "Upload failed.");
          return null;
        }
        return result.url;
      } catch (err) {
        setUploadError(
          err instanceof Error ? err.message : "Unknown upload error."
        );
        return null;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  /** Sequentially upload + insert a list of files. */
  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      for (const f of list) {
        const url = await uploadAndInsert(f);
        if (url) {
          appendBlock(`![${altFromFilename(f.name)}](${url})`);
        }
      }
    },
    [uploadAndInsert, appendBlock]
  );

  // ---------------------------------------------------------------------------
  // HTML → Markdown (turndown), used by the paste fallback
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
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "")
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "")
      .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "")
      .replace(/<meta\b[^>]*>/gi, "")
      .replace(/<link\b[^>]*>/gi, "")
      .replace(/<o:p>[\s\S]*?<\/o:p>/gi, "")
      .replace(/<\/?xml[^>]*>/gi, "")
      .replace(/<!\[if[^\]]*\][^]*?<!\[endif\]>/gi, "")
      .replace(/<b[^>]*id="docs-internal-guid-[^"]*"[^>]*>/gi, "")
      .replace(/<\/b>(?=\s*$|\s*<)/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "");

    return turndown.turndown(cleaned).trim();
  }, []);

  // ---------------------------------------------------------------------------
  // Wrapper-level paste interceptor — handles HTML and image-from-clipboard
  // before they reach MDXEditor (so big rich-HTML pastes get the same clean
  // turndown conversion the previous editor had).
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handler = async (e: ClipboardEvent) => {
      const cb = e.clipboardData;
      if (!cb) return;

      // 1) Image on clipboard → upload + insert.
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

      // 2) Rich HTML → turndown → append. Only takes over when the
      //    clipboard genuinely has HTML AND it's not a tiny inline
      //    fragment (so plain copy/paste between paragraphs of the
      //    editor's own content stays native — preserves caret/undo).
      const html = cb.getData("text/html");
      if (!html || html.trim().length < 50) return;

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
      if (markdown) appendBlock(markdown);
    };

    wrapper.addEventListener("paste", handler, true);
    return () => wrapper.removeEventListener("paste", handler, true);
  }, [htmlToMarkdown, uploadFiles, appendBlock]);

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
  // File picker
  // ---------------------------------------------------------------------------

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await uploadFiles(files);
    e.target.value = "";
  };

  /**
   * Per-image upload handler MDXEditor's image plugin calls when the user
   * inserts an image via its built-in image dialog. Returns the URL string
   * the plugin uses to construct the `![alt](url)` markdown node.
   */
  const editorImageUpload = useCallback(
    async (image: File): Promise<string> => {
      const url = await uploadAndInsert(image);
      if (!url) {
        // The image plugin throws on rejection, surfacing the message in
        // the dialog. Match the same UX the inline error span uses.
        throw new Error(uploadError || "Upload failed");
      }
      return url;
    },
    [uploadAndInsert, uploadError]
  );

  return (
    <div>
      {/* Toolbar (custom, above the editor's own toolbar) */}
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

      {/* Editor — the inline `--mdx-min-h` custom property is read by
          the .mdx-editor rule in globals.css to size the content area
          (MDXEditor itself doesn't expose a minHeight prop). */}
      <div
        ref={wrapperRef}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{ ["--mdx-min-h" as string]: `${height}px` }}
        className={`mdx-editor-wrap rounded border ${
          dragOver
            ? "border-black ring-2 ring-black ring-offset-2"
            : "border-gray-300"
        } transition-shadow`}
      >
        <Editor
          editorRef={editorRef}
          markdown={value}
          onChange={handleEditorChange}
          imageUploadHandler={editorImageUpload}
        />
      </div>

      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
        Type markdown and it renders inline as you go (try{" "}
        <code className="bg-gray-100 px-1 py-0.5 rounded">## heading</code>,{" "}
        <code className="bg-gray-100 px-1 py-0.5 rounded">**bold**</code>,{" "}
        <code className="bg-gray-100 px-1 py-0.5 rounded">- list</code>).
        Paste from Google Docs, Notion, Word, or any webpage — formatting
        comes through automatically. To add an image: click{" "}
        <b>Upload image</b>, drag a file onto the editor, or paste a
        screenshot from your clipboard.
      </p>
    </div>
  );
}
