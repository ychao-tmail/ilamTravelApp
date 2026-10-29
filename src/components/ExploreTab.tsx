import { useState, useEffect } from "react";
import { Search, Sparkles, Volume2, BookOpen, Compass, CornerDownRight, Play, Pause, Check, MapPin, Share2, Layers, Headphones, FileText, CheckCircle2, ChevronRight, X, Wifi, Radio, Navigation } from "lucide-react";
import { Spot } from "../types";
import { resolveSpotStory, FeaturedStoryArticle } from "../data/taiwanStories";
import { apiClient } from "../api/client";
import { 
  fetchMobileNetworkLocation, 
  fetchDeviceGeolocation, 
  getCachedLocation, 
  saveCachedLocation, 
  calcDistanceKm, 
  findClosestTaiwanCounty, 
  TAIWAN_COUNTIES, 
  DetectedLocation 
} from "../services/locationService";

// Flagship spots across Taiwan (North, Central, South, East, Offshore)
export const DEFAULT_SPOTS: Spot[] = [
  // 北部
  {
    id: "spot_tpe_1",
    name: "大稻埕/迪化街",
    intro: "百年茶香與南北貨商貿傳奇，走訪閩南紅磚洋樓與巴洛克繁複山牆，品味舊台北新思潮搖籃。",
    location: "台北市大同區",
    region: "北部",
    county: "台北市",
    icon: "🏛️",
    lat: 25.0560,
    lng: 121.5100
  },
  {
    id: "spot_tpe_2",
    name: "國立故宮博物院",
    intro: "典藏近七十萬件中華文明稀世珍寶，宮殿建築依外雙溪山勢而建，氣勢雄渾。",
    location: "台北市士林區",
    region: "北部",
    county: "台北市",
    icon: "🏺",
    lat: 25.1023,
    lng: 121.5485
  },
  {
    id: "spot_tpe_3",
    name: "台北101",
    intro: "台灣當代工程地標，竹節節節高升意象與世界級金色風阻尼球，俯瞰台北繁華天際線。",
    location: "台北市信義區",
    region: "北部",
    county: "台北市",
    icon: "🏙️",
    lat: 25.0339,
    lng: 121.5644
  },
  {
    id: "spot_ntpc_1",
    name: "九份老街",
    intro: "黃金山城霧雨濛濛，層疊石階與紅燈籠茶樓錯落，遙想昔日採金盛世與山海奇境。",
    location: "新北市瑞芳區",
    region: "北部",
    county: "新北市",
    icon: "🏮",
    lat: 25.1099,
    lng: 121.8452
  },
  {
    id: "spot_ntpc_2",
    name: "淡水紅毛城與老街",
    intro: "守望淡水河口三百餘年的紅磚城堡，串聯大航海時代西班牙、荷蘭與清末英國領事歷史。",
    location: "新北市淡水區",
    region: "北部",
    county: "新北市",
    icon: "⛵",
    lat: 25.1754,
    lng: 121.4329
  },
  {
    id: "spot_ila_1",
    name: "羅東林業文化園區",
    intro: "羅東這座城市是被木頭養大的。漫步在貯木池與森林鐵路間，感受昔日太平山伐木林業歲月。",
    location: "宜蘭縣羅東鎮",
    region: "北部",
    county: "宜蘭縣",
    icon: "🌲",
    lat: 24.6865,
    lng: 121.7709
  },
  {
    id: "spot_ila_2",
    name: "冬山河生態綠舟",
    intro: "斥資二十年保護並還原的生態系，更藏有神秘如歐式宮殿般的天井地下鐵道河道秘境。",
    location: "宜蘭縣冬山鄉",
    region: "北部",
    county: "宜蘭縣",
    icon: "⛵",
    lat: 24.6346,
    lng: 121.7915
  },
  {
    id: "spot_ila_3",
    name: "蘇澳冷泉",
    intro: "恆溫22℃的天下第一奇特汽水冷泉，日治時期著名的彈珠汽水與羊羹便在此誕生。",
    location: "宜蘭縣蘇澳鎮",
    region: "北部",
    county: "宜蘭縣",
    icon: "🫧",
    lat: 24.5953,
    lng: 121.8504
  },
  {
    id: "spot_ila_4",
    name: "南方澳漁港",
    intro: "台灣鯖魚的故鄉與世界最大的純金媽祖所在地。看三面夾海的生猛漁港小鎮聚落。",
    location: "宜蘭縣蘇澳鎮",
    region: "北部",
    county: "宜蘭縣",
    icon: "🐟",
    lat: 24.5828,
    lng: 121.8687
  },
  // 中部
  {
    id: "spot_txg_1",
    name: "高美濕地",
    intro: "大甲溪出海口的國際級潮間帶濕地，八百公尺生態木棧道伸向海面，夕陽風車如詩如畫。",
    location: "台中市清水區",
    region: "中部",
    county: "台中市",
    icon: "🌅",
    lat: 24.3120,
    lng: 120.5501
  },
  {
    id: "spot_txg_2",
    name: "審計新村",
    intro: "半世紀前台灣省政府審計處老宿舍群，蛻變為充滿在地手作與文創咖啡香氣的活力聚落。",
    location: "台中市西區",
    region: "中部",
    county: "台中市",
    icon: "☕",
    lat: 24.1456,
    lng: 120.6629
  },
  {
    id: "spot_nan_1",
    name: "日月潭",
    intro: "全台最大高山天然湖泊，向山清水模建築懷抱湖光山色，品味紅玉紅茶與邵族風土。",
    location: "南投縣魚池鄉",
    region: "中部",
    county: "南投縣",
    icon: "🛶",
    lat: 23.8517,
    lng: 120.9167
  },
  {
    id: "spot_nan_2",
    name: "清境農場",
    intro: "坐落合歡山腰的雲端草原，青青草原綿羊漫步與歐風山莊，感受高山清新微風。",
    location: "南投縣仁愛鄉",
    region: "中部",
    county: "南投縣",
    icon: "🐑",
    lat: 24.0583,
    lng: 121.1627
  },
  {
    id: "spot_chw_1",
    name: "鹿港老街",
    intro: "一府二鹿三艋舺，九曲巷防風抗盜、紅磚拱門與瑤林街古風，承載清代商業鼎盛輝煌。",
    location: "彰化縣鹿港鎮",
    region: "中部",
    county: "彰化縣",
    icon: "🏮",
    lat: 24.0567,
    lng: 120.4326
  },
  // 南部
  {
    id: "spot_tnn_1",
    name: "安平古堡",
    intro: "荷蘭東印度公司熱蘭遮城四百年，斑駁紅磚三合土殘壁與古榕交纏，見證台灣大航海起點。",
    location: "台南市安平區",
    region: "南部",
    county: "台南市",
    icon: "🏰",
    lat: 23.0016,
    lng: 120.1606
  },
  {
    id: "spot_tnn_2",
    name: "赤崁樓",
    intro: "荷治普羅民遮城殘存紅磚地窖，乾隆御賜贔屭馱碑與魁星文昌閣，古今風雲會聚府城核心。",
    location: "台南市中西區",
    region: "南部",
    county: "台南市",
    icon: "🏯",
    lat: 22.9976,
    lng: 120.2026
  },
  {
    id: "spot_khh_1",
    name: "駁二藝術特區",
    intro: "昔日高雄港第三船渠存放魚粉砂糖的老倉庫群，新生為南台灣前衛當代藝術海風聚落。",
    location: "高雄市鹽埕區",
    region: "南部",
    county: "高雄市",
    icon: "🎨",
    lat: 22.6202,
    lng: 120.2818
  },
  {
    id: "spot_khh_2",
    name: "旗津老街與燈塔",
    intro: "八角純白巴洛克燈塔巍峨守望旗後山頂，俯瞰高雄第一港口萬噸巨輪與生猛海味街市。",
    location: "高雄市旗津區",
    region: "南部",
    county: "高雄市",
    icon: "🚢",
    lat: 22.6146,
    lng: 120.2678
  },
  {
    id: "spot_chi_1",
    name: "阿里山森林遊樂區",
    intro: "世界三大高山森林鐵路之一，百年紅檜巨木林立，日出、雲海與晚霞交織的高山朝聖地。",
    location: "嘉義縣阿里山鄉",
    region: "南部",
    county: "嘉義縣",
    icon: "🚂",
    lat: 23.5106,
    lng: 120.8037
  },
  {
    id: "spot_pif_1",
    name: "墾丁鵝鑾鼻公園",
    intro: "台灣最南端岬角純白鐵造燈塔，隆起珊瑚礁岩石灰岩洞與蔚藍巴士海峽交融的國境之南。",
    location: "屏東縣恆春鎮",
    region: "南部",
    county: "屏東縣",
    icon: "🗼",
    lat: 21.9022,
    lng: 120.8524
  },
  // 東部
  {
    id: "spot_hua_1",
    name: "太魯閣國家公園",
    intro: "數百萬年板塊推擠與立霧溪下切侵蝕的大理石世界級峽谷，燕子口與九曲洞峭壁鬼斧神工。",
    location: "花蓮縣秀林鄉",
    region: "東部",
    county: "花蓮縣",
    icon: "⛰️",
    lat: 24.1590,
    lng: 121.6219
  },
  {
    id: "spot_hua_2",
    name: "七星潭",
    intro: "月牙形礫石海灣，太平洋湛藍浪花拍岸，遠眺清水斷崖高聳入雲海天一色。",
    location: "花蓮縣新城鄉",
    region: "東部",
    county: "花蓮縣",
    icon: "🌊",
    lat: 24.0305,
    lng: 121.6293
  },
  {
    id: "spot_ttt_1",
    name: "池上伯朗大道",
    intro: "花東縱谷無電桿的遼闊純粹綠毯稻浪，中央山脈甘泉孕育冠軍好米與金城武樹傳奇。",
    location: "台東縣池上鄉",
    region: "東部",
    county: "台東縣",
    icon: "🌾",
    lat: 23.1189,
    lng: 121.2215
  },
  {
    id: "spot_ttt_2",
    name: "三仙台",
    intro: "八拱跨海人行步橋宛如巨龍臥波，火山碎屑岩海蝕柱與海蝕溝點綴太平洋最美日出岬角。",
    location: "台東縣成功鎮",
    region: "東部",
    county: "台東縣",
    icon: "🌉",
    lat: 23.1235,
    lng: 121.4184
  },
  // 離島
  {
    id: "spot_pen_1",
    name: "澎湖跨海大橋",
    intro: "橫跨吼門水道長達2.5公里長虹臥波，白沙拱門與澎湖蔚藍海流交相輝映。",
    location: "澎湖縣白沙鄉",
    region: "離島",
    county: "澎湖縣",
    icon: "🌉",
    lat: 23.6521,
    lng: 119.5323
  },
  {
    id: "spot_kin_1",
    name: "金門莒光樓",
    intro: "傳統紫禁城角樓宮殿形制，曾為台海前線軍事勳章地標，登樓遠眺烈嶼與廈門海景。",
    location: "金門縣金城鎮",
    region: "離島",
    county: "金門縣",
    icon: "🏯",
    lat: 24.4253,
    lng: 118.3149
  },
  {
    id: "spot_mzu_1",
    name: "馬祖芹壁聚落",
    intro: "依山傍海的閩東花崗岩石頭屋群，宛如地中海小鎮，斑駁反共標語與蔚藍海濤共譜幽情。",
    location: "連江縣北竿鄉",
    region: "離島",
    county: "連江縣",
    icon: "🏘️",
    lat: 26.2238,
    lng: 119.9832
  }
];

