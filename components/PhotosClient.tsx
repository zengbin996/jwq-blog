'use client';

import { useState, useMemo } from 'react';
import PhotoGallery from './PhotoGallery';

export interface PhotoItem {
  id: number;
  urls: string[];
  alts: string[];
  title: string | null;
  takenAt: string | null;
  location: string | null;
  country: string | null;
  year: string;
  categories: string[];
}

interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  photos: PhotoItem[];
  lang: string;
  dict: {
    count: string;
    count_group: string;
    no_photos: string;
    filter_all: string;
    filter_year: string;
    filter_region: string;
    filter_category: string;
  };
}

function FilterBar({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0">{label}</span>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            value === o.value
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function t(template: string, vars: Record<string, number | string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

export default function PhotosClient({ photos, lang, dict }: Props) {
  const [year, setYear] = useState('');
  const [region, setRegion] = useState('');
  const [category, setCategory] = useState('');

  // Build filter options
  const years = useMemo<FilterOption[]>(() => {
    const all = [...new Set(photos.map((p) => p.year).filter((y) => y !== '—'))].sort((a, b) => b.localeCompare(a));
    return [{ value: '', label: dict.filter_all }, ...all.map((y) => ({ value: y, label: y }))];
  }, [photos, dict.filter_all]);

  const regions = useMemo<FilterOption[]>(() => {
    const all = [...new Set(photos.map((p) => p.country).filter(Boolean) as string[])].sort();
    if (all.length === 0) return [];
    return [{ value: '', label: dict.filter_all }, ...all.map((r) => ({ value: r, label: r }))];
  }, [photos, dict.filter_all]);

  const categories = useMemo<FilterOption[]>(() => {
    const all = [...new Set(photos.flatMap((p) => p.categories))].sort();
    if (all.length === 0) return [];
    return [{ value: '', label: dict.filter_all }, ...all.map((c) => ({ value: c, label: c }))];
  }, [photos, dict.filter_all]);

  // Filter
  const filtered = useMemo(() => {
    return photos.filter((p) => {
      if (year && p.year !== year) return false;
      if (region && p.country !== region) return false;
      if (category && !p.categories.includes(category)) return false;
      return true;
    });
  }, [photos, year, region, category]);

  // Group by year
  const groups = useMemo(() => {
    const map = new Map<string, PhotoItem[]>();
    for (const p of filtered) {
      const g = map.get(p.year) ?? [];
      g.push(p);
      map.set(p.year, g);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const hasFilters = regions.length > 0 || categories.length > 0;

  return (
    <>
      {/* Filter bar */}
      {hasFilters && (
        <div className="mb-8 flex flex-col gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/6 dark:border-white/6">
          <FilterBar label={dict.filter_year} options={years} value={year} onChange={setYear} />
          {regions.length > 0 && (
            <FilterBar label={dict.filter_region} options={regions} value={region} onChange={setRegion} />
          )}
          {categories.length > 0 && (
            <FilterBar label={dict.filter_category} options={categories} value={category} onChange={setCategory} />
          )}
        </div>
      )}

      {/* Count */}
      <p className="text-sm text-zinc-400 mb-8">{t(dict.count, { count: filtered.length })}</p>

      {/* Grid */}
      {groups.length === 0 ? (
        <p className="text-zinc-400 text-sm">{dict.no_photos}</p>
      ) : (
        <div className="space-y-16">
          {groups.map(([y, groupPhotos]) => (
            <section key={y}>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <span>{y}</span>
                <span className="text-sm font-normal text-zinc-400">{t(dict.count_group, { count: groupPhotos.length })}</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {groupPhotos.map((photo) => (
                  <PhotoGallery
                    key={photo.id}
                    urls={photo.urls}
                    alts={photo.alts}
                    title={photo.title}
                    takenAt={photo.takenAt}
                    location={photo.location}
                    lang={lang}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
