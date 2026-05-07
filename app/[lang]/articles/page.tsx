import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArticles, getArticleCategories, mediaUrl, type Article } from '@/lib/api';
import { hasLocale, getDictionary, t } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[lang]/articles'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.articles.title };
}

function readingTime(content: string | null, minLabel: string): string {
  if (!content) return t(minLabel, { min: 1 });
  const words = content.replace(/[^\u4e00-\u9fa5\w]/g, '').length;
  return t(minLabel, { min: Math.max(1, Math.ceil(words / 400)) });
}

function ArticleCard({ article, lang, readTimeLabel }: { article: Article; lang: string; readTimeLabel: string }) {
  return (
    <Link
      href={`/${lang}/articles/${article.documentId}`}
      className="group flex gap-4 py-6 border-b border-black/6 dark:border-white/6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 -mx-4 px-4 rounded-xl transition-colors"
    >
      {article.cover && (
        <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image src={mediaUrl(article.cover)} alt={article.title} width={80} height={80} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex flex-col gap-1 min-w-0">
        <h2 className="font-semibold text-base leading-snug group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-2">
          {article.title}
        </h2>
        {article.content && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {article.content.replace(/[#*`>\-\[\]]/g, '').trim()}
          </p>
        )}
        <div className="flex items-center gap-3 mt-auto text-xs text-zinc-400 dark:text-zinc-500">
          <span>{new Date(article.createdAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US')}</span>
          <span>·</span>
          <span>{readingTime(article.content, readTimeLabel)}</span>
          {article.category && <><span>·</span><span>{article.category.name}</span></>}
        </div>
      </div>
    </Link>
  );
}

export default async function ArticlesPage({ params, searchParams }: PageProps<'/[lang]/articles'> & { searchParams: Promise<{ category?: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { category: categorySlug } = await searchParams;
  const [articles, categories, dict] = await Promise.all([
    getArticles(), getArticleCategories(), getDictionary(lang),
  ]);

  const rootCategories = categories.filter((c) => !c.parent);
  const filtered = categorySlug
    ? articles.filter((a) => a.category?.name.toLowerCase() === categorySlug || a.category?.parent?.name.toLowerCase() === categorySlug)
    : articles;

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{dict.articles.title}</h1>
      <div className="flex flex-wrap gap-2 mb-10">
        <Link href={`/${lang}/articles`} className={`px-4 py-1.5 rounded-full text-sm transition-colors ${!categorySlug ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>
          {dict.articles.all}
        </Link>
        {rootCategories.map((cat) => (
          <Link key={cat.id} href={`/${lang}/articles?category=${encodeURIComponent(cat.name.toLowerCase())}`}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${categorySlug === cat.name.toLowerCase() ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>
            {cat.name}
          </Link>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-zinc-400 text-sm">{dict.articles.no_articles}</p>
      ) : (
        <div>
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} lang={lang} readTimeLabel={dict.articles.read_time} />
          ))}
        </div>
      )}
    </div>
  );
}
