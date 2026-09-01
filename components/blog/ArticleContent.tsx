"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface ArticleContentProps {
  content: string;
}

// Helper to format inline markdown elements (bold, italic, inline code, links)
function formatInlineText(text: string): React.ReactNode {
  // Split text by inline code `...`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((codePart, i) => {
    if (codePart.startsWith("`") && codePart.endsWith("`") && codePart.length > 2) {
      const inlineCode = codePart.slice(1, -1);
      return (
        <code
          key={i}
          className="bg-[#181818] text-[#00E5FF] border border-[#2A2A2A] px-1.5 py-0.5 rounded text-[0.85em] font-mono mx-0.5"
        >
          {inlineCode}
        </code>
      );
    }

    // Process bold **...**
    const boldParts = codePart.split(/(\*\*[^*]+\*\*)/g);
    return (
      <React.Fragment key={i}>
        {boldParts.map((boldPart, j) => {
          if (boldPart.startsWith("**") && boldPart.endsWith("**") && boldPart.length > 4) {
            return (
              <strong key={j} className="font-bold text-[#F5F5F5]">
                {boldPart.slice(2, -2)}
              </strong>
            );
          }
          return boldPart;
        })}
      </React.Fragment>
    );
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
    <div className="my-8 rounded-lg overflow-hidden border border-[#222222] bg-[#0D0D0D] shadow-xl text-left">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141414] border-b border-[#1F1F1F] text-xs font-mono">
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

      {/* Code Body with preserved whitespace and no justify */}
      <div className="p-5 overflow-x-auto text-xs md:text-sm font-mono text-[#00E5FF] leading-relaxed select-text">
        <pre className="m-0 p-0 text-left whitespace-pre font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  if (!content) return null;

  // Robust Markdown Parser extracting Code Blocks and Text Blocks
  const regex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const blocks: { type: "code" | "text"; content: string; lang?: string }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({
        type: "text",
        content: content.slice(lastIndex, match.index),
      });
    }
    blocks.push({
      type: "code",
      lang: match[1] || "",
      content: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    blocks.push({
      type: "text",
      content: content.slice(lastIndex),
    });
  }

  return (
    <div className="space-y-6 text-[#C0C0C0] text-base md:text-lg leading-relaxed font-light text-left">
      {blocks.map((block, idx) => {
        if (block.type === "code") {
          return <CodeBlock key={idx} code={block.content} language={block.lang} />;
        }

        // Split text chunk by double line-breaks
        const paragraphs = block.content
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean);

        return (
          <React.Fragment key={idx}>
            {paragraphs.map((p, pIdx) => {
              if (p.startsWith("## ")) {
                return (
                  <h2
                    key={pIdx}
                    className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#F5F5F5] pt-8 pb-2 border-b border-[#1A1A1A] text-left"
                  >
                    {p.replace("## ", "")}
                  </h2>
                );
              }

              if (p.startsWith("### ")) {
                return (
                  <h3
                    key={pIdx}
                    className="font-display text-xl md:text-2xl font-bold text-[#E31B23] pt-4 text-left"
                  >
                    {p.replace("### ", "")}
                  </h3>
                );
              }

              if (p.startsWith("> ")) {
                return (
                  <blockquote
                    key={pIdx}
                    className="border-l-2 border-[#E31B23] pl-4 py-2 italic text-[#E0E0E0] bg-[#121212]/50 my-6 text-left"
                  >
                    {formatInlineText(p.replace("> ", ""))}
                  </blockquote>
                );
              }

              if (p.startsWith("- ") || p.startsWith("* ")) {
                const items = p.split("\n").filter((line) => line.trim().startsWith("- ") || line.trim().startsWith("* "));
                return (
                  <ul key={pIdx} className="space-y-2 my-4 pl-5 list-disc text-left marker:text-[#E31B23]">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        {formatInlineText(item.replace(/^[-*]\s+/, ""))}
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={pIdx} className="text-left text-[#B5B5B5] leading-relaxed">
                  {formatInlineText(p)}
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};
