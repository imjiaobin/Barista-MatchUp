import 'dotenv/config'
import { db } from './client'
import { events, pageContent } from './schema'

const contentRows: Array<{ page: string; sectionKey: string; label: string; content: string }> = [
  // 首頁 —— 輪播主視覺（3 張投影片）
  { page: 'home', sectionKey: 'hero_1_tag', label: '輪播 1 · 標籤', content: '咖啡師媒合' },
  { page: 'home', sectionKey: 'hero_1_line1', label: '輪播 1 · 標題第一行', content: 'Pour your' },
  { page: 'home', sectionKey: 'hero_1_line2', label: '輪播 1 · 標題第二行', content: 'story.' },
  { page: 'home', sectionKey: 'hero_1_body', label: '輪播 1 · 說明文字', content: 'Pourfolio 連結專業咖啡師與品牌活動，讓每一次倒杯都成為難忘的品牌體驗。' },
  { page: 'home', sectionKey: 'hero_2_tag', label: '輪播 2 · 標籤', content: '活動策劃' },
  { page: 'home', sectionKey: 'hero_2_line1', label: '輪播 2 · 標題第一行', content: 'Craft the' },
  { page: 'home', sectionKey: 'hero_2_line2', label: '輪播 2 · 標題第二行', content: 'moment.' },
  { page: 'home', sectionKey: 'hero_2_body', label: '輪播 2 · 說明文字', content: '從小型品牌聚會到大型年會，為每個規模的活動配對最合適的咖啡師。' },
  { page: 'home', sectionKey: 'hero_3_tag', label: '輪播 3 · 標籤', content: '品牌聯名' },
  { page: 'home', sectionKey: 'hero_3_line1', label: '輪播 3 · 標題第一行', content: 'Elevate your' },
  { page: 'home', sectionKey: 'hero_3_line2', label: '輪播 3 · 標題第二行', content: 'brand.' },
  { page: 'home', sectionKey: 'hero_3_body', label: '輪播 3 · 說明文字', content: '讓咖啡師成為你活動最有記憶點的存在，一杯咖啡，一個品牌故事。' },
  // 首頁 —— 創辦人（2 位）
  { page: 'home', sectionKey: 'founder_1_name', label: '創辦人 1 · 姓名', content: 'Hardy' },
  { page: 'home', sectionKey: 'founder_1_role', label: '創辦人 1 · 職稱', content: '共同創辦人' },
  { page: 'home', sectionKey: 'founder_1_tag', label: '創辦人 1 · 標籤', content: '2016 台灣手沖冠軍 · 木咖 Horoka Coffee 創辦人' },
  { page: 'home', sectionKey: 'founder_1_bio', label: '創辦人 1 · 簡介', content: '2016 年台灣手沖咖啡冠軍，深耕手沖沖煮多年，現為「木咖」咖啡廳創辦人。將競賽級的沖煮功底與經營品牌的實戰經驗，帶入 Pourfolio 的咖啡師審核與媒合標準。' },
  { page: 'home', sectionKey: 'founder_2_name', label: '創辦人 2 · 姓名', content: '資訊補充中' },
  { page: 'home', sectionKey: 'founder_2_role', label: '創辦人 2 · 職稱', content: '共同創辦人 · 烘豆師' },
  { page: 'home', sectionKey: 'founder_2_tag', label: '創辦人 2 · 標籤', content: '烘豆師' },
  { page: 'home', sectionKey: 'founder_2_bio', label: '創辦人 2 · 簡介', content: '個人經歷資訊補充中。' },
  // About 頁 —— 品牌故事段落
  { page: 'about', sectionKey: 'story_para_1', label: '起點段落 1', content: 'Pourfolio 源自一個簡單的觀察：優秀的咖啡師很多，值得被好好呈現的品牌活動也很多，但兩者之間始終缺少一座橋樑。' },
  { page: 'about', sectionKey: 'story_para_2', label: '起點段落 2', content: '我們是一群熱愛咖啡文化的人，深信一杯精心準備的咖啡能為活動帶來截然不同的溫度。Pourfolio 正是在這樣的信念下起步。' },
  { page: 'about', sectionKey: 'story_para_3', label: '起點段落 3', content: '我們不想只當仲介，而是成為真正懂咖啡、懂活動的媒合夥伴。每一次配對，都是對品質的承諾。' },
  // Services 頁 —— 頁首主視覺
  { page: 'services', sectionKey: 'hero_label', label: '頁首 · 標籤', content: '服務項目' },
  { page: 'services', sectionKey: 'hero_heading_line1', label: '頁首 · 標題第一行', content: '從媒合到落地，' },
  { page: 'services', sectionKey: 'hero_heading_accent', label: '頁首 · 標題第二行（強調色）', content: '一站到位' },
  // Services 頁 —— 合作流程區塊標題與 CTA
  { page: 'services', sectionKey: 'process_label', label: '合作流程 · 標籤', content: '合作流程' },
  { page: 'services', sectionKey: 'process_heading_line1', label: '合作流程 · 標題第一行', content: '四個步驟，完成你的' },
  { page: 'services', sectionKey: 'process_heading_line2', label: '合作流程 · 標題第二行', content: '完美咖啡活動' },
  { page: 'services', sectionKey: 'process_cta', label: '合作流程 · 按鈕文字', content: '填寫需求表單' },
  // Events 頁 —— 頁首主視覺
  { page: 'events', sectionKey: 'hero_label', label: '頁首 · 標籤', content: '活動故事' },
  { page: 'events', sectionKey: 'hero_heading_line1', label: '頁首 · 標題第一行', content: '每一場活動，' },
  { page: 'events', sectionKey: 'hero_heading_accent', label: '頁首 · 標題第二行（強調色）', content: '都值得被記住' },
  { page: 'events', sectionKey: 'hero_body', label: '頁首 · 說明文字', content: '這裡蒐錄 Pourfolio 媒合、策劃過的精選歷屆活動，從企業尾牙到品牌快閃，記錄每一次咖啡與品牌相遇的時刻。' },
  // Contact 頁 —— 頁首主視覺
  { page: 'contact', sectionKey: 'hero_label', label: '頁首 · 標籤', content: '聯絡我們' },
  { page: 'contact', sectionKey: 'hero_heading_line1', label: '頁首 · 標題第一行', content: '告訴我們你的' },
  { page: 'contact', sectionKey: 'hero_heading_accent', label: '頁首 · 標題第二行（強調色）', content: '活動故事' },
  // Baristas 頁 —— 頁首主視覺
  { page: 'baristas', sectionKey: 'hero_label', label: '頁首 · 標籤', content: '咖啡師介紹' },
  { page: 'baristas', sectionKey: 'hero_heading_line1', label: '頁首 · 標題第一行', content: '每一位，都是' },
  { page: 'baristas', sectionKey: 'hero_heading_accent', label: '頁首 · 標題第二行（強調色）', content: '故事的述說者' },
  // Baristas 頁 —— 加入平台呼籲區塊
  { page: 'baristas', sectionKey: 'cta_label', label: '加入平台 · 標籤', content: '咖啡師申請' },
  { page: 'baristas', sectionKey: 'cta_heading', label: '加入平台 · 標題', content: '你也是優秀的咖啡師？' },
  { page: 'baristas', sectionKey: 'cta_body', label: '加入平台 · 說明文字', content: '加入 Pourfolio 平台，接觸更多高品質的商業合作機會，讓你的技術被更多人看見。' },
  { page: 'baristas', sectionKey: 'cta_button', label: '加入平台 · 按鈕文字', content: '申請加入平台' },
]

