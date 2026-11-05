# 📝 AI深旅 (DeepGo Taiwan) - 版本更新記錄 (Changelog)

本文檔詳細記錄 **全台 AI 深度旅遊導覽平台「AI深旅 (DeepGo Taiwan)」** 的版本發布歷程、核心新增功能、架構重構與優化修正。

---

## 🌐 [v1.5.0] - 2026-11-04

### 🌟 三層式多國語言系統 (i18n) 與英日雙語導覽 (International Multi-Language Support)
* **頂部極簡語言切換按鈕 (`繁中 | EN | 日`)**：
  - 於頂部 Header 導航列顯眼位置配置三色藥丸切換器，外國旅客與評審點擊即可在繁體中文 (`zh-TW`)、英文 (`en`) 與日文 (`ja`) 間秒速切換。
  - 變更語言時同步更新 `document.documentElement.lang`，並永久保存偏好至 `localStorage`。
* **三層式多語架構實裝 (Three-Tier Architecture)**：
  - **第一層：AI 智慧行程規劃**：
    - 在 GPT / Gemini 提示詞中主動傳入 `targetLang`，大模型直接生成原生道地英文或日文排程、亮點解說與住宿美食理由，無須二次機器翻譯。
  - **第二層：UI 介面全域國際化**：
    - 首頁探索、AI 規劃表單（天數、交通工具、支出預算、旅遊風格、客製備註）、我的行程、行程共學與學習紀錄分頁按鈕全面抽取至字典庫 (`src/i18n/translations.ts`)，語言切換時全畫面瞬時連動。
  - **第三層：景點與美食深度專文即時 AI 翻譯與本機快取**：
    - 景點故事與美食小卡專文彈窗新增「🌐 AI 翻譯」切換列，遊客可隨時切換「原文」與「英/日文譯文」。
    - 翻譯結果自動持久化至手機儲存空間（`deepgo_trans_cache_*`），大幅節省 API 額度並實現離線秒開。
* **景點與美食地址「雙語保留機制」**：
  - 景點、餐廳名與實體地址在外語模式下嚴格遵守「外文名稱 + (繁體中文原名)」規範（例如 `Dihua Street (迪化街)`、`羅東林場肉羹 (Luodong Linchang Pork Thick Soup)`）。
  - Google Maps 導航按鈕調用標準協議時一律保留中文地名關鍵字，保證在台灣 Google 地圖定位、叫車給計程車司機看或問路時 100% 準確無誤。
* **TTS 語音導覽多國語言自動適配**：
  - 原生 Android TTS 插件與 Web Speech 語音合成引擎在英語模式下自動載入 `en-US` 語音包，日語模式下載入 `ja-JP` 語音包，現場走讀邊聽邊看無障礙。

---

## 🥢 [v1.4.3] - 2026-11-04

### 🌟 美食導航「一家一張獨立小卡」與「深度介紹專文」升級 (Dedicated Food Cards & In-Depth Culinary Articles)
* **美食卡片徹底解耦（一家一張獨立小卡）**：
  - 徹底解決過往多間餐廳混排在單一卡片導致 Google Maps 導航搜尋字串合併出錯的問題。
  - 不論是新排定的行程或歷史儲存的行程，每日推薦的每家特色店家、小吃或夜市排隊攤位，均獨立呈現為單獨專屬卡片。
  - 每張小卡均配置專屬的「🧭 Google 導航」按鈕，點擊後精準鎖定該店家的確切名稱與地址，直達現場絕不迷路。
* **全新「📖 美食深度故事專文」閱讀彈窗與知識體系**：
  - 建立全台道地小吃風土故事資料庫（`src/data/foodStories.ts`），涵蓋宜蘭羅東林場肉羹、阿灶伯當歸羊肉湯、魏姐包心粉圓、大稻埕林合發油飯、民樂旗魚米粉、台南文章牛肉湯、周氏蝦捲等近百道經典美饌。
  - 每張美食小卡均可點擊「📖 閱讀美食介紹專文」，開啟沉浸式專題彈窗，細述百年店家的歷史身世、古法製作工法、風味特色與在地老饕私房吃法秘笈。
