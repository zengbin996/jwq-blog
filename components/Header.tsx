'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import type { Dictionary, Locale } from '@/lib/i18n';
import type { ArticleCategory } from '@/lib/api';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <span className="w-8 h-8" />;
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      )}
    </button>
  );
}

interface Props {
  lang: Locale;
  dict: Dictionary['nav'];
  categories: ArticleCategory[];
}

export default function Header({ lang, dict, categories }: Props) {
  const pathname = usePathname();
  const [articleMenuOpen, setArticleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  const switchLocalePath = (targetLang: Locale) => {
    const segments = pathname.split('/');
    segments[1] = targetLang;
    return segments.join('/') || `/${targetLang}`;
  };

  const isActive = (path: string) => {
    const withLang = `/${lang}${path}`;
    return path === '/' ? pathname === `/${lang}` || pathname === `/${lang}/` : pathname.startsWith(withLang);
  };

  const rootCategories = categories.filter((c) => !c.parent);

  const navLinkClass = (path: string) =>
    `px-3 py-1.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/8 ${
      isActive(path) ? 'text-black dark:text-white font-medium' : 'text-zinc-500 dark:text-zinc-400'
    }`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-black/6 dark:border-white/6">
        <nav className="container h-full flex items-center justify-between">
          <Link
            href={`/${lang}`}
            className="text-sm font-semibold tracking-tight text-black dark:text-white hover:opacity-70 transition-opacity"
          >
            JWQ
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <ul className="flex items-center gap-1 text-sm">
              <li
                className="relative"
                onMouseEnter={() => setArticleMenuOpen(true)}
                onMouseLeave={() => setArticleMenuOpen(false)}
              >
                <button
                  className={navLinkClass('/articles')}
                  onClick={() => setArticleMenuOpen((v) => !v)}
                >
                  {dict.articles}
                </button>
                {articleMenuOpen && (
                  <>
                    <div className="absolute top-full left-0 right-0 h-1" />
                    <div className="absolute top-full mt-1 left-0 w-32 rounded-lg border border-black/6 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-lg py-1">
                      <Link
                        href={`/${lang}/articles`}
                        className="block px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-black/4 dark:hover:bg-white/6 transition-colors"
                        onClick={() => setArticleMenuOpen(false)}
                      >
                        {dict.articles}
                      </Link>
                      {rootCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/${lang}/articles?category=${encodeURIComponent(cat.name.toLowerCase())}`}
                          className="block px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-black/4 dark:hover:bg-white/6 transition-colors"
                          onClick={() => setArticleMenuOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </li>
              {[
                { label: dict.photos, href: '/photos' },
                { label: dict.about, href: '/about' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={`/${lang}${link.href}`} className={navLinkClass(link.href)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ThemeToggle />

            <div className="ml-3 flex items-center gap-1 text-xs border-l border-black/10 dark:border-white/10 pl-3">
              {(['zh', 'en'] as Locale[]).map((l) => (
                <Link
                  key={l}
                  href={switchLocalePath(l)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    lang === l ? 'text-black dark:text-white font-semibold' : 'text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {l === 'zh' ? '中' : 'EN'}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed top-14 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-black/6 dark:border-white/6 md:hidden">
          <nav className="container py-3 flex flex-col text-sm">
            <Link
              href={`/${lang}/articles`}
              className={`px-3 py-2.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
                isActive('/articles') ? 'text-black dark:text-white font-medium' : 'text-zinc-600 dark:text-zinc-300'
              }`}
            >
              {dict.articles}
            </Link>
            {rootCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${lang}/articles?category=${encodeURIComponent(cat.name.toLowerCase())}`}
                className="pl-7 pr-3 py-2 rounded-md text-zinc-400 dark:text-zinc-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            {[
              { label: dict.photos, href: '/photos' },
              { label: dict.about, href: '/about' },
            ].map((link) => (
              <Link
                key={link.href}
                href={`/${lang}${link.href}`}
                className={`px-3 py-2.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
                  isActive(link.href) ? 'text-black dark:text-white font-medium' : 'text-zinc-600 dark:text-zinc-300'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 pt-2 border-t border-black/6 dark:border-white/6 flex items-center gap-1 px-2">
              {(['zh', 'en'] as Locale[]).map((l) => (
                <Link
                  key={l}
                  href={switchLocalePath(l)}
                  className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                    lang === l ? 'text-black dark:text-white font-semibold bg-black/5 dark:bg-white/8' : 'text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {l === 'zh' ? '中文' : 'English'}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
