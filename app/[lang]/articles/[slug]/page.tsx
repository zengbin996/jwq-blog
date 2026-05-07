import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getArticle, getArticles, mediaUrl } from '@/lib/api';
import { hasLocale, getDictionary } from '@/lib/i18n';
import MarkdownContent from '@/components/MarkdownContent';

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.flatMap((a) => [
    { lang: 'zh', slug: a.documentId },
    { lang: 'en', slug: a.documentId },
  ]);
}

export async function generateMetadata({ params }: PageProps<'/[lang]/articles/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.content?.slice(0, 160).replace(/[#*`>\-\[\]]/g, '').trim(),
  };
}

export default async function ArticlePage({ params }: PageProps<'/[lang]/articles/[slug]'>) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const [article, dict] = await Promise.all([getArticle(slug), getDictionary(lang)]);
  if (!article) notFound();

  const breadcrumbs = [];
  if (article.category?.parent) breadcrumbs.push(article.category.parent.name);
  if (article.category) breadcrumbs.push(article.category.name);

  return (
    <article className="container py-12 max-w-3xl">
      <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-8">
        <Link href={`/${lang}/articles`} className="hover:text-black dark:hover:text-white transition-colors">
          {dict.articles.title}
        </Link>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2"><span>/</span><span>{crumb}</span></span>
        ))}
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">{article.title}</h1>
        <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          <time dateTime={article.createdAt}>
            {new Date(article.createdAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          {article.tags && article.tags.length > 0 && (
            <><span>·</span>
              <div className="flex gap-1.5 flex-wrap">
                {article.tags.map((tag) => <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-zinc-100 dark:bg-zinc-800">{tag}</span>)}
              </div>
            </>
          )}
        </div>
      </header>

      {article.cover && (
        <div className="mb-10 rounded-2xl overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-900">
          <Image src={mediaUrl(article.cover)} alt={article.title} width={800} height={450} className="w-full h-full object-cover" priority />
        </div>
      )}

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        {article.content ? (
          <MarkdownContent content={article.content} />
        ) : (
          <p className="text-zinc-400">暂无内容</p>
        )}
      </div>

      <div className="mt-16 pt-8 border-t border-black/6 dark:border-white/6">
        <Link href={`/${lang}/articles`} className="text-sm text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
          {dict.articles.back}
        </Link>
      </div>
    </article>
  );
}
