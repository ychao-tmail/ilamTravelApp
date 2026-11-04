# 行程里程合理性優化、Google 導航直開、午晚餐小卡推薦 完成清單

## 1. 里程合理性與移動流暢性 (Geographic Rationality & Flow)
- **廊道聚類 (District Clustering)**：重構本地智慧規劃引擎 (`src/services/localPlannerEngine.ts`) 與後端大模型規劃提示詞（Gemini / OpenAI GPT），將每日行程鎖定在同一生活圈或相鄰廊道（如大稻埕•中山老城、士林外雙溪、信義松山），堅決避免東西南北折返奔波。
- **里程與時程試算**：
  - 依照旅客選定的交通模式（🚗 汽車、🛵 機車、🚇 捷運/公車、🚶 步行），精算相鄰景點之移動里程 (`distanceFromPrevKm`) 與耗時 (`travelTimeDesc`)。
  - 行程卡片間插入順向移動標籤（如：`🚗 車程約 8 分鐘 · 2.2 公里`）與銜接導軌線。
  - 每日頂部提供「當日遊歷生活圈」與「全日預估移動里程」摘要徽章。

## 2. 景點 Google Maps 導航按鈕 (Direct Google Navigation)
- 在「我的行程 (`MyItineraryTab.tsx`)」的每個景點卡片右側，新增醒目的 **`🧭 Google 導航`** 按鈕。
- 點擊後以標準 URL Scheme (`https://www.google.com/maps/dir/?api=1&destination=...`) 開啟：
  - 在 Android 手機（含本 APK）自動喚起原生 Google 地圖 App 並帶入導航目的地。
  - 在瀏覽器自動開啟 Google 地圖路線規劃。
- 行程路線圖彈窗中的每張景點小卡亦同步配置 **`🧭 導航`** 按鈕。
- 推薦住宿卡片同步新增 **`🧭 旅宿導航`** 按鈕。

## 3. 獨立午餐與晚餐/夜市推薦小卡 (Dedicated Lunch & Dinner Cards)
- 資料模型擴充 `MealRecommend` 結構（包含 `name` 店名、`dish` 招牌必吃品項、`cost` 預估花費、`highlight` 特色小評、`location` 確切地址）。
- 每日行程獨立展示：
  - **`🥢 在地午餐推薦小卡`**（金橘色調高質感小卡，標示店家、招牌必吃品項與花費，附專屬 `🧭 Google 導航` 按鈕）。
  - **`🏮 晚餐 / 夜市推薦小卡`**（深藍紫夜市色調小卡，標示特色夜市/人氣名攤、排隊亮點與花費，附專屬 `🧭 Google 導航` 按鈕）。
- 兼容舊版歷史行程文字備案，保障歷史存檔平順過渡。
