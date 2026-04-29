"use client";

/**
 * MDXEditor instance with all the plugins this site's blog editor needs.
 *
 * Kept in its own module so the parent MarkdownEditor can lazy-load this
 * via `next/dynamic({ ssr: false })` cleanly. MDXEditor itself uses
 * browser-only APIs at module load time (matchMedia, lexical's editor
 * config) so it MUST be client-only.
 */

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  UndoRedo,
  Separator,
} from "@mdxeditor/editor";

interface InnerProps {
  markdown: string;
  onChange: (md: string) => void;
  imageUploadHandler: (file: File) => Promise<string>;
}

/**
 * Editor toolbar — sits inside the editor frame, above the content
 * surface. Kept lean: undo/redo, bold/italic, block type (heading,
 * paragraph, blockquote, etc.), lists, links, tables, thematic break.
 *
 * Image insertion is handled by the parent's own toolbar (Upload image
 * button + drag/paste) so users don't have to dig through a dialog.
 */
function ToolbarContents() {
  return (
    <>
      <UndoRedo />
      <Separator />
      <BoldItalicUnderlineToggles />
      <Separator />
      <BlockTypeSelect />
      <Separator />
      <ListsToggle />
      <Separator />
      <CreateLink />
      <InsertTable />
      <InsertThematicBreak />
    </>
  );
}

export default function MdxEditorInner({
  markdown,
  onChange,
  imageUploadHandler,
}: InnerProps) {
  return (
    <MDXEditor
      markdown={markdown}
      onChange={onChange}
      // Apply the same `prose` classes the public blog post page uses
      // so the in-editor rendering matches what a published post looks
      // like — headings, list bullets, blockquote bars, code styles all
      // mirror the live site.
      contentEditableClassName="mdx-editor-content prose prose-lg prose-neutral max-w-none focus:outline-none"
      className="mdx-editor"
      placeholder="Write your post… type markdown shortcuts (## heading, **bold**, - list) and they render as you type."
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({ imageUploadHandler }),
        tablePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
        // codeMirrorPlugin enables syntax highlighting inside fenced
        // code blocks for the languages listed here.
        codeMirrorPlugin({
          codeBlockLanguages: {
            "": "Plain text",
            js: "JavaScript",
            ts: "TypeScript",
            tsx: "TSX",
            jsx: "JSX",
            json: "JSON",
            html: "HTML",
            css: "CSS",
            md: "Markdown",
            sh: "Shell",
            sql: "SQL",
            python: "Python",
            yaml: "YAML",
          },
        }),
        // markdownShortcutPlugin must be last so it sees the other
        // plugins' node types and can route shortcuts (## → heading)
        // into them.
        markdownShortcutPlugin(),
        toolbarPlugin({ toolbarContents: () => <ToolbarContents /> }),
      ]}
    />
  );
}
