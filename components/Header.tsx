'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

interface Props {
  lang: Locale;
  dict: Dictionary['nav'];
}

export default function Header({ lang, dict }: Props) {
  const pathname = usePathname();
  const [articleMenuOpen, setArticleMenuOpen] = useState(false);

  // Build a path for the current page in another locale
  const switchLocalePath = (targetLang: Locale) => {
    // pathname is like /zh/articles or /en/photos
    const segments = pathname.split('/');
    segments[1] = targetLang; // replace lang segment
    return segments.join('/') || `/${targetLang}`;
  };

  const isActive = (path: string) => {
    const withLang = `/${lang}${path}`;
    return path === '/' ? pathname === `/${lang}` || pathname === `/${lang}/` : pathname.startsWith(withLang);
  };

  const ARTICLE_LINKS = [
    { label: dict.frontend, href: `/articles?category=frontend` },
    { label: dict.backend, href: `/articles?category=backend` },
    { label: dict.english, href: `/articles?category=english` },
    { label: dict.diary, href: `/articles?category=diary` },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-black/6 dark:border-white/6">
      <nav className="container h-full flex items-center justify-between">
        <Link
          href={`/${lang}`}
          className="text-sm font-semibold tracking-tight text-black dark:text-white hover:opacity-70 transition-opacity"
        >
          JWQ
        </Link>

        <div className="flex items-center gap-1">
          <ul className="flex items-center gap-1 text-sm">
            {/* Articles dropdown */}
            <li className="relative">
              <button
                className={`px-3 py-1.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/8 ${
                  isActive('/articles') ? 'text-black dark:text-white font-medium' : 'text-zinc-500 dark:text-zinc-400'
                }`}
                onMouseEnter={() => setArticleMenuOpen(true)}
                onMouseLeave={() => setArticleMenuOpen(false)}
                onClick={() => setArticleMenuOpen((v) => !v)}
              >
                {dict.articles}
              </button>
              {articleMenuOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-28 rounded-lg border border-black/6 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-lg py-1"
                  onMouseEnter={() => setArticleMenuOpen(true)}
                  onMouseLeave={() => setArticleMenuOpen(false)}
                >
                  {ARTICLE_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={`/${lang}${item.href}`}
                      className="block px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-black/4 dark:hover:bg-white/6 transition-colors"
                      onClick={() => setArticleMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {[
              { label: dict.photos, href: '/photos' },
              { label: dict.about, href: '/about' },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={`/${lang}${link.href}`}
                  className={`px-3 py-1.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/8 ${
                    isActive(link.href) ? 'text-black dark:text-white font-medium' : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Language switcher */}
          <div className="ml-3 flex items-center gap-1 text-xs border-l border-black/10 dark:border-white/10 pl-3">
            {(['zh', 'en'] as Locale[]).map((l) => (
              <Link
                key={l}
                href={switchLocalePath(l)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  lang === l
                    ? 'text-black dark:text-white font-semibold'
                    : 'text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {l === 'zh' ? '中' : 'EN'}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
