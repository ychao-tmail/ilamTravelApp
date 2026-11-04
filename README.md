# 🇹🇼 AI深旅 (DeepGo Taiwan) - 全台 AI 深度旅遊導覽平台

[![Latest Release](https://img.shields.io/github/v/release/ychao-tmail/ilamTravelApp?label=APK%20Release&color=blue)](https://github.com/ychao-tmail/ilamTravelApp/releases)
[![Build & Release APK](https://github.com/ychao-tmail/ilamTravelApp/actions/workflows/build-apk.yml/badge.svg)](https://github.com/ychao-tmail/ilamTravelApp/actions/workflows/build-apk.yml)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Android%20APK-green)](https://github.com/ychao-tmail/ilamTravelApp)

**AI深旅 (DeepGo Taiwan)** 是一款結合 **地理空間合理性演算法** 與 **OpenAI GPT-4o-mini / Google Gemini 雙 AI 引擎** 的全台深度旅遊導覽應用程式。

專為喜愛台灣在地文史、空間建築與道地飲食的旅客設計，提供「零折返合理路徑排程」、「每日午晚餐必吃推薦」、「Google Maps 一鍵導航」與「AI 語音說書」等核心功能。

---

## 📲 最新 Android APK 下載

👉 **前往 [GitHub Releases 頁面下載最新版 APK](https://github.com/ychao-tmail/ilamTravelApp/releases)**

* **最新版本**: `v1.4.0`
* **APK 檔案**: `deepgo-taiwan-v1.4.0-debug.apk`
* **安裝方式**: 下載後直接在 Android 手機上點選安裝（允許安裝未知來源應用程式）即可使用。

---

## ✨ 核心亮點特色

1. **AI 行程地理合理性排程 (v1.4.0)**
   - 空間相鄰聚合演算法，避免跨區折返奔波（告別折返跑）。
   - 自動精算前後景點間預估里程與移動時間，旅行節奏更順暢。
2. **每日專屬午餐與晚餐/夜市推薦小卡 (v1.4.0)**
   - 每日行程獨立附帶「在地特色午餐」與「夜市/商圈晚餐」推薦卡。
   - 包含招牌必吃品項、預算花費估算與精確地址。
3. **Google 地圖一鍵即時導航**
   - 景點卡片與美饌小卡均配備一鍵導航按鈕，無縫叫起手機 Google 地圖 App。
4. **雙 AI 說書與行程規劃引擎**
   - 支援 OpenAI GPT-4o-mini 與 Google Gemini，深度挖掘全台 22 縣市的人文故事與歷史背景。
5. **高擬真語音說書 (TTS)**
   - 內建溫暖主播音色（nova, shimmer, alloy, onyx），隨走隨聽在地故事。
6. **戶外/室內雙模定位**
   - 戶外啟動高精度硬體 GPS，室內自動切換基地台/網路定位，全場景自動計算景點距離。

---

## 📚 專案文檔

* 📝 **[版本更新記錄 (CHANGELOG.md)](./CHANGELOG.md)**：詳細記錄 v1.0.0 至 v1.4.0 的完整變更。
* 📱 **[Android APK 建置與打包操作手冊 (ANDROID_BUILD_GUIDE.md)](./ANDROID_BUILD_GUIDE.md)**：本機 Android Studio 與 CLI 編譯指南。

---

## 🛠️ 技術架構

* **前端核心**：React 19 + TypeScript + Vite + Tailwind CSS
* **原生行動容器**：Capacitor 8 (Android Native)
* **後端服務**：Express + Node.js (支援動態 PORT 與全端靜態資產掛載)
* **AI 服務**：OpenAI API (GPT-4o-mini, TTS-1) + Google GenAI SDK (Gemini)
* **CI/CD**：GitHub Actions 自動化 Gradle 建置與 Release 發布流程

---

## 💻 本地端開發 (Local Development)

```bash
# 1. 安裝相依套件
npm install

# 2. 啟動開發伺服器 (包含前端與後端 API)
npm run dev

# 3. 測試前端編譯
npm run build

# 4. 同步至 Android 原生工程
npm run cap:sync
```

---

## 📄 授權說明
本專案採用 MIT 授權條款。
