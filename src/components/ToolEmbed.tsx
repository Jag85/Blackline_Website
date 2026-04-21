"use client";

import { useEffect, useRef, useState } from "react";

interface ToolEmbedProps {
  src: string;
  title: string;
}

export default function ToolEmbed({ src, title }: ToolEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(900);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const adjustHeight = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc?.body) {
          const newHeight = Math.max(
            doc.body.scrollHeight,
            doc.documentElement.scrollHeight,
            900
          );
          setHeight(newHeight + 40);
        }
      } catch {
        // cross-origin or load error — fall back to default
      }
    };

    iframe.addEventListener("load", adjustHeight);
    const interval = setInterval(adjustHeight, 1000);

    return () => {
      iframe.removeEventListener("load", adjustHeight);
      clearInterval(interval);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      className="w-full border-0 bg-white rounded-lg shadow-sm"
      style={{ height: `${height}px` }}
    />
  );
}
