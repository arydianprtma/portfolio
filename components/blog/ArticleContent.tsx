"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal, ExternalLink } from "lucide-react";

interface ArticleContentProps {
  content: string;
}

// Robust inline formatter for bold, inline code, and links
export function formatInline(text: string): React.ReactNode[] {
  if (!text) return [];

  // Match: inline code `...`, bold **...**, bold *...*, markdown link [...](...)
  const tokenRegex = /(`[^`]+`|\*\*[^*]+?\*\*|\*[^*]+?\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // 1. Inline Code
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={index}
          className="bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[0.85em] font-mono mx-0.5 break-all inline-block align-middle"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // 2. Bold Text (**...** or *...*) -> Clean bright bold text
    if (
      (part.startsWith("**") && part.endsWith("**") && part.length >= 4) ||
      (part.startsWith("*") && part.endsWith("*") && part.length >= 2)
    ) {
      const inner = part.startsWith("**") ? part.slice(2, -2) : part.slice(1, -1);
      return (
        <strong key={index} className="font-bold text-[var(--foreground)]">
          {inner}
        </strong>
      );
    }

    // 4. Link [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E31B23] hover:underline inline-flex items-center gap-0.5 font-medium"
        >
          <span>{linkMatch[1]}</span>
          <ExternalLink className="w-3 h-3 inline" />
        </a>
      );
    }

    // Plain Text
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

// Code Block with copy button and language tag
const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLang = language?.toUpperCase() || "CODE";

  return (
    <div className="my-6 rounded overflow-hidden border border-[var(--border)] bg-[#0D0D0D] text-left">
      <div className="flex items-center justify-between px-4 py-2 bg-[#141414] border-b border-[#1F1F1F] text-xs font-mono">
        <div className="flex items-center gap-2 text-[#777777]">
          <Terminal className="w-3.5 h-3.5 text-[#E31B23]" />
          <span className="font-bold tracking-wider text-[#A0A0A0]">{displayLang}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-[#777777] hover:text-[#F5F5F5] transition-colors py-0.5 px-2 rounded hover:bg-[#1F1F1F]"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 overflow-x-auto text-xs md:text-sm font-mono text-[#00E5FF] leading-relaxed select-text">
        <pre className="m-0 p-0 text-left whitespace-pre font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  if (!content) return null;

  // 1. Separate code blocks from normal markdown text
  const rawText = content.replace(/\r\n/g, "\n");
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const sections: { type: "code" | "text"; content: string; lang?: string }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      sections.push({
        type: "text",
        content: rawText.slice(lastIndex, match.index),
      });
    }
    sections.push({
      type: "code",
      lang: match[1] || "",
      content: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < rawText.length) {
    sections.push({
      type: "text",
      content: rawText.slice(lastIndex),
    });
  }

  return (
    <div className="space-y-4 text-[var(--muted)] text-sm md:text-base leading-relaxed font-normal text-left">
      {sections.map((section, sIdx) => {
        if (section.type === "code") {
          return <CodeBlock key={sIdx} code={section.content} language={section.lang} />;
        }

        // Process text lines and group properly
        const lines = section.content.split("\n");
        const renderedElements: React.ReactNode[] = [];
        let currentList: { type: "ul" | "ol"; items: string[] } | null = null;
        let currentParagraph: string[] = [];

        const flushParagraph = (key: string) => {
          if (currentParagraph.length > 0) {
            const pText = currentParagraph.join(" ").trim();
            if (pText) {
              renderedElements.push(
                <p key={key} className="text-[var(--muted)] leading-relaxed my-3 font-sans">
                  {formatInline(pText)}
                </p>
              );
            }
            currentParagraph = [];
          }
        };

        const flushList = (key: string) => {
          if (currentList && currentList.items.length > 0) {
            if (currentList.type === "ul") {
              renderedElements.push(
                <ul key={key} className="space-y-2 my-3 pl-5 list-disc marker:text-[#E31B23]">
                  {currentList.items.map((item, iIdx) => (
                    <li key={iIdx} className="text-[var(--muted)] leading-relaxed">
                      {formatInline(item)}
                    </li>
                  ))}
                </ul>
              );
            } else {
              renderedElements.push(
                <ol key={key} className="space-y-2 my-3 pl-5 list-decimal marker:text-[#E31B23]">
                  {currentList.items.map((item, iIdx) => (
                    <li key={iIdx} className="text-[var(--muted)] leading-relaxed">
                      {formatInline(item)}
                    </li>
                  ))}
                </ol>
              );
            }
            currentList = null;
          }
        };

        lines.forEach((line, lIdx) => {
          const trimmed = line.trim();

          // Empty line -> flush current paragraph and list
          if (!trimmed) {
            flushParagraph(`p-${sIdx}-${lIdx}`);
            flushList(`list-${sIdx}-${lIdx}`);
            return;
          }

          // Horizontal Divider
          if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
            flushParagraph(`p-${sIdx}-${lIdx}`);
            flushList(`list-${sIdx}-${lIdx}`);
            renderedElements.push(<hr key={`hr-${sIdx}-${lIdx}`} className="border-[var(--border)] my-6" />);
            return;
          }

          // Heading 2 (## ...) -> Clean neutral color with anchor id!
          if (trimmed.startsWith("## ")) {
            flushParagraph(`p-${sIdx}-${lIdx}`);
            flushList(`list-${sIdx}-${lIdx}`);
            const rawHeading = trimmed.replace(/^##\s+/, "").trim();
            const headingId = rawHeading
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/[\s_-]+/g, "-");

            renderedElements.push(
              <h2
                id={headingId}
                key={`h2-${sIdx}-${lIdx}`}
                className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight text-[var(--foreground)] pt-6 pb-2 border-b border-[var(--border)] scroll-mt-28"
              >
                {rawHeading}
              </h2>
            );
            return;
          }

          // Heading 3 (### ...) -> Clean neutral color!
          if (trimmed.startsWith("### ")) {
            flushParagraph(`p-${sIdx}-${lIdx}`);
            flushList(`list-${sIdx}-${lIdx}`);
            const rawHeading = trimmed.replace(/^###\s+/, "").trim();
            const headingId = rawHeading
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/[\s_-]+/g, "-");

            renderedElements.push(
              <h3
                id={headingId}
                key={`h3-${sIdx}-${lIdx}`}
                className="font-display text-base md:text-lg font-bold text-[var(--foreground)] pt-4 pb-1 uppercase tracking-wide scroll-mt-28"
              >
                {rawHeading}
              </h3>
            );
            return;
          }

          // Blockquote (> ...)
          if (trimmed.startsWith("> ")) {
            flushParagraph(`p-${sIdx}-${lIdx}`);
            flushList(`list-${sIdx}-${lIdx}`);
            renderedElements.push(
              <blockquote
                key={`bq-${sIdx}-${lIdx}`}
                className="border-l-2 border-[#E31B23] pl-4 py-2 italic text-[var(--foreground)] bg-[var(--surface)] my-4"
              >
                {formatInline(trimmed.replace(/^>\s+/, ""))}
              </blockquote>
            );
            return;
          }

          // Bullet List Item (- ... or * ...)
          if (/^[-*]\s+/.test(trimmed)) {
            flushParagraph(`p-${sIdx}-${lIdx}`);
            const itemText = trimmed.replace(/^[-*]\s+/, "");
            if (!currentList || currentList.type !== "ul") {
              flushList(`list-${sIdx}-${lIdx}`);
              currentList = { type: "ul", items: [itemText] };
            } else {
              currentList.items.push(itemText);
            }
            return;
          }

          // Numbered List Item (1. ... or 2. ...)
          if (/^\d+\.\s+/.test(trimmed)) {
            flushParagraph(`p-${sIdx}-${lIdx}`);
            const itemText = trimmed.replace(/^\d+\.\s+/, "");
            if (!currentList || currentList.type !== "ol") {
              flushList(`list-${sIdx}-${lIdx}`);
              currentList = { type: "ol", items: [itemText] };
            } else {
              currentList.items.push(itemText);
            }
            return;
          }

          // Regular paragraph line
          if (currentList) {
            flushList(`list-${sIdx}-${lIdx}`);
          }
          currentParagraph.push(trimmed);
        });

        flushParagraph(`p-${sIdx}-end`);
        flushList(`list-${sIdx}-end`);

        return <React.Fragment key={sIdx}>{renderedElements}</React.Fragment>;
      })}
    </div>
  );
};
