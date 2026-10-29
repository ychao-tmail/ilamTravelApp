# 全台 AI 深度旅遊導覽平台 - Capacitor Android APK 打包與雲端後端連網架構規劃

本規劃旨在將現有的「全台 AI 深度旅遊導覽平台 (React 19 + TypeScript + Vite + Express + Gemini)」透過 **Capacitor 原生容器技術**，打包轉化為可安裝於 Android 智慧型手機的 `.apk` 原生應用程式。配合使用者確認之「**後端部署連網模式**」，系統將前端 UI 封裝於 APK 本機，後端 Express 伺服器與 Gemini AI 部署於雲端，前端透過可配置之 API 基礎網址與遠端伺服器安全通訊。

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **已於前期問答確認之核心決策：**
> 1. **封裝框架**：採用 **Capacitor 原生容器封裝**（標準 Android 原生工程，產出相容各大手機品牌的 `.apk` 安裝包）。
> 2. **網路架構模式**：**純連網模式**（行程規劃、AI 深度說書詞均依賴雲端伺服器即時運算；當連線中斷時提供友善連線提示與重試機制）。
> 3. **API 網址配置**：**支援環境變數切換**（預設指向當前雲端託管網址，可透過 `VITE_API_BASE_URL` 或應用內設定自由切換測試與生產端點）。

---

## 1. Overview & Core Concept

* **產品型態**：以 Capacitor Android 原生容器包裹現有 React SPA，支援觸控手勢、沉浸式全螢幕操作與 Android 硬體返回鍵。
* **使用者族群**：台灣深度文化旅行者、文史愛好者、家庭旅遊與自駕自由行旅客。
* **核心價值**：
  * 手機桌布獨立圖示與原生 App 體驗，無需瀏覽器網址列干擾。
  * 完整保留全台 22 縣市真實文史深度專文庫、AI 一鍵說書詞客製、智慧行程規劃與學習紀錄。
  * 雲端後端代管 `GEMINI_API_KEY`，確保金鑰永不暴露於手機客戶端。

---

## 2. User Experience & Visual Design

### Key User Flows
1. **啟動與連線檢測**：點擊桌面 App 圖示啟動，畫面載入本機快顯資源，背景檢查雲端後端連線狀態（綠燈正常／橘燈伺服器休眠喚醒中）。
2. **全台景點探索與專文閱讀**：透過下導覽列瀏覽全台景點，點擊卡片閱讀深度歷史身世、建築密碼與常民美食。
3. **雲端 AI 一鍵說書詞**：在語音播放器中點擊「一鍵產生說書詞」，客戶端透過遠端 API 呼叫 Gemini 3.8 Flash 雲端模型，即時回傳客製化語音文本並以手機 TTS 朗讀。
4. **AI 智慧行程規劃**：輸入自訂天數、縣市與出遊風格，遠端生成故事化多日行程並自動儲存至本機 LocalStorage。
5. **後端連線設定（工程與維運輔助）**：在頂部狀態標籤點擊可檢視或更新當前連線之後端伺服器網址（支援開發預設網址與自訂雲端網址）。

### Visual Identity & Touch Ergonomics (依據 Mobile Touch Guidelines)
* **色彩調性**：延續海島風土美學（深藍海軍調 `#13294B`、暖金琥珀 `#E8A02C`、米白風土底色 `#FAF8F5`）。
* **觸控靶區**：所有底部 Tab 項目、音訊播放控制鈕、篩選標籤均維持 $\ge 44 \times 44\text{px}$ 觸控範圍，避免戶外走動時誤觸。
* **狀態感知**：新增網路連線異常與伺服器連線中斷時的輕量橫幅通知，並提供「重試連線」按鈕。

---

## 3. Key Product Decisions & Trade-Offs

### 決策 1：採 Capacitor 封裝而非純網頁或 React Native 重寫
* **選擇方案**：Capacitor 7.x 容器封裝。
* **原因**：目前 React 19 + Tailwind 前端已有極高的完成度與豐富的深度文史內容。Capacitor 能 100% 沿用既有 UI 與商務邏輯，省去 90% 重複開發時間，且產出乾淨標準的 Android Studio Gradle 專案。
* **替代方案評估**：React Native 需全數重寫 UI 元件與手勢；純 PWA 需使用者自行操作瀏覽器「加到主畫面」，在部分品牌手機上引導成本較高。

