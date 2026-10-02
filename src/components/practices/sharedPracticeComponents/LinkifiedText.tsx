import { FC, ReactNode } from 'react';

/** Match http(s) URLs; trailing sentence punctuation is peeled off below. */
const URL_PATTERN = /https?:\/\/[^\s]+/gi;
const TRAILING_PUNCTUATION = /[.,;:!?)]+$/;

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5 shrink-0 opacity-90"
    aria-hidden="true"
  >
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

/** e.g. https://www.patreon.com/... → "patreon" */
export const getSiteLabel = (url: string): string => {
  try {
    const host = new URL(url).hostname.replace(/^www\./i, '');
    const label = host.split('.')[0];
    return label || 'link';
  } catch {
    return 'link';
  }
};

const splitUrlMatch = (raw: string): { href: string; trailing: string } => {
  const punctMatch = raw.match(TRAILING_PUNCTUATION);
  if (!punctMatch) return { href: raw, trailing: '' };
  return {
    href: raw.slice(0, -punctMatch[0].length),
    trailing: punctMatch[0],
  };
};

interface LinkifiedTextProps {
  text: string;
  className?: string;
}

/**
 * Renders plain text with raw URLs replaced by short site-name links + icon.
 * "Visit https://www.patreon.com/... to learn" → "Visit patreon ↗ to learn"
 */
const LinkifiedText: FC<LinkifiedTextProps> = ({ text, className }) => {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const pattern = new RegExp(URL_PATTERN.source, URL_PATTERN.flags);

  while ((match = pattern.exec(text)) !== null) {
    const start = match.index;
    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    const { href, trailing } = splitUrlMatch(match[0]);
    const label = getSiteLabel(href);

    nodes.push(
      <a
        key={`link-${start}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 decoration-stone-50/70 hover:decoration-stone-50 transition-colors cursor-pointer"
      >
        <span>{label}</span>
        <ExternalLinkIcon />
      </a>
    );

    if (trailing) {
      nodes.push(trailing);
    }

    lastIndex = start + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return <span className={className}>{nodes.length > 0 ? nodes : text}</span>;
};

export default LinkifiedText;
