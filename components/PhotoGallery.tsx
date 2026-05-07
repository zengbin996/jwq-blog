'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Props {
  urls: string[];
  alts: string[];
  title: string | null;
  takenAt: string | null;
  location: string | null;
  lang: string;
}

export default function PhotoGallery({ urls, alts, title, takenAt, location, lang }: Props) {
  if (urls.length === 0) return null;

  const isMulti = urls.length > 1;
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => setLightbox((i) => (i != null ? (i - 1 + urls.length) % urls.length : null)), [urls.length]);
  const next = useCallback(() => setLightbox((i) => (i != null ? (i + 1) % urls.length : null)), [urls.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, close, prev, next]);

  return (
    <>
      {/* Card */}
      <div
        className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 cursor-pointer"
        onClick={() => setLightbox(0)}
      >
        <Image
          src={urls[0]}
          alt={alts[0] ?? title ?? ''}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isMulti && (
          <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-md backdrop-blur-sm">
            +{urls.length}
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100">
          {title && <p className="text-white text-xs font-medium line-clamp-1">{title}</p>}
          {takenAt && (
            <p className="text-white/70 text-xs">
              {new Date(takenAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US')}
            </p>
          )}
          {location && <p className="text-white/70 text-xs">{location}</p>}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none"
            onClick={close}
          >
            ×
          </button>

          {/* Counter */}
          {isMulti && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {lightbox + 1} / {urls.length}
            </div>
          )}

          {/* Prev */}
          {isMulti && (
            <button
              className="absolute left-4 text-white/60 hover:text-white text-4xl px-4 py-2"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            className="relative"
            style={{ width: '90vw', height: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={urls[lightbox]}
              alt={alts[lightbox] ?? title ?? ''}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Next */}
          {isMulti && (
            <button
              className="absolute right-4 text-white/60 hover:text-white text-4xl px-4 py-2"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              ›
            </button>
          )}

          {/* Caption */}
          {(title || takenAt || location) && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-white/70 space-y-0.5">
              {title && <p className="text-white font-medium">{title}</p>}
              <p>
                {takenAt && new Date(takenAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US')}
                {location && ` · ${location}`}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
