/**
 * Multi-Language Translations Dictionary (i18n)
 * Supports Traditional Chinese (zh-TW), English (en), and Japanese (ja)
 * Designed for exhibition demonstrations and real international tourists visiting Taiwan.
 */

export type SupportedLanguage = "zh-TW" | "en" | "ja";

export interface TranslationDict {
  // Navigation Tabs
  tabExplore: string;
  tabExploreSub: string;
  tabPlanner: string;
  tabPlannerSub: string;
  tabItinerary: string;
  tabItinerarySub: string;
  tabRecord: string;
  tabRecordSub: string;
  tabColearn: string;

  // Header & Brand
  appTitle: string;
  appSubtitle: string;
  languageSelect: string;

  // Explore Tab
  searchPlaceholder: string;
  allRegions: string;
  northRegion: string;
  centralRegion: string;
  southRegion: string;
  eastRegion: string;
  offshoreRegion: string;
  themeHistorical: string;
  themeArchitecture: string;
  themeFood: string;
  featuredStory: string;
  readStory: string;
  distanceFromYou: string;
  unlockedBadge: string;
  visitedBadge: string;
  markVisited: string;
  markedVisited: string;
  addToItinerary: string;
  addedSuccess: string;
  audioGuideTitle: string;
  playAudio: string;
  pauseAudio: string;
  audioVoicePack: string;
  audioSpeed: string;
  audioOnsiteTips: string;
  close: string;
  filterByRegion: string;
  filterByTheme: string;
  foundSpots: string;

  // Planner Tab
  plannerHeader: string;
  plannerSub: string;
  selectCounty: string;
  selectDistricts: string;
  selectDays: string;
  daysUnit: string;
  selectTransport: string;
  selectBudget: string;
  selectStyle: string;
  userNotesLabel: string;
  userNotesPlaceholder: string;
  generateTripBtn: string;
  generatingTrip: string;
  remixPresetBtn: string;
  transportCar: string;
  transportScooter: string;
  transportPublic: string;
  transportWalk: string;
  budgetBudget: string;
  budgetComfort: string;
  budgetLuxury: string;
  styleNature: string;
  styleSlow: string;
  styleFood: string;
  styleCulture: string;
  styleFamily: string;
  styleAdventure: string;

  // Itinerary Tab
  itineraryHeader: string;
  itinerarySub: string;
  dayTab: string;
  viewMapBtn: string;
  clearTripBtn: string;
  confirmClear: string;
  emptyTrip: string;
  gotoPlanner: string;
  areaFocusLabel: string;
  dayTotalKm: string;
  recommendedLodging: string;
  lodgingNavBtn: string;
  recommendedFood: string;
  oneCardPerShop: string;
  googleNavBtn: string;
  readFoodArticleBtn: string;
  directToShopMap: string;
  signatureDish: string;
  estimatedCost: string;
  interSpotTransit: string;
  approxMinutes: string;
  closeMapBtn: string;

  // Food & Spot Modal
  foodArticleHeader: string;
  foodHistoryStory: string;
  foodOnsiteTips: string;
  foodAudioListen: string;
  foodAudioPlaying: string;
  navDirectToShop: string;
  translateWithAi: string;
  translating: string;
  originalText: string;
  translatedText: string;

