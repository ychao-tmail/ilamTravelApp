import { useState, CSSProperties } from "react";
import { CheckSquare, Square, Calendar, Plus, Compass, Trash2, ArrowRight, CornerDownRight, Sparkles, Map, X, ChevronLeft, ChevronRight, Navigation, BookOpen } from "lucide-react";
import { DayItinerary, SavedItinerary } from "../types";

const getSpotCoords = (spotName: string): { x: number; y: number; region: string; bg: string } => {
  const name = spotName || "";
  
  // 台北 / 新北 / 基隆 (北部)
  if (name.includes("101") || name.includes("故宮") || name.includes("大稻埕") || name.includes("迪化") || name.includes("台北") || name.includes("西門") || name.includes("陽明山") || name.includes("北投") || name.includes("士林")) {
    return { x: 64, y: 16, region: "台北市", bg: "🏙️" };
  }
  if (name.includes("九份") || name.includes("淡水") || name.includes("紅毛城") || name.includes("野柳") || name.includes("十分") || name.includes("烏來") || name.includes("三峽") || name.includes("新北")) {
    return { x: 67, y: 14, region: "新北市", bg: "🏮" };
  }
  if (name.includes("基隆") || name.includes("廟口") || name.includes("正濱") || name.includes("和平島") || name.includes("潮境")) {
    return { x: 70, y: 11, region: "基隆市", bg: "⚓" };
  }
  
  // 宜蘭 (東北)
  if (name.includes("林場") || name.includes("林業") || name.includes("羅東")) {
    return { x: 74, y: 25, region: "宜蘭羅東", bg: "🌲" };
  }
  if (name.includes("生態綠舟") || name.includes("冬山") || name.includes("斑比")) {
    return { x: 76, y: 28, region: "宜蘭冬山", bg: "⛵" };
  }
  if (name.includes("冷泉") || name.includes("蘇澳") || name.includes("南方澳")) {
    return { x: 78, y: 32, region: "宜蘭蘇澳", bg: "🫧" };
  }
  if (name.includes("礁溪") || name.includes("頭城") || name.includes("宜蘭")) {
    return { x: 72, y: 22, region: "宜蘭縣", bg: "♨️" };
  }

  // 桃園 / 新竹 / 苗栗 (西北)
  if (name.includes("桃園") || name.includes("大溪") || name.includes("石門") || name.includes("拉拉山")) {
    return { x: 54, y: 20, region: "桃園市", bg: "🌸" };
  }
  if (name.includes("新竹") || name.includes("城隍廟") || name.includes("司馬庫斯") || name.includes("內灣") || name.includes("北埔")) {
    return { x: 48, y: 25, region: "新竹縣市", bg: "💨" };
  }
  if (name.includes("苗栗") || name.includes("勝興") || name.includes("龍騰") || name.includes("三義") || name.includes("南庄") || name.includes("泰安")) {
    return { x: 44, y: 32, region: "苗栗縣", bg: "🪵" };
  }

  // 台中 / 彰化 / 南投 / 雲林 (中部)
  if (name.includes("高美") || name.includes("逢甲") || name.includes("宮原") || name.includes("審計") || name.includes("台中") || name.includes("歌劇院")) {
    return { x: 40, y: 40, region: "台中市", bg: "🌇" };
  }
  if (name.includes("鹿港") || name.includes("彰化") || name.includes("八卦山") || name.includes("扇形車庫") || name.includes("田尾")) {
    return { x: 34, y: 45, region: "彰化縣", bg: "⛩️" };
  }
  if (name.includes("日月潭") || name.includes("清境") || name.includes("合歡山") || name.includes("溪頭") || name.includes("埔里") || name.includes("南投")) {
    return { x: 50, y: 47, region: "南投縣", bg: "🛶" };
  }
  if (name.includes("雲林") || name.includes("北港") || name.includes("古坑") || name.includes("西螺")) {
    return { x: 32, y: 53, region: "雲林縣", bg: "🎋" };
  }

  // 嘉義 / 台南 / 高雄 / 屏東 (南部)
  if (name.includes("阿里山") || name.includes("嘉義") || name.includes("檜意") || name.includes("故宮南院") || name.includes("奮起湖")) {
    return { x: 40, y: 60, region: "嘉義縣市", bg: "🚂" };
  }
  if (name.includes("安平") || name.includes("赤崁") || name.includes("台南") || name.includes("奇美") || name.includes("國華街") || name.includes("神農街")) {
    return { x: 30, y: 68, region: "台南市", bg: "🏯" };
  }
  if (name.includes("駁二") || name.includes("旗津") || name.includes("西子灣") || name.includes("高雄") || name.includes("愛河") || name.includes("瑞豐")) {
    return { x: 32, y: 76, region: "高雄市", bg: "🚢" };
  }
  if (name.includes("墾丁") || name.includes("鵝鑾鼻") || name.includes("恆春") || name.includes("小琉球") || name.includes("海生館") || name.includes("屏東")) {
    return { x: 42, y: 88, region: "屏東縣", bg: "🏖️" };
  }

  // 花蓮 / 台東 (東部)
  if (name.includes("太魯閣") || name.includes("七星潭") || name.includes("花蓮") || name.includes("東大門") || name.includes("瑞穗") || name.includes("清水斷崖")) {
    return { x: 70, y: 44, region: "花蓮縣", bg: "⛰️" };
  }
  if (name.includes("伯朗大道") || name.includes("池上") || name.includes("三仙台") || name.includes("台東") || name.includes("鹿野") || name.includes("知本") || name.includes("綠島")) {
    return { x: 62, y: 70, region: "台東縣", bg: "🌾" };
  }

  // 離島
  if (name.includes("澎湖") || name.includes("跨海大橋") || name.includes("七美") || name.includes("摩西分海")) {
    return { x: 16, y: 50, region: "澎湖群島", bg: "🌊" };
  }
  if (name.includes("金門") || name.includes("莒光樓") || name.includes("翟山") || name.includes("烈嶼")) {
    return { x: 12, y: 22, region: "金門列島", bg: "🎖️" };
  }
  if (name.includes("馬祖") || name.includes("芹壁") || name.includes("南竿") || name.includes("北竿") || name.includes("連江")) {
    return { x: 22, y: 10, region: "連江馬祖", bg: "🏘️" };
  }

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const x = 35 + Math.abs((hash % 35));
  const y = 25 + Math.abs(((hash >> 3) % 55));
  return { x, y, region: "台灣在地", bg: "📍" };
};

