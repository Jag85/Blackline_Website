"use client";

import dynamic from "next/dynamic";
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

export default function MarkdownEditor({
  value,
  onChange,
  height = 500,
}: MarkdownEditorProps) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v || "")}
        height={height}
        preview="live"
      />
    </div>
  );
}
