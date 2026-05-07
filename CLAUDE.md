@AGENTS.md

# 项目概览

**jwq-personal-blog** — 基于 Next.js 16 App Router 的个人博客，内容通过 Strapi CMS 管理，构建时静态生成（SSG）。

后端项目：`C:\Users\Nick\Desktop\WWW\MYSELF\jwq-strapi`

---

## 技术栈

- **Next.js 16** App Router + `'use cache'` 静态预渲染（需在 next.config.ts 开启 `experimental.cacheComponents: true`）
- **Tailwind CSS v4** — container 在 globals.css 用 `@utility container` 自定义，最大宽度 1536px（适配 1920px 屏幕）
- **react-simple-maps** — 世界地图组件，地图数据在 `public/world.json`（由 world-atlas TopoJSON 转换生成）
- **多语言** — 中文 `zh` / 英文 `en`，路由前缀 `/zh/` `/en/`，字典文件在 `dictionaries/zh.json` `dictionaries/en.json`

---

## 路由结构

```
proxy.ts                     → locale 检测，自动重定向到 /zh 或 /en
app/layout.tsx               → 最简根 layout（仅 return children）
app/[lang]/layout.tsx        → 带 Header 的真实根 layout
app/[lang]/page.tsx          → 首页
app/[lang]/articles/page.tsx → 文章列表
app/[lang]/articles/[slug]/  → 文章详情（generateStaticParams 静态生成）
app/[lang]/photos/page.tsx   → 相册
app/[lang]/about/page.tsx    → 关于我
```

---

## 关键文件

| 文件 | 说明 |
|------|------|
| `lib/api.ts` | 所有 Strapi 请求，函数内用 `'use cache'` |
| `lib/i18n.ts` | `LOCALES`, `getDictionary`, `hasLocale`, `t()` |
| `components/Header.tsx` | Client Component，接收 `lang` 和 `dict` props，含语言切换 |
| `components/FootprintMap.tsx` | Client Component，react-simple-maps 世界地图 + 水波标记 |
| `components/FootprintMapLoader.tsx` | `'use client'` 包装层，用 `dynamic(..., {ssr:false})` 加载地图 |
| `dictionaries/zh.json` / `en.json` | 所有 UI 文案 |
| `types/react-simple-maps.d.ts` | 手写类型声明（无官方 @types 包）|
| `public/world.json` | 世界地图 GeoJSON，177 个国家 |

---

## Strapi API 说明

- **Strapi 版本 5**，populate 必须用数组格式：`populate[0]=cover&populate[1]=category`，**不支持逗号分隔**
- 关联字段为空时返回 `null` 而非 `[]`，访问前必须用 `?.` 或 `?? []`
- 环境变量：`STRAPI_URL`（默认 `http://localhost:1337`）、`STRAPI_TOKEN`

### Strapi 数据模型

| Collection | 关键字段 |
|------------|---------|
| article | title, content(markdown), cover, category(→article-category), tags, published, featured |
| article-category | name, order, parent(自关联), children |
| photo | title, image(多图), takenAt, featured, footprint(→footprint), categories(→category) |
| footprint | name, latitude, longitude, city, country, visitedAt |
| category | name, slug（照片分类） |

---

## 首页结构

1. **Hero** — 大标题 + 两个 CTA 按钮
2. **旅行足迹** — `getFootprints()` + react-simple-maps 世界地图（scale:750, center:[108,35]），水波标记
3. **为什么要旅游** — 4 列卡片（Motto），文案来自字典
4. **精选照片** — `getPhotos({featured:true})`，4 行交错布局

---

## 注意事项

- `'use cache'` 需要在 `next.config.ts` 的 `experimental.cacheComponents: true` 才能使用
- `dynamic(..., {ssr:false})` 只能在 Client Component (`'use client'`) 中使用，已通过 `FootprintMapLoader.tsx` 解决
- world.json 删除后可用以下命令重新生成：
  ```bash
  node --input-type=module -e "
  import { feature } from 'topojson-client';
  import { readFileSync, writeFileSync } from 'fs';
  const topo = JSON.parse(readFileSync('./node_modules/world-atlas/countries-110m.json', 'utf8'));
  const geojson = feature(topo, topo.objects.countries);
  writeFileSync('./public/world.json', JSON.stringify(geojson));
  "
  ```
- Tailwind v4 中 `container` 需在 `globals.css` 用 `@utility container` 自定义，不能用 `tailwind.config.js`