### 決策 2：前後端分離式 API Client 架構
* **選擇方案**：建立集中式 `src/api/client.ts`，根據執行環境動態決定請求基礎網址：
  * 在 Web 開發環境：使用相對路徑 `/api/*`。
  * 在 APK 原生環境：優先取用 `VITE_API_BASE_URL`，預設回退至當前已運行的 Cloud Run 網址 (`https://ais-dev-4c77ogdycvrhx7f7azn4an-369482150771.asia-east1.run.app`)。
* **原因**：解決 APK 本機 `capacitor://localhost` 呼叫相對路徑會 404 的原生跨網域問題。

---

## 4. Technical Architecture & Data Strategy

### 系統架構圖 (System Architecture)

```
┌──────────────────────────────────────────────────────────────┐
│                  Android 手機裝置 (APK 客戶端)                 │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │               Capacitor Native Shell 容器              │  │
│  │  - Android WebView                                     │  │
│  │  - Capacitor Text-to-Speech (原生語音插件/WebSpeech)   │  │
│  │  - 狀態列 / 螢幕旋轉 / 返回鍵原生控制                  │  │
│  └──────────────────────────┬─────────────────────────────┘  │
│                             │                                │
│  ┌──────────────────────────▼─────────────────────────────┐  │
│  │               React 19 SPA (前端靜態資源)               │  │
│  │  - ExploreTab (全台22縣市深度專文)                     │  │
│  │  - AiPlannerTab (多日行程智慧規劃)                     │  │
│  │  - MyItineraryTab (行程管理與離線清單)                 │  │
│  │  - LearningRecordTab (風土成就徽章)                    │  │
│  │  - LocalStorage (行程、走訪紀錄持久化儲存)             │  │
│  └──────────────────────────┬─────────────────────────────┘  │
│                             │                                │
│                             │ HTTPS REST Calls               │
└─────────────────────────────┼────────────────────────────────┘
                              │ (Bearer / JSON)
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    雲端伺服器 (Cloud Server)                 │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Express API Server (server.ts)            │  │
│  │  - POST /api/guided-story (說書詞客製化)               │  │
│  │  - POST /api/itinerary-plan (AI 行程規劃)              │  │
│  │  - CORS 白名單 (允許 capacitor://localhost 與自訂網域) │  │
│  └──────────────────────────┬─────────────────────────────┘  │
│                             │                                │
│                             │ Google GenAI SDK (3.8 Flash)   │
│                             ▼                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │             Google Gemini API (安全保管 API KEY)       │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 具體實施工作項目與規劃步驟

1. **API 連線中介層 (`src/api/client.ts`)**：
   * 封裝 `guidedStory()` 與 `itineraryPlan()`。
   * 自動整合 `VITE_API_BASE_URL` 與預設 Cloud Run 服務網址，自動包含健全的網路超時與連線異常提示。
2. **後端 CORS 跨域支援 (`server.ts`)**：
   * 確保 Express 允許來自 `capacitor://localhost`、`http://localhost` 以及本機除錯網址的 Cross-Origin 請求。
3. **Capacitor 專案設定檔 (`capacitor.config.ts`)**：
   * 宣告 `appId: "com.deepgo.taiwan"`、`appName: "AI深旅 DeepGo"`、`webDir: "dist"`。
   * 配置 Android Cleartext 流量政策與伺服器逾時防護。
4. **前端呼叫點切換**：
   * 更新 `ExploreTab.tsx` 與 `AiPlannerTab.tsx`，改用新建立之 `apiClient` 模組。
5. **產生 Android 原生目錄與打包腳本**：
   * 安裝 `@capacitor/core`、`@capacitor/cli`、`@capacitor/android`。
   * 執行前端建置 `npm run build`。
   * 初始化 `android/` 目錄並產出可供 Android Studio 一鍵建置的 `.apk` 建置指示手冊 (`ANDROID_BUILD_GUIDE.md`)。

---

## 5. Verification Plan

1. **本機 Web 編譯驗證**：執行 `compile_applet` 確保加入 Capacitor 與 API Client 後，前端建置零錯誤。
2. **API 端點跨域驗證**：測試連線雲端後端，確認 `/api/guided-story` 與 `/api/itinerary-plan` 能正常回應且無跨域阻擋。
3. **Capacitor 靜態資源同步驗證**：驗證 `dist/` 輸出目錄結構完整，`capacitor.config.ts` 解析正確。
4. **Android 專案骨架就緒**：產出完整 Android Studio 工程檔案與手冊，方便隨時進行 Gradle APK 建置。