* **美食故事語音朗讀說書（TTS）**：
  - 美食專文彈窗內嵌專屬語音朗讀器，整合 Android 原生 TTS 與 Web Speech 雙引擎，一鍵收聽「專業播音員」講述美食典故與老饕指南。
* **智慧文字解析與向下相容引擎 (`parseFoodRecommendIntoMealCards`)**：
  - 自動偵測並智慧切分歷史儲存行程中以逗號、頓號串連的複合美食字串，自動補齊精確地址、招牌料理與深度文化介紹，實現 100% 完美向下相容。

---

## 🔊 [v1.4.2] - 2026-11-04

### 🌟 Android 原生 TTS 語音插件與全設備無縫自動切換 (Universal Text-to-Speech)
* **安裝 `@capacitor-community/text-to-speech` 原生外掛**：
  - 專門針對 Android 原生系統底層 TTS 引擎（`android.speech.tts.TextToSpeech`）進行橋接，解決部分 Android 手機在 WebView 中無內建語音或不支援 HTML5 Web Speech API 的問題。
* **App.tsx 全域啟動語音能力自動偵測 (`detectTtsCapabilities`)**：
  - 在 App 載入時自動偵測執行環境（Android 原生 APK 或 Web 瀏覽器），並驗證 Web Speech API 與系統語音引擎支援狀態。
  - 當偵測到瀏覽器 Web Speech 不可用或缺少語音時，系統自動將主引擎切換為 Android 原生 TTS 服務，確保語音導覽在所有實體手機與平板設備上都能 100% 正常發聲。
* **統一跨端語音呼叫服務架構 (`src/services/nativeTtsService.ts`)**：
  - 封裝 `speakUtterance()` 與 `stopUtterance()`：
    - 在 Android 原生環境優先啟用 `@capacitor-community/text-to-speech`，零等待高音質播報。
    - 在桌面與支援的瀏覽器自動對接 Google 國語 / 中文 (台灣) Web Speech 語音。
    - 具備跨引擎雙重容錯重試機制（Retry & Fallback），若一方受限自動切換備援。
  - 完整支援語速調節（0.8x、1.0x、1.25x）與不同口吻語音包（專業主播、可愛孩子、英語播報）。
* **探索頁面與系統診斷面板升級**：
  - 探索說書彈窗中的語音播放器動態顯示當前啟用的語音引擎狀態徽章（如 `Android 原生系統 TTS 引擎` 或 `Web Speech 瀏覽器語音`）。
  - 在系統設定彈窗中加入專屬「🔊 語音導覽與 TTS 語音引擎狀態」卡片，詳細列出環境診斷資訊並提供一鍵「試聽 TTS 語音發聲測試」功能。
* **每次更新完整版本變更紀錄規範維護**：
  - 遵循版本更新變更紀錄標準，同步更新 `CHANGELOG.md` 與 `package.json`（v1.4.2）。

---

## 🎨 [v1.4.1] - 2026-11-04

### 🌟 專屬視覺識別與官方圖標升級 (Brand & App Icon Integration)
* **全套 Android 原生 Launcher 圖標替換**：
  - 封裝全新官方「旅遊趣」黃色露營露營車與陽光意象手繪圖標。
  - 涵蓋所有 Android 原生解析度（`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`）。
  - 同步配置標準方形圓角圖標（`ic_launcher.png`）、圓形圖標（`ic_launcher_round.png`）與自適應前景圖標（`ic_launcher_foreground.png`）。
* **自適應圖標（Adaptive Icons）背景色優化**：
  - 更新 `ic_launcher_background.xml` 為黃色品牌主色（`#FED640`），確保在各品牌手機（Pixel、Samsung、小米、Sony 等）以圓形、淚滴形或方圓形遮罩裁切時，圖標邊角無縫融合且主視覺完全不被裁切。
* **全新啟動畫面（Splash Screens）**：
  - 更新全部橫式與直式解析度的 Android Splash Screen，中央嵌合專屬圖標與雅緻米白底色（`#FAF8F5`）。
