import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPhotos, mediaUrl } from '@/lib/api';
import { hasLocale, getDictionary } from '@/lib/i18n';
import PhotosClient, { type PhotoItem } from '@/components/PhotosClient';

export async function generateMetadata({ params }: PageProps<'/[lang]/photos'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.photos.title };
}

export default async function PhotosPage({ params }: PageProps<'/[lang]/photos'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const [photos, dict] = await Promise.all([getPhotos(), getDictionary(lang)]);

  const items: PhotoItem[] = photos.map((photo) => {
    const imgs = photo.image ?? [];
    const year = photo.takenAt
      ? new Date(photo.takenAt).getFullYear().toString()
      : photo.publishedAt
        ? new Date(photo.publishedAt).getFullYear().toString()
        : '—';
    return {
      id: photo.id,
      urls: imgs.map(mediaUrl),
      alts: imgs.map((m) => m.alternativeText ?? ''),
      title: photo.title,
      takenAt: photo.takenAt,
      location: photo.footprint ? (photo.footprint.city ?? photo.footprint.name) : null,
      country: photo.footprint?.country ?? null,
      year,
      categories: (photo.categories ?? []).map((c) => c.name),
    };
  });

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-10">{dict.photos.title}</h1>
      <PhotosClient
        photos={items}
        lang={lang}
        dict={{
          count: dict.photos.count,
          count_group: dict.photos.count_group,
          no_photos: dict.photos.no_photos,
          filter_all: dict.photos.filter_all,
          filter_year: dict.photos.filter_year,
          filter_region: dict.photos.filter_region,
          filter_category: dict.photos.filter_category,
        }}
      />
    </div>
  );
}
