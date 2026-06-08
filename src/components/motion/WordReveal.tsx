import { Fragment } from "react";

interface WordRevealProps {
  /** The text to reveal word-by-word. Supports `\n` for line breaks. */
  children: string;
  /** Tag to render as. Defaults to span. */
  as?: "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
  /** Delay in ms before the first word starts revealing. */
  delay?: number;
  /** Per-word stagger in ms. Default 80. */
  stagger?: number;
}

/**
 * Reveals text one word at a time with an upward fade-in.
 *
 * Pure CSS — NO framer-motion, NO "use client", NO JavaScript. Each word
 * is a span carrying the `.reveal-up` animation (defined in globals.css)
 * with a per-word `animation-delay`. The critical property: the base
 * state of every word is fully visible (opacity:1); the animation only
 * plays the entrance. So if JS never loads, if hydration fails, or if
 * the user prefers reduced motion, the text is simply *there* —
 * crawlers and users both see it.
 *
 * This replaced a framer-motion implementation whose `initial opacity:0`
 * left the homepage H1 invisible whenever the JS bundle was slow or
 * failed — the same class of bug that once hid a blog post's body.
 */
export default function WordReveal({
  children,
  as: Tag = "span",
  className = "",
  delay = 0,
  stagger = 80,
}: WordRevealProps) {
  const lines = children.split("\n").map((line) => line.split(" "));

  return (
    <Tag className={className}>
      {lines.map((words, lineIdx) => {
        // Global word index = all words on preceding lines + position on
        // this line. Computed purely (no mutation during render) so the
        // per-word animation-delay staggers across line breaks too.
        const precedingWords = lines
          .slice(0, lineIdx)
          .reduce((n, w) => n + w.length, 0);
        return (
          <Fragment key={lineIdx}>
            {words.map((word, wi) => {
              const animationDelay = `${delay + (precedingWords + wi) * stagger}ms`;
              return (
                <Fragment key={wi}>
                  <span
                    className="reveal-up inline-block"
                    style={{ animationDelay }}
                  >
                    {word}
                  </span>
                  {/* Keep the inter-word space as a normal text node
                      (outside the inline-block) so lines still wrap. */}
                  {wi < words.length - 1 ? " " : null}
                </Fragment>
              );
            })}
            {lineIdx < lines.length - 1 && <br />}
          </Fragment>
        );
      })}
    </Tag>
  );
}