  // Settings & System
  systemSettings: string;
  ttsStatusHeader: string;
  activeTtsEngine: string;
  testTtsBtn: string;
  testingTts: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDict> = {
  "zh-TW": {
    // Navigation
    tabExplore: "全台探索",
    tabExploreSub: "行腳走讀",
    tabPlanner: "AI行程規劃",
    tabPlannerSub: "生活圈智慧排程",
    tabItinerary: "我的行程",
    tabItinerarySub: "走讀清單與地圖",
    tabRecord: "走讀成就",
    tabRecordSub: "解鎖徽章與紀錄",
    tabColearn: "同遊說書",

    // Header & Brand
    appTitle: "AI深旅",
    appSubtitle: "全台深度旅遊走讀導覽",
    languageSelect: "語言切換",

    // Explore Tab
    searchPlaceholder: "搜尋全台灣景點、老街、古蹟、夜市...",
    allRegions: "全台灣",
    northRegion: "北部",
    centralRegion: "中部",
    southRegion: "南部",
    eastRegion: "東部",
    offshoreRegion: "離島",
    themeHistorical: "歷史背景",
    themeArchitecture: "建築特色",
    themeFood: "在地飲食",
    featuredStory: "特色專文",
    readStory: "閱讀深度專文",
    distanceFromYou: "距您",
    unlockedBadge: "已解鎖故事",
    visitedBadge: "已走訪",
    markVisited: "標記為已走訪",
    markedVisited: "✔ 已標記走訪",
    addToItinerary: "➕ 排入我的行程",
    addedSuccess: "已加入您的行程！",
    audioGuideTitle: "語音導覽與說書",
    playAudio: "即時語音播放",
    pauseAudio: "暫停語音朗讀",
    audioVoicePack: "配英語音包",
    audioSpeed: "語速",
    audioOnsiteTips: "行家現場走讀密技與私房看點",
    close: "關閉",
    filterByRegion: "地理分區快速篩選",
    filterByTheme: "預設導覽主題方向",
    foundSpots: "全台深度探索景點",

    // Planner Tab
    plannerHeader: "AI 智慧行程規劃",
    plannerSub: "生活圈廊道聚合，嚴格保證移動流暢性，絕不跨區折返跑",
    selectCounty: "目的地縣市",
    selectDistricts: "遊歷區域或自訂關鍵字",
    selectDays: "旅遊天數",
    daysUnit: "天",
    selectTransport: "預計交通方式",
    selectBudget: "預算模式",
    selectStyle: "團隊旅行風格",
    userNotesLabel: "旅客特別需求/自訂備註（可選填）",
    userNotesPlaceholder: "例如：想多去日式老屋、喜歡在地小吃、同行有長輩走路放慢...",
    generateTripBtn: "✨ 開始 AI 智慧排程",
    generatingTrip: "AI 依據地理相鄰性聚類規劃中...",
    remixPresetBtn: "套用經典旗艦行程",
    transportCar: "🚗 汽車自駕",
    transportScooter: "🛵 機車雙載",
    transportPublic: "🚆 大眾捷運/火車",
    transportWalk: "🚶 步行動線",
    budgetBudget: "💰 省錢小吃",
    budgetComfort: "🛋️ 舒適精緻",
    budgetLuxury: "💎 豪華尊榮",
    styleNature: "🌲 自然生態",
    styleSlow: "☕ 漫活體驗",
    styleFood: "🍜 美食巡禮",
    styleCulture: "🏛️ 歷史文化",
    styleFamily: "🎠 親子同樂",
    styleAdventure: "🎒 戶外探險",

    // Itinerary Tab
    itineraryHeader: "台灣深度行腳走讀",
    itinerarySub: "打卡走訪全台名勝，解鎖文化學習徽章與導覽紀錄",
    dayTab: "第 %d 天",
    viewMapBtn: "🗺️ 查看路線地圖",
    clearTripBtn: "重啟/清空",
    confirmClear: "確定要重新規劃這份行程嗎？",
    emptyTrip: "目前行程表為空",
    gotoPlanner: "前往 AI 規劃行程",
    areaFocusLabel: "當日遊歷生活圈 • 動線順向不折返",
    dayTotalKm: "全日約 %s km",
    recommendedLodging: "今日推薦住宿處",
    lodgingNavBtn: "旅宿導航",
    recommendedFood: "今日特色美食推薦",
    oneCardPerShop: "一家一卡 • 精準導航",
    googleNavBtn: "Google 導航",
    readFoodArticleBtn: "📖 閱讀美食介紹專文",
    directToShopMap: "直達店家地圖",
    signatureDish: "招牌必吃",
    estimatedCost: "預估花費",
    interSpotTransit: "車程移動",
    approxMinutes: "約 %d 分鐘 · %s 公里",
    closeMapBtn: "關閉地圖閱覽",

    // Food & Spot Modal
    foodArticleHeader: "特色美食專文",
    foodHistoryStory: "舌尖上的風土身世與料理精髓",
    foodOnsiteTips: "老饕私房吃法與推薦指南",
    foodAudioListen: "收聽美食故事語音朗讀",
    foodAudioPlaying: "正在朗讀美食典故說書...",
    navDirectToShop: "🧭 開啟 Google 導航直達現場",
    translateWithAi: "🌐 呼叫 AI 翻譯專文",
    translating: "AI 即時翻譯中...",
    originalText: "繁中原文",
    translatedText: "多國語言譯文",

    // Settings
    systemSettings: "系統連線與設定",
    ttsStatusHeader: "語音導覽與 TTS 語音引擎狀態",
    activeTtsEngine: "當前主用語音引擎",
    testTtsBtn: "▶️ 試聽 TTS 語音發聲測試",
    testingTts: "⏹️ 停止測試語音"
  },

  "en": {
    // Navigation
    tabExplore: "Explore",
    tabExploreSub: "Cultural Walk",
    tabPlanner: "AI Planner",
    tabPlannerSub: "Smart Routing",
    tabItinerary: "My Trip",
    tabItinerarySub: "Routes & Maps",
    tabRecord: "Footprints",
    tabRecordSub: "Badges & Progress",
    tabColearn: "Audio Tour",

    // Header & Brand
    appTitle: "DeepGo Taiwan",
    appSubtitle: "In-Depth Travel & Audio Guide",
    languageSelect: "Language",

    // Explore Tab
    searchPlaceholder: "Search spots, historic streets, night markets...",
    allRegions: "All Taiwan",
    northRegion: "North",
    centralRegion: "Central",
    southRegion: "South",
    eastRegion: "East",
    offshoreRegion: "Islands",
    themeHistorical: "History",
    themeArchitecture: "Architecture",
    themeFood: "Local Cuisine",
    featuredStory: "In-Depth Article",
    readStory: "Read Story Article",
    distanceFromYou: "Away",
    unlockedBadge: "Unlocked",
    visitedBadge: "Visited",
    markVisited: "Mark as Visited",
    markedVisited: "✔ Visited",
    addToItinerary: "➕ Add to Itinerary",
    addedSuccess: "Added to your itinerary!",
    audioGuideTitle: "Audio Guide & Narrative",
    playAudio: "Play Audio Guide",
    pauseAudio: "Pause Audio",
    audioVoicePack: "Voice Style",
    audioSpeed: "Speed",
    audioOnsiteTips: "On-site Highlights & Expert Tips",
    close: "Close",
    filterByRegion: "Filter by Region",
    filterByTheme: "Tour Theme Focus",
    foundSpots: "Cultural Destinations",

    // Planner Tab
    plannerHeader: "AI Smart Trip Planner",
    plannerSub: "Clustered corridors for smooth flow, zero backtracking guaranteed",
    selectCounty: "Destination City / County",
    selectDistricts: "Districts or Keywords",
    selectDays: "Trip Duration",
    daysUnit: "Days",
    selectTransport: "Transportation",
    selectBudget: "Budget Mode",
    selectStyle: "Travel Style",
    userNotesLabel: "Special Requests / Notes (Optional)",
    userNotesPlaceholder: "e.g., love historic tea houses, prefer local street food, leisurely walking pace...",
    generateTripBtn: "✨ Generate AI Itinerary",
    generatingTrip: "AI is clustering optimal corridors...",
    remixPresetBtn: "Load Classic Flagship Trip",
    transportCar: "🚗 Car Driving",
    transportScooter: "🛵 Scooter",
    transportPublic: "🚆 MRT / Train",
    transportWalk: "🚶 Walking",
    budgetBudget: "💰 Budget Friendly",
    budgetComfort: "🛋️ Comfortable",
    budgetLuxury: "💎 Luxury Premium",
    styleNature: "🌲 Nature & Ecology",
    styleSlow: "☕ Slow Living",
    styleFood: "🍜 Gourmet Feasts",
    styleCulture: "🏛️ History & Heritage",
    styleFamily: "🎠 Family Friendly",
    styleAdventure: "🎒 Outdoor Adventure",

    // Itinerary Tab
    itineraryHeader: "Taiwan Cultural Journey",
    itinerarySub: "Visit cultural heritage, unlock learning badges and travel memories",
    dayTab: "Day %d",
    viewMapBtn: "🗺️ View Route Map",
    clearTripBtn: "Reset",
    confirmClear: "Reset and clear this itinerary?",
    emptyTrip: "Your itinerary is currently empty",
    gotoPlanner: "Go to AI Planner",
    areaFocusLabel: "Daily Living Corridor • Smooth Transit",
    dayTotalKm: "Total ~%s km",
    recommendedLodging: "Recommended Lodging",
    lodgingNavBtn: "Hotel Nav",
    recommendedFood: "Today's Featured Gourmet",
    oneCardPerShop: "One Card Per Shop • Accurate Nav",
    googleNavBtn: "Google Nav",
    readFoodArticleBtn: "📖 Read Food Story Article",
    directToShopMap: "Direct Map",
    signatureDish: "Signature Dishes",
    estimatedCost: "Budget",
    interSpotTransit: "Transit",
    approxMinutes: "~%d min · %s km",
    closeMapBtn: "Close Map",

    // Food & Spot Modal
    foodArticleHeader: "Culinary Heritage Article",
    foodHistoryStory: "Origins, Craftsmanship & Flavors",
    foodOnsiteTips: "Foodie Tips & Ordering Guide",
    foodAudioListen: "Listen to Audio Story",
    foodAudioPlaying: "Narrating food heritage story...",
    navDirectToShop: "🧭 Open Google Maps Navigation",
    translateWithAi: "🌐 Translate Article with AI",
    translating: "Translating with AI...",
    originalText: "Original Chinese",
    translatedText: "Translated",

    // Settings
    systemSettings: "System & Settings",
    ttsStatusHeader: "Audio Guide & TTS Engine Status",
    activeTtsEngine: "Active TTS Engine",
    testTtsBtn: "▶️ Voice Test Playback",
    testingTts: "⏹️ Stop Voice Test"
  },

  "ja": {
    // Navigation
    tabExplore: "全台散策",
    tabExploreSub: "文化ウォーキング",
    tabPlanner: "AI旅程プラン",
    tabPlannerSub: "生活圏スマート配車",
    tabItinerary: "保存した旅程",
    tabItinerarySub: "ルート＆マップ",
    tabRecord: "旅の記録",
    tabRecordSub: "バッジ＆スタンプ",
    tabColearn: "音声ガイド",

    // Header & Brand
    appTitle: "AI深旅 (DeepGo)",
    appSubtitle: "台湾ディープトリップ＆音声ガイド",
    languageSelect: "言語切替",

    // Explore Tab
    searchPlaceholder: "台湾全土の名所、古い街並み、夜市を検索...",
    allRegions: "台湾全土",
    northRegion: "北部",
    centralRegion: "中部",
    southRegion: "南部",
    eastRegion: "東部",
    offshoreRegion: "離島",
    themeHistorical: "歴史と背景",
    themeArchitecture: "建築の特徴",
    themeFood: "郷土グルメ",
    featuredStory: "特集記事",
    readStory: "詳細記事を読む",
    distanceFromYou: "現在地から",
    unlockedBadge: "解除済みストーリー",
    visitedBadge: "訪問済み",
    markVisited: "訪問済みにチェック",
    markedVisited: "✔ 訪問済み",
    addToItinerary: "➕ 旅程に追加",
    addedSuccess: "旅程に追加しました！",
    audioGuideTitle: "音声ガイド＆ストーリーテリング",
    playAudio: "音声を再生",
    pauseAudio: "音声を一時停止",
    audioVoicePack: "音声スタイル",
    audioSpeed: "再生速度",
    audioOnsiteTips: "プロの現地散策ポイント",
    close: "閉じる",
    filterByRegion: "エリアで絞り込む",
    filterByTheme: "テーマを選択",
    foundSpots: "台湾ディープ観光スポット",

    // Planner Tab
    plannerHeader: "AIスマート旅程プランナー",
    plannerSub: "生活圏クラスター設計で無駄な往復のない最適な移動を実現",
    selectCounty: "目的地の県・市",
    selectDistricts: "巡りたい地域やキーワード",
    selectDays: "旅行日数",
    daysUnit: "日間",
    selectTransport: "移動手段",
    selectBudget: "予算モード",
    selectStyle: "旅行スタイル",
    userNotesLabel: "特別なご要望・備考（任意）",
    userNotesPlaceholder: "例：レトロな日本家屋が好き、地元B級グルメ中心、ゆっくり歩きたい...",
    generateTripBtn: "✨ AI旅程を自動生成",
    generatingTrip: "AIが最適なルートを計算中...",
    remixPresetBtn: "定番モデルコースを読み込む",
    transportCar: "🚗 レンタカー・車",
    transportScooter: "🛵 バイク",
    transportPublic: "🚆 MRT・電車",
    transportWalk: "🚶 徒歩散策",
    budgetBudget: "💰 コスパ重視",
    budgetComfort: "🛋️ スタンダード",
    budgetLuxury: "💎 ラグジュアリー",
    styleNature: "🌲 自然・エコ",
    styleSlow: "☕ ゆったりカフェ",
    styleFood: "🍜 グルメ巡り",
    styleCulture: "🏛️ 歴史・文化遺産",
    styleFamily: "🎠 ファミリー向け",
    styleAdventure: "🎒 アウトドア冒険",

    // Itinerary Tab
    itineraryHeader: "台湾ディープ文化散策",
    itinerarySub: "台湾の名所を巡り、文化バッジと思い出をコレクション",
    dayTab: "%d日目",
    viewMapBtn: "🗺️ ルートマップを見る",
    clearTripBtn: "リセット",
    confirmClear: "この旅程をリセットしますか？",
    emptyTrip: "現在旅程は登録されていません",
    gotoPlanner: "AIプランナーで計画する",
    areaFocusLabel: "当日の生活圏エリア • 順路移動で往復なし",
    dayTotalKm: "全日約 %s km",
    recommendedLodging: "本日のおすすめ宿泊先",
    lodgingNavBtn: "ホテルへナビ",
    recommendedFood: "本日の厳選地元グルメ",
    oneCardPerShop: "1店舗1カード・正確ナビ",
    googleNavBtn: "Google ナビ",
    readFoodArticleBtn: "📖 グルメ詳細記事を読む",
    directToShopMap: "お店の地図へ",
    signatureDish: "看板メニュー",
    estimatedCost: "予算目安",
    interSpotTransit: "移動時間",
    approxMinutes: "車で約 %d 分 · %s km",
    closeMapBtn: "地図を閉じる",

    // Food & Spot Modal
    foodArticleHeader: "郷土グルメ特集記事",
    foodHistoryStory: "歴史・伝統の味と職人技の秘密",
    foodOnsiteTips: "通の食べ方＆注文ガイド",
    foodAudioListen: "グルメ音声ガイドを聞く",
    foodAudioPlaying: "音声ガイドを再生中...",
    navDirectToShop: "🧭 Google マップでナビを開始",
    translateWithAi: "🌐 AIで記事を翻訳",
    translating: "AIで翻訳中...",
    originalText: "繁体字原文",
    translatedText: "多言語翻訳",

    // Settings
    systemSettings: "システムと設定",
    ttsStatusHeader: "音声ガイドとTTSエンジンの状態",
    activeTtsEngine: "現在使用中の音声エンジン",
    testTtsBtn: "▶️ 音声テスト再生",
    testingTts: "⏹️ 音声テスト停止"
  }
};