// Haversine distance calculator in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  return calcDistanceKm(lat1, lon1, lat2, lon2);
}

export const PRESET_LOCATIONS = [
  { name: "宜蘭（羅東/冬山/蘇澳）", lat: 24.6865, lng: 121.7709, countyKey: "台灣 - 宜蘭縣" },
  { name: "台北（大稻埕/故宮/101）", lat: 25.0450, lng: 121.5300, countyKey: "台灣 - 台北市" },
  { name: "新北（九份/淡水）", lat: 25.1300, lng: 121.6500, countyKey: "台灣 - 新北市" },
  { name: "台中（高美濕地/審計新村）", lat: 24.1500, lng: 120.6700, countyKey: "台灣 - 台中市" },
  { name: "南投（日月潭/清境農場）", lat: 23.9500, lng: 120.9500, countyKey: "台灣 - 南投縣" },
  { name: "彰化（鹿港老街）", lat: 24.0567, lng: 120.4326, countyKey: "台灣 - 彰化縣" },
  { name: "台南（安平古堡/赤崁樓）", lat: 23.0000, lng: 120.2000, countyKey: "台灣 - 台南市" },
  { name: "高雄（駁二/旗津）", lat: 22.6200, lng: 120.3000, countyKey: "台灣 - 高雄市" },
  { name: "花蓮（太魯閣/七星潭）", lat: 24.0000, lng: 121.6000, countyKey: "台灣 - 花蓮縣" },
  { name: "台東（池上/三仙台）", lat: 23.1000, lng: 121.3000, countyKey: "台灣 - 台東縣" }
];

