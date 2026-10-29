import { useState, useEffect } from "react";
import { Compass, Sparkles, Calendar, Award, Info, RefreshCw, Layers, Users, Server, Wifi, Globe, X, Check } from "lucide-react";
import ExploreTab from "./components/ExploreTab";
import AiPlannerTab from "./components/AiPlannerTab";
import MyItineraryTab from "./components/MyItineraryTab";
import LearningRecordTab from "./components/LearningRecordTab";
import ColearnTab from "./components/ColearnTab";
import { DayItinerary, SavedItinerary } from "./types";
import { apiClient, isNativePlatform, DEFAULT_CLOUD_BACKEND_URL } from "./api/client";

// Flagship default itinerary covering Taiwan nationwide
const DEFAULT_ITINERARY: DayItinerary[] = [
  {
    dayNum: 1,
    lodging: "🏡 台北大稻埕老洋樓文青旅宿：鄰近霞海城隍廟，步行即至迪化街百年商街",
    foodRecommend: "🍜 永樂市場林合發油飯、阿伯迪化街杏仁露、士林夜市生煎包與十全排骨",
    activities: [
      { time: "10:00", title: "大稻埕/迪化街", cost: "免費", highlight: "漫步清末茶商與巴洛克繁複立面街屋，品味南北貨與新思潮風華", theme: "歷史背景" },
      { time: "15:00", title: "國立故宮博物院", cost: "門票 $350 元", highlight: "依外雙溪山勢而建的宮殿式殿堂，細賞翠玉白菜與歷代青銅陶瓷", theme: "建築特色" }
    ]
  },
  {
    dayNum: 2,
    lodging: "🌾 日月潭向山水岸景觀飯店：坐擁邵族聖山水社大山日出雲影",
    foodRecommend: "🍵 魚池鄉台茶18號紅玉紅茶、伊達邵碼頭現烤阿薩姆紅茶香菇蛋、高美濕地清水米糕",
    activities: [
      { time: "09:30", title: "日月潭", cost: "遊船 $300 元", highlight: "搭船橫渡拉魯島，漫步團紀彥清水模向山建築與無邊際水池", theme: "建築特色" },
      { time: "16:30", title: "高美濕地", cost: "免費", highlight: "八百公尺木棧道延伸入海，金色夕陽伴隨巨型風車與招潮蟹潮間帶", theme: "歷史背景" }
    ]
  },
  {
    dayNum: 3,
    lodging: "🌊 台南府城老宅天井民宿：保留磨石子地坪與古木桁架，步行至國華街",
    foodRecommend: "🐟 安平現炸周氏蝦捲、新鮮溫體清燙牛肉湯、同記安平古早味傳統豆花",
    activities: [
      { time: "09:30", title: "安平古堡", cost: "門票 $70 元", highlight: "四百年熱蘭遮城三合土紅磚殘壁，伴古榕盤根錯節的大航海記憶", theme: "歷史背景" },
      { time: "14:00", title: "赤崁樓", cost: "門票 $70 元", highlight: "九座贔屭馱御碑與閩南閣樓，探訪荷蘭地窖與魁星文昌文脈", theme: "歷史背景" },
      { time: "17:00", title: "神農街", cost: "免費", highlight: "清代五條港木造老街屋，紅燈籠與手作鐵窗花交織的夜色散步", theme: "在地飲食" }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("explore"); // explore, planner, itinerary, record
  
  // Saved itinerary files
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([]);
  const [activeItineraryId, setActiveItineraryId] = useState<string>("");

  // Remix preset values to prefill AI Planner
  const [presetDays, setPresetDays] = useState<number | undefined>(undefined);
  const [presetDistricts, setPresetDistricts] = useState<string[] | undefined>(undefined);
  const [userCountyKey, setUserCountyKey] = useState<string>("台灣 - 台北市");

  // Custom generated or fallback itinerary from AiPlannerTab
  const [currentItinerary, setCurrentItinerary] = useState<DayItinerary[]>(DEFAULT_ITINERARY);
  
  // Visited spot names tracker
  const [visitedSpots, setVisitedSpots] = useState<string[]>([]);
  
  // Unlocked companion stories list
  const [unlockedStories, setUnlockedStories] = useState<Record<string, string[]>>({});
  
  // Accrued learning/cultural tags
  const [unlockedTags, setUnlockedTags] = useState<string[]>([]);

  // Navigation target spot for featured guide article
  const [navGuideSpot, setNavGuideSpot] = useState<string | null>(null);

  // Cloud Backend Connection State
  const [showServerModal, setShowServerModal] = useState(false);
  const [serverStatus, setServerStatus] = useState<{ checked: boolean; ok: boolean; latencyMs?: number; error?: string }>({
    checked: false,
    ok: true
  });
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [isTestingServer, setIsTestingServer] = useState(false);

  const testServerConnection = async () => {
    setIsTestingServer(true);
    const result = await apiClient.checkServerHealth();
    setServerStatus({
      checked: true,
      ok: result.ok,
      latencyMs: result.latencyMs,
      error: result.error
    });
    setIsTestingServer(false);
  };

  const handleSaveCustomUrl = () => {
    apiClient.setCustomBaseUrl(customUrlInput.trim() || null);
    testServerConnection();
  };

  const handleResetDefaultUrl = () => {
    apiClient.setCustomBaseUrl(null);
    setCustomUrlInput("");
    testServerConnection();
  };

  const handleOpenSpotGuide = (spotName: string) => {
    setNavGuideSpot(spotName);
    setActiveTab("explore");
  };

  // Load from LocalStorage if user previously generated or saved trip details
  useEffect(() => {
    try {
      const savedVisited = localStorage.getItem("yilan_visited_spots");
      const savedUnlocked = localStorage.getItem("yilan_unlocked_stories");
      const savedTags = localStorage.getItem("yilan_unlocked_tags");
      const savedItinerary = localStorage.getItem("yilan_current_itinerary");
      const savedList = localStorage.getItem("yilan_saved_itineraries");
      const savedActiveId = localStorage.getItem("yilan_active_itinerary_id");
      
      if (savedVisited) setVisitedSpots(JSON.parse(savedVisited));
      if (savedUnlocked) setUnlockedStories(JSON.parse(savedUnlocked));
      if (savedTags) setUnlockedTags(JSON.parse(savedTags));
      if (savedItinerary) setCurrentItinerary(JSON.parse(savedItinerary));

      let loadedList: SavedItinerary[] = [];
      if (savedList) {
        loadedList = JSON.parse(savedList);
        setSavedItineraries(loadedList);
      } else {
        const initialSaved: SavedItinerary[] = [
          {
            id: "default_init",
            title: "台灣旗艦文史三日行 (台北、日月潭、台南府城)",
            days: 3,
            regions: ["台北", "南投", "台南"],
            plan: DEFAULT_ITINERARY,
            createdAt: new Date().toLocaleDateString()
          },
          {
            id: "yilan_sample",
            title: "宜蘭溪南水綠林業三日線 (羅東、冬山、蘇澳)",
            days: 3,
            regions: ["羅東", "冬山", "蘇澳"],
            plan: [
              {
                dayNum: 1,
                lodging: "🏡 羅東林場暖木旅棧：檜木文青風設計，步行可達羅東夜市",
                foodRecommend: "🍜 林場肉羹、阿灶伯當歸羊肉湯、三星蔥多餅",
                activities: [
                  { time: "10:00", title: "羅東林業文化園區", cost: "免費", highlight: "百年林業貯木池與日式檜木舊樟木宿舍群", theme: "歷史背景" },
                  { time: "18:00", title: "羅東夜市", cost: "約 $250 元", highlight: "聚集道地三星蔥多餅與常民經典美食", theme: "在地飲食" }
                ]
              },
              {
                dayNum: 2,
                lodging: "🌾 冬山小河稻香民宿：坐擁四季變化的稻浪景致、附湧泉湧香早餐",
                foodRecommend: "🍵 冬山老街古早米粉羹、廣興做田人黑糖麻糬與素馨茶香",
                activities: [
                  { time: "09:00", title: "冬山河生態綠舟", cost: "門票 $30 元", highlight: "遊船探訪如魔幻神殿般的神秘地下水道河港", theme: "歷史背景" },
                  { time: "14:00", title: "斑比山丘", cost: "門票 $200 元", highlight: "與極其療癒親民的梅花鹿、呆萌水豚親密互動餵食", theme: "建築特色" }
                ]
              },
              {
                dayNum: 3,
                lodging: "🌊 蘇澳煙波大飯店四季雙泉館：頂樓浴場坐擁全台首創冷熱雙湯池",
                foodRecommend: "🐟 新鮮現炸烤南方澳鯖魚、阿芬鮮魚湯、冷泉手工羊羹",
                activities: [
                  { time: "09:00", title: "蘇澳冷泉", cost: "門票 $120 元", highlight: "體驗 22℃ 豐沛清涼帶有微氣泡的天然碳酸冷泉", theme: "歷史背景" },
                  { time: "11:30", title: "南方澳漁港", cost: "免費", highlight: "全國著名鯖魚故鄉，朝聖南天宮純金媽祖殿堂", theme: "在地飲食" }
                ]
              }
            ],
            createdAt: new Date().toLocaleDateString()
          }
        ];
        loadedList = initialSaved;
        setSavedItineraries(initialSaved);
        localStorage.setItem("yilan_saved_itineraries", JSON.stringify(initialSaved));
      }

      if (savedActiveId && loadedList.some(item => item.id === savedActiveId)) {
        setActiveItineraryId(savedActiveId);
        const activeItem = loadedList.find(item => item.id === savedActiveId);
        if (activeItem) {
          setCurrentItinerary(activeItem.plan);
        }
      } else if (loadedList.length > 0) {
        setActiveItineraryId(loadedList[0].id);
        setCurrentItinerary(loadedList[0].plan);
      }
    } catch (e) {
      console.error("Local data lookup failed, initial state active:", e);
    }
  }, []);

  // Update lists inside local storage
  const saveStateToStorage = (
    visited: string[],
    unlocked: Record<string, string[]>,
    tags: string[],
    itinerary: DayItinerary[],
    savedList?: SavedItinerary[],
    activeId?: string
  ) => {
    try {
      localStorage.setItem("yilan_visited_spots", JSON.stringify(visited));
      localStorage.setItem("yilan_unlocked_stories", JSON.stringify(unlocked));
      localStorage.setItem("yilan_unlocked_tags", JSON.stringify(tags));
      localStorage.setItem("yilan_current_itinerary", JSON.stringify(itinerary));
      if (savedList) {
        localStorage.setItem("yilan_saved_itineraries", JSON.stringify(savedList));
      }
      if (activeId) {
        localStorage.setItem("yilan_active_itinerary_id", activeId);
      }
    } catch (e) {
      console.warn("Could not synchronize with localstorage:", e);
    }
  };

  const handleToggleVisitedSpot = (spotName: string) => {
    let updated: string[];
    if (visitedSpots.includes(spotName)) {
      updated = visitedSpots.filter(item => item !== spotName);
    } else {
      updated = [...visitedSpots, spotName];
    }
    
    setVisitedSpots(updated);
    
    // Automatically synthesize corresponding theme learning tags
    const dynamicTags = collectAllTags(updated, unlockedStories);
    setUnlockedTags(dynamicTags);

    saveStateToStorage(updated, unlockedStories, dynamicTags, currentItinerary, savedItineraries, activeItineraryId);
  };

  const handleUnlockStory = (spotName: string, theme: string, newTag: string) => {
    const list = unlockedStories[spotName] || [];
    let updatedStories = { ...unlockedStories };
    
    if (!list.includes(theme)) {
      updatedStories[spotName] = [...list, theme];
    }
    
    setUnlockedStories(updatedStories);

    // Conjoin new tags
    let updatedTags = [...unlockedTags];
    if (!updatedTags.includes(newTag)) {
      updatedTags.push(newTag);
    }
    setUnlockedTags(updatedTags);

    saveStateToStorage(visitedSpots, updatedStories, updatedTags, currentItinerary, savedItineraries, activeItineraryId);
  };

  // Maps exact spot names and unlocked themes directly to high quality tags List
  const collectAllTags = (visited: string[], unlocked: Record<string, string[]>) => {
    const tags = new Set<string>();
    
    // Flagship spots tags across Taiwan
    visited.forEach(spot => {
      if (spot.includes("大稻埕") || spot.includes("迪化")) tags.add("✓大稻埕商貿史");
      if (spot.includes("故宮")) tags.add("✓故宮文物南遷史");
      if (spot.includes("101")) tags.add("✓台北天際線地標");
      if (spot.includes("九份")) tags.add("✓黃金山城採礦史");
      if (spot.includes("淡水")) tags.add("✓大航海海防交涉");
      if (spot.includes("高美")) tags.add("✓國家重要濕地保育");
      if (spot.includes("審計")) tags.add("✓眷舍青年聚落活化");
      if (spot.includes("日月潭")) tags.add("✓邵族文化水電史");
      if (spot.includes("清境")) tags.add("✓滇緬義胞拓荒史");
      if (spot.includes("鹿港")) tags.add("✓一府二鹿通商史");
      if (spot.includes("安平")) tags.add("✓熱蘭遮城大航海史");
      if (spot.includes("赤崁")) tags.add("✓普羅民遮城碑林");
      if (spot.includes("神農")) tags.add("✓五條港清代街屋");
      if (spot.includes("駁二")) tags.add("✓港口工業繁榮轉型");
      if (spot.includes("旗津")) tags.add("✓打狗發祥海洋史");
      if (spot.includes("阿里山")) tags.add("✓阿里山林業鐵路");
      if (spot.includes("鵝鑾鼻") || spot.includes("墾丁")) tags.add("✓東亞之光防禦燈塔");
      if (spot.includes("太魯閣")) tags.add("✓立霧溪峽谷下切地質");
      if (spot.includes("七星潭")) tags.add("✓月牙灣討海星宿傳說");
      if (spot.includes("伯朗大道") || spot.includes("池上")) tags.add("✓花東縱谷農墾良米");
      if (spot.includes("三仙台")) tags.add("✓八仙傳奇阿美族漁撈");
      if (spot.includes("澎湖")) tags.add("✓吼門深海水道貫通");
      if (spot.includes("莒光樓") || spot.includes("金門")) tags.add("✓戰地政務歷史徽記");
      if (spot.includes("芹壁") || spot.includes("馬祖")) tags.add("✓閩東花崗石人字砌石屋");
      if (spot.includes("林業文化園區") || spot.includes("羅東林")) tags.add("✓清朝林業史");
      if (spot.includes("冷泉")) tags.add("✓冷泉地質");
      if (spot.includes("南方澳") || spot.includes("漁港")) tags.add("✓漁港文化");
      if (spot.includes("生態綠舟")) tags.add("✓生態保育史");
      if (spot.includes("斑比")) tags.add("✓梅花鹿生態");
      if (spot.includes("三星蔥")) tags.add("✓三星風土");
      if (spot.includes("夜市")) tags.add("✓常民小吃點評");
    });

    Object.entries(unlocked).forEach(([spot, themes]) => {
      themes.forEach(theme => {
        if (spot.includes("大稻埕")) {
          if (theme === "歷史背景") tags.add("✓大稻埕商貿史");
          else if (theme === "建築特色") tags.add("✓巴洛克街屋");
          else tags.add("✓永樂市場老味");
        } else if (spot.includes("安平")) {
          if (theme === "歷史背景") tags.add("✓熱蘭遮城大航海史");
          else if (theme === "建築特色") tags.add("✓荷式三合土紅磚壁");
          else tags.add("✓安平蝦捲牛肉湯");
        } else if (spot.includes("日月潭")) {
          if (theme === "歷史背景") tags.add("✓邵族文化水電史");
          else if (theme === "建築特色") tags.add("✓向山清水模地景");
          else tags.add("✓紅玉紅茶阿薩姆蛋");
        } else if (spot.includes("太魯閣")) {
          if (theme === "歷史背景") tags.add("✓立霧溪峽谷下切地質");
          else if (theme === "建築特色") tags.add("✓中橫開拓峭壁步道");
          else tags.add("✓原鄉馬告竹筒飯");
        } else if (spot.includes("駁二")) {
          if (theme === "歷史背景") tags.add("✓港口工業繁榮轉型");
          else if (theme === "建築特色") tags.add("✓老倉庫鋼雕再生美學");
          else tags.add("✓鹽埕老舖切仔麵");
        } else if (spot === "羅東林業文化園區") {
          if (theme === "歷史背景") tags.add("✓清朝林業史");
          else if (theme === "建築特色") tags.add("✓日式檜木建築");
          else tags.add("✓林場肉羹文化");
        } else if (spot === "冬山河生態綠舟") {
          if (theme === "歷史背景") tags.add("✓生態保育史");
          else if (theme === "建築特色") tags.add("✓鐵道涵洞造景");
          else tags.add("✓冬山香魚茶香");
        } else if (spot === "蘇澳冷泉") {
          if (theme === "歷史背景") tags.add("✓冷泉地質");
          else if (theme === "建築特色") tags.add("✓清水模日式湯屋");
          else tags.add("✓彈珠汽水與羊羹");
        } else if (spot === "南方澳漁港") {
          if (theme === "歷史背景") tags.add("✓漁港文化");
          else if (theme === "建築特色") tags.add("✓折衷式漁港聚落");
          else tags.add("✓現撈鯖魚料理");
        } else {
          tags.add(`✓${spot}${theme}`);
        }
      });
    });

    return Array.from(tags);
  };

  const handlePlanGenerated = (newPlan: DayItinerary[], notesStr: string) => {
    const newItinerary: SavedItinerary = {
      id: "ai_" + Date.now(),
      title: `✨ AI 智慧規劃行程 (${newPlan.length}天分頁)`,
      days: newPlan.length,
      regions: ["羅東", "冬山"],
      plan: newPlan,
      createdAt: new Date().toLocaleDateString()
    };
    
    const updatedList = [newItinerary, ...savedItineraries];
    setSavedItineraries(updatedList);
    setActiveItineraryId(newItinerary.id);
    setCurrentItinerary(newPlan);
    
    // Sync with local memory storage right away
    saveStateToStorage(visitedSpots, unlockedStories, unlockedTags, newPlan, updatedList, newItinerary.id);
  };

  const handleClearItinerary = () => {
    const updatedList = savedItineraries.map(item => {
      if (item.id === activeItineraryId) {
        return {
          ...item,
          title: "我的客製行程 (已重整)",
          plan: DEFAULT_ITINERARY
        };
      }
      return item;
    });
    setSavedItineraries(updatedList);
    setCurrentItinerary(DEFAULT_ITINERARY);
    saveStateToStorage(visitedSpots, unlockedStories, unlockedTags, DEFAULT_ITINERARY, updatedList, activeItineraryId);
  };

  const handleCopyPublicItinerary = (title: string, daysNum: number, districts: string[], plan: DayItinerary[]) => {
    const newItinerary: SavedItinerary = {
      id: "copied_" + Date.now(),
      title: `${title}`,
      days: daysNum,
      regions: districts,
      plan: plan,
      createdAt: new Date().toLocaleDateString()
    };
    
    const updatedList = [newItinerary, ...savedItineraries];
    setSavedItineraries(updatedList);
    setActiveItineraryId(newItinerary.id);
    setCurrentItinerary(plan);
    saveStateToStorage(visitedSpots, unlockedStories, unlockedTags, plan, updatedList, newItinerary.id);
  };

  const handleRemixPublicItinerary = (daysNum: number, districts: string[]) => {
    setPresetDays(daysNum);
    setPresetDistricts(districts);
    setActiveTab("planner");
  };

  const handleClearPresets = () => {
    setPresetDays(undefined);
    setPresetDistricts(undefined);
  };

  const handleSelectItinerary = (id: string) => {
    const found = savedItineraries.find(item => item.id === id);
    if (found) {
      setActiveItineraryId(id);
      setCurrentItinerary(found.plan);
      saveStateToStorage(visitedSpots, unlockedStories, unlockedTags, found.plan, savedItineraries, id);
    }
  };

  const handleDeleteItinerary = (id: string) => {
    if (savedItineraries.length <= 1) {
      alert("請至少保留一份行程！");
      return;
    }
    const filtered = savedItineraries.filter(item => item.id !== id);
    setSavedItineraries(filtered);
    
    let nextActiveId = activeItineraryId;
    let nextPlan = currentItinerary;
    if (activeItineraryId === id) {
      nextActiveId = filtered[0].id;
      nextPlan = filtered[0].plan;
      setCurrentItinerary(nextPlan);
      setActiveItineraryId(nextActiveId);
    }
    saveStateToStorage(visitedSpots, unlockedStories, unlockedTags, nextPlan, filtered, nextActiveId);
  };

  const handleResetRecord = () => {
    setVisitedSpots([]);
    setUnlockedStories({});
    setUnlockedTags([]);
    setCurrentItinerary(DEFAULT_ITINERARY);
    const initialSaved: SavedItinerary[] = [
      {
        id: "default_init",
        title: "台灣旗艦文史三日行 (台北、日月潭、台南府城)",
        days: 3,
        regions: ["台北", "南投", "台南"],
        plan: DEFAULT_ITINERARY,
        createdAt: new Date().toLocaleDateString()
      }
    ];
    setSavedItineraries(initialSaved);
    setActiveItineraryId("default_init");
    localStorage.clear();
  };

  // Add customized spot from explore tab directly into itinerary
  const handleAddSpotToItinerary = (spotName: string, detail: any) => {
    // Locate Day index of active day, append place activity under Day 1 by default
    const updated = currentItinerary.map((day, idx) => {
      if (idx === 0) {
        // Prevent duplicate append
        const found = day.activities.some(a => a.title === spotName);
        if (found) return day;
        return {
          ...day,
          activities: [...day.activities, {
            time: "15:00",
            title: spotName,
            cost: detail.cost || "免費",
            highlight: "深度探索「" + spotName + "」",
            theme: detail.theme || "歷史背景"
          }]
        };
      }
      return day;
    });

    const updatedList = savedItineraries.map(item => {
      if (item.id === activeItineraryId) {
        return {
          ...item,
          plan: updated
        };
      }
      return item;
    });

    setSavedItineraries(updatedList);
    setCurrentItinerary(updated);
    saveStateToStorage(visitedSpots, unlockedStories, unlockedTags, updated, updatedList, activeItineraryId);
    setActiveTab("itinerary");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-start py-0 md:py-6 select-none font-sans">
      
      {/* Mobile-First Shell container with responsive shadow framing */}
      <div className="w-full max-w-md bg-[#FAF8F5] md:rounded-3xl shadow-xl min-h-screen md:min-h-[820px] flex flex-col justify-between border border-gray-150 relative overflow-hidden">
        
        {/* Top Header navbar with Yilan styling elements */}
        <header className="bg-[#13294B] text-white px-5 py-3.5 flex justify-between items-center border-b border-[#13294B] relative shadow-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-[#E8A02C] text-[#13294B] rounded-lg text-sm">🎒</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black tracking-tight font-display">AI深旅 DeepGo</h1>
                <span className="text-[9px] bg-[#E8A02C]/20 text-[#E8A02C] font-mono font-bold px-1.5 py-0.5 rounded-full border border-[#E8A02C]/40">
                  v1.2.0
                </span>
              </div>
              <p className="text-[9px] text-[#E8A02C]/90 font-mono tracking-wider">AI DEEP GO SMART PLANNER</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setCustomUrlInput(localStorage.getItem("deepgo_custom_api_url") || "");
              setShowServerModal(true);
              testServerConnection();
            }}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 transition-all px-2.5 py-1 rounded-full font-mono text-[9px] cursor-pointer"
            title="點擊檢查雲端後端連線狀態與設定"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${serverStatus.ok ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
            <span>{isNativePlatform() ? "APK連網" : "雲端後端"}</span>
            <span className="text-white/60">⚙️</span>
          </button>
        </header>

        {/* Dynamic Inner Tab Viewport content area */}
        <main className="flex-1 p-5 overflow-y-auto pb-24">
          <div id="tab-viewport">
            {activeTab === "explore" && (
              <ExploreTab
                onUnlockStory={handleUnlockStory}
                unlockedStories={unlockedStories}
                onAddSpotToItinerary={handleAddSpotToItinerary}
                onToggleVisitedSpot={handleToggleVisitedSpot}
                visitedSpots={visitedSpots}
                initialSpotName={navGuideSpot}
                onClearInitialSpot={() => setNavGuideSpot(null)}
                onUserCountyDetected={(county) => setUserCountyKey(county)}
              />
            )}
            
            {activeTab === "planner" && (
              <AiPlannerTab
                onPlanGenerated={handlePlanGenerated}
                onNavigateToItinerary={() => setActiveTab("itinerary")}
                presetDays={presetDays}
                presetDistricts={presetDistricts}
                clearPresets={handleClearPresets}
                detectedCounty={userCountyKey}
              />
            )}

            {activeTab === "itinerary" && (
              <MyItineraryTab
                itinerary={currentItinerary}
                savedItineraries={savedItineraries}
                activeItineraryId={activeItineraryId}
                onSelectItinerary={handleSelectItinerary}
                onDeleteItinerary={handleDeleteItinerary}
                visitedSpots={visitedSpots}
                onToggleVisited={handleToggleVisitedSpot}
                onClearItinerary={handleClearItinerary}
                onChangeTab={(tab) => setActiveTab(tab)}
                onOpenSpotGuide={handleOpenSpotGuide}
              />
            )}

            {activeTab === "colearn" && (
              <ColearnTab
                onCopyItinerary={handleCopyPublicItinerary}
                onRemixItinerary={handleRemixPublicItinerary}
                onChangeTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === "record" && (
              <LearningRecordTab
                visitedSpots={visitedSpots}
                unlockedStories={unlockedStories}
                unlockedTags={unlockedTags}
                onResetRecord={handleResetRecord}
              />
            )}
          </div>
        </main>

        {/* Bottom Tab Bar navigation controls (Prompt A requirements) */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-150 py-2.5 px-4 flex justify-between items-center z-40 shadow-lg">
          
          <button
            onClick={() => setActiveTab("explore")}
            className={`flex flex-col items-center justify-center flex-1 transition-all ${
              activeTab === "explore" ? "text-[#13294B]" : "text-gray-400 hover:text-gray-500"
            }`}
          >
            <Compass className={`w-5 h-5 mb-1 ${activeTab === "explore" ? "stroke-[2.5]" : ""}`} />
            <span className="text-[10px] font-bold">首頁景點</span>
          </button>

          <button
            onClick={() => setActiveTab("planner")}
            className={`flex flex-col items-center justify-center flex-1 transition-all relative ${
              activeTab === "planner" ? "text-[#13294B]" : "text-gray-400 hover:text-gray-500"
            }`}
          >
            <Sparkles className={`w-5 h-5 mb-1 ${activeTab === "planner" ? "text-[#E8A02C]" : ""}`} />
            <span className="text-[10px] font-bold">AI 智慧規劃</span>
            <span className="absolute -top-1 right-3 bg-red-500 text-white font-black text-[7px] w-2.5 h-2.5 rounded-full flex items-center justify-center animate-bounce">
              !
            </span>
          </button>

          <button
            onClick={() => setActiveTab("itinerary")}
            className={`flex flex-col items-center justify-center flex-1 transition-all ${
              activeTab === "itinerary" ? "text-[#13294B]" : "text-gray-400 hover:text-gray-500"
            }`}
          >
            <Calendar className={`w-5 h-5 mb-1 ${activeTab === "itinerary" ? "stroke-[2.5]" : ""}`} />
            <span className="text-[10px] font-bold">我的行程</span>
          </button>

          <button
            onClick={() => setActiveTab("colearn")}
            className={`flex flex-col items-center justify-center flex-1 transition-all ${
              activeTab === "colearn" ? "text-[#13294B]" : "text-gray-400 hover:text-gray-500"
            }`}
          >
            <Users className={`w-5 h-5 mb-1 ${activeTab === "colearn" ? "stroke-[2.5]" : ""}`} />
            <span className="text-[10px] font-bold">行程共學</span>
          </button>

          <button
            onClick={() => setActiveTab("record")}
            className={`flex flex-col items-center justify-center flex-1 transition-all ${
              activeTab === "record" ? "text-[#13294B]" : "text-gray-400 hover:text-gray-500"
            }`}
          >
            <Award className={`w-5 h-5 mb-1 ${activeTab === "record" ? "stroke-[2.5]" : ""}`} />
            <span className="text-[10px] font-bold">學習紀錄</span>
          </button>
          
        </nav>

        {/* Cloud Backend Server Connection & Settings Modal */}
        {showServerModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-150 animate-scale-up flex flex-col">
              {/* Modal Header */}
              <div className="bg-[#13294B] text-white p-4.5 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-white/10 rounded-xl">☁️</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm font-display leading-tight">雲端後端連線狀態</h3>
                      <span className="text-[9px] bg-white/20 text-white font-mono px-1.5 py-0.2 rounded font-medium">v1.2.0</span>
                    </div>
                    <p className="text-[10px] text-gray-300">APK 原生連線與 API 路由設定</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowServerModal(false)}
                  className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 text-xs text-gray-700">
                {/* Health Status Box */}
                <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                  serverStatus.ok 
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-900" 
                    : "bg-amber-50/80 border-amber-200 text-amber-900"
                }`}>
                  <div className="pt-0.5">
                    {serverStatus.ok ? (
                      <span className="w-3 h-3 rounded-full bg-emerald-500 block animate-pulse"></span>
                    ) : (
                      <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">
                        {serverStatus.ok 
                          ? (isNativePlatform() && !apiClient.getBaseUrl() ? "🟢 原生離線智慧引擎已就緒" : "🟢 雲端伺服器通訊正常") 
                          : "🟠 離線智慧模式啟動中"}
                      </span>
                      {serverStatus.latencyMs !== undefined && (
                        <span className="font-mono text-[10px] bg-white/70 px-1.5 py-0.5 rounded-md border border-emerald-200">
                          {serverStatus.latencyMs} ms
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-90">
                      {isNativePlatform() && !apiClient.getBaseUrl()
                        ? "手機 APK 已啟用深旅本地原生智慧引擎，無需連接外網伺服器即可完整生成行程與故事導覽！"
                        : (serverStatus.ok
                          ? "已成功連線至雲端 API，享有即時大型語言模型服務。"
                          : "未連線至自訂伺服器，已無縫切換至本地離線智慧引擎，功能運作完全正常。")}
                    </p>
                  </div>
                </div>

                {/* Current Active URL */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-500 block">當前運作模式：</span>
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 font-mono text-[11px] text-gray-800 break-all select-all">
                    {apiClient.getBaseUrl() || (isNativePlatform() ? "⚡ 本機原生離線智慧引擎（高可靠度免外網）" : "（本機預覽模式 - 相對路徑）")}
                  </div>
                </div>

                {/* Custom URL Input */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-gray-600 block">
                    自訂雲端後端伺服器網址（選填）：
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-custom-backend.com"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#13294B]"
                  />
                  <p className="text-[10px] text-gray-400">
                    若您有部署 server.ts 至自訂伺服器（如 Render、Fly.io、GCP），可在此輸入網址串接雲端。
                  </p>
                </div>

                {/* Dual Engine Info Badge */}
                <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-blue-700 font-bold text-xs">🛡️ 雙模高可用韌性保障</span>
                  </div>
                  <p className="text-[11px] text-blue-900 leading-relaxed">
                    本 APK 內建台灣 22 縣市完整文史景點與行程數據。無論在飛機上、山區收訊不良或無後端伺服器環境，皆能 100% 順暢生成客製化多日深度行程！
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={testServerConnection}
                    disabled={isTestingServer}
                    className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingServer ? "animate-spin" : ""}`} />
                    <span>測試連線</span>
                  </button>

                  <button
                    onClick={handleSaveCustomUrl}
                    className="flex-1 py-2 px-3 bg-[#13294B] hover:bg-[#1E3E62] text-white rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>儲存網址</span>
                  </button>

                  {customUrlInput && (
                    <button
                      onClick={handleResetDefaultUrl}
                      className="py-2 px-2.5 text-gray-400 hover:text-red-500 rounded-xl font-medium transition-all text-[11px] cursor-pointer"
                      title="重設為預設雲端網址"
                    >
                      重設
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
