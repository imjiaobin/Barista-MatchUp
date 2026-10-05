# 後台頁面建立準則（/admin）

規範 `src/app/admin/**` 與 `src/components/admin/**` 的所有新增與修改。
視覺對照：`Admin Guidelines.dc.html`。色彩唯一來源：`src/styles/admin-tokens.css`。

## 0. 動手前

1. 先讀根目錄 `AGENTS.md`：本專案 Next.js 版本有破壞性變更，查 `node_modules/next/dist/docs/` 再寫。
2. 判斷頁面屬於第 5 節哪一種模板，**複製對應的參考檔再改**，不自創版型。
3. 找元件順序：`src/components/admin/ui/` → `src/components/admin/` → 都沒有才新增（新增的通用元件放 `ui/`）。

## 1. 技術棧（只用專案已安裝的套件）

- Next.js App Router、React 19、TypeScript strict（`noUnusedLocals` 開啟）
- Tailwind CSS 4（CSS-first，`darkMode` 由 `admin-tokens.css` 內的 `@custom-variant dark` 定義）
- 圖示：`react-icons/fi`，`size={16}`；按鈕內 16、空狀態 18
- 表單：Server Actions + `useActionState` + `zod`（伺服器端驗證為準）
- 資料：Drizzle（`src/db`）；每個 page 與 action 開頭 `await requireAdminSession()`
- 動畫：如需要用已安裝的 `framer-motion`，後台原則上不加動畫
- import 一律用相對路徑（專案沒有設定 `@/` alias）
- **不得新增 npm 套件**（shadcn、lucide、tanstack、sonner、next-themes 等）。真的需要時先說明理由並詢問。

## 2. Design tokens

色票全部定義在 `src/styles/admin-tokens.css`，對應 `src/styles/global.css` 的 `@theme` 既有品牌色（cream / latte / mocha / caramel / espresso / olive / ink），字體沿用 `app/layout.tsx` 的 Inter + Noto Sans TC。

| 語意 class | 淺色來源 | 用途 |
| --- | --- | --- |
| `bg-background` | cream.light | 頁面底色 |
| `bg-card` | white | 卡片、表格、Dialog |
| `bg-sidebar` / `text-sidebar-foreground` | cream / espresso | 側欄 |
| `text-foreground` / `text-muted-foreground` | ink / ink.muted | 文字 |
| `bg-primary` / `hover:bg-primary-hover` | caramel / caramel.dark | 主要操作 |
| `bg-secondary`、`bg-accent` | latte | 次要強調、選取、hover |
| `text-success` / `bg-success-soft` | olive | 成功 |
| `text-info` / `bg-info-soft` | espresso / latte | 進行中 |
| `text-warning`、`text-destructive` | 新增 | 警示、刪除 |
| `border-border`、`border-input`、`outline-ring` | latte / caramel | 框線、焦點 |

規則：
- 後台只用上表語意 class。**禁止**：hex/rgb、`stone-*` `gray-*` `red-*` 等原色、前台色名（`caramel` `espresso` `cream`…）、`.btn-primary` `.section-label` 等前台 class、任意值 `p-[13px]`。
- 深色模式不寫 `dark:`；token 已處理。
- 字體 `font-admin`（由 AdminFrame 套用，頁面不用再寫）。
- 圓角：卡片/表格容器 `rounded-2xl`；Dialog、登入卡 `rounded-3xl`；按鈕、輸入框、Select、Badge `rounded-full`。
- 陰影：卡片 `shadow-card`、浮層 `shadow-pop`、Dialog `shadow-modal`。
- 不覆寫 Tailwind 預設的 `sans`、`rounded-*`、`shadow-sm/md/lg`，避免影響前台。

### 字級

