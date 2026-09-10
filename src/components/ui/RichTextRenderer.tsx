'use client';

import parse, { HTMLReactParserOptions, Element, domToReact, DOMNode } from 'html-react-parser';

interface RichTextRendererProps {
  content: string | null | undefined;
  className?: string;
}

const parserOptions: HTMLReactParserOptions = {
  replace(domNode) {
    if (domNode instanceof Element && domNode.name === 'a') {
      const { href, ...rest } = domNode.attribs;
      const safehref =
        href && (href.startsWith('javascript:') || href.startsWith('data:'))
          ? '#'
          : href;
      return (
        <a {...rest} href={safehref} target="_blank" rel="noopener noreferrer">
          {domToReact(domNode.children as DOMNode[], parserOptions)}
        </a>
      );
    }
  },
};

function decodeHtmlEntities(value: string): string {
  if (!value) return value;

  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = value;
    return textarea.value;
  }

  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

export default function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content) return null;

  const parsed = parse(decodeHtmlEntities(content), parserOptions);

  // If a className is passed, wrap in a div with those classes.
  // Otherwise, always wrap in a prose container so parsed HTML headings
  // receive the typography styles consistently.
  const wrapperClassName =
    className ??
    'prose prose-lg max-w-none prose-headings:text-university-deep-blue prose-a:text-mcaai-teal';

  return <div className={wrapperClassName}>{parsed}</div>;
}