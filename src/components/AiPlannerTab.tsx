import { useState, useEffect } from "react";
import { Sparkles, Calendar, Compass, ClipboardList, RefreshCw, CheckCircle, ChevronRight, HelpCircle } from "lucide-react";
import { PlannerPreferences, DayItinerary } from "../types";
import { apiClient } from "../api/client";

const DESTINATIONS_LIST = [
  "台灣 - 台北市", 
  "台灣 - 新北市", 
  "台灣 - 基隆市", 
  "台灣 - 桃園市", 
  "台灣 - 新竹縣市", 
  "台灣 - 苗栗縣", 
  "台灣 - 台中市", 
  "台灣 - 彰化縣", 
  "台灣 - 南投縣", 
  "台灣 - 雲林縣", 
  "台灣 - 嘉義縣市", 
  "台灣 - 台南市", 
  "台灣 - 高雄市", 
  "台灣 - 屏東縣 (含墾丁)", 
  "台灣 - 宜蘭縣", 
  "台灣 - 花蓮縣", 
  "台灣 - 台東縣", 
  "台灣 - 澎湖群島", 
  "台灣 - 金門列島", 
  "台灣 - 連江馬祖", 
  "台灣 - 全島環島行程", 
  "✏️ 自設其他台灣目的地..."
];

const DESTINATION_SPOTS_MAP: Record<string, string[]> = {
  "台灣 - 台北市": ["台北101", "國立故宮博物院", "大稻埕/迪化街", "西門町", "陽明山擎天崗", "北投溫泉", "士林夜市"],
  "台灣 - 新北市": ["淡水老街與紅毛城", "九份山城", "十分瀑布", "野柳地質公園", "烏來老街", "三峽老街", "金瓜石黃金博物館"],
  "台灣 - 基隆市": ["基隆廟口夜市", "正濱漁港彩色屋", "和平島地質公園", "潮境公園", "望幽谷"],
  "台灣 - 桃園市": ["大溪老街", "石門水庫", "拉拉山巨木群", "Xpark水族館", "角板山行館"],
  "台灣 - 新竹縣市": ["城隍廟商圈", "南寮漁港十七公里海岸線", "司馬庫斯神木群", "內灣老街", "北埔老街"],
  "台灣 - 苗栗縣": ["勝興車站", "龍騰斷橋", "三義木雕街", "南庄老街", "泰安溫泉"],
  "台灣 - 台中市": ["高美濕地", "逢甲夜市", "宮原眼科", "審計新村", "勤美綠園道", "武陵農場", "台中國家歌劇院"],
  "台灣 - 彰化縣": ["鹿港老街", "八卦山大佛", "扇形車庫", "田尾公路花園", "王功漁港採蚵"],
  "台灣 - 南投縣": ["日月潭", "清境農場", "溪頭自然教育園區", "合歡山武嶺", "埔里酒廠", "車埕木業展示館"],
  "台灣 - 雲林縣": ["北港朝天宮", "雲林布袋戲館", "古坑綠色隧道", "劍湖山世界", "西螺延平老街"],
  "台灣 - 嘉義縣市": ["阿里山國家森林遊樂區", "檜意森活村", "文化路夜市", "故宮南院", "奮起湖老街"],
  "台灣 - 台南市": ["安平古堡", "赤崁樓", "神農街", "奇美博物館", "國華街美食", "七股鹽山", "祀典武廟"],
  "台灣 - 高雄市": ["駁二藝術特區", "旗津島與燈塔", "西子灣日落", "瑞豐夜市", "蓮池潭龍虎塔", "衛武營國家藝術文化中心"],
  "台灣 - 屏東縣 (含墾丁)": ["墾丁鵝鑾鼻公園", "國立海洋生物博物館", "墾丁大街", "小琉球", "恆春古城", "萬里桐潮間帶"],
  "台灣 - 宜蘭縣": ["羅東林業文化園區", "冬山河生態綠舟", "蘇澳冷泉", "南方澳漁港", "礁溪溫泉", "頭城老街與外澳沙灘"],
  "台灣 - 花蓮縣": ["太魯閣國家公園", "七星潭", "東大門夜市", "瑞穗牧場", "鯉魚潭", "清水斷崖", "石梯坪"],
  "台灣 - 台東縣": ["池上伯朗大道", "三仙台", "鹿野高台熱氣球", "鐵花村音樂聚落", "知本溫泉", "多良車站", "綠島"],
  "台灣 - 澎湖群島": ["澎湖跨海大橋", "奎壁山摩西分海", "七美雙心石滬", "馬公中央老街", "山水沙灘", "二崁古厝"],
  "台灣 - 金門列島": ["金門莒光樓", "翟山坑道", "古寧頭戰史館", "水頭聚落得月樓", "模範街", "獅山砲陣地"],
  "台灣 - 連江馬祖": ["馬祖芹壁聚落", "南竿北海坑道", "鐵堡", "八八坑道", "東引燈塔", "大坵島梅花鹿"],
  "台灣 - 全島環島行程": ["台北101", "太魯閣國家公園", "池上伯朗大道", "墾丁鵝鑾鼻公園", "安平古堡", "日月潭", "阿里山國家森林遊樂區"]
};

