# JWQ 个人博客

基于 Next.js 16 App Router 构建的个人博客网站，内容通过 Strapi 5 CMS 管理，构建时静态生成（SSG），支持中英文多语言。

## 功能页面

- **首页** — 旅行足迹世界地图（水波标记）、旅游感悟卡片、精选照片拼接展示
- **文章** — 学习笔记（前端 / 后端 / 英语）与随笔日记，按分类 Tab 筛选，构建时静态生成
- **相册** — 按年份分组展示所有照片
- **关于我** — 个人简介与技能标签
- **多语言** — 中文（`/zh/`）/ 英文（`/en/`），浏览器自动检测跳转

## 技术栈

| 技术 | 用途 |
|------|------|
| [Next.js 16](https://nextjs.org) | App Router + `'use cache'` 静态预渲染 |
| [Tailwind CSS v4](https://tailwindcss.com) | 样式，container 最大宽度 1536px |
| [Strapi 5](https://strapi.io) | 后端 CMS（独立项目 `jwq-strapi`） |
| [react-simple-maps](https://www.react-simple-maps.io) | 世界地图可视化 |

## 本地开发

```bash
# 1. 复制环境变量
cp .env.local.example .env.local
# 填入 STRAPI_URL 和 STRAPI_TOKEN

# 2. 启动（需先启动 Strapi）
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)，自动跳转到 `/zh` 或 `/en`。

## 构建

```bash
npm run build   # 构建时从 Strapi 拉取数据，静态生成所有页面
npm run start
```

## 环境变量

参考 `.env.local.example`：

```
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your_token
```

## 项目结构

```
app/[lang]/          # 多语言页面（zh / en）
components/          # Header, FootprintMap, FootprintMapLoader
lib/api.ts           # Strapi 数据请求
lib/i18n.ts          # 多语言工具函数
dictionaries/        # zh.json / en.json 文案
public/world.json    # 世界地图 GeoJSON
types/               # 手写类型声明
```
