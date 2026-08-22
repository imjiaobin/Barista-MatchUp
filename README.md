# Pourfolio

咖啡師活動媒合平台品牌網站，目前處於早期起步階段。
連結獨立咖啡師與品牌活動，讓每一次倒杯都成為難忘的品牌體驗。

## Tech Stack

| 工具 | 版本 | 用途 |
|------|------|------|
| Next.js（App Router） | ^16 | 框架、路由、建置工具、Server Actions |
| React | ^19 | UI 框架 |
| TypeScript | ~6 | 型別安全 |
| Tailwind CSS | ^3.4 | Utility-first 樣式 |
| Framer Motion | ^12 | 頁面切換與動畫 |
| React Icons | ^5 | 圖示庫 |
| Sass | ^1 | 全域樣式補充 |
| Drizzle ORM | ^0.45 | 資料庫 ORM |
| Neon Postgres | — | Serverless PostgreSQL |
| jose / bcryptjs | — | 後台登入 session（JWT）與密碼雜湊 |
| Nodemailer | ^9 | 聯絡表單通知信（Gmail SMTP） |

## 頁面結構

```
/                前台首頁     Hero 輪播、媒合流程、精選咖啡師、CTA
/about           品牌故事     創辦初衷、品牌核心價值、發展路線圖
/services        服務項目     四項服務說明（媒合、企劃協力、品牌聯名、常態方案）
/baristas        咖啡師       咖啡師列表、分類篩選、申請加入入口（v2 才會有後台管理）
/events          活動經歷     歷屆活動列表，資料來自資料庫
/contact         聯絡我們     活動需求詢問表單，送出後寫入資料庫並寄信通知管理員
/admin/login     後台登入
/admin           後台管理     活動 CRUD、詢問表單紀錄、首頁/品牌故事文案編輯、帳號設定
```

## 專案結構

```
src/
├── app/               App Router：前台頁面 + admin/（後台，middleware.ts 保護）
├── assets/            圖片、SVG、靜態資源
├── components/        共用元件（Navbar、Footer、PageTransition、admin/ 後台元件...）
├── db/                Drizzle schema、DB client、seed 腳本
├── lib/               auth/email/常數、actions/（Server Actions）
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

複製 `.env.example` 為 `.env` 並填入實際值：

```env
DATABASE_URL=                # Neon PostgreSQL 連線字串
ADMIN_SESSION_SECRET=        # 後台 session JWT 簽章密鑰
ADMIN_SEED_USERNAME=         # 僅 db:seed-admin 使用
ADMIN_SEED_PASSWORD=         # 僅 db:seed-admin 使用
GMAIL_USER=                  # 寄送聯絡表單通知信的 Gmail 帳號
GMAIL_APP_PASSWORD=          # Gmail 應用程式密碼
ADMIN_NOTIFICATION_EMAIL=    # 通知信收件地址
NEXT_PUBLIC_SITE_URL=        # 正式網址，供 sitemap/metadata 使用
```

`.env` 已加入 `.gitignore`，請勿 commit。

## 資料庫

```bash
npm run db:generate     # 依 schema 產生 migration SQL（commit 進 drizzle/）
npm run db:migrate      # 套用 migration 到 DATABASE_URL 指向的資料庫
npm run db:studio       # 開啟 Drizzle Studio 瀏覽資料
npm run db:seed-admin   # 建立/更新後台管理員帳號（讀 ADMIN_SEED_USERNAME/PASSWORD）
npm run db:seed-content # 匯入初始頁面文案與活動資料
```

首次建置流程：`npm run db:migrate` → `npm run db:seed-admin` → `npm run db:seed-content`。
