"use client";

import DOMPurify from "isomorphic-dompurify";

type Props = {
  content: string;
  className?: string;
};

export default function RichTextRenderer({ content, className }: Props) {
  const cleanHtml = DOMPurify.sanitize(content);

  return (
    <div
      className={`prose max-w-none ${className || ""}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}