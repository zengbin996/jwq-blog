import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import Header from '@/components/Header';
import { LOCALES, hasLocale, getDictionary } from '@/lib/i18n';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: { default: lang === 'zh' ? 'JWQ 的个人博客' : "JWQ's Blog", template: '%s | JWQ' },
    description: dict.home.hero_desc,
  };
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<'/[lang]'> & { children: React.ReactNode }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header lang={lang} dict={dict.nav} />
        <main className="flex-1 pt-14">{children}</main>
        <footer className="border-t border-black/6 dark:border-white/6 py-6 mt-8">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400">
            <span>© 2025 JWQ. All rights reserved.</span>
            <span>Built with Next.js & Tailwind CSS</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