| 用途 | class |
| --- | --- |
| 頁面 H1 | `text-[26px] font-light tracking-tight`（由 PageHeader 提供） |
| 卡片標題 | `text-base font-semibold`（由 CardHeader 提供） |
| 內文、表格、表單 | `text-sm` |
| Label | `text-[13px] font-medium` |
| 輔助說明、時間 | `text-xs text-muted-foreground` |
| 統計數字 | `text-3xl font-light tabular-nums` |

### 間距與尺寸
- 頁面內距與區塊間距由 AdminFrame 的 `<main>` 提供（`gap-6`），頁面最外層用 `<>…</>`，不要再包 padding。
- 卡片內 `p-5`；表單欄位間 `gap-5`；按鈕群 `gap-2`。
- 控制項 `h-9`；表格列內操作 `size="sm"`（`h-8`）；表格列高 48px。
- 表單頁、設定頁內容 `max-w-3xl`。

## 3. 版面骨架

`src/app/admin/(dashboard)/layout.tsx` → `components/admin/shell/AdminFrame.tsx`：
- 側欄 `w-sidebar`（240px），收合 `w-sidebar-collapsed`（68px）只顯示圖示；狀態存 cookie `admin-sidebar`。
- < 1024px 側欄改為抽屜，頂部列顯示選單鈕。
- 頂部列：收合鈕、主題切換（cookie `admin-theme`）。
- 導覽項目只在 `AdminFrame.tsx` 的 `NAV` 陣列新增。
- 頁面不得自己再包側欄、頂部列。

## 4. 元件（`src/components/admin/ui/`）

| 元件 | 用法重點 |
| --- | --- |
| `PageHeader` | 每頁必有。`title`、`description`、`badge`、`actions`、`breadcrumbs`（詳情頁最後一層放資料名稱） |
| `Button` / `ButtonLink` / `buttonClass()` | variant：`primary`（每區塊最多 1 個）、`secondary`、`ghost`、`destructive`、`link`；size：`md` `sm` `icon` |
| `SubmitButton` | 表單送出鈕，自動處理 pending（停用 + 轉圈 + `pendingText`） |
| `Card` / `CardHeader` / `CardBody` / `DescriptionList` | 所有內容區塊都放在 Card；DescriptionList 空值自動顯示「—」 |
| `Field` + `Input` / `Select` / `Textarea` / `Switch` | Label 在上，`required` 顯示 `*`，`hint` 或 `error` 在下 |
| `FormAlert` | 伺服器錯誤放表單頂部；成功訊息 `tone="success"` |
| `Badge` | 只接 `tone`；狀態文案與色調查 `src/lib/status.ts` |
| `Table` / `Th` / `Tr` / `Td` / `Pagination` | 數字 `numeric` + 靠右；分頁以 URL 為準 |
| `ConfirmDialog` | 所有刪除、不可逆操作。標題寫明對象：「刪除活動「秋季市集」？」 |
| `EmptyState` / `Skeleton` | 空資料、篩選無結果、載入 |

- 按鈕文案「動詞 + 名詞」：新增活動、儲存變更、更新密碼。不用「確定」「提交」「OK」。
- 不使用 `window.alert` / `confirm`。
- 新增狀態種類時，先在 `src/lib/status.ts` 加對照，再用 `<Badge tone>`。

## 5. 頁面模板（參考實作）

