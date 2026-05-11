'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

export interface JustifiedItem {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
  title?: string | null;
}

interface Row {
  items: JustifiedItem[];
  height: number;
  widths: number[];
}

function buildRows(items: JustifiedItem[], containerWidth: number, targetHeight: number, gap: number): Row[] {
  const rows: Row[] = [];
  let rowItems: JustifiedItem[] = [];

  for (const item of items) {
    const ar = item.width && item.height ? item.width / item.height : 1;
    rowItems.push(item);

    // Natural widths of current row items at targetHeight
    const naturalWidths = rowItems.map((it) => {
      const ratio = it.width && it.height ? it.width / it.height : 1;
      return targetHeight * ratio;
    });
    const totalNatural = naturalWidths.reduce((s, w) => s + w, 0);
    const totalGap = gap * (rowItems.length - 1);

    if (totalNatural + totalGap >= containerWidth) {
      // Scale row to fill container width exactly
      const scale = (containerWidth - totalGap) / totalNatural;
      const rowHeight = targetHeight * scale;
      rows.push({
        items: [...rowItems],
        height: rowHeight,
        widths: naturalWidths.map((w) => w * scale),
      });
      rowItems = [];
    }
  }
  // Drop last incomplete row — don't push rowItems

  return rows;
}

interface Props {
  items: JustifiedItem[];
  targetHeight?: number;
  gap?: number;
}

export default function JustifiedGrid({ items, targetHeight = 280, gap = 8 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<Row[]>([]);

  const [isMobile, setIsMobile] = useState(false);

  const recalculate = useCallback(() => {
    const width = containerRef.current?.clientWidth;
    if (!width) return;
    setIsMobile(width < 640);
    setRows(buildRows(items, width, targetHeight, gap));
  }, [items, targetHeight, gap]);

  useEffect(() => {
    recalculate();
    const observer = new ResizeObserver(recalculate);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [recalculate]);

  if (isMobile) {
    const mobileItems = items.length % 2 === 0 ? items : items.slice(0, -1);
    return (
      <div ref={containerRef} className="w-full grid grid-cols-2" style={{ gap }}>
        {mobileItems.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 group aspect-square"
          >
            <Image
              src={item.url}
              alt={item.alt}
              fill
              sizes="50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex flex-col" style={{ gap }}>
        {rows.map((row, ri) => (
          <div key={ri} className="flex overflow-hidden" style={{ gap, height: row.height }}>
            {row.items.map((item, ii) => (
              <div
                key={item.id}
                className="relative shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 group"
                style={{ width: row.widths[ii], height: row.height }}
              >
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
