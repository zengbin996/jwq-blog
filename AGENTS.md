<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Agent Guidelines for This Project

## Framework Rules

- **Next.js 16 App Router** — always check `node_modules/next/dist/docs/` before writing routing or data-fetching code
- **`'use cache'`** replaces `fetch` cache options — requires `experimental.cacheComponents: true` in `next.config.ts`
- **`dynamic(..., { ssr: false })`** only works inside `'use client'` components — use a Client Component wrapper (see `FootprintMapLoader.tsx`)
- **`proxy.ts`** replaces `middleware.ts` — use `export function proxy()` not `export function middleware()`
- **`PageProps<'/[lang]'>`** and **`LayoutProps<'/[lang]'>`** are globally available TypeScript helpers for typed route params

## Strapi 5 Rules

- `populate` must use array format: `populate[0]=cover&populate[1]=category` — **comma-separated strings are rejected with 400**
- Relation fields return `null` when empty, never `[]` — always guard with `?.` or `?? []`
- `draftAndPublish` collections don't need `filters[publishedAt][$notNull]` — Strapi 5 handles this automatically

## Tailwind CSS v4 Rules

- `container` must be defined via `@utility container` in `globals.css` — no `tailwind.config.js`
- Use canonical class names: `border-black/6` not `border-black/[.06]`, `h-100` not `h-[400px]`

## i18n Rules

- All pages live under `app/[lang]/` — never create pages at `app/` root level (except `layout.tsx`)
- Always call `hasLocale(lang)` and `notFound()` at the top of every `[lang]` page
- All UI strings come from `dictionaries/zh.json` and `dictionaries/en.json` — no hardcoded Chinese/English text in components
- Links must include the locale prefix: `/${lang}/articles` not `/articles`

## General Rules

- `world.json` in `public/` is generated from `world-atlas` — if deleted, regenerate with the command in `CLAUDE.md`
- `react-simple-maps` has no official `@types` package — use `types/react-simple-maps.d.ts`