const seedEvents: Array<typeof events.$inferInsert> = [
  { title: '新創品牌週年尾牙', eventDate: '2024-12-01', location: '台北', category: '企業活動', summary: '為科技新創團隊打造的年度尾牙咖啡吧，結合手沖與特調飲品站，串聯整場活動氣氛。', gradientPreset: 'brown-indigo' },
  { title: '香氛品牌期間限定店', eventDate: '2024-09-01', location: '台中', category: '品牌快閃', summary: '兩週快閃店期間常駐咖啡師，依香氛調性設計對應風味的特調飲品，強化品牌體驗記憶點。', gradientPreset: 'indigo-stone' },
  { title: '手作質感婚禮午茶', eventDate: '2024-06-01', location: '台北', category: '婚禮 / 私人派對', summary: '戶外證婚後的午茶時段，以手沖吧檯取代制式茶會，成為賓客最常提起的驚喜環節。', gradientPreset: 'olive-indigo' },
  { title: '3C 品牌新品發表會', eventDate: '2024-03-01', location: '高雄', category: '產品發表', summary: '媒合擅長拉花與視覺呈現的咖啡師，飲品造型與新品配色呼應，成為媒體拍攝焦點。', gradientPreset: 'stone-olive' },
  { title: '選物店期間限定咖啡吧', eventDate: '2023-11-01', location: '台北', category: '品牌快閃', summary: '與選物店合作的常態快閃咖啡吧，累積穩定回頭客群，後續延伸為長期合作方案。', gradientPreset: 'brown-olive' },
  { title: '企業內部教育訓練茶會', eventDate: '2023-08-01', location: '新竹', category: '企業活動', summary: '全天訓練課程中安排的咖啡休息時段，以輕鬆的沖煮體驗緩和高密度課程節奏。', gradientPreset: 'indigo-brown' },
]

async function main() {
  for (const row of contentRows) {
    await db.insert(pageContent)
      .values(row)
      .onConflictDoUpdate({
        target: [pageContent.page, pageContent.sectionKey],
        set: { content: row.content, label: row.label, updatedAt: new Date() },
      })
  }
  console.log(`已寫入 ${contentRows.length} 筆頁面文案`)

  const existingEvents = await db.select({ id: events.id }).from(events).limit(1)
  if (existingEvents.length === 0) {
    await db.insert(events).values(seedEvents)
    console.log(`已匯入 ${seedEvents.length} 筆活動資料`)
  } else {
    console.log('events 資料表已有資料，略過活動匯入')
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
