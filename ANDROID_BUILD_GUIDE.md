# 全台 AI 深度旅遊導覽平台 - Android APK 建置與打包操作手冊

本專案已成功配置 **Capacitor 原生容器**，將 React 19 + TypeScript + Vite 前端封裝為標準 Android 原生工程。以下為您產出與匯出 `.apk` 檔案的完整操作步驟。

---

## 快速摘要 (Quick Start)

* **應用程式識別碼 (Package ID)**: `com.deepgo.taiwan`
* **應用程式名稱**: `AI深旅 DeepGo`
* **連網模式**: 純連網架構（前端打包於手機，AI 運算與說書詞生成請求傳送至雲端伺服器）
* **預設雲端後端**: `https://ais-dev-4c77ogdycvrhx7f7azn4an-369482150771.asia-east1.run.app`

---

## 方法一：使用 Android Studio 一鍵編譯 APK（推薦）

如果您本機已安裝 [Android Studio](https://developer.android.com/studio)：

### 1. 同步前端靜態檔案至 Android 目錄
在專案終端機中執行：
```bash
npm run cap:sync
```
此指令會自動執行 `vite build` 並將最新的前端程式碼複製至 `android/app/src/main/assets/public/`。

### 2. 使用 Android Studio 開啟工程
在終端機執行：
```bash
npx cap open android
```
或者手動開啟 Android Studio，點選 **Open** 並選擇本專案底下的 `android` 資料夾。

### 3. 編譯產出 APK
1. 等待 Android Studio 右下角的 Gradle Sync 完成。
2. 點選頂部功能表：**Build > Build Bundle(s) / APK(s) > Build APK(s)**。
3. 編譯完成後，右下角會跳出通知：**"APK(s) generated successfully."**
4. 點選通知中的 **locate**，即可開啟資料夾找到編譯好的 APK：
   * 檔案路徑：`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 方法二：使用命令列 (CLI) 無介面編譯 APK

若您在 Linux / macOS / CI 環境或未開啟 Android Studio：

```bash
# 1. 確保最新前端建置已同步
npm run cap:sync

# 2. 進入 android 目錄
cd android

# 3. 執行 Gradle 編譯 Debug APK
./gradlew assembleDebug
```
編譯完成後，APK 即位於：
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 如何將 APK 安裝到 Android 手機

### 方式 A：透過 USB 傳輸線或雲端硬碟直接安裝（最簡單）
1. 將產出的 `app-debug.apk` 檔案上傳至 Google 雲端硬碟、LINE，或透過 USB 傳輸線直接複製到手機的「下載 (Download)」資料夾。
2. 在手機上開啟該檔案，系統會詢問是否允許「安裝未知來源應用程式」。
3. 點選「允許」並完成安裝，即可在手機桌面看到 **AI深旅 DeepGo** 圖示！

### 方式 B：透過 ADB 指令安裝
如果手機開啟了「開發人員選項」與「USB 偵錯」：
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 雲端後端與 API 連線說明

1. **連線設定**：
   * APK 預設會連線至目前的雲端伺服器。
   * 進入 App 後，點選頂部導覽列右側的 **「APK連網 ⚙️」** 標籤，可隨時測試與雲端伺服器的即時延遲（Ping），或手動輸入自訂的後端主機網址。
2. **CORS 跨域設定**：
   * 專案後端 `server.ts` 已配置允許 `capacitor://localhost` 與原生網域的跨來源請求（CORS），確保 AI 行程規劃與語音說書詞順利回傳。
3. **手機語音播放**：
   * 系統已整合 Android WebView 原生 `Web Speech API`，並針對台灣繁體中文（`zh-TW`）與英文語音包進行發音優化。
