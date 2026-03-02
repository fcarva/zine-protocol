import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownRenderer({ content }: { content: string }) {
  function containsImage(node: React.ReactNode): boolean {
    if (!React.isValidElement(node)) return false;
    if (typeof node.type === "string" && node.type === "img") return true;

    const children = React.Children.toArray(
      (node.props as { children?: React.ReactNode }).children,
    );
    return children.some(containsImage);
  }

  return (
    <article className="markdown-content text-base-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => {
            const hasImage = React.Children.toArray(children).some(containsImage);
            return <p className={hasImage ? "contains-image" : undefined}>{children}</p>;
          },
          img: ({ src, alt }) => {
            if (!src) return null;
            return (
              <figure className="zine-figure">
                <img
                  className="zine-image"
                  src={src}
                  alt={alt || ""}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

