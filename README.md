# Pourfolio

咖啡師活動媒合平台品牌網站，目前處於早期起步階段。
連結獨立咖啡師與品牌活動，讓每一次倒杯都成為難忘的品牌體驗。

## Tech Stack

| 工具 | 版本 | 用途 |
|------|------|------|
| Next.js（App Router） | ^16 | 框架、路由、建置工具 |
| React | ^19 | UI 框架 |
| TypeScript | ~6 | 型別安全 |
| Tailwind CSS | ^3.4 | Utility-first 樣式 |
| Framer Motion | ^12 | 頁面切換與動畫 |
| React Icons | ^5 | 圖示庫 |
| Sass | ^1 | 全域樣式補充 |

## 頁面結構

```
/           首頁       Hero 輪播、媒合流程、精選咖啡師、CTA
/about      品牌故事   創辦初衷、品牌核心價值、發展路線圖
/services   服務項目   四項服務說明（媒合、企劃協力、品牌聯名、常態方案）
/baristas   咖啡師     咖啡師列表、分類篩選、申請加入入口
/contact    聯絡我們   活動需求詢問表單
```

## 專案結構

```
src/
├── app/               App Router：layout.tsx、page.tsx、about/、services/、baristas/、contact/、not-found.tsx
├── assets/            圖片、SVG、靜態資源
├── components/        共用元件
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── PageTransition.tsx
├── types/             TypeScript 型別定義
└── styles/
    └── global.scss    Tailwind directives + 全域樣式
```

## 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器（http://localhost:3000）
npm run dev

# TypeScript 型別檢查 + 打包
npm run build

# 以 production 模式啟動打包結果
npm run start

# ESLint 檢查
npm run lint
```

## 部署

本專案部署於 **Vercel**。

**方式一：Vercel CLI**

```bash
npm i -g vercel
vercel
```

**方式二：GitHub 連動（推薦長期維護）**

1. 將專案推上 GitHub
2. 至 [vercel.com](https://vercel.com) → Import Git Repository
3. 選擇 repo → Deploy（Framework Preset 自動偵測為 Next.js）

每次推送至 `main` branch 將自動觸發重新部署。

## 品牌色彩

| 名稱 | HEX | 用途 |
|------|-----|------|
| `brown` | `#f77754` | 主品牌色、CTA、強調文字 |
| `olive` | `#584b42` | 深色背景 |
| `indigo` | `#537d91` | logo、輔助色 |
| `cream` | `#a4d1c8` | 漸層背景 |

## 環境變數

若日後串接 EmailJS 或其他第三方服務，請在根目錄建立 `.env`：

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

`.env` 已加入 `.gitignore`，請勿 commit。
