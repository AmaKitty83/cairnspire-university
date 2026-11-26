import type { ReactNode } from 'react';
import rawBillOfRights from '../../governance/preliminary_bill_of_rights.md?raw';

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(
        <strong key={key++} className="font-bold text-[#2b1808]">
          {renderInline(token.slice(2, -2))}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      nodes.push(
        <em key={key++} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded bg-[#efe0bc] border border-[#c9a86a] text-[11px] font-mono text-[#3d230b]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

interface ParsedBlock {
  type: 'h1' | 'h2' | 'h3' | 'hr' | 'quote' | 'tip' | 'p' | 'ol-item' | 'ul-item' | 'nested-ul-item';
  num?: string;
  text: string;
}

function parseCharterMarkdown(md: string): ParsedBlock[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks: ParsedBlock[] = [];
  let inTip = false;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (!trimmed) {
      inTip = false;
      continue;
    }

    if (trimmed === '---') {
      inTip = false;
      blocks.push({ type: 'hr', text: '' });
      continue;
    }

    if (trimmed.startsWith('### ')) {
      inTip = false;
      blocks.push({ type: 'h3', text: trimmed.slice(4) });
      continue;
    }
    if (trimmed.startsWith('## ')) {
      inTip = false;
      blocks.push({ type: 'h2', text: trimmed.slice(3) });
      continue;
    }
    if (trimmed.startsWith('# ')) {
      inTip = false;
      blocks.push({ type: 'h1', text: trimmed.slice(2) });
      continue;
    }

    if (trimmed.startsWith('>')) {
      const content = trimmed.replace(/^>\s?/, '');
      if (content === '[!TIP]') {
        inTip = true;
        continue;
      }
      blocks.push({ type: inTip ? 'tip' : 'quote', text: content });
      continue;
    }

    inTip = false;

    const nestedBullet = raw.match(/^\s{2,}-\s+(.*)$/);
    if (nestedBullet) {
      blocks.push({ type: 'nested-ul-item', text: nestedBullet[1] });
      continue;
    }

    const numbered = raw.match(/^(\d+)\.\s+(.*)$/);
    if (numbered) {
      blocks.push({ type: 'ol-item', num: numbered[1], text: numbered[2] });
      continue;
    }

    const bullet = raw.match(/^-\s+(.*)$/);
    if (bullet) {
      blocks.push({ type: 'ul-item', text: bullet[1] });
      continue;
    }

    blocks.push({ type: 'p', text: trimmed });
  }

  return blocks;
}

const CHARTER_BLOCKS = parseCharterMarkdown(rawBillOfRights);

export function BillOfRightsReader() {
  return (
    <article className="pt-3 mt-2 border-t border-[#d8bc8a] space-y-2 text-xs text-[#3b2410] leading-relaxed">
      {CHARTER_BLOCKS.map((block, idx) => {
        switch (block.type) {
          case 'h1':
            return (
              <h3 key={idx} className="font-atlas text-base font-bold text-[#331d0b] pt-1">
                {renderInline(block.text)}
              </h3>
            );
          case 'h2':
            return (
              <h4
                key={idx}
                className="font-atlas text-sm font-bold text-[#4a2b0f] pt-2 border-b border-[#dfc492] pb-1"
              >
                {renderInline(block.text)}
              </h4>
            );
          case 'h3':
            return (
              <h5 key={idx} className="font-atlas text-[13px] font-bold text-[#3c230f] pt-2">
                {renderInline(block.text)}
              </h5>
            );
          case 'hr':
            return <hr key={idx} className="border-[#d8bc8a] my-2" />;
          case 'tip':
            return (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950"
              >
                {renderInline(block.text)}
              </div>
            );
          case 'quote':
            return (
              <div
                key={idx}
                className="pl-3 py-0.5 border-l-2 border-[#a87e45] text-[#54371b] bg-[#fbf3df]/70 rounded-r"
              >
                {renderInline(block.text)}
              </div>
            );
          case 'ol-item':
            return (
              <div key={idx} className="flex gap-2 pl-1">
                <span className="font-bold text-[#6e451b] shrink-0">{block.num}.</span>
                <div className="flex-1">{renderInline(block.text)}</div>
              </div>
            );
          case 'ul-item':
            return (
              <div key={idx} className="flex gap-2 pl-2">
                <span className="text-[#8a5a24] shrink-0">•</span>
                <div className="flex-1">{renderInline(block.text)}</div>
              </div>
            );
          case 'nested-ul-item':
            return (
              <div key={idx} className="flex gap-2 pl-7">
                <span className="text-[#8a5a24] shrink-0">◦</span>
                <div className="flex-1">{renderInline(block.text)}</div>
              </div>
            );
          default:
            return <p key={idx}>{renderInline(block.text)}</p>;
        }
      })}
    </article>
  );
}
