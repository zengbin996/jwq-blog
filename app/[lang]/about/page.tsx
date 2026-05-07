import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { hasLocale, getDictionary } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[lang]/about'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.about.title };
}

const SKILLS = ['TypeScript', 'React', 'Next.js', 'Node.js', 'Strapi', 'Tailwind CSS', 'English'];

export default async function AboutPage({ params }: PageProps<'/[lang]/about'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-10">{dict.about.title}</h1>
      <section className="flex flex-col sm:flex-row gap-8 mb-12">
        <div className="shrink-0 w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden" />
        <div>
          <h2 className="text-xl font-semibold mb-2">JWQ</h2>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{dict.about.desc}</p>
          <div className="flex gap-3 mt-4">
            <Link href={`/${lang}/articles`} className="text-sm text-zinc-500 hover:text-black dark:hover:text-white transition-colors">{dict.nav.articles} →</Link>
            <Link href={`/${lang}/photos`} className="text-sm text-zinc-500 hover:text-black dark:hover:text-white transition-colors">{dict.nav.photos} →</Link>
          </div>
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">{dict.about.skills}</h3>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <span key={skill} className="px-3 py-1 rounded-full text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">{skill}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
