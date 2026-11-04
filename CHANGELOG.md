# 📝 AI深旅 (DeepGo Taiwan) - 版本更新記錄 (Changelog)

本文檔詳細記錄 **全台 AI 深度旅遊導覽平台「AI深旅 (DeepGo Taiwan)」** 的版本發布歷程、核心新增功能、架構重構與優化修正。

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