const STYLE_LIST = ["🏛 人文歷史", "🌲 自然生態", "📸 網紅打卡", "🍜 在地美食", "🚲 慢活悠遊"];
const TRANSPORT_LIST = ["🚌 大眾運輸 / 高鐵捷運", "🛵 機車 / 自乘", "🚗 汽車 / 自駕", "🚏 台灣好行觀光公車"];
const BUDGET_LIST = ["💰 經濟省錢", "✨ 舒適輕奢", "👑 頂級豪華"];

const GUIDE_LENGTHS = ["📝 簡潔", "📄 中等", "📑 長文"];
const EXPRESS_STYLES = ["🏛 經典", "🎭 幽默", "🎓 教學"];
const VOICE_PACKS = ["🧒 可愛孩子", "🎙 專業的主播", "🇬🇧 英語播報"];

interface AiPlannerTabProps {
  onPlanGenerated: (plan: DayItinerary[], notesStr: string) => void;
  onNavigateToItinerary: () => void;
  presetDays?: number;
  presetDistricts?: string[];
  clearPresets?: () => void;
}

export default function AiPlannerTab({ 
  onPlanGenerated, 
  onNavigateToItinerary,
  presetDays,
  presetDistricts,
  clearPresets
}: AiPlannerTabProps) {
  // Mode: 'input' or 'result'
  const [step, setStep] = useState<"input" | "result">("input");
  
  // Geolocation compatibility checking states
  const [ignoreGeoWarning, setIgnoreGeoWarning] = useState<boolean>(false);
  const [showGeoModal, setShowGeoModal] = useState<boolean>(false);

  // Preference States
  const [selectedCounty, setSelectedCounty] = useState<string>("台灣 - 台北市");
  const [customCountyInput, setCustomCountyInput] = useState<string>("");
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(["台北101", "故宮博物院"]);
  const [customDistrictInput, setCustomDistrictInput] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<number>(3);
  const [selectedStyle, setSelectedStyle] = useState<string>("🏛 人文歷史");
  const [selectedTransport, setSelectedTransport] = useState<string>("🚗 汽車 / 自駕");
  const [selectedBudget, setSelectedBudget] = useState<string>("💰 省錢");
  const [userNotes, setUserNotes] = useState<string>("");

  // Guide and Voice preferences states
  const [selectedGuideLength, setSelectedGuideLength] = useState<string>("📄 中等");
  const [selectedExpressStyle, setSelectedExpressStyle] = useState<string>("🏛 經典");
  const [selectedVoicePack, setSelectedVoicePack] = useState<string>("🎙 專業的主播");

  // Helper function to check if the chosen locations are geographically far/unreasonable to be on the same itinerary
  const getGeographicSanityAlert = () => {
    const allTexts = [
      selectedCounty,
      customCountyInput,
      ...selectedDistricts,
      userNotes
    ].map(t => (t || "").toLowerCase());

    const hasTaipei = allTexts.some(t => t.includes("台北") || t.includes("taipei") || t.includes("迪化街") || t.includes("淡水") || t.includes("九份") || t.includes("北投") || t.includes("基隆"));
    const hasKaohsiung = allTexts.some(t => t.includes("高雄") || t.includes("kaohsiung") || t.includes("駁二") || t.includes("旗津") || t.includes("瑞豐"));
    const hasKenting = allTexts.some(t => t.includes("墾丁") || t.includes("恆春") || t.includes("kenting") || t.includes("鵝鑾批") || t.includes("鵝鑾鼻"));
    const hasTainan = allTexts.some(t => t.includes("台南") || t.includes("tainan") || t.includes("安平") || t.includes("奇美"));
    const hasHualien = allTexts.some(t => t.includes("花蓮") || t.includes("hualien") || t.includes("太魯閣") || t.includes("七星潭"));
    const hasTaitung = allTexts.some(t => t.includes("台東") || t.includes("taitung") || t.includes("伯朗大道"));

    // Case 1: Taipei & South (Kaohsiung/Kenting/Tainan etc)
    if (hasTaipei && (hasKaohsiung || hasKenting || hasTainan)) {
      return {
        type: "taiwan_north_south",
        title: "🗺️ 台灣南北極限拉車超距警告 (台北 ⇄ 南台灣)",
        message: "「台北」與「台南/高雄/墾丁」南北相隔超過 300 公里。若行程天數較短（1至3天內），全天將消耗在大眾交通、高鐵或公路上，使得走讀和現場語音聆聽體驗大打折扣。",
        suggestion: "建議每次深度行程收斂在一或兩個相鄰城鎮，將天數單純專注在北部特區或南部人文。除非您已配置高預算並願意乘坐快捷高鐵。",
        conflictingSpots: "台北 與 " + (hasKenting ? "墾丁" : hasKaohsiung ? "高雄" : "台南")
      };
    }

    // Case 2: Eastern & Southern Taiwan Barrier (Hualien/Taitung & Kenting)
    if ((hasHualien || hasTaitung) && hasKenting) {
      return {
        type: "taiwan_east_south",
        title: "🗺️ 中央/海岸山脈重障警示 (花東 ⇄ 墾丁恆春)",
        message: "花蓮/台東與墾丁之間因地形阻隔，開車單程極度崎嶇且耗時 4-5 小時以上，鐵路與火車也需要迂迴乘換，交通消耗甚大！",
        suggestion: "建議針對花蓮太魯閣、或墾丁蔚藍海岸分別進行單獨安排，以發揮深度走讀的最合理性。",
        conflictingSpots: (hasHualien ? "花蓮" : "台東") + " 與 墾丁"
      };
    }

    return null;
  };

  const geoAlert = getGeographicSanityAlert();

  useEffect(() => {
    let changed = false;
    if (presetDays !== undefined && presetDays !== selectedDays) {
      setSelectedDays(presetDays);
      changed = true;
    }
    if (presetDistricts && presetDistricts.length > 0) {
      setSelectedDistricts(presetDistricts);
      
      // Auto-detect matching county
      let found = false;
      for (const [cty, spots] of Object.entries(DESTINATION_SPOTS_MAP)) {
        if (presetDistricts.some(pd => spots.includes(pd))) {
          setSelectedCounty(cty);
          found = true;
          break;
        }
      }
      if (!found) {
        setSelectedCounty("✏️ 自設其他台灣目的地...");
        setCustomCountyInput(presetDistricts[0] || "");
      }
      changed = true;
    }
    if (changed) {
      setStep("input");
      if (clearPresets) {
        clearPresets();
      }
    }
  }, [presetDays, presetDistricts]);

  const [isLoading, setIsLoading] = useState(false);
  const [itineraryResult, setItineraryResult] = useState<DayItinerary[]>([]);
  const [itineraryNotes, setItineraryNotes] = useState("");
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  const toggleDistrict = (dist: string) => {
    if (selectedDistricts.includes(dist)) {
      if (selectedDistricts.length > 1) {
        setSelectedDistricts(selectedDistricts.filter(item => item !== dist));
      }
    } else {
      setSelectedDistricts([...selectedDistricts, dist]);
    }
  };

  const handleAddCustomDistrict = () => {
    const trimmed = customDistrictInput.trim();
    if (trimmed && !selectedDistricts.includes(trimmed)) {
      setSelectedDistricts([...selectedDistricts, trimmed]);
      setCustomDistrictInput("");
    }
  };

  const handleCountyChange = (county: string) => {
    setSelectedCounty(county);
    if (county === "✏️ 自設其他台灣目的地...") {
      setSelectedDistricts([]);
    } else {
      const defaults = DESTINATION_SPOTS_MAP[county] || ["中心景點", "特色老街"];
      setSelectedDistricts([defaults[0], defaults[1] || "特色商圈"]);
    }
  };

  const handleGeneratePlan = async (bypassGeoCheck: boolean = false) => {
    const alert = getGeographicSanityAlert();
    if (alert && !ignoreGeoWarning && !bypassGeoCheck) {
      setShowGeoModal(true);
      return;
    }

    setShowGeoModal(false);
    setIsLoading(true);
    setStep("result");
    
    try {
      const countyToSend = selectedCounty === "✏️ 自設其他台灣目的地..." ? (customCountyInput.trim() || "台灣目的地") : selectedCounty;
      const data = await apiClient.generateItineraryPlan({
        county: countyToSend,
        districts: selectedDistricts,
        days: selectedDays,
        style: selectedStyle,
        transport: selectedTransport,
        budget: selectedBudget,
        userNotes: userNotes,
        guideLength: selectedGuideLength.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '').trim(),
        expressStyle: selectedExpressStyle.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '').trim(),
        voicePack: selectedVoicePack.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '').trim()
      });
      
      if (data.success) {
        setItineraryResult(data.itinerary);
        setItineraryNotes(data.notes);
        setIsAiGenerated(!!data.isAi);
      } else {
        throw new Error("Generation failure");
      }
    } catch (e: any) {
      console.error("Itinerary generation error:", e);
      setItineraryNotes("連線雲端後端逾時或異常，請確認網路連線或稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLockInElectronicItinerary = () => {
    onPlanGenerated(itineraryResult, itineraryNotes);
    onNavigateToItinerary();
  };

  const displayCountyName = selectedCounty === "✏️ 自設其他台灣目的地..." 
    ? (customCountyInput || "台灣景點") 
    : selectedCounty;

  return (
    <div className="space-y-6 fade-in p-1 select-none">
      
      {step === "input" ? (
        // FORM SCREEN (Prompt C 畫面一「輸入偏好」)
        <div className="space-y-5 fade-in">
          
          {/* Header */}
          <div className="text-center space-y-1.5 py-2">
            <span className="bg-[#E8A02C]/10 text-[#D2691E] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              ✨ AI深旅 DeepGo ． 智慧規劃
            </span>
            <h2 className="text-xl font-extrabold text-[#13294B] font-display">
              告訴我你想去哪裡，AI 幫你排台灣行程
            </h2>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              任選台灣熱門縣市、自訂城鎮景點與私房祕境，為您貼心定制兼具歷史風土與特色美食的故事深度導覽。
            </p>
          </div>

          {/* County / Destination Select Selector */}
          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              🗺️ 選擇旅遊國家 / 區域 / 城市
            </label>
            <select
              value={selectedCounty}
              onChange={(e) => handleCountyChange(e.target.value)}
              className="w-full text-xs bg-[#FAF8F5] border border-gray-200 rounded-xl p-3 text-gray-700 font-bold focus:outline-none focus:ring-1 focus:ring-[#13294B] focus:bg-white transition-all duration-150"
            >
              {DESTINATIONS_LIST.map(dest => (
                <option key={dest} value={dest}>
                  📍 {dest}
                </option>
              ))}
            </select>

            {/* Custom Manual Free-text Country Input */}
            {selectedCounty === "✏️ 自設其他台灣目的地..." && (
              <div className="pt-2 fade-in">
                <label className="text-[10px] font-bold text-gray-400 block mb-1">
                  ✍️ 手動輸入任何台灣目的地：
                </label>
                <input
                  type="text"
                  value={customCountyInput}
                  onChange={(e) => setCustomCountyInput(e.target.value)}
                  placeholder="例如：綠島、馬祖、小琉球、阿里山森林遊樂區..."
                  className="w-full text-xs bg-[#FAF8F5] border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 font-bold placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#13294B] focus:bg-white transition-all"
                />
              </div>
            )}
          </div>

          {/* District list selector & manual input */}
          <div className="space-y-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                <span>景點與特定名勝自訂</span>
                <span className="text-[10px] text-gray-400">已選 {selectedDistricts.length} 處</span>
              </label>
              <p className="text-[10px] text-gray-400 mt-1">
                您可以自由鍵入想去的知名商圈、著名古蹟、特定地標名稱，或直接點選下方推薦熱點。
              </p>
            </div>

            {/* Manual input bar */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customDistrictInput}
                onChange={(e) => setCustomDistrictInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomDistrict();
                  }
                }}
                placeholder="輸入景點或名勝，如：台北101、安平古堡、九份山城..."
                className="flex-1 text-xs bg-[#FAF8F5] border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#13294B] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={handleAddCustomDistrict}
                className="bg-[#13294B] hover:bg-[#0c1c38] text-white px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all"
              >
                新增
              </button>
            </div>

            {/* Tag List of Chosen Spots */}
            {selectedDistricts.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                  已選定之核心景點 / 地標：
                </div>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#FAF8F5] rounded-xl border border-gray-100 min-h-[42px]">
                  {selectedDistricts.map(dist => (
                    <span
                      key={dist}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E8A02C]/10 border border-[#E8A02C]/20 text-[#D2691E] text-xs font-bold fade-in"
                    >
                      🗺️ {dist}
                      <button
                        type="button"
                        onClick={() => setSelectedDistricts(selectedDistricts.filter(d => d !== dist))}
                        className="hover:text-red-600 font-extrabold text-sm ml-1 select-none focus:outline-none cursor-pointer"
                        title="刪除"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick clicks list (only if chosen county is in DESTINATION_SPOTS_MAP) */}
            {selectedCounty !== "✏️ 自設其他台灣目的地..." && (DESTINATION_SPOTS_MAP[selectedCounty] || []).length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                  💡 {selectedCounty} 快速點選熱門名勝：
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(DESTINATION_SPOTS_MAP[selectedCounty] || []).map(dist => {
                    const isSelected = selectedDistricts.includes(dist);
                    return (
                      <button
                        key={dist}
                        type="button"
                        onClick={() => toggleDistrict(dist)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 border ${
                          isSelected
                            ? "bg-[#13294B] text-white border-[#13294B]"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-white hover:border-gray-300"
                        }`}
                      >
                        {isSelected ? "✓ " : ""} {dist}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Trip Days choice buttons - custom manually entered supported */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#13294B] uppercase tracking-wider block">
                規劃旅遊天數 (可自行輸入)
              </label>
              
              {/* Manual numeric adjuster / input box */}
              <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-gray-200 px-2.5 py-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedDays(prev => Math.max(1, prev - 1))}
                  className="w-6 h-6 hover:bg-gray-200 text-[#13294B] rounded-full flex items-center justify-center font-bold text-sm select-none transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={selectedDays}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value);
                    if (!isNaN(parsed) && parsed > 0) {
                      setSelectedDays(parsed);
                    } else if (e.target.value === "") {
                      setSelectedDays(1);
                    }
                  }}
                  className="w-12 text-center text-xs font-black font-mono bg-transparent text-[#13294B] border-none focus:outline-none focus:ring-0 p-0"
                />
                <button
                  type="button"
                  onClick={() => setSelectedDays(prev => Math.min(30, prev + 1))}
                  className="w-6 h-6 hover:bg-gray-200 text-[#13294B] rounded-full flex items-center justify-center font-bold text-sm select-none transition-colors"
                >
                  +
                </button>
                <span className="text-xs text-gray-500 font-bold select-none border-l border-gray-200 pl-1.5 ml-1">天</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[1, 2, 3, 5, 7].map(daysNum => {
                const isSelected = selectedDays === daysNum;
                return (
                  <button
                    key={daysNum}
                    type="button"
                    onClick={() => setSelectedDays(daysNum)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? "bg-[#13294B] text-white border-[#13294B]"
                        : "bg-[#FAF8F5] text-gray-600 border-gray-200 hover:bg-white"
                    }`}
                  >
                    {daysNum}天
                  </button>
                );
              })}
            </div>
          </div>

          {/* Travel style buttons selection */}
          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              深度旅遊風格
            </label>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {STYLE_LIST.map(style => {
                const isSelected = selectedStyle === style;
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setSelectedStyle(style)}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? "bg-[#13294B] text-white border-[#13294B]"
                        : "bg-[#FAF8F5] text-gray-600 border-gray-200 hover:bg-white"
                    }`}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transport buttons selection */}
          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              交通出行方式
            </label>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {TRANSPORT_LIST.map(trans => {
                const isSelected = selectedTransport === trans;
                return (
                  <button
                    key={trans}
                    type="button"
                    onClick={() => setSelectedTransport(trans)}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? "bg-[#13294B] text-white border-[#13294B]"
                        : "bg-[#FAF8F5] text-gray-600 border-gray-200 hover:bg-white"
                    }`}
                  >
                    {trans}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget choices buttons selection */}
          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              支出預算模式
            </label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {BUDGET_LIST.map(budget => {
                const isSelected = selectedBudget === budget;
                return (
                  <button
                    key={budget}
                    type="button"
                    onClick={() => setSelectedBudget(budget)}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? "bg-[#13294B] text-white border-[#13294B]"
                        : "bg-[#FAF8F5] text-gray-600 border-gray-200 hover:bg-white"
                    }`}
                  >
                    {budget}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Travel Remarks / Notes Input Field */}
          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              📋 旅客個性化備註 (例如：要買藥妝、喜愛米其林、帶老人家同遊等)
            </label>
            <div className="pt-1">
              <textarea
                id="user-planner-notes"
                rows={2}
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="例：想多留時間逛免稅店 / 推薦和牛法餐 / 偏好入住有景觀的民宿與酒店..."
                className="w-full text-xs bg-[#FAF8F5] border border-gray-200 rounded-xl p-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#13294B] focus:bg-white resize-none transition-all duration-150"
              />
            </div>
          </div>

          {/* Custom Guide Settings Section */}
          <div className="space-y-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <h3 className="text-xs font-black text-[#13294B] uppercase tracking-wider border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
              <span>🔊</span> 智慧導覽與語音包自訂偏好
            </h3>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                導覽風格（字數長度）
              </label>
              <div className="grid grid-cols-3 gap-2">
                {GUIDE_LENGTHS.map(len => {
                  const isSelected = selectedGuideLength === len;
                  return (
                    <button
                      key={len}
                      type="button"
                      onClick={() => setSelectedGuideLength(len)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? "bg-[#13294B] text-white border-[#13294B] shadow-xs"
                          : "bg-[#FAF8F5] text-gray-600 border-gray-200 hover:bg-white"
                      }`}
                    >
                      {len}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                表達風格
              </label>
              <div className="grid grid-cols-3 gap-2">
                {EXPRESS_STYLES.map(style => {
                  const isSelected = selectedExpressStyle === style;
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setSelectedExpressStyle(style)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? "bg-[#13294B] text-white border-[#13294B] shadow-xs"
                          : "bg-[#FAF8F5] text-gray-600 border-gray-200 hover:bg-white"
                      }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                現場配音語音包
              </label>
              <div className="grid grid-cols-3 gap-2">
                {VOICE_PACKS.map(pk => {
                  const isSelected = selectedVoicePack === pk;
                  return (
                    <button
                      key={pk}
                      type="button"
                      onClick={() => setSelectedVoicePack(pk)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? "bg-[#13294B] text-white border-[#13294B] shadow-xs"
                          : "bg-[#FAF8F5] text-gray-600 border-gray-200 hover:bg-white"
                      }`}
                    >
                      {pk}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Geographic sanity friction check banner (提醒景點範圍跨區的合理性) */}
          {geoAlert && (
            <div className="bg-amber-50/70 border border-amber-250/50 rounded-2xl p-4 shadow-[0_2px_8px_-3px_rgba(232,160,44,0.15)] space-y-3 animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <span className="text-xl select-none">🚨</span>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-[#D2691E] font-display flex items-center gap-1.5">
                    {geoAlert.title}
                  </h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed font-sans font-medium">
                    {geoAlert.message}
                  </p>
                </div>
              </div>
              <div className="bg-white/80 rounded-xl p-2.5 border border-amber-150/40 text-[10px] text-gray-500 leading-relaxed font-sans">
                💡 <strong>深度探尋規劃建議：</strong>{geoAlert.suggestion}
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-amber-200/40">
                <input
                  type="checkbox"
                  id="bypass-geo"
                  checked={ignoreGeoWarning}
                  onChange={(e) => setIgnoreGeoWarning(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 border-gray-300 transition-all cursor-pointer"
                />
                <label htmlFor="bypass-geo" className="text-[10px] font-bold text-gray-500 cursor-pointer select-none">
                  我已了解上述地區跨度過遠，並同意在同一行程中合併規劃。
                </label>
              </div>
            </div>
          )}

          {/* Main big submission button (Prompt C) */}
          <button
            onClick={() => handleGeneratePlan(false)}
            className="w-full bg-[#13294B] hover:bg-[#0c1c38] text-white rounded-2xl py-3.5 text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] mt-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#E8A02C] animate-pulse" />
            ✨ 智啟 DeepGo 台灣專屬旅遊規劃
          </button>
        </div>
      ) : (
        // RESULTS DISPLAY SCREEN (Prompt C 畫面二「行程結果」)
        <div className="space-y-5 fade-in">
          
          {/* Output header banner */}
          <div className="bg-[#13294B] text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-1">
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isAiGenerated ? "bg-amber-500 text-white" : "bg-emerald-600 text-white"
              }`}>
                {isAiGenerated ? "✨ AI 台灣定制版" : "📖 精緻經典風土版"}
              </span>
              <h2 className="text-lg font-black font-display tracking-tight">
                您的 {displayCountyName} 原創深度行程表
              </h2>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                結合 {displayCountyName} 在地風土、著名景致與個人偏好量身設計。
              </p>
            </div>
          </div>

          {isLoading ? (
            /* Generating Screen state */
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-full border-4 border-[#E8A02C] border-t-transparent animate-spin mx-auto"></div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-700">DeepGo 正在為您智慧配案中...</p>
                <p className="text-[10px] text-gray-400 font-mono">
                  正在為您排定精選點景：{selectedDistricts.join("、")} {selectedDays}天 {selectedStyle} 深度行
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Output Travel suggestions */}
              {itineraryNotes && (
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3.5 text-[11px] text-[#D2691E] leading-relaxed">
                  {itineraryNotes}
                </div>
              )}

              {/* Day-by-Day itinerary list cards (Prompt C) */}
              <div className="space-y-4">
                {itineraryResult.map((day) => (
                  <div key={day.dayNum} className="space-y-2 border-l-2 border-dashed border-gray-200 pl-4 py-1 relative">
                    <div className="absolute -left-1.5 top-2.5 w-3 h-3 rounded-full bg-[#13294B]"></div>
                    <h3 className="text-xs font-extrabold text-[#13294B] font-display">
                      第 {day.dayNum} 天行程
                    </h3>

                    <div className="flex flex-wrap gap-1.5 py-1">
                      {day.lodging && (
                        <div className="text-[10px] text-blue-800 bg-[#EDF4FF] rounded-lg px-2.5 py-1.5 font-medium leading-relaxed border border-blue-100">
                          🏡 <strong>今日住宿：</strong>{day.lodging}
                        </div>
                      )}
                      {day.foodRecommend && (
                        <div className="text-[10px] text-amber-800 bg-amber-50/70 rounded-lg px-2.5 py-1.5 font-medium leading-relaxed border border-amber-100">
                          🍽️ <strong>美食推薦：</strong>{day.foodRecommend}
                        </div>
                      )}
                    </div>

                    <div className="grid gap-3">
                      {day.activities.map((act, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl p-3 border border-gray-150/45 shadow-xs flex justify-between items-start gap-3"
                          id={`plan-result-${day.dayNum}-${index}`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[9px] text-[#D2691E] font-black bg-amber-50 px-1.5 py-0.5 rounded">
                                {act.time}
                              </span>
                              <h4 className="font-bold text-xs text-gray-900">{act.title}</h4>
                            </div>
                            <p className="text-[10px] text-gray-500 italic leading-relaxed pl-1 pt-0.5">
                              “{act.highlight}”
                            </p>
                          </div>
                          
                          <div className="text-right flex-shrink-0 space-y-1">
                            <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full block">
                              {act.cost}
                            </span>
                            <span className="text-[8px] font-bold text-[#13294B] block pr-1.5">
                              🏷 {act.theme}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons panel (Prompt C: 📖 產出電子行程表 and 🔄 重新規劃) */}
              <div className="flex gap-2.5 pt-4">
                <button
                  onClick={() => setStep("input")}
                  className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  重新規劃偏好
                </button>
                <button
                  onClick={handleLockInElectronicItinerary}
                  className="flex-1 bg-[#13294B] hover:bg-[#0c1c38] text-white py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-[#E8A02C]" />
                  產出電子行程表
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Dynamic Geographic Sanity Confirmation Modal dialog */}
      {showGeoModal && geoAlert && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-[2px] flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-gray-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-[#D2691E] flex items-center justify-center text-2xl mx-auto border border-amber-100 animate-bounce">
              ⚠️
            </div>
            
            <div className="space-y-1">
              <h3 className="font-extrabold text-[#11223F] text-sm">
                {geoAlert.title}
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed text-left bg-gray-50 p-3 rounded-xl border border-gray-100 font-sans">
                {geoAlert.message}
              </p>
            </div>

            <div className="text-[10px] text-left text-[#D2691E] bg-amber-50/50 p-3 rounded-xl border border-amber-150/30">
              💡 <strong>行前建議：</strong>{geoAlert.suggestion}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowGeoModal(false)}
                className="py-2.5 px-4 bg-gray-150/50 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                🔍 重新調整景點
              </button>
              <button
                type="button"
                onClick={() => {
                  setIgnoreGeoWarning(true);
                  handleGeneratePlan(true);
                }}
                className="py-2.5 px-4 bg-[#13294B] hover:bg-[#0c1c38] text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
              >
                ⚠️ 仍要合併規劃
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