interface MyItineraryTabProps {
  itinerary: DayItinerary[];
  savedItineraries: SavedItinerary[];
  activeItineraryId: string;
  onSelectItinerary: (id: string) => void;
  onDeleteItinerary: (id: string) => void;
  visitedSpots: string[];
  onToggleVisited: (spotName: string) => void;
  onClearItinerary?: () => void;
  onChangeTab?: (tab: string) => void;
  onOpenSpotGuide?: (spotName: string, theme?: string) => void;
}

export default function MyItineraryTab({
  itinerary,
  savedItineraries,
  activeItineraryId,
  onSelectItinerary,
  onDeleteItinerary,
  visitedSpots,
  onToggleVisited,
  onClearItinerary,
  onChangeTab,
  onOpenSpotGuide
}: MyItineraryTabProps) {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [activeSpotIndex, setActiveSpotIndex] = useState<number>(0);

  const totalDestinationsCount = itinerary.reduce((sum, day) => sum + day.activities.length, 0);
  const visitedDestinationsCount = visitedSpots.length;
  const progressPercent = totalDestinationsCount > 0 ? Math.round((visitedDestinationsCount / totalDestinationsCount) * 100) : 0;

  const routeSpots = itinerary.flatMap((day) =>
    day.activities.map((act) => ({
      ...act,
      dayNum: day.dayNum,
      coords: getSpotCoords(act.title)
    }))
  );

  return (
    <div className="space-y-6 fade-in p-1">
      {/* Dynamic progress bar header */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-50 text-[#E8A02C] rounded-lg">
              <Calendar className="w-4 h-4" />
            </span>
            <div>
              <h4 className="font-bold text-gray-900 text-sm font-display">台灣深度行腳走讀</h4>
              <p className="text-xs text-gray-400">打卡走訪全台名勝，解鎖文化學習徽章與導覽紀錄</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#13294B] bg-[#13294B]/5 px-2.5 py-1 rounded-full">
            {visitedDestinationsCount} / {totalDestinationsCount} 景點
          </span>
        </div>

        {/* Dynamic progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-gray-400 font-mono font-medium">
            <span>探索進度</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
            <div
              className="h-full bg-gradient-to-r from-[#D2691E] to-[#E8A02C] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* View Map Button & Route info */}
        <div className="pt-1 select-none">
          <button
            onClick={() => {
              setActiveSpotIndex(0);
              setIsMapOpen(true);
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#13294B] hover:bg-[#1E3E62] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer"
          >
            <Map className="w-3.5 h-3.5" />
            <span>🗺️ 查看路線地圖</span>
          </button>
        </div>
      </div>

      {/* 行程多檔案切換清單 */}
      <div className="space-y-2">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block font-mono">
          🗂️ 我的所有行程清單 ({savedItineraries.length})
        </span>
        
        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
          {savedItineraries.map((sItem) => {
            const isActive = sItem.id === activeItineraryId;
            return (
              <div
                key={sItem.id}
                onClick={() => onSelectItinerary(sItem.id)}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  isActive
                    ? "border-[#E8A02C] bg-white shadow-xs ring-1 ring-[#E8A02C]"
                    : "border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200"
                }`}
              >
                <div className="space-y-1 flex-1 pr-1 truncate">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {isActive ? (
                      <span className="bg-[#E8A02C]/10 text-[#E8A02C] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0">
                        正在使用
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0">
                        備用行程
                      </span>
                    )}
                    <h5 className="font-bold text-xs text-gray-900 truncate font-display">
                      {sItem.title}
                    </h5>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-mono">
                    <span>{sItem.days} 天分頁</span>
                    <span>•</span>
                    <span className="truncate">{sItem.regions.join("、")}</span>
                    <span>•</span>
                    <span>{sItem.createdAt}</span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("確信要刪除這份行程檔案嗎？")) {
                      onDeleteItinerary(sItem.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0"
                  title="刪除行程"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day selectors tabs */}
      {(() => {
        const currentActiveDay = activeDay > itinerary.length ? 1 : activeDay;
        
        return (
          <>
            <div className="flex items-center justify-between border-b border-gray-200">
              <div className="flex gap-2 -mb-px">
                {itinerary.map((day) => (
                  <button
                    key={day.dayNum}
                    onClick={() => setActiveDay(day.dayNum)}
                    className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
                      currentActiveDay === day.dayNum
                        ? "border-[#13294B] text-[#13294B] font-bold"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    第 {day.dayNum} 天
                  </button>
                ))}
                {itinerary.length === 0 && (
                  <div className="p-3 text-gray-400 text-xs">暫無天數行程</div>
                )}
              </div>

              {/* Actions */}
              {onClearItinerary && (
                <button
                  onClick={onClearItinerary}
                  className="text-xs text-red-600 hover:text-[#D2691E] flex items-center gap-1 bg-amber-50 hover:bg-amber-100/70 border border-amber-100 px-2.5 py-1 rounded-lg transition-all font-medium mb-1.5"
                >
                  <Trash2 className="w-3 h-3" /> 重啟/清空
                </button>
              )}
            </div>

            {/* Day Activities list */}
            <div className="space-y-4">
              {itinerary.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400 text-xs space-y-3">
                  <p>目前行程表為空</p>
                  {onChangeTab && (
                    <button
                      _id="goto-planner-btn"
                      onClick={() => onChangeTab("planner")}
                      className="bg-[#13294B] text-white px-4 py-2 rounded-xl text-xs font-semibold inline-block mx-auto"
                    >
                      前往 AI 規劃行程
                    </button>
                  )}
                </div>
              ) : (
                itinerary
                  .filter((day) => day.dayNum === currentActiveDay)
                  .map((day) => (
              <div key={day.dayNum} className="space-y-3">
                {/* Dynamically display lodging and food suggestions if configured */}
                {day.lodging && (
                  <div className="bg-[#EDF4FF] border border-blue-100 rounded-2xl p-4 shadow-xs flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">🏡</span>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block font-mono">今日推薦住宿處</span>
                      <p className="text-xs text-blue-950 font-bold leading-relaxed">{day.lodging}</p>
                    </div>
                  </div>
                )}

                {day.foodRecommend && (
                  <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 shadow-xs flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">🍽️</span>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest block font-mono">今日特色美食推薦</span>
                      <p className="text-xs text-amber-950 font-bold leading-relaxed">{day.foodRecommend}</p>
                    </div>
                  </div>
                )}

                {day.activities.map((act, index) => {
                  const isVisited = visitedSpots.includes(act.title);
                  return (
                    <div
                      key={index}
                      className={`bg-white rounded-2xl border p-4 transition-all shadow-xs flex items-start gap-3 justify-between ${
                        isVisited
                          ? "border-emerald-100/80 bg-emerald-50/10"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                      id={`itinerary-act-${index}`}
                    >
                      <div className="flex gap-3">
                        {/* Checkbox trigger visit */}
                        <button
                          onClick={() => onToggleVisited(act.title)}
                          className="flex-shrink-0 mt-0.5 text-gray-400 hover:text-[#13294B] transition-all focus:outline-none"
                          title="點擊標記走訪"
                        >
                          {isVisited ? (
                            <CheckSquare className="w-5.5 h-5.5 text-emerald-600 stroke-[2.5]" />
                          ) : (
                            <Square className="w-5.5 h-5.5 text-gray-300 hover:text-gray-400" />
                          )}
                        </button>

                        <div className="space-y-1.5">
                          {/* Time & Title */}
                          <div className="flex items-center gap-2">
                            <span className="bg-[#13294B]/5 text-gray-500 font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                              {act.time}
                            </span>
                            <h4 className={`font-bold text-sm font-display ${isVisited ? "text-gray-500 line-through" : "text-gray-900"}`}>
                              {act.title}
                            </h4>
                          </div>

                          {/* Highlight and metadata */}
                          <div className="space-y-1 text-xs text-gray-600 leading-relaxed">
                            <p className="flex items-start gap-1">
                              <CornerDownRight className="w-3.5 h-3.5 mt-0.5 text-gray-300 flex-shrink-0" />
                              <span>{act.highlight}</span>
                            </p>
                            <div className="flex flex-wrap items-center gap-2 pl-4 pt-1">
                              <span className="bg-[#D2691E]/5 text-[#D2691E] border border-[#D2691E]/10 text-[9px] px-1.5 py-0.5 rounded-full font-semibold">
                                💰 {act.cost}
                              </span>
                              <span className="bg-[#13294B]/5 text-[#13294B] border border-[#13294B]/10 text-[9px] px-1.5 py-0.5 rounded-full font-semibold">
                                📚 導覽主題：{act.theme}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Guide link flag */}
                      {onOpenSpotGuide ? (
                        <button
                          onClick={() => onOpenSpotGuide(act.title, act.theme)}
                          className="text-[#13294B] hover:text-[#E8A02C] text-[11px] font-bold py-1.5 px-3 bg-amber-50/80 hover:bg-amber-100 rounded-xl flex items-center gap-1.5 transition-all self-center border border-amber-200/70 shadow-xs cursor-pointer flex-shrink-0"
                          title="開啟此景點的深度特色導覽專文"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#E8A02C]" />
                          <span>特色專文</span>
                        </button>
                      ) : onChangeTab && (
                        <button
                          onClick={() => onChangeTab("explore")}
                          className="text-[#13294B] hover:text-[#E8A02C] text-[11px] font-bold py-1.5 px-3 bg-amber-50/80 hover:bg-amber-100 rounded-xl flex items-center gap-1.5 transition-all self-center border border-amber-200/70 shadow-xs cursor-pointer flex-shrink-0"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#E8A02C]" />
                          <span>特色專文</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
        )}
      </div>
          </>
        );
      })()}

      {/* Empty helper tip */}
      <div className="bg-[#FAF8F5] border border-gray-200/50 rounded-2xl p-4 text-xs text-gray-500 flex items-start gap-2">
        <span className="text-[#E8A02C]">💡</span>
        <p>
          當您出發到現場後，勾選<strong>「已走訪」</strong>複選框。這不僅會追蹤行程進度，還會同步解鎖<strong>「學習紀錄」</strong>分頁中的專屬文化主題勳章喔！
        </p>
      </div>

      {/* Route Map pop-up Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs select-none">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-150 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#13294B]/5">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-[#13294B] animate-pulse" />
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 tracking-tight">🗺️ 台灣全島 • 行程路線圖</h3>
                  <p className="text-[10px] text-gray-400 font-medium">地理分佈預覽 & 景點探索卡片</p>
                </div>
              </div>
              <button
                onClick={() => setIsMapOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 bg-gray-50/50 flex flex-col justify-between">
              
              {/* Map Preview Container */}
              <div className="bg-white border border-gray-150 rounded-2xl p-3 relative shadow-xs">
                <span className="absolute top-2.5 left-2.5 text-[9px] bg-[#13294B] text-white px-2 py-0.5 rounded-full font-mono font-bold z-10 opacity-80 shadow-xs">
                  TAIWAN MAP
                </span>
                
                <div className="w-full aspect-15/11 bg-slate-50 rounded-xl relative overflow-hidden border border-gray-100 flex items-center justify-center">
                  {routeSpots.length === 0 ? (
                    <div className="text-center p-6 text-gray-400 text-xs">
                      🗺️ 暫無天數行程，請先至 AI 規劃行程！
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      {/* SVG Territory Drawing */}
                      <svg viewBox="0 0 500 380" className="w-full h-full">
                        {/* Background grid lines */}
                        <defs>
                          <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(226, 232, 240, 0.5)" strokeWidth="0.8" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* Taiwan Island Stylized Polygons */}
                        {/* Northern Taiwan (Taipei / New Taipei / Keelung / Yilan / Taoyuan) */}
                        <polygon points="320,30 365,55 385,100 330,110 260,95 270,55" fill="#EBF3F9" stroke="#fff" strokeWidth="2" opacity="0.75" />
                        
                        {/* Central Taiwan (Taichung / Changhua / Nantou / Miaoli) */}
                        <polygon points="260,95 330,110 330,185 240,195 185,160 215,115" fill="#E8F4E5" stroke="#fff" strokeWidth="2" opacity="0.75" />
                        
                        {/* Southern Taiwan (Chiayi / Tainan / Kaohsiung / Pingtung) */}
                        <polygon points="240,195 330,185 305,290 220,350 160,280 145,230" fill="#FDF3E8" stroke="#fff" strokeWidth="2" opacity="0.75" />
                        
                        {/* Eastern Taiwan (Hualien / Taitung coastal spine) */}
                        <polygon points="330,110 385,100 365,220 325,300 305,290 330,185" fill="#E6F2F5" stroke="#fff" strokeWidth="2" opacity="0.75" />

                        {/* Offshore Islands (Penghu, Kinmen, Matsu) */}
                        <circle cx="80" cy="190" r="18" fill="#F4EBF9" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
                        <circle cx="60" cy="85" r="13" fill="#F4EBF9" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
                        <circle cx="110" cy="38" r="10" fill="#F4EBF9" stroke="#fff" strokeWidth="1.5" opacity="0.8" />

                        {/* Region Names */}
                        <text x="330" y="70" fill="#1565c0" fontSize="10px" fontWeight="bold" opacity="0.85" className="font-sans">北部特區</text>
                        <text x="235" y="145" fill="#2e7d32" fontSize="10px" fontWeight="bold" opacity="0.85" className="font-sans">中部平原/山岳</text>
                        <text x="185" y="260" fill="#b78103" fontSize="10px" fontWeight="bold" opacity="0.85" className="font-sans">南部府城/港都</text>
                        <text x="345" y="210" fill="#00838f" fontSize="10px" fontWeight="bold" opacity="0.85" className="font-sans">東部花東縱谷</text>
                        <text x="80" y="193" fill="#6a1b9a" fontSize="8px" fontWeight="bold" textAnchor="middle" opacity="0.85" className="font-sans">澎湖</text>
                        <text x="60" y="88" fill="#6a1b9a" fontSize="8px" fontWeight="bold" textAnchor="middle" opacity="0.85" className="font-sans">金門</text>
                        <text x="110" y="41" fill="#6a1b9a" fontSize="8px" fontWeight="bold" textAnchor="middle" opacity="0.85" className="font-sans">馬祖</text>

                        {/* Connections between spots */}
                        {routeSpots.length > 1 && (
                          <path
                            d={routeSpots
                              .map((s, idx) => {
                                const xVal = (s.coords.x * 500) / 100;
                                const yVal = (s.coords.y * 380) / 100;
                                return `${idx === 0 ? "M" : "L"} ${xVal} ${yVal}`;
                              })
                              .join(" ")}
                            fill="none"
                            stroke="#E8A02C"
                            strokeWidth="3"
                            strokeDasharray="6,6"
                            className="transition-all duration-300"
                          />
                        )}

                        {/* Spot pins */}
                        {routeSpots.map((spot, idx) => {
                          const xVal = (spot.coords.x * 500) / 100;
                          const yVal = (spot.coords.y * 380) / 100;
                          const isCurrent = idx === activeSpotIndex;

                          return (
                            <g key={idx} className="cursor-pointer" onClick={() => setActiveSpotIndex(idx)}>
                              {isCurrent && (
                                <circle
                                  cx={xVal}
                                  cy={yVal}
                                  r="16"
                                  fill="#E8A02C"
                                  className="animate-ping"
                                  style={{ animationDuration: "1.5s", opacity: 0.4 }}
                                />
                              )}
                              <circle
                                cx={xVal}
                                cy={yVal}
                                r={isCurrent ? "12" : "9"}
                                fill={isCurrent ? "#13294B" : "#E8A02C"}
                                stroke="#fff"
                                strokeWidth="1.5"
                                className="transition-all duration-300 shadow-sm"
                              />
                              <text
                                x={xVal}
                                y={yVal + 3}
                                textAnchor="middle"
                                fill="#fff"
                                fontSize={isCurrent ? "9px" : "8px"}
                                fontWeight="bold"
                                className="font-mono"
                              >
                                {idx + 1}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Stack Deck (Tactile Staging) */}
              {routeSpots.length > 0 && (
                <div className="space-y-4">
                  {/* Cards Stack Stage */}
                  <div className="relative h-[180px] w-full max-w-[340px] mx-auto overflow-visible select-none flex items-center justify-center">
                    {routeSpots.map((spot, idx) => {
                      // Determine offsets & scale
                      let diff = idx - activeSpotIndex;
                      // Handle wrapping
                      if (diff < 0) {
                        diff = diff + routeSpots.length;
                      }

                      let cardStyle: CSSProperties = {
                        transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        transformOrigin: "bottom center"
                      };

                      if (diff === 0) {
                        cardStyle = {
                          ...cardStyle,
                          zIndex: 30,
                          transform: "translateY(0px) scale(1) rotate(0deg)",
                          opacity: 1,
                          pointerEvents: "auto"
                        };
                      } else if (diff === 1) {
                        cardStyle = {
                          ...cardStyle,
                          zIndex: 20,
                          transform: "translateY(12px) scale(0.93) rotate(2deg)",
                          opacity: 0.85,
                          pointerEvents: "none"
                        };
                      } else if (diff === 2) {
                        cardStyle = {
                          ...cardStyle,
                          zIndex: 10,
                          transform: "translateY(24px) scale(0.86) rotate(-2deg)",
                          opacity: 0.5,
                          pointerEvents: "none"
                        };
                      } else {
                        cardStyle = {
                          ...cardStyle,
                          zIndex: 0,
                          transform: "translateY(36px) scale(0.8) rotate(4deg)",
                          opacity: 0,
                          pointerEvents: "none"
                        };
                      }

                      const isVisited = visitedSpots.includes(spot.title);

                      return (
                        <div
                          key={idx}
                          style={cardStyle}
                          className="absolute inset-x-0 top-0 h-[155px] bg-white border border-gray-150 rounded-2xl p-4 shadow-md flex flex-col justify-between hover:border-gray-250 cursor-pointer"
                          onClick={() => {
                            if (idx !== activeSpotIndex) {
                              setActiveSpotIndex(idx);
                            }
                          }}
                        >
                          {/* Inner details */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-[8px] bg-amber-50 text-[#D2691E] font-black px-1.5 py-0.5 rounded border border-amber-100/60 uppercase tracking-wider">
                                第 {spot.dayNum} 天 • 站點 {idx + 1}
                              </span>
                              <span className="text-[10px] font-bold text-gray-400 font-mono">
                                🕒 {spot.time}
                              </span>
                            </div>

                            <h4 className="font-black text-xs text-gray-900 flex items-center gap-1.5 pt-1.5 leading-snug">
                              <span className="text-sm">{spot.coords.bg}</span>
                              <span className="truncate">{spot.title}</span>
                            </h4>
                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed line-clamp-2">
                              {spot.highlight}
                            </p>
                          </div>

                          {/* Action footer */}
                          <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
                            <span className="text-[9px] text-[#13294B] font-bold bg-[#13294B]/5 px-2 py-0.5 rounded-full font-sans">
                              📍 {spot.coords.region}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleVisited(spot.title);
                              }}
                              className={`text-[9px] font-semibold px-2 py-0.8 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                                isVisited
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                              }`}
                            >
                              {isVisited ? "✓ 已走訪" : "🏁 記入完成"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Manual pagination controller buttons */}
                  <div className="flex items-center justify-between px-6 pt-1">
                    <button
                      onClick={() =>
                        setActiveSpotIndex((prev) =>
                          prev === 0 ? routeSpots.length - 1 : prev - 1
                        )
                      }
                      className="p-2 bg-white border border-gray-250/70 hover:bg-gray-50 rounded-full shadow-xs cursor-pointer text-gray-600"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <span className="text-xs font-bold text-gray-500 font-mono">
                      {activeSpotIndex + 1} / {routeSpots.length}
                    </span>

                    <button
                      onClick={() =>
                        setActiveSpotIndex((prev) =>
                          prev === routeSpots.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="p-2 bg-white border border-gray-250/70 hover:bg-gray-50 rounded-full shadow-xs cursor-pointer text-gray-600"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end bg-white">
              <button
                onClick={() => setIsMapOpen(false)}
                className="px-5 py-2 bg-[#13294B] hover:bg-[#1E3E62] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                關閉地圖閱覽
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