| 模板 | 參考檔 | 結構 |
| --- | --- | --- |
| 列表頁 | `app/admin/(dashboard)/events/page.tsx` | PageHeader（筆數 + 新增）→ Card：GET 篩選表單 → Table → Pagination。篩選、分頁存在 searchParams；區分「沒有資料」與「篩選無結果」兩種空狀態 |
| 詳情頁 | `app/admin/(dashboard)/submissions/[id]/page.tsx` | 麵包屑 → PageHeader（名稱 + 狀態 Badge）→ `lg:grid-cols-[minmax(0,1fr)_320px]`：左欄資訊卡片、右欄 sticky 狀態操作。查無資料 `notFound()` |
| 表單頁 | `app/admin/(dashboard)/events/new/page.tsx` + `components/admin/EventForm.tsx` | 依主題分卡片；錯誤 FormAlert 在頂部；底部 sticky 操作列「取消 / 儲存」。新增與編輯共用同一個 Form |
| 儀表板 | `app/admin/(dashboard)/page.tsx` | 4 張統計卡（可點進已篩選列表）→ 最近 5 筆 + 查看全部。圖表沿用既有 `components/admin/charts/` |
| 設定頁 | `app/admin/(dashboard)/settings/page.tsx` | 每區塊一張卡片、各自儲存；危險操作放最下方 `border-destructive/40` 卡片 |
| 登入頁 | `app/admin/login/page.tsx` + `components/admin/LoginForm.tsx` | 不套 AdminFrame；置中卡片 `max-w-sm`；錯誤不透露帳號是否存在 |

共用狀態檔：`(dashboard)/loading.tsx`（Skeleton）、`error.tsx`（重新載入）、`not-found.tsx`。新增路由層級若版面不同，可再放自己的 `loading.tsx`。

## 6. 每頁必須處理的狀態

| 狀態 | 做法 |
| --- | --- |
| 載入 | `loading.tsx`，骨架形狀接近實際版面，不用整頁 spinner |
| 空資料 | `EmptyState` + 主要操作：「還沒有活動」「新增活動」 |
| 篩選無結果 | 「找不到符合條件的…」+「清除篩選」 |
| 錯誤 | `error.tsx`，不顯示 stack、不顯示原始錯誤訊息 |
| 找不到 | `notFound()` |
| 未登入 | `requireAdminSession()` 自動導向登入頁 |

## 7. 文案

- 繁體中文、台灣用語：設定（非設置）、資料（非數據）、登入（非登錄）、檔案（非文件）。
- 中英數字之間加半形空格：「共 12 筆」「匯出 CSV」。
- 日期時間 `zh-TW`、24 小時制：`2026/10/04 14:30`。
- 進行中文案用全形刪節號：「儲存中…」。不用驚嘆號、不用 emoji。

## 8. 無障礙

- 圖示按鈕必須有 `aria-label`（收合時的導覽連結用 `title`）。
- 不移除 focus outline；焦點色用 `outline-ring`。
- 每個輸入框有對應 `<label htmlFor>`（`Field` 已處理）。

## 9. 完成檢查清單

- [ ] `npm run lint`、`npx tsc --noEmit` 無錯誤
- [ ] 沒有新增套件、沒有寫死顏色或原色 class
- [ ] 淺色、深色各看一次
- [ ] 載入、空資料、錯誤狀態都有
- [ ] 375px、1280px 寬度版面不破，中文標籤、按鈕不斷行
- [ ] 刪除有 ConfirmDialog
- [ ] 篩選、分頁條件在 URL 上

## 附錄：導入步驟（一次性，Tailwind 4 版本）

1. 已完成：`src/styles/admin-tokens.css` 已複製，並在 `src/styles/global.css` 的 `@import "tailwindcss";` 之後以 `@import "./admin-tokens.css";` 匯入。
2. 不需要 `tailwind.admin.ts`：Tailwind 4 採 CSS-first，`darkMode` 與後台色票都在 `admin-tokens.css`，不存在 `tailwind.config.ts`。
3. 已完成：複製 `src/components/admin/ui/`、`shell/`、`src/lib/status.ts`。
4. 已完成：dashboard `layout.tsx` 改用 `AdminFrame`；`AdminNav.tsx` 已不再被引用，可刪除。`StatusControl.tsx` 的狀態文案改由 `src/lib/status.ts`（底層仍讀 `src/lib/constants.ts`）。
5. 其餘既有頁面（submissions 列表、satisfaction、stats、content）照第 5 節模板改寫，**保留既有功能邏輯**（執行紀錄、滿意度、流失原因等），只換版面與元件。
