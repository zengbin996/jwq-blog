const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN ?? '';

async function strapiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`/api${path}`, STRAPI_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
    next: { revalidate: false },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Strapi fetch failed: ${res.status} ${url}\n${body}`);
  }
  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
}

export interface ArticleCategory {
  id: number;
  documentId: string;
  name: string;
  order: number;
  description: string | null;
  parent: ArticleCategory | null;
  children: ArticleCategory[];
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  content: string | null; // markdown
  cover: StrapiMedia | null;
  category: ArticleCategory | null;
  tags: string[] | null;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Footprint {
  id: number;
  documentId: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  visitedAt: string | null;
  description: string | null;
  cover: StrapiMedia | null;
}

export interface PhotoCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  cover: StrapiMedia | null;
}

export interface Photo {
  id: number;
  documentId: string;
  title: string | null;
  image: StrapiMedia[] | null;
  takenAt: string | null;
  description: string | null;
  featured: boolean;
  order: number;
  coverIndex: number;
  footprint: Footprint | null;
  categories: PhotoCategory[];
  publishedAt: string | null;
}

// ─── Article API ──────────────────────────────────────────────────────────────

export async function getArticles(): Promise<Article[]> {
  'use cache';
  const data = await strapiGet<{ data: Article[] }>('/articles', {
    'populate[0]': 'cover',
    'populate[category][populate][0]': 'parent',
    'filters[published][$eq]': 'true',
    'sort': 'order:asc,createdAt:desc',
    'pagination[pageSize]': '200',
  });
  return data.data;
}

export async function getArticle(documentId: string): Promise<Article | null> {
  'use cache';
  const data = await strapiGet<{ data: Article }>(`/articles/${documentId}`, {
    'populate[0]': 'cover',
    'populate[category][populate][0]': 'parent',
  });
  return data.data ?? null;
}

export async function getArticleCategories(): Promise<ArticleCategory[]> {
  'use cache';
  const data = await strapiGet<{ data: ArticleCategory[] }>('/article-categories', {
    'populate[0]': 'parent',
    'populate[1]': 'children',
    'sort': 'order:asc',
    'pagination[pageSize]': '100',
  });
  return data.data;
}

export interface FeaturedPhoto {
  id: number;
  documentId: string;
  priority: number;
  image: StrapiMedia | null;
}

// ─── Photo API ────────────────────────────────────────────────────────────────

export async function getPhotos(params?: { featured?: boolean }): Promise<Photo[]> {
  'use cache';
  const query: Record<string, string> = {
    'populate[0]': 'image',
    'populate[1]': 'footprint',
    'populate[2]': 'categories',
    'pagination[pageSize]': '500',
  };
  if (params?.featured) {
    query['filters[featured][$eq]'] = 'true';
    query['sort'] = 'order:asc,takenAt:desc';
  } else {
    query['sort'] = 'takenAt:desc,order:asc';
  }
  const data = await strapiGet<{ data: Photo[] }>('/photos', query);
  return data.data;
}

export async function getFeaturedPhotos(): Promise<FeaturedPhoto[]> {
  'use cache';
  const data = await strapiGet<{ data: FeaturedPhoto[] }>('/featured-photos', {
    'populate': 'image',
    'sort': 'priority:asc',
    'pagination[pageSize]': '50',
  });
  return data.data;
}

export async function getPhotoCategories(): Promise<PhotoCategory[]> {
  'use cache';
  const data = await strapiGet<{ data: PhotoCategory[] }>('/categories', {
    'populate': 'cover',
    'sort': 'name:asc',
  });
  return data.data;
}

// ─── Footprint API ────────────────────────────────────────────────────────────

export async function getFootprints(): Promise<Footprint[]> {
  'use cache';
  const data = await strapiGet<{ data: Footprint[] }>('/footprints', {
    'populate': 'cover',
    'sort': 'visitedAt:desc',
    'pagination[pageSize]': '500',
  });
  return data.data;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function mediaUrl(media: StrapiMedia | null | undefined): string {
  if (!media) return '';
  if (media.url.startsWith('http')) return media.url;
  return `${STRAPI_URL}${media.url}`;
}
