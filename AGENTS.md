# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

---

# Agent Guidelines for This Project

## Framework Rules

- **Next.js 16 App Router** — check `node_modules/next/dist/docs/` before writing routing or data-fetching code
- **`'use cache'`** replaces `fetch` cache options — requires `experimental.cacheComponents: true` in `next.config.ts`
- **`dynamic(..., { ssr: false })`** only works inside `'use client'` — use a Client Component wrapper (see `FootprintMapLoader.tsx`)
- **`proxy.ts`** replaces `middleware.ts` — use `export function proxy()` not `export function middleware()`
- **`PageProps<'/[lang]'>`** and **`LayoutProps<'/[lang]'>`** are globally available TypeScript helpers

## Strapi 5 Rules

- `populate` must use array format: `populate[0]=cover&populate[1]=category` — comma-separated strings cause 400
- Relation fields return `null` when empty, never `[]` — guard with `?.` or `?? []`
- `photo.image` is `StrapiMedia[] | null` (multi-image array) — use `image?.[coverIndex ?? 0]` for the cover
- `draftAndPublish` collections don't need `filters[publishedAt][$notNull]` — Strapi 5 handles it

## Tailwind CSS v4 Rules

- `container` must be defined via `@utility container` in `globals.css` — no `tailwind.config.js`
- Use canonical class names: `border-black/6`, `h-100`, not `border-black/[.06]`, `h-[400px]`

## i18n Rules

- All pages live under `app/[lang]/` — never create pages at `app/` root level (except `layout.tsx`)
- Always call `hasLocale(lang)` and `notFound()` at the top of every `[lang]` page
- All UI strings come from `dictionaries/zh.json` and `dictionaries/en.json` — no hardcoded text in components
- Links must include locale prefix: `/${lang}/articles` not `/articles`

## General Rules

- `world.json` in `public/` is generated from `world-atlas` — see `CLAUDE.md` for the regeneration command
- `react-simple-maps` has no official `@types` — use `types/react-simple-maps.d.ts`
- `Header` receives `categories: ArticleCategory[]` from layout — do not fetch categories inside Header
