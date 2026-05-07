'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  content: string;
}

export default function MarkdownContent({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-3xl font-bold mt-10 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-semibold mt-8 mb-3 pb-2 border-b border-black/8 dark:border-white/8">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-2">{children}</h3>,
        h4: ({ children }) => <h4 className="text-base font-semibold mt-4 mb-1">{children}</h4>,
        p: ({ children }) => <p className="my-4 leading-7">{children}</p>,
        ul: ({ children }) => <ul className="my-4 pl-6 list-disc space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="my-4 pl-6 list-decimal space-y-1">{children}</ol>,
        li: ({ children }) => <li className="leading-7">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="my-4 pl-4 border-l-4 border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 italic">
            {children}
          </blockquote>
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono text-rose-600 dark:text-rose-400">
                {children}
              </code>
            );
          }
          return (
            <code className={`${className ?? ''} text-sm`} {...props}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="my-6 p-4 rounded-xl bg-zinc-900 dark:bg-zinc-950 text-zinc-100 overflow-x-auto text-sm leading-6 font-mono">
            {children}
          </pre>
        ),
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300">
            {children}
          </a>
        ),
        img: ({ src, alt }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt ?? ''} className="my-6 rounded-xl max-w-full" />
        ),
        table: ({ children }) => (
          <div className="my-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-zinc-100 dark:bg-zinc-800">{children}</thead>,
        th: ({ children }) => <th className="px-4 py-2 text-left font-semibold border border-zinc-200 dark:border-zinc-700">{children}</th>,
        td: ({ children }) => <td className="px-4 py-2 border border-zinc-200 dark:border-zinc-700">{children}</td>,
        hr: () => <hr className="my-8 border-black/8 dark:border-white/8" />,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
