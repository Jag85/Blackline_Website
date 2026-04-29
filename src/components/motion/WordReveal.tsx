"use client";

import { motion } from "framer-motion";
import { Fragment } from "react";

interface WordRevealProps {
  /** The text to reveal word-by-word. */
  children: string;
  /** Tag to render as. Defaults to span. */
  as?: "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
  /** Delay in ms before the first word starts revealing. */
  delay?: number;
  /** Per-word stagger in seconds. Default 0.08. */
  stagger?: number;
}

/**
 * Reveals text one word at a time with a slight upward fade-in.
 * Each word animates independently so long lines feel handcrafted
 * rather than ported in as a single block. Respects line breaks
 * (\n) — useful for tagline-style hero copy.
 */
export default function WordReveal({
  children,
  as = "span",
  className = "",
  delay = 0,
  stagger = 0.08,
}: WordRevealProps) {
  // Split on whitespace but keep newlines as their own "tokens" so
  // multi-line headlines still wrap exactly where they should.
  const lines = children.split("\n");

  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: stagger, delayChildren: delay / 1000 }}
    >
      {lines.map((line, lineIdx) => (
        <Fragment key={lineIdx}>
          {line.split(" ").map((word, wordIdx) => (
            <motion.span
              key={`${lineIdx}-${wordIdx}`}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: "0.5em" },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {word}
              {wordIdx < line.split(" ").length - 1 && " "}
            </motion.span>
          ))}
          {lineIdx < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </Tag>
  );
}
