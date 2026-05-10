@AGENTS.md

# 项目概览

**jwq-personal-blog** — Next.js 16 App Router 个人博客，Strapi CMS 后端，SSG 静态生成。

后端项目：`C:\Users\hello\Desktop\WWW\jwq-strapi`

---

## 技术栈

- **Next.js 16** App Router + `'use cache'`（需 `experimental.cacheComponents: true`）
- **Tailwind CSS v4** — `container` 在 `globals.css` 用 `@utility container`，最大宽度 1536px
- **react-simple-maps** — 世界地图，数据在 `public/world.json`
- **next-themes** — 深色/浅色模式，`ThemeProvider` 包裹全局
- **多语言** — `zh` / `en`，字典在 `dictionaries/`

---

## 路由结构

```
proxy.ts                        → locale 检测重定向
app/[lang]/layout.tsx           → 根 layout（Header + Footer + ThemeProvider）
app/[lang]/page.tsx             → 首页
app/[lang]/articles/page.tsx    → 文章列表
app/[lang]/articles/[slug]/     → 文章详情
app/[lang]/photos/page.tsx      → 相册
app/[lang]/about/page.tsx       → 关于我
```

---

## 关键文件

| 文件 | 说明 |
|------|------|
| `lib/api.ts` | 所有 Strapi 请求，函数内用 `'use cache'` |
| `lib/i18n.ts` | `LOCALES`, `getDictionary`, `hasLocale`, `t()` |
| `components/Header.tsx` | Client，接收 `lang` + `dict.nav` + `categories`，含文章分类下拉菜单和语言切换 |
| `components/JustifiedGrid.tsx` | Client，Justified 排版照片网格，移动端降级为 2 列 |
| `components/FootprintMap.tsx` | Client，react-simple-maps 地图 + 水波标记 |
| `components/FootprintMapLoader.tsx` | `dynamic({ssr:false})` 包装层 |
| `components/ThemeProvider.tsx` | next-themes 包装层 |
| `dictionaries/zh.json` / `en.json` | 所有 UI 文案 |

---

## Strapi API

- **Strapi 5**，`populate` 必须用数组：`populate[0]=x&populate[1]=y`
- 关联字段为空返回 `null` 不是 `[]`，必须用 `?.` 或 `?? []`
- 环境变量：`STRAPI_URL`（默认 `http://localhost:1337`）、`STRAPI_TOKEN`

### 数据模型

| Collection | 关键字段 |
|------------|---------|
| article | title, content(md), cover, category(→article-category), published, featured |
| article-category | name, order, parent(自关联), children |
| photo | title, image(StrapiMedia[], 多图), takenAt, featured, coverIndex, footprint, categories |
| featured-photo | image(StrapiMedia), priority — 首页精选独立 collection |
| footprint | name, latitude, longitude, city, country, visitedAt |
| category | name, slug（照片分类） |

---

## 首页结构

1. **Hero** — 大标题 + 文章/照片 CTA 按钮
2. **旅行足迹** — `getFootprints()` + 地图 + 城市标签列表
3. **为什么要旅游** — 4 列 Motto 卡片，文案来自字典
4. **精选照片** — `getFeaturedPhotos()` + `JustifiedGrid`（targetHeight=420）

---

## 注意事项

- `photo.image` 是 `StrapiMedia[] | null`（多图数组），取封面用 `image[coverIndex ?? 0]`
- `getFeaturedPhotos()` 取首页精选，对应 `/featured-photos` collection，与 `getPhotos({featured:true})` 不同
- `world.json` 重新生成：
  ```bash
  node --input-type=module -e "
  import { feature } from 'topojson-client';
  import { readFileSync, writeFileSync } from 'fs';
  const topo = JSON.parse(readFileSync('./node_modules/world-atlas/countries-110m.json', 'utf8'));
  writeFileSync('./public/world.json', JSON.stringify(feature(topo, topo.objects.countries)));
  "
  ```