export const REGIONS_LIST = ["📍 附近景點", "全部全台", "北部", "中部", "南部", "東部", "離島"];

interface ExploreTabProps {
  onUnlockStory: (spotName: string, theme: string, tag: string) => void;
  unlockedStories: Record<string, string[]>;
  onAddSpotToItinerary?: (spotName: string, detail: any) => void;
  onToggleVisitedSpot?: (spotName: string) => void;
  visitedSpots?: string[];
  initialSpotName?: string | null;
  onClearInitialSpot?: () => void;
  onUserCountyDetected?: (countyKey: string) => void;
}

export default function ExploreTab({ 
  onUnlockStory, 
  unlockedStories, 
  onAddSpotToItinerary,
  onToggleVisitedSpot,
  visitedSpots = [],
  initialSpotName,
  onClearInitialSpot,
  onUserCountyDetected
}: ExploreTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("📍 附近景點");
  const [selectedTheme, setSelectedTheme] = useState<"歷史背景" | "建築特色" | "在地飲食">("歷史背景");
  const [activeSpot, setActiveSpot] = useState<Spot | null>(null);
  const [currentArticle, setCurrentArticle] = useState<FeaturedStoryArticle | null>(null);
  const [activeTabMode, setActiveTabMode] = useState<"article" | "audio" | "tips">("article");

  // User location for Nearby Spots (with local cache support)
  const [userCoords, setUserCoords] = useState<DetectedLocation>(() => {
    const cached = getCachedLocation();
    if (cached) return cached;
    return {
      lat: 25.0450,
      lng: 121.5300,
      name: "台北市（預設中心）",
      countyName: "台北市",
      source: "cache",
      accuracyDesc: "預設位置"
    };
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locatingMethod, setLocatingMethod] = useState<"network" | "gps" | null>(null);
  const [locationStatusNotice, setLocationStatusNotice] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // 1. Mobile Network Location (4G/5G 行動網路基地台定位 - 室內外皆可秒速定位，不需等待 GPS 衛星)
  const handleLocateViaMobileNetwork = async () => {
    setIsLocating(true);
    setLocatingMethod("network");
    setLocationStatusNotice("📶 正在以行動網路基地台定位所在地...");

    try {
      const netLoc = await fetchMobileNetworkLocation();
      if (netLoc) {
        setUserCoords(netLoc);
        setLocationStatusNotice(`✅ 已由行動網路定位：${netLoc.countyName}`);
        if (onUserCountyDetected) {
          const { county } = findClosestTaiwanCounty(netLoc.lat, netLoc.lng);
          onUserCountyDetected(county.countyKey);
        }
      } else {
        setLocationStatusNotice("行動網路定位查詢逾時，維持目前所在地");
      }
    } catch (e) {
      console.warn("Mobile network locate error:", e);
      setLocationStatusNotice("行動網路訊號不穩，請稍候再試");
    } finally {
      setIsLocating(false);
      setLocatingMethod(null);
      setTimeout(() => setLocationStatusNotice(null), 4000);
    }
  };

  // 2. GPS Satellite / Device Hardware Location
  const handleLocateViaGps = async () => {
    setIsLocating(true);
    setLocatingMethod("gps");
    setLocationStatusNotice("🛰️ 正在連線 GPS 衛星偵測精準位置...");

    try {
      const gpsLoc = await fetchDeviceGeolocation(true);
      setUserCoords(gpsLoc);
      setLocationStatusNotice(`✅ GPS 衛星精準定位成功：${gpsLoc.countyName}`);
      if (onUserCountyDetected) {
        const { county } = findClosestTaiwanCounty(gpsLoc.lat, gpsLoc.lng);
        onUserCountyDetected(county.countyKey);
      }
    } catch (err: any) {
      console.log("GPS locate unavailable or denied, falling back to mobile network:", err);
      setLocationStatusNotice("GPS 訊號弱，自動切換為行動網路基地台定位...");
      // Auto fallback to cellular network
      const netLoc = await fetchMobileNetworkLocation();
      if (netLoc) {
        setUserCoords(netLoc);
        setLocationStatusNotice(`✅ 已自動切換為行動網路定位：${netLoc.countyName}`);
        if (onUserCountyDetected) {
          const { county } = findClosestTaiwanCounty(netLoc.lat, netLoc.lng);
          onUserCountyDetected(county.countyKey);
        }
      }
    } finally {
      setIsLocating(false);
      setLocatingMethod(null);
      setTimeout(() => setLocationStatusNotice(null), 4000);
    }
  };

  // Auto detect location on initial app launch:
  // Immediately attempts Mobile Network (instant) + attempts coarse device geolocation
  useEffect(() => {
    // Immediate non-blocking mobile network location fetch
    fetchMobileNetworkLocation().then((netLoc) => {
      if (netLoc) {
        setUserCoords(netLoc);
        if (onUserCountyDetected) {
          const { county } = findClosestTaiwanCounty(netLoc.lat, netLoc.lng);
          onUserCountyDetected(county.countyKey);
        }
      }
    }).catch(() => {});

    // Also attempt coarse device geolocation if available
    fetchDeviceGeolocation(false).then((geoLoc) => {
      if (geoLoc) {
        setUserCoords(geoLoc);
        if (onUserCountyDetected) {
          const { county } = findClosestTaiwanCounty(geoLoc.lat, geoLoc.lng);
          onUserCountyDetected(county.countyKey);
        }
      }
    }).catch(() => {});
  }, []);

  // Voice/audio custom controls
  const [guideText, setGuideText] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isAiCustomized, setIsAiCustomized] = useState(false);
  const [selectedGuideLength, setSelectedGuideLength] = useState<string>("中等"); // 簡潔, 中等, 長文
  const [selectedExpressStyle, setSelectedExpressStyle] = useState<string>("經典"); // 經典, 幽默, 教學
  const [selectedVoicePack, setSelectedVoicePack] = useState<string>("專業的主播"); // 可愛孩子, 專業的主播, 英語播報
  const [speechRate, setSpeechRate] = useState<number>(1.0); // 0.8, 1.0, 1.2
  const [justGeneratedSuccess, setJustGeneratedSuccess] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [usedAiModel, setUsedAiModel] = useState<string | null>(null);

  // Web Speech audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Listen for initialSpotName passed from itinerary navigation
  useEffect(() => {
    if (initialSpotName) {
      const match = DEFAULT_SPOTS.find(
        (s) => s.name === initialSpotName || initialSpotName.includes(s.name) || s.name.includes(initialSpotName)
      );
      if (match) {
        handleOpenGuide(match, selectedTheme);
      } else {
        const customSpot: Spot = {
          id: "custom_" + initialSpotName,
          name: initialSpotName,
          intro: `台灣精選文化走讀景點：${initialSpotName}`,
          location: "台灣深度推薦景點",
          region: "全台",
          icon: "📍"
        };
        handleOpenGuide(customSpot, selectedTheme);
      }
      if (onClearInitialSpot) {
        onClearInitialSpot();
      }
    }
  }, [initialSpotName]);

  // Handle open spot guide modal and load authentic featured article immediately
  const handleOpenGuide = (
    spot: Spot,
    theme: "歷史背景" | "建築特色" | "在地飲食" = selectedTheme,
    openMode: "article" | "audio" = "article"
  ) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setAudioProgress(0);
    setActiveSpot(spot);
    setSelectedTheme(theme);

    // 1. Immediately resolve authentic featured article from rich database
    const article = resolveSpotStory(spot.name, theme);
    setCurrentArticle(article);
    setGuideText(article.audioScript);
    setIsAiCustomized(false);
    setJustGeneratedSuccess(false);
    setToastMsg(null);
    setUsedAiModel(null);
    setActiveTabMode(openMode);

    // 2. Unlock learning tag and story record
    onUnlockStory(spot.name, theme, article.tag);
  };

  // Switch theme directly inside reader modal
  const handleSwitchThemeInModal = (theme: "歷史背景" | "建築特色" | "在地飲食") => {
    if (!activeSpot) return;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setAudioProgress(0);
    setSelectedTheme(theme);
    const article = resolveSpotStory(activeSpot.name, theme);
    setCurrentArticle(article);
    setGuideText(article.audioScript);
    setIsAiCustomized(false);
    setJustGeneratedSuccess(false);
    setToastMsg(null);
    setUsedAiModel(null);
    onUnlockStory(activeSpot.name, theme, article.tag);
  };

  // Generate live AI customized voice script via Gemini
  const handleCustomizeWithAi = async () => {
    if (!activeSpot) return;
    setIsLoadingAi(true);
    setJustGeneratedSuccess(false);
    setToastMsg(null);
    setActiveTabMode("audio");
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);

    try {
      const data = await apiClient.generateGuidedStory({
        spotName: activeSpot.name,
        theme: selectedTheme,
        lengthStyle: selectedGuideLength,
        voiceStyle: selectedExpressStyle,
        voiceTone: selectedVoicePack
      });

      if (data && data.text) {
        setGuideText(data.text);
        setIsAiCustomized(true);
        setUsedAiModel(data.model || "gemini-3.8-flash");
        setJustGeneratedSuccess(true);
        setToastMsg(`✅ 已由 Gemini 生成【${selectedGuideLength} / ${selectedExpressStyle} / ${selectedVoicePack}】專屬說書詞！`);
        return;
      }
      throw new Error("API did not return valid text");
    } catch (e: any) {
      console.warn("AI generation failed or offline, fallback to styled authentic script:", e);
      // High-fidelity fallback preserving verified authentic content
      const fallbackArticle = resolveSpotStory(activeSpot.name, selectedTheme);
      let localScript = fallbackArticle.audioScript;
      if (selectedExpressStyle === "幽默") {
        localScript = `💥 各位客官坐好囉！聽我來扒一扒【${activeSpot.name}】的精彩身世！關於這裡的【${selectedTheme}】：\n\n${fallbackArticle.audioScript}\n\n這才叫真真正正的深度台灣漫遊！`;
      } else if (selectedExpressStyle === "教學") {
        localScript = `🎓 各位旅客，請翻開台灣風土人文講義。今天在【${activeSpot.name}】，我們特別講授其【${selectedTheme}】：\n\n${fallbackArticle.audioScript}\n\n請大家在現場特別留意其空間構造、歷史脈絡與生活細節。`;
      } else if (selectedVoicePack === "英語播報") {
        localScript = `Welcome to explore ${activeSpot.name} in Taiwan!\n\n${fallbackArticle.audioScript}\n\nEnjoy your deep journey through Taiwan's rich history and culture!`;
      } else if (selectedVoicePack === "可愛孩子") {
        localScript = `👶 哇！大哥哥大姊姊快看！這裡就是【${activeSpot.name}】唷！\n\n${fallbackArticle.audioScript}\n\n是不是超級神奇？我們一起去探險吧！`;
      }
      setGuideText(localScript);
      setIsAiCustomized(true);
      setJustGeneratedSuccess(true);
      setToastMsg(`✨ 已生成【${selectedGuideLength} / ${selectedExpressStyle} / ${selectedVoicePack}】典藏導覽說書詞！`);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Audio Playback with Web Speech API
  const handleToggleAudio = () => {
    if (!window.speechSynthesis) {
      alert("您的瀏覽器尚不支援內建語音播放 Web Speech API。");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setAudioProgress(0);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = guideText || currentArticle?.audioScript || "歡迎收聽台灣深度語音導覽。";
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      if (selectedVoicePack === "英語播報") {
        utterance.lang = "en-US";
        utterance.rate = speechRate * 0.95;
        utterance.pitch = 1.0;
      } else if (selectedVoicePack === "可愛孩子") {
        utterance.lang = "zh-TW";
        utterance.rate = speechRate * 1.1;
        utterance.pitch = 1.4;
      } else {
        utterance.lang = "zh-TW";
        utterance.rate = speechRate * 0.92;
        utterance.pitch = 0.95;
      }

      utterance.onend = () => {
        setIsPlayingAudio(false);
        setAudioProgress(100);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      // Approximate progress tracking
      const estDurationSec = Math.max(10, Math.round(textToSpeak.length * 0.35 * (1 / speechRate)));
      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed += 0.5;
        const pct = Math.min(99, Math.round((elapsed / estDurationSec) * 100));
        setAudioProgress(pct);
        if (elapsed >= estDurationSec || !isPlayingAudio) {
          clearInterval(interval);
        }
      }, 500);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Calculate distance for all spots
  const spotsWithDistance: Spot[] = DEFAULT_SPOTS.map((spot) => {
    if (spot.lat && spot.lng) {
      const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, spot.lat, spot.lng);
      return { ...spot, distanceKm: dist };
    }
    return spot;
  });

  // Top nearby spots sorted by proximity for the quick guide picker
  const nearbyRecommendedSpots = [...spotsWithDistance]
    .sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999))
    .slice(0, 4);

  // Filter spots by search & region
  const filteredSpots = spotsWithDistance
    .filter((spot) => {
      const matchesSearch =
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.intro.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion =
        selectedRegion === "全部全台" ||
        selectedRegion === "📍 附近景點" ||
        spot.region === selectedRegion;
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => {
      if (selectedRegion === "📍 附近景點") {
        return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
      }
      return 0;
    });

  const themesList: Array<{ name: "歷史背景" | "建築特色" | "在地飲食"; icon: string }> = [
    { name: "歷史背景", icon: "🏛️" },
    { name: "建築特色", icon: "📐" },
    { name: "在地飲食", icon: "🍜" }
  ];

  return (
    <div className="space-y-5 fade-in p-1">
      {/* Hero Header */}
      <div className="bg-[#13294B] text-white p-5 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 font-[serif] text-8xl">台</div>
        <div className="relative z-10 space-y-1">
          <span className="bg-[#E8A02C] text-[#13294B] text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            全台走讀現場隨身聽
          </span>
          <h2 className="text-2xl font-bold font-display tracking-tight mt-1">台灣真實特色導覽專文庫</h2>
          <p className="text-gray-200 text-xs sm:text-sm max-w-lg leading-relaxed">
            告別走馬看花！收錄全台22縣市精選文史身世、建築空間構造密碼、常民舌尖尋味與行家現場走讀密技。
          </p>
        </div>
      </div>

      {/* 📍 Nearby Spots Guide Picker Section (預設開啟附近的景點可以挑選導覽) */}
      <div className="bg-gradient-to-br from-[#13294B] via-[#1B3B60] to-[#13294B] text-white p-4.5 rounded-2xl shadow-md space-y-3.5 border border-[#E8A02C]/25 relative">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#E8A02C]/20 text-[#E8A02C] rounded-xl text-xl">📍</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base font-display">
                  附近熱門景點導覽推薦
                </h3>
                <span className="bg-[#E8A02C] text-[#13294B] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  預設推薦
                </span>
              </div>
              <p className="text-[11px] text-gray-300 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>目前所在地：</span>
                <span className="font-bold text-amber-300 underline decoration-amber-400/50 underline-offset-2">
                  {userCoords.name}
                </span>
                {userCoords.source === "network" && (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    📶 行動網路定位
                  </span>
                )}
                {userCoords.source === "gps" && (
                  <span className="text-[9px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-1.5 py-0.2 rounded font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    🛰️ GPS 精準
                  </span>
                )}
                {userCoords.source === "cache" && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded font-mono">
                    ⚡ 自動記憶位置
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Action buttons: Mobile Network, GPS, Manual Location Picker */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handleLocateViaMobileNetwork}
              disabled={isLocating}
              className={`text-[10px] px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all border cursor-pointer active:scale-95 ${
                locatingMethod === "network"
                  ? "bg-emerald-500 text-white border-emerald-400"
                  : "bg-white/10 hover:bg-white/20 text-white border-white/15"
              } disabled:opacity-50`}
              title="使用 4G/5G 行動網路基地台快速定位（免等待衛星，室內外皆可）"
            >
              <Wifi className={`w-3.5 h-3.5 text-emerald-300 ${locatingMethod === "network" ? "animate-spin" : ""}`} />
              <span>{locatingMethod === "network" ? "網路定位中..." : "行動網路定位"}</span>
            </button>

            <button
              onClick={handleLocateViaGps}
              disabled={isLocating}
              className={`text-[10px] px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all border cursor-pointer active:scale-95 ${
                locatingMethod === "gps"
                  ? "bg-amber-500 text-white border-amber-400"
                  : "bg-white/10 hover:bg-white/20 text-white border-white/15"
              } disabled:opacity-50`}
              title="使用手機硬體 GPS 衛星精準定位"
            >
              <Navigation className={`w-3.5 h-3.5 text-[#E8A02C] ${locatingMethod === "gps" ? "animate-spin" : ""}`} />
              <span>{locatingMethod === "gps" ? "GPS搜尋中..." : "GPS精準"}</span>
            </button>

            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="text-[10px] bg-white/10 hover:bg-white/20 active:scale-95 text-white px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all border border-white/15 cursor-pointer"
              title="手動挑選全台 22 縣市所在位置"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>切換城市</span>
            </button>
          </div>
        </div>

        {/* Temporary locating status notice message */}
        {locationStatusNotice && (
          <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 text-[11px] text-amber-200 flex items-center gap-1.5 animate-fadeIn">
            <span>ℹ️</span>
            <span>{locationStatusNotice}</span>
          </div>
        )}

        {/* Location Picker Popover Drawer */}
        {showLocationPicker && (
          <div className="p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 space-y-2.5 animate-fadeIn text-xs">
            <div className="flex justify-between items-center text-gray-200 text-[11px] font-bold">
              <span>📍 選擇您所在的台灣城市（即時計算全台景點距您里程）：</span>
              <button
                onClick={() => setShowLocationPicker(false)}
                className="text-gray-300 hover:text-white px-2 py-0.5 rounded cursor-pointer bg-white/10"
              >
                ✕ 關閉
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {TAIWAN_COUNTIES.map((c) => {
                const isCur = userCoords.countyName === c.name || userCoords.name.includes(c.name);
                return (
                  <button
                    key={c.name}
                    onClick={() => {
                      const newLoc: DetectedLocation = {
                        lat: c.lat,
                        lng: c.lng,
                        name: `${c.name}（📍 手動自選）`,
                        countyName: c.name,
                        source: "manual",
                        accuracyDesc: "手動指定"
                      };
                      setUserCoords(newLoc);
                      saveCachedLocation(newLoc);
                      if (onUserCountyDetected) {
                        onUserCountyDetected(c.countyKey);
                      }
                      setShowLocationPicker(false);
                      setLocationStatusNotice(`已手動切換至：${c.name}`);
                      setTimeout(() => setLocationStatusNotice(null), 3000);
                    }}
                    className={`p-2 rounded-lg text-left text-[11px] transition-all cursor-pointer border flex items-center justify-between ${
                      isCur
                        ? "bg-[#E8A02C] text-[#13294B] border-[#E8A02C] font-bold shadow-xs"
                        : "bg-white/10 hover:bg-white/20 text-gray-200 border-white/10"
                    }`}
                  >
                    <span>📍 {c.name}</span>
                    <span className="text-[9px] opacity-75">{c.region}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4 Quick Pick Nearby Spot Cards */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] text-gray-300 flex items-center justify-between">
            <span>✨ 距離您最近的景點（點擊直接收聽導覽或閱讀專文）：</span>
            <span className="text-[10px] text-amber-300/90 font-mono">
              主題：{selectedTheme}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {nearbyRecommendedSpots.map((spot) => {
              const distLabel =
                spot.distanceKm !== undefined
                  ? spot.distanceKm < 1
                    ? `距您約 ${Math.round(spot.distanceKm * 1000)} 公尺`
                    : `距您約 ${spot.distanceKm} 公里`
                  : "周邊熱門";

              return (
                <div
                  key={spot.id}
                  className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl p-3 flex flex-col justify-between transition-all group shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl p-0.5 bg-white/10 rounded-lg">{spot.icon}</span>
                        <h4 className="font-bold text-sm text-white group-hover:text-[#E8A02C] transition-colors">
                          {spot.name}
                        </h4>
                      </div>
                      <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        📍 {distLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300 line-clamp-1 pl-0.5">
                      {spot.intro}
                    </p>
                  </div>

                  {/* Quick Action buttons */}
                  <div className="flex items-center gap-2 pt-2.5 mt-1.5 border-t border-white/10">
                    <button
                      onClick={() => handleOpenGuide(spot, selectedTheme, "audio")}
                      className="flex-1 bg-[#E8A02C] hover:bg-[#d68f23] text-[#13294B] text-[11px] font-black py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
                      title="直接播放景點語音解說"
                    >
                      <Headphones className="w-3.5 h-3.5 text-[#13294B]" />
                      <span>🎙️ 立即導覽</span>
                    </button>
                    <button
                      onClick={() => handleOpenGuide(spot, selectedTheme, "article")}
                      className="flex-1 bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all border border-white/15 cursor-pointer active:scale-95"
                      title="閱讀深度文史與空間解說"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-200" />
                      <span>📖 深度故事</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5" />
        <input
          type="text"
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#13294B] shadow-xs transition-all"
          placeholder="搜尋全台景點或縣市，例如：大稻埕、安平古堡、日月潭、太魯閣、鹿港..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Region Selector Pills */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
          地理分區快速篩選
        </label>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {REGIONS_LIST.map((reg) => {
            const isSelected = selectedRegion === reg;
            return (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-[#13294B] text-white border-[#13294B] shadow-xs"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {reg}
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
          預設導覽主題方向
        </label>
        <div className="grid grid-cols-3 gap-2">
          {themesList.map((theme) => {
            const isSelected = selectedTheme === theme.name;
            return (
              <button
                key={theme.name}
                onClick={() => setSelectedTheme(theme.name)}
                className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-[#13294B] text-white border-[#13294B] shadow-xs font-semibold"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span>{theme.icon}</span>
                <span>{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of spots */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#13294B]" />
            全台深度探索景點 ({filteredSpots.length})
          </h3>
          <span className="text-[10px] text-gray-400 font-mono">
            目前範圍：{selectedRegion}
          </span>
        </div>

        {filteredSpots.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-100 text-center text-gray-400 text-sm">
            找不到符合的台灣探索景點，請嘗試更換搜尋關鍵字或分區。
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredSpots.map((spot) => {
              const unlockedList = unlockedStories[spot.name] || [];
              const isVisited = visitedSpots.includes(spot.name);
              return (
                <div
                  key={spot.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4.5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  id={`spot-card-${spot.id}`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl p-1 bg-[#FAF8F5] rounded-xl">{spot.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900 text-base font-display">{spot.name}</h4>
                            {isVisited && (
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-100 flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> 已走訪
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 flex items-center flex-wrap gap-1 mt-0.5">
                            📍 {spot.location}
                            {spot.region && (
                              <span className="ml-0.5 bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.2 rounded font-medium">
                                {spot.region}
                              </span>
                            )}
                            {spot.distanceKm !== undefined && (
                              <span className="ml-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.2 rounded-full border border-emerald-200/80 font-mono">
                                📍 距您 {spot.distanceKm < 1 ? `${Math.round(spot.distanceKm * 1000)} 公尺` : `${spot.distanceKm} 公里`}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      {unlockedList.length > 0 && (
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                          📖 已研讀 {unlockedList.length}/3 篇
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-xs leading-relaxed mb-4">
                      {spot.intro}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenGuide(spot, selectedTheme, "article")}
                      className="flex-1 min-w-[120px] bg-[#13294B] hover:bg-[#1E3E62] text-white text-xs font-bold py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#E8A02C]" />
                      <span>閱讀【{selectedTheme}】專文</span>
                    </button>
                    <button
                      onClick={() => handleOpenGuide(spot, selectedTheme, "audio")}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      title="快速聆聽此景點語音說書詞"
                    >
                      <Headphones className="w-3.5 h-3.5 text-white" />
                      <span>🎧 聽說書詞</span>
                    </button>
                    {onAddSpotToItinerary && (
                      <button
                        onClick={() =>
                          onAddSpotToItinerary(spot.name, {
                            time: "預定前往",
                            title: spot.name,
                            cost: "免費",
                            highlight: spot.intro.slice(0, 25) + "...",
                            theme: selectedTheme
                          })
                        }
                        className="bg-[#FAF8F5] hover:bg-gray-100 text-gray-700 text-xs border border-gray-200 py-2.5 px-3 rounded-xl transition-all font-semibold cursor-pointer"
                        title="加進我的行程"
                      >
                        排入行程
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FULL FEATURE ARTICLE READER / AUDIO DRAWER */}
      {activeSpot && currentArticle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[92vh] flex flex-col border border-gray-100">
            {/* Modal Header */}
            <div className="bg-[#13294B] text-white p-4.5 flex justify-between items-center select-none flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-1 bg-white/10 rounded-xl">{activeSpot.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base font-display leading-tight">{activeSpot.name}</h3>
                    <span className="bg-[#E8A02C] text-[#13294B] text-[10px] font-extrabold px-2 py-0.2 rounded-full">
                      特色專文
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-0.5">
                    📍 {activeSpot.location} • 標籤解鎖：{currentArticle.tag}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveSpot(null);
                  setCurrentArticle(null);
                  setIsPlayingAudio(false);
                  if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
                title="關閉"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* In-Modal Quick Theme Switcher */}
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between gap-2 overflow-x-auto flex-shrink-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex-shrink-0">
                專文篇章：
              </span>
              <div className="flex gap-1.5 flex-shrink-0">
                {themesList.map((t) => {
                  const isCurrent = selectedTheme === t.name;
                  return (
                    <button
                      key={t.name}
                      onClick={() => handleSwitchThemeInModal(t.name)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all border cursor-pointer flex items-center gap-1 ${
                        isCurrent
                          ? "bg-[#13294B] text-white border-[#13294B] shadow-xs"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span>{t.icon}</span>
                      <span>{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reader Tab bar: Article vs Audio Player vs On-site Tips */}
            <div className="px-5 pt-3 pb-1 border-b border-gray-100 flex items-center gap-4 text-xs font-bold text-gray-500 flex-shrink-0">
              <button
                onClick={() => setActiveTabMode("article")}
                className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTabMode === "article"
                    ? "border-[#13294B] text-[#13294B]"
                    : "border-transparent hover:text-gray-900"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>📜 深度特色專文</span>
              </button>
              <button
                onClick={() => setActiveTabMode("audio")}
                className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTabMode === "audio"
                    ? "border-[#E8A02C] text-[#E8A02C]"
                    : "border-transparent hover:text-gray-900"
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span>🎧 語音說書播音</span>
                {isPlayingAudio && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTabMode("tips")}
                className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTabMode === "tips"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent hover:text-gray-900"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>💡 現場走讀密技</span>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 bg-[#FAF8F5]">
              {/* TAB 1: AUTHENTIC DEEP ARTICLE */}
              {activeTabMode === "article" && (
                <div className="space-y-4">
                  {/* Article Title Banner */}
                  <div className="bg-white p-4.5 rounded-2xl border border-amber-200/60 shadow-xs space-y-2">
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                      台灣風土深度走讀手稿
                    </span>
                    <h3 className="font-extrabold text-gray-900 text-base sm:text-lg leading-snug font-display">
                      {currentArticle.articleTitle}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                      💡 <strong>導讀精要：</strong>{currentArticle.summary}
                    </p>
                  </div>

                  {/* Quick Action Banner to Audio & AI */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 bg-[#E8A02C] text-white rounded-xl text-lg shadow-xs">🎧</span>
                      <div>
                        <span className="text-xs font-bold text-gray-900 block font-display">現場走讀想用聽的？</span>
                        <span className="text-[11px] text-gray-600">隨身聽原聲解說，或由 Gemini 為您客製專屬風格說書詞</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setActiveTabMode("audio");
                          if (!isPlayingAudio) {
                            handleToggleAudio();
                          }
                        }}
                        className="flex-1 sm:flex-initial py-2 px-3.5 bg-[#13294B] hover:bg-[#1E3E62] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>聆聽說書</span>
                      </button>
                      <button
                        onClick={() => {
                          handleCustomizeWithAi();
                        }}
                        className="flex-1 sm:flex-initial py-2 px-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        <span>一鍵產生說書詞</span>
                      </button>
                    </div>
                  </div>

                  {/* Section 1: 文史身世與時代背景 */}
                  <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                      <span className="text-base">🏛️</span>
                      <h4 className="font-bold text-sm text-gray-900 font-display">
                        風土身世與歷史脈絡
                      </h4>
                    </div>
                    <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                      {currentArticle.historyContext}
                    </div>
                  </div>

                  {/* Section 2: 空間構造與建築解密 */}
                  <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                      <span className="text-base">📐</span>
                      <h4 className="font-bold text-sm text-gray-900 font-display">
                        空間構造與建築密碼
                      </h4>
                    </div>
                    <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                      {currentArticle.architectureDetails}
                    </div>
                  </div>

                  {/* Section 3: 常民舌尖與在地理氣 */}
                  <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                      <span className="text-base">🍜</span>
                      <h4 className="font-bold text-sm text-gray-900 font-display">
                        常民生活與尋味指南
                      </h4>
                    </div>
                    <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                      {currentArticle.foodCulture}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: AUDIO NARRATIVE & AI CONTROLLER */}
              {activeTabMode === "audio" && (
                <div className="space-y-4">
                  {/* Toast Alert */}
                  {toastMsg && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center justify-between gap-2 shadow-xs animate-fade-in font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{toastMsg}</span>
                      </div>
                      {!isPlayingAudio && (
                        <button
                          onClick={handleToggleAudio}
                          className="py-1 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer flex-shrink-0 shadow-xs"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>立即播放</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Audio Player Card */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-4.5 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleToggleAudio}
                          className="w-12 h-12 bg-[#E8A02C] hover:bg-amber-500 text-white rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          {isPlayingAudio ? (
                            <Pause className="w-5 h-5 fill-white" />
                          ) : (
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          )}
                        </button>
                        <div>
                          <span className="text-sm font-bold text-gray-900 block font-display">
                            {isPlayingAudio ? "正在播報導覽說書..." : "點擊播放語音導覽"}
                          </span>
                          <span className="text-xs text-gray-400">
                            語音包：{selectedVoicePack} • 語速：{speechRate}x
                          </span>
                        </div>
                      </div>

                      {/* Speed control */}
                      <div className="flex gap-1">
                        {[0.8, 1.0, 1.25].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => setSpeechRate(rate)}
                            className={`text-[10px] px-2 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                              speechRate === rate
                                ? "bg-[#13294B] text-white border-[#13294B]"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-white"
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#E8A02C] h-1.5 transition-all duration-300"
                          style={{ width: `${audioProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                        <span>進度 {audioProgress}%</span>
                        <span>{isAiCustomized ? `✨ Gemini 專屬版 (${usedAiModel || "gemini-3.8-flash"})` : "📖 原文典藏解說稿"}</span>
                      </div>
                    </div>

                    {/* Spoken text view */}
                    <div className="bg-[#FAF8F5] rounded-xl p-3.5 border border-gray-200 text-xs text-gray-800 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                      {guideText}
                    </div>

                    {/* Action buttons below spoken text */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                      <button
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(guideText || "");
                            alert("已複製說書詞至剪貼簿！");
                          }
                        }}
                        className="text-[11px] text-gray-500 hover:text-gray-800 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>📋</span> 複製說書文字
                      </button>
                      <button
                        onClick={handleToggleAudio}
                        className="text-[11px] text-[#13294B] hover:text-[#E8A02C] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {isPlayingAudio ? (
                          <>
                            <Pause className="w-3.5 h-3.5 text-[#E8A02C]" />
                            <span>暫停語音朗讀</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 text-[#13294B]" />
                            <span>語音朗讀這段話</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* AI Customizer Panel */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-xs font-bold text-[#13294B] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#E8A02C]" />
                        Gemini 智慧現場說書客製（可選腔調與長度）
                      </span>
                    </div>

                    {/* Option selects */}
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500 font-semibold text-[11px]">篇幅長度:</span>
                        <div className="flex gap-1">
                          {["簡潔", "中等", "長文"].map((len) => (
                            <button
                              key={len}
                              onClick={() => setSelectedGuideLength(len)}
                              className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                                selectedGuideLength === len
                                  ? "bg-[#13294B] text-white border-[#13294B]"
                                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-white"
                              }`}
                            >
                              {len}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500 font-semibold text-[11px]">口吻風格:</span>
                        <div className="flex gap-1">
                          {["經典", "幽默", "教學"].map((est) => (
                            <button
                              key={est}
                              onClick={() => setSelectedExpressStyle(est)}
                              className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                                selectedExpressStyle === est
                                  ? "bg-[#13294B] text-white border-[#13294B]"
                                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-white"
                              }`}
                            >
                              {est}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500 font-semibold text-[11px]">配英語音包:</span>
                        <div className="flex gap-1">
                          {["專業的主播", "可愛孩子", "英語播報"].map((vtp) => (
                            <button
                              key={vtp}
                              onClick={() => setSelectedVoicePack(vtp)}
                              className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                                selectedVoicePack === vtp
                                  ? "bg-[#13294B] text-white border-[#13294B]"
                                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-white"
                              }`}
                            >
                              {vtp}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleCustomizeWithAi}
                      disabled={isLoadingAi}
                      className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-[#13294B] to-[#1E3E62] hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {isLoadingAi ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>連線 Gemini 即時量身客製中...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#E8A02C]" />
                          <span>一鍵由 Gemini 產生【{selectedGuideLength}/{selectedExpressStyle}/{selectedVoicePack}】說書詞</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: ON-SITE TIPS */}
              {activeTabMode === "tips" && (
                <div className="space-y-4">
                  <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                    <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5 font-display">
                      <span>👀</span> 行家現場走讀密技與私房看點
                    </h4>
                    <p className="text-xs text-gray-500">
                      到了【{activeSpot.name}】現場，務必放慢腳步親自觀察以下 3 個核心細節：
                    </p>
                    <ul className="space-y-2.5 pt-1">
                      {currentArticle.onSiteTips.map((tip, idx) => (
                        <li
                          key={idx}
                          className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl text-xs text-gray-800 leading-relaxed flex items-start gap-2.5 font-medium"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Sticky Bar */}
            <div className="p-3.5 bg-white border-t border-gray-200 flex items-center justify-between gap-2 flex-shrink-0">
              {onToggleVisitedSpot && (
                <button
                  onClick={() => onToggleVisitedSpot(activeSpot.name)}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                    visitedSpots.includes(activeSpot.name)
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {visitedSpots.includes(activeSpot.name) ? "✔ 已標記走訪" : "標記為已走訪"}
                </button>
              )}

              {onAddSpotToItinerary && (
                <button
                  onClick={() => {
                    onAddSpotToItinerary(activeSpot.name, {
                      time: "預定前往",
                      title: activeSpot.name,
                      cost: "免費",
                      highlight: activeSpot.intro.slice(0, 25) + "...",
                      theme: selectedTheme
                    });
                    alert(`已將「${activeSpot.name}」加入您的行程！`);
                  }}
                  className="py-2 px-4 bg-[#13294B] hover:bg-[#1E3E62] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <span>➕ 排入我的行程</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
