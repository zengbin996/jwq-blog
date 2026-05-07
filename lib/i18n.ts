import 'server-only';

export const LOCALES = ['zh', 'en'] as const;
export const DEFAULT_LOCALE = 'zh' as const;
export type Locale = (typeof LOCALES)[number];

export const hasLocale = (locale: string): locale is Locale =>
  (LOCALES as readonly string[]).includes(locale);

const dictionaries = {
  zh: () => import('@/dictionaries/zh.json').then((m) => m.default),
  en: () => import('@/dictionaries/en.json').then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<typeof dictionaries['zh']>>;

export const getDictionary = (locale: Locale) => dictionaries[locale]();

/** Replace {key} placeholders */
export function t(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replace(`{${k}}`, String(v)),
    template,
  );
}