* **Web PWA 與瀏覽器 Favicon 全面同步**：
  - 產出 `favicon.png`、`favicon.ico`、`apple-touch-icon.png`、`icon-192.png` 與 `icon.png`（512x512）。
  - 更新 `manifest.json` 與 `index.html`，支援 Chrome PWA 安裝與 iOS 主畫面捷徑。
* **App 頂部導覽列品牌圖標**：
  - 於 App 頂部導覽列直接展示官方圖標，大幅提升品牌識別度與精緻質感。

---

## 🚀 [v1.4.0] - 2026-11-04

### 🌟 核心新功能 (Major Features)
* **AI 行程地理合理性演算法 (AI Geographic Rationality & Route Flow)**：
  - 導入空間相鄰區域聚合（Spatial Clustering）與地理廊道順序規劃，確保多日行程每日景點均集中在同一個行政區或相鄰生活圈。
  - 自動計算前後景點間預估距離（`distanceFromPrevKm`）與移動交通時間（`travelTimeDesc`），徹底解決景點跨區折返奔波（折返跑）的問題。
* **獨立午餐、晚餐/夜市推薦專屬小卡 (Dedicated Lunch & Dinner Cards)**：
  - 每日行程結構化產出專屬的「在地午餐小卡」與「特色晚餐/夜市小卡」。
  - 清楚列出推薦店名/商圈、招牌必吃品項、預估花費預算與詳細地址。
* **Google 地圖一鍵即時導航按鈕 (Google Maps Direct Navigation)**：
  - 每個景點卡片與午晚餐小卡均內建「Google 導航」按鈕。
  - 點擊直接開啟 Google Maps App 或網頁版路線導航（支援 Android 手機一鍵叫起 Google 地圖）。
* **一鍵下載專案完整原始碼 ZIP 包 (`/api/download-project`)**：
  - 後端新增 `/api/download-project` 串流端點，一鍵打包不含 `node_modules` 與 `.git` 的純淨專案 ZIP，方便開發者快速在本機 Android Studio 開發除錯。
* **GitHub Actions 自動化編譯發布**：
  - 同步推送程式碼後自動透過 GitHub Actions 編譯產生 `deepgo-taiwan-v1.4.0-debug.apk` 並自動發布至 GitHub Release。

---

## 🛠️ [v1.3.6] - 2026-11-04

### ✨ 功能與建置優化 (Enhancements & Builds)
* **精選故事文章置頂呈現**：
  - 景點深度說書閱讀彈窗（Reader Modal）版面優化，將完整的歷史背景、建築特色與深度人文長文置頂優先展示，提供更優質的沈浸式閱讀體驗。
* **Capacitor 核心依賴項補齊**：
  - 將 `@capacitor/core`、`@capacitor/android`、`@capacitor/cli` 明確寫入 `package.json`，確保在 CI/CD 環境與本機執行 `npm run cap:sync` 時 Gradle 同步 100% 成功。

---

## 🛡️ [v1.3.5] - 2026-11-04

### 🐛 錯誤修復與優化 (Bug Fixes)
* **嚴格景點去重演算法 (Zero-Duplicate Algorithm)**：
  - 修復多日行程可能出現同名景點的問題，加入兩道過濾機制（Prompt 強約束 + 程式後處理防重複過濾），確保天數再長也不會出現重複景點。
* **差異化特色住宿與美食輪替**：
  - 消除每日相同民宿或範本化文字，每日住宿推薦依區域特色輪替，美食小吃每日推薦不同招牌名產。
* **CI 建置相容性升級**：
  - GitHub Actions 建置指令加入 `--legacy-peer-deps` 參數，避免 npm 在 React 19 與特定套件間的 peer 依賴衝突。

---

## 🎙️ [v1.3.4] - 2026-11-04

### 🌟 新功能與介面調整 (UI & Voice)
* **首頁精簡頂部佈局**：
  - 重新整理探索頁面頂部卡片，聚焦即時導覽、推薦路線與語音聽書入口。
* **OpenAI GPT 語音語音合成（TTS）引擎整合**：
  - 支援 OpenAI `tts-1` 高擬真語音朗讀，提供 nova（溫暖知性）、alloy、shimmer、onyx（低沈沉穩）等專業主播級音質，並內建記憶體快取避免重複耗費額度。

