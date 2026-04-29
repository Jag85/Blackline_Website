"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
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

/**
 * Markdown editor with a "paste preserves structure" behavior similar to
 * Ghost. When the clipboard contains HTML — i.e. you copied from Google
 * Docs, Notion, Word, or a web page — we intercept the paste, convert
 * the HTML to GitHub-Flavored Markdown via turndown, and insert that at
 * the caret instead of the default plain-text fallback.
 *
 * This keeps the source-of-truth in markdown (which `react-markdown +
 * remark-gfm` renders on /blog/[slug]) while giving authors the "paste
 * and it just looks right" feel they're used to from rich-text CMSes.
 *
 * Headings, bold/italic, links, lists, blockquotes, fenced code blocks,
 * GFM tables, strikethrough, and task lists all carry through. Plain-
 * text pastes fall through to the editor's default behavior so quick
 * snippet pasting still feels native.
 */
export default function MarkdownEditor({
  value,
  onChange,
  height = 500,
}: MarkdownEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Stable ref to the latest onChange so the paste listener (bound once
  // when the textarea appears) always calls the current callback.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  /**
   * Convert a chunk of HTML to GFM markdown. Async so turndown loads
   * lazily — it's only needed on the first paste, not on initial render.
   */
  const htmlToMarkdown = useCallback(async (html: string): Promise<string> => {
    const [{ default: TurndownService }, gfmModule] = await Promise.all([
      import("turndown"),
      import("turndown-plugin-gfm"),
    ]);

    const turndown = new TurndownService({
      headingStyle: "atx", // # H1, ## H2 (the format remark-gfm renders cleanest)
      codeBlockStyle: "fenced", // ``` blocks instead of indented
      bulletListMarker: "-",
      emDelimiter: "_",
      hr: "---",
    });
    // GFM plugin adds: tables, strikethrough, task lists.
    turndown.use(gfmModule.gfm);

    // Source-specific noise that produces ugly markdown if left in.
    const cleaned = html
      // Google Docs wraps content in an <b> with id="docs-internal-guid-..."
      // which turndown otherwise emits as bare ** on every paragraph.
      .replace(/<b[^>]*id="docs-internal-guid-[^"]*"[^>]*>/gi, "")
      .replace(/<\/b>(?=\s*$|\s*<)/gi, "")
      // MS Word / Outlook artifacts
      .replace(/<o:p>[\s\S]*?<\/o:p>/gi, "")
      .replace(/<\/?xml[^>]*>/gi, "")
      .replace(/<!\[if[^\]]*\][^]*?<!\[endif\]>/gi, "")
      // HTML comments (often present in Notion / Word exports)
      .replace(/<!--[\s\S]*?-->/g, "");

    return turndown.turndown(cleaned).trim();
  }, []);

  // Bind a `paste` listener directly to the underlying <textarea>. We can't
  // use React's onPaste on the wrapper alone because the editor's preview
  // pane shouldn't intercept pastes — only the edit textarea should.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let detachHandler: (() => void) | null = null;

    /** Attach the paste listener to the textarea once it exists. */
    const attach = () => {
      const textarea = wrapper.querySelector(
        "textarea"
      ) as HTMLTextAreaElement | null;
      if (!textarea) return false;

      const handler = async (e: ClipboardEvent) => {
        const cb = e.clipboardData;
        if (!cb) return;
        const html = cb.getData("text/html");
        // No HTML on the clipboard → let the editor handle the paste itself.
        if (!html || html.trim().length === 0) return;

        // We have structural HTML to preserve — take over.
        e.preventDefault();
        e.stopPropagation();

        let markdown = "";
        try {
          markdown = await htmlToMarkdown(html);
        } catch (err) {
          console.error("[MarkdownEditor] HTML→MD failed; falling back to plain text:", err);
          markdown = cb.getData("text/plain");
        }
        if (!markdown) return;

        const start = textarea.selectionStart ?? textarea.value.length;
        const end = textarea.selectionEnd ?? textarea.value.length;
        const next =
          textarea.value.slice(0, start) + markdown + textarea.value.slice(end);

        // Push the new content up to the parent. MDEditor is controlled, so
        // it'll re-render with the new value on the next React tick.
        onChangeRef.current(next);

        // Restore caret to the end of the inserted block on the next frame
        // (after MDEditor has re-rendered the textarea).
        const caret = start + markdown.length;
        requestAnimationFrame(() => {
          textarea.focus();
          textarea.setSelectionRange(caret, caret);
        });
      };

      textarea.addEventListener("paste", handler);
      detachHandler = () => textarea.removeEventListener("paste", handler);
      return true;
    };

    if (attach()) return () => detachHandler?.();

    // Editor lazy-loads via next/dynamic — the textarea won't be in the DOM
    // on first effect run. Watch for it to appear, then attach once.
    const observer = new MutationObserver(() => {
      if (attach()) observer.disconnect();
    });
    observer.observe(wrapper, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      detachHandler?.();
    };
  }, [htmlToMarkdown]);

  return (
    <div data-color-mode="light" ref={wrapperRef}>
      <MDEditor
        value={value}
        onChange={(v) => onChange(v || "")}
        height={height}
        preview="live"
      />
      <p className="text-xs text-gray-500 mt-2">
        Tip: paste from Google Docs, Notion, Word, or any webpage —
        headings, lists, tables, links, and bold/italic come through as
        markdown automatically.
      </p>
    </div>
  );
}