---

## 📱 [v1.3.3] - 2026-11-04

### 🎨 介面與體驗優化 (UX Improvements)
* **手機視窗底部導覽列固定 (Pinned Mobile Navigation)**：
  - 解決 Android WebView 與不同螢幕高度下底部功能選單偶發漂浮或被內容推擠的問題。
  - 將底部導覽列鎖定於 Viewport 底部，達到與原生 Android App 一致的流暢操控體驗。

---

## 📍 [v1.3.2] - 2026-11-04

### 🛰️ 定位功能升級 (Location Enhancements)
* **戶外/室內雙模智慧定位支援**：
  - 支援戶外高精度硬體 GPS (`enableHighAccuracy: true`) 與室內基地台/行動網路 IP 定位自動切換。
  - 當使用者位於室內、地下室或 GPS 訊號微弱處時，自動退回網路定位，確保行程與附近景點探索永不中斷。

---

## 📡 [v1.3.1] - 2026-11-04

### 🎯 精度顯示與硬體優先 (GPS Precision)
* **硬體 GPS 優先度調校**：
  - 提升原生硬體 GPS 取樣權重，大幅降低定位飄移。
  - 介面即時標記定位來源（如「硬體高精度 GPS」或「網路輔助定位」）並顯示精確度公尺數（Accuracy ±m）。

---

## 🧠 [v1.3.0] - 2026-11-04

### 🤖 AI 引擎核心躍升 (Dual AI Architecture)
* **整合 OpenAI GPT-4o-mini 與 Google Gemini 雙引擎架構**：
  - 導入客製化 API Key 與模型選擇介面，可自由切換 GPT-4o-mini 或 Gemini 模型。
  - 強化台灣在地文史、俚語、在地小吃與古蹟建築的語意理解能力，產生更高質感的語音說書腳本。

---

## 📦 [v1.2.0] - 2026-11-04

### 🤖 Android 原生權限與自動發布 (Android Native)
* **原生 Android 權限設定**：
  - 配置 `AndroidManifest.xml` 中的 `ACCESS_FINE_LOCATION` 與 `ACCESS_COARSE_LOCATION` 原生權限。
* **CI/CD 自動化釋出**：
  - 建立 GitHub Actions 工作流程，固定 Debug Keystore 簽章，自動將產出的 APK 上傳至 GitHub Release。

---

## 🧭 [v1.1.0] - 2026-11-04

### 🗺️ 附近景點探索與離線韌性 (Nearby Exploration & Offline Engine)
* **即時鄰近景點里程計算**：
  - 根據經緯度即時計算使用者與台灣各景點的距離（公里數），並依近到遠動態排序。
* **本機離線智慧排程保底機制**：
  - 當遇到無網路或 AI 服務短暫不可用時，自動啟動本地景點演算法，無縫組裝出符合主題的推薦行程。

---

## 🏁 [v1.0.0] - 2026-11-04

### 🚀 初始發布 (Initial Release)
* **全台 22 縣市景點文史資料庫**：
  - 涵蓋台北、新北、宜蘭、花蓮、台東、台南、高雄等 22 縣市的深度景點。
* **三大導覽維度**：
  - 歷史背景深度文史、建築空間美學特色、在地特色飲食文化。
* **智慧行程規劃器**：
  - 支援 1 至 5 日多日行程規劃，可依出遊偏好（文青放鬆、親子同樂、戶外生態等）客製推薦。
* **Capacitor 混合原生架構**：
  - React 19 + TypeScript + Vite 現代化前端架構，無縫封裝為 Android 原生 APK。

---

## 📥 最新版本下載 (Downloads)
* **最新穩定版 APK**：請至 GitHub 專案的 [Releases 頁面](https://github.com/ychao-tmail/ilamTravelApp/releases) 下載最新安裝檔（例如 `deepgo-taiwan-v1.4.0-debug.apk`）。
* **原始碼庫**：[https://github.com/ychao-tmail/ilamTravelApp](https://github.com/ychao-tmail/ilamTravelApp)
