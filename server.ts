import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { resolveSpotStory } from "./src/data/taiwanStories.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable CORS for Capacitor Native App (capacitor://localhost, http://localhost) & Web Clients
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Initialize Gemini SDK if API key is provided
const isGeminiEnabled = !!process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (isGeminiEnabled) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini Live GenAI SDK initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini SDK:", err);
  }
} else {
  console.log("Using High-Fidelity local simulation. Provide GEMINI_API_KEY for live AI content.");
}

// Multi-model fallback caller to handle temporary 503 high-demand spikes gracefully
async function generateGeminiWithFallback(prompt: string, config: any) {
  if (!isGeminiEnabled || !ai) {
    throw new Error("Gemini AI is not initialized");
  }
  // Valid models per gemini-api skill: gemini-3.8-flash, gemini-3.1-flash-lite, gemini-flash-latest
  const models = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  let lastErr = null;
  for (const m of models) {
    try {
      const res = await ai.models.generateContent({
        model: m,
        contents: prompt,
        config
      });
      const text = res.text || "";
      if (text.trim()) {
        return { text: text.trim(), model: m };
      }
    } catch (e: any) {
      console.warn(`[Gemini SDK] Model '${m}' request failed: ${e?.message || e}. Attempting next model in chain...`);
      lastErr = e;
    }
  }
  throw lastErr || new Error("All Gemini models in fallback chain failed");
}

// HANDCRAFTED STORIES (Covering North, Central, South, East & Offshore Taiwan)
const HANDCRAFTED_STORIES: Record<string, Record<string, string>> = {
  "大稻埕/迪化街": {
    "歷史背景": "大稻埕是清末至日治時期台北最繁盛的商貿樞紐。淡水開港後，茶葉、南北貨、布匹與中藥在此沿淡水河碼頭聚合成市，造就了台灣近代商業自覺與新文化運動的搖籃。",
    "建築特色": "走進迪化街，宛如置身露天建築博物館：從閩南式瓦頂店屋、洋樓式牌坊，到繁複華麗的巴洛克式泥塑山牆，天井與長進深的街屋空間見證了世代商家的生活智慧。",
    "在地飲食": "永樂市場周邊飄香著油飯、旗魚米粉與潤餅，配上一杯百年老店酸甜生津的仙草茶或滋養杏仁露，每口皆是台北百年商街的古早滋味。"
  },
  "國立故宮博物院": {
    "歷史背景": "典藏近七十萬件中華歷代藝術瑰寶，藏品歷經抗日戰爭萬里遷徙，最後渡海落腳台北士林外雙溪，完整串聯了五千年的東方文明歷史長卷與工藝美學脈絡。",
    "建築特色": "依山而建的傳統中國宮殿式建築，綠色琉璃瓦覆頂、黃色脊飾、淡白牆垣，與外雙溪青翠山巒融為一體，氣勢宏偉且兼具現代恆溫防震典藏工程科技。",
    "在地飲食": "院內故宮晶華將傳世國寶如「翠玉白菜」、「肉形石」等意象轉化為精巧文人佳餚，而鄰近士林夜市生煎包與士林大香腸則展現台北平民小吃的熱力。"
  },
  "台北101": {
    "歷史背景": "矗立於台北信義計畫區的世界級摩天超高樓，曾連續五年名列全球最高建築，是台灣高科技營造、國際金融與現代化自信向世界展現的地標名片。",
    "建築特色": "外型取材自「節節高升」的竹節意象與東方如意吉祥圖騰；內部懸掛重達660公噸的金色風阻尼球（Tuned Mass Damper），也是對大眾開放的耐震工程奇觀。",
    "在地飲食": "地下美食街匯聚享譽全球的鼎泰豐小籠包，樓上觀景台則能一邊俯瞰台北盆地燈火萬家，一邊品嚐台灣冠軍高山烏龍手沖茶。"
  },
  "九份老街": {
    "歷史背景": "依山傍海的黃金山城，十九世紀末因採金熱潮崛起，曾被譽為「小香港」。淘金繁華落盡後沉寂數十年，後因電影《悲情城市》取景而重獲新生，喚醒旅人對昔日山城礦業的幽思。",
    "建築特色": "梯級山道狹窄陡峭，「豎崎路」兩側高掛朱紅燈籠與木造茶樓錯落層疊，雨霧瀰漫時煙嵐飄渺，宛若懸浮在太平洋海岸邊上的魔幻聚落。",
    "在地飲食": "九份芋圓香Q彈牙、嚼勁十足，草仔粿飄散天然鼠麴草香與香菇蘿蔔絲鹹甜交織，佐以老茶館的凍頂烏龍，山嵐微雨中最是暖心。"
  },
  "高美濕地": {
    "歷史背景": "位於台中清水大甲溪出海口南側，原為高美海水浴場，隨泥沙淤積演化為豐富的潮間帶濕地，現為國際級國家重要濕地，孕育全球瀕危雲林莞草與珍貴鳥類。",
    "建築特色": "長達八百公尺的木棧道蜿蜒伸向海洋深處，巧妙落實「人鳥分流」保育哲學，遠方排開的十八座巨型白色風力發電機，構築出極致遼闊的現代海天構圖。",
    "在地飲食": "清水老街盛名的大脆炸肉圓、筒仔米糕配熱騰騰肉羹湯，是探訪濕地迎著海風漫步後，最能驅散寒意、撫慰味蕾的台中海線招牌美食。"
  },
  "日月潭": {
    "歷史背景": "台灣最大的高山天然湖泊，以拉魯島為界，東半部形如日輪，西半部狀似月鉤。自古為邵族原住民聚居的聖地，日治時期引濁水溪水開鑿發電工程，造就現今水波浩渺的日月奇景。",
    "建築特色": "湖畔向山行政暨遊客中心由日本建築大師團紀彥操刀，低矮清水模建築如手臂般環抱湖景，無邊際水池與日月潭水天相接，是當代地景建築名作。",
    "在地飲食": "魚池鄉馳名中外的台茶18號紅玉紅茶，茶湯帶著淡淡天然肉桂香與薄荷涼感；搭配伊達邵碼頭現烤阿薩姆紅茶香菇蛋、山豬肉刈包，回味悠長。"
  },
  "安平古堡": {
    "歷史背景": "建於1624年，初名熱蘭遮城，是荷蘭東印度公司統治台灣與開展東亞航海貿易的大本營，也是近代台灣走向世界大航海時代的歷史起點，鄭成功收復後改名安平。",
    "建築特色": "現存珍貴紅磚殘壁採用糯米、糖漿、蚵灰與砂石調合的「三合土」古法砌築，攀附百年老榕樹盤根錯節，散發歷經四百年歲月洗禮的古樸蒼涼美感。",
    "在地飲食": "安平港邊現炸香脆周氏蝦捲、新鮮滾燙牛肉湯，再配一碗綿密細緻的同記安平豆花，每一口都是府城深厚悠遠的時光沉澱。"
  },
  "駁二藝術特區": {
    "歷史背景": "原為高雄港第三船渠旁存放魚粉與砂糖的陳舊港邊倉庫群，見證了高雄重工業與海運鼎盛時代。2001年由在地藝術家群起推動再生，蛻變為南台灣最具指標性的前衛文創園地。",
    "建築特色": "紅磚與斜頂檜木桁架老倉庫改裝，保留重工業粗獷桁樑與鐵道遺跡，搭配巨型戶外鋼雕公仔與立體彩繪壁畫，將冷硬碼頭轉化為充滿活力的海風美學空間。",
    "在地飲食": "鹽埕埔老街區的鴨肉珍、冬粉王、阿婆冰與碳烤三明治，滿載老高雄討海人與碼頭工人的生猛熱情滋味。"
  },
  "太魯閣國家公園": {
    "歷史背景": "歷經數百萬年菲律賓海板塊碰撞擠壓抬升，立霧溪長年湍急切割侵蝕，造就世界上最震撼的大理石高山峽谷奇觀，亦承載太魯閣族狩獵與中橫公路開拓的人文悲壯史。",
    "建築特色": "中橫公路一鑿一斧人工開鑿於險峻岩壁間，燕子口懸崖絕壁上的溶穴壺穴、九曲洞迴廊與長春祠瀑布飛流，展現鬼斧神工自然地質與人力抗衡的驚奇。",
    "在地飲食": "新城老街酸甜沁涼的佳興檸檬汁、原住民特色馬告香腸與竹筒飯，是健行步道後補充能量的最佳山海野趣選擇。"
  },
  "池上伯朗大道": {
    "歷史背景": "位於花東縱谷秀姑巒溪與卑南溪沖積扇平原，受中央山脈甘純雪水灌溉與日夜溫差滋養，孕育出享譽全台的池上良質米，因廣告取景「金城武樹」而風靡國際。",
    "建築特色": "這條田園道路最難得之處在於「全線無電線桿、無水泥建物遮蔽」，視野純粹無暇，翠綠稻浪隨太平洋季風翻湧直至遠方海岸山脈山麓，撫平都市人的煩擾。",
    "在地飲食": "以木片便當盒盛裝的池上古早味鐵路便當，米飯粒粒分明飽滿甘甜，搭配酥炸排骨、滷蛋與酸菜；再來一支在地米冰淇淋，滿口米香純粹。"
  },
  "墾丁鵝鑾鼻公園": {
    "歷史背景": "位於台灣最南端岬角，巴士海峽與太平洋在此交會。十九世紀因七星岩屢傳外國船難，清廷聘請英國技師興建鵝鑾鼻燈塔，曾為罕見武裝防禦型燈塔，被譽為「東亞之光」。",
    "建築特色": "純白色圓柱形鐵造燈塔高聳於綠茵草坪間，周圍為隆起珊瑚礁石灰岩溶洞地貌，礁石小徑交錯於海濱熱帶灌木林，眺望深藍南海極為遼闊壯美。",
    "在地飲食": "恆春古城老街名物綠豆蒜（剝殼綠豆熬煮加粉條糖水）、後壁湖現切百元生魚片，以及滿州特產港口茶，海味甜香滿盈。"
  },
  "澎湖跨海大橋": {
    "歷史背景": "橫跨白沙島與西嶼島之間的吼門水道，全長近2.5公里，竣工時曾為遠東第一深海大橋。吼門水道水流湍急如吼，大橋落成終結了兩島鄉民百年驚滔駭浪的渡海苦旅。",
    "建築特色": "白沙端巨大的白色拱門橫跨公路上，題字蒼勁，大橋如長虹臥波破浪穿行於碧藍海面之上，橋身設有防風浪消波塊與弧形賞海路廊。",
    "在地飲食": "仙人掌紅艷冰淇淋酸甜消暑，搭配通樑古榕旁現炸外酥內鮮的花枝丸，與清甜回甘的小管麵線，是澎湖海島旅行最迷人的味覺記憶。"
  },
  "羅東林業文化園區": {
    "歷史背景": "羅東這座城市，是被木頭養大的。日治時期太平山砍下的紅檜，沿著蘭陽溪漂流近30公里到這裡的貯木池。為什麼泡在水裡？因為檜木富含油脂，泡水能防止龜裂、稀釋樹脂，讓木頭保存更久——古人的智慧，藏在這池靜水裡。",
    "建築特色": "園區內的日式木造宿舍群與舊竹林車站，皆以檜木建築傳統卡榫工法建造而成。梁柱散發著淡淡香氣，不著一釘的結構挺過了百年風雨，是太平山林林業生活美學的典範。",
    "在地飲食": "林場工人們往昔從事高強度體力勞動，高溫多汗，因此需要勾芡起鍋、熱量飽足的肉羹。這催生林場周邊盛名的『林場肉羹』，也刻印下專屬羅東的木香與羹香常民記憶。"
  },
  "冬山河生態綠舟": {
    "歷史背景": "這片公園花了整整20年才誕生。設計哲學不是蓋一座公園，而是還給土地一個完整生態系。東岸保留原生植被成了候鳥的家，園區還在復育螢火蟲。那座神似哈比屋的『大樹公』，其實是座瞭望塔，登頂可望見龜山島。",
    "建築特色": "園區內最令人驚艷的是魔幻如歐式神殿的『神秘地下河道』。它利用舊鐵道涵洞與天井自然採光，當日光透過綠水折射在粗獷岩壁，如同大自然的魔幻交響樂章。",
    "在地飲食": "冬山清冽的湧泉培育了出肉質極其細嫩、毫無土味的『冬山香魚』。再配上冬山鄉特產香氣高雅的素馨茶，一口細緻香魚、一口回甘茶湯，即是專屬於生態綠舟的風土滋味。"
  },
  "蘇澳冷泉": {
    "歷史背景": "『天下第一奇泉』不是隨便講的——全世界碳酸冷泉屈指可數。泉水恆溫22℃，泡進去先一陣冰涼，接著皮膚冒出細細氣泡，像浸在天然汽水裡。日治時期這裡的泉水還曾被用來做彈珠汽水。",
    "建築特色": "冷泉公園整體採用低調洗鍊的清水模石板與天然原木百葉打造。在粗獷極簡的線條下，溫泉煙霧與周邊青翠的山崗完美交融，營造了遺世獨立的純白禪意空間。",
    "在地飲食": "因冷泉水質不含任何雜質、甘甜純淨，日治時期便孕育出極具蘇澳色彩的『彈珠汽水』與『蘇澳羊羹』。蘇澳羊羹口感細膩甘彈，甜而不膩，是泡完冷泉後的絕佳和風茶點。"
  },
  "南方澳漁港": {
    "歷史背景": "南方澳是台灣『鯖魚的故鄉』，全台超過九成鯖魚從這裡上岸。港邊南天宮供奉一尊重達200公斤的純金媽祖，是全世界最大的金身媽祖。對討海人來說，媽祖是每次出海能否平安回來的依靠。",
    "建築特色": "三座漁港併存於陡峭夾縫中，包夾著日治時期的紅磚造船所、戰後現代鋼筋水泥魚市與窄小高聳的漁工宿舍群，散發出一股生猛強韌、山海相迫的港埠聚落美感。",
    "在地飲食": "現撈、現殺、現爆鹽烤的『鯖魚料理』是港邊的靈魂。搭配熱騰騰的南方澳厚嫩米粉羹，海風微鹹，鮮魚滾燙，每一口都浸透了討海人的質質與豪邁。"
  }
};

// HANDCRAFTED ITINERARIES (Prompt C)
const DEFAULT_ITINERARY_ACTIVITIES = [
  {
    dayNum: 1,
    lodging: "🏡 羅東林場暖木旅棧：檜木文青風設計，附日式景觀浴缸，步行 8 分鐘即達熱鬧的羅東夜市",
    foodRecommend: "🍜 林場肉羹（一甲子排隊名店）、魏姐包心粉圓、阿灶伯當歸羊肉湯與三星蔥多餅",
    activities: [
      { time: "10:00", title: "羅東林業文化園區", cost: "免費", highlight: "百年林場貯木池，漫步日式木屋環湖步道", theme: "歷史背景" },
      { time: "18:00", title: "羅東夜市", cost: "約 $300 元", highlight: "當歸羊肉湯、三星蔥多餅，宜蘭小吃精華集大成", theme: "在地飲食" }
    ]
  },
  {
    dayNum: 2,
    lodging: "🌾 冬山小河稻香民宿：坐擁四季變化的稻浪景致，提供豐盛在地湧泉食材早餐與單車免費租借",
    foodRecommend: "🍵 冬山素馨紅茶、冬山老街古早味米粉羹、廣興做田人黑糖麻糬與稻香風味私廚",
    activities: [
      { time: "09:00", title: "冬山河生態綠舟", cost: "門票 $30 元", highlight: "搭船探索魔幻神殿地下河道，登頂大樹公瞭望塔", theme: "歷史背景" },
      { time: "14:00", title: "斑比山丘", cost: "門票物料約 $200 元", highlight: "與可愛梅花鹿、水豚親密互動與餵食體驗", theme: "建築特色" }
    ]
  },
  {
    dayNum: 3,
    lodging: "🌊 蘇澳煙波大飯店四季雙泉館：頂樓雙泉湯池（全台唯一黃金溫泉與沁涼冷泉），可俯瞰南方澳日出",
    foodRecommend: "🐟 南方澳現烤野生鯖魚宴、阿芬鮮魚湯、在地蘇澳古早味羊羹與沁涼冷泉彈珠汽水",
    activities: [
      { time: "09:00", title: "蘇澳冷泉公園", cost: "門票 20 元", highlight: "體驗全台獨一無二低溫碳酸冷泉，感受沁涼微氣泡肌膚洗禮", theme: "建築特色" },
      { time: "14:00", title: "南方澳漁港", cost: "免費", highlight: "漫步鯖魚故鄉，參拜金身媽祖，欣賞傳統與現代交織的漁港埠落美感", theme: "歷史背景" }
    ]
  } 
];

function getTravelNotes(style: string, transport: string, budget: string): string {
  const sText = style ? style.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '').trim() : "漫活體驗";
  const tText = transport ? transport.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '').trim() : "汽車";
  const bText = budget ? budget.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '').trim() : "省錢";

  return `💡 行前溫馨小秘笈：
 - 本行程為您的【${sText}】偏好與【${tText}】移動方式客製。安排以充實、步調優美為原則。
 - 移動時可多留意與尊循當地歷史、地景、安全指示；在【${bText}】預算模式下，景點或美食多特意搭配您的特色期望。
 - 行程中推薦的故事導覽，可使用「學習紀錄」或「行程共學」同步解鎖更多隱藏的在地小故事喔！`;
}

// ENDPOINT 1: GUIDED STORY GENERATION
app.post("/api/guided-story", async (req, res) => {
  const { spotName, theme, lengthStyle, voiceStyle, voiceTone } = req.body;
  const targetSpot = spotName || "台灣景點";
  const targetTheme = theme || "歷史背景";
  const lStyle = lengthStyle || "中等";
  const vStyle = voiceStyle || "經典";
  const vTone = voiceTone || "專業的主播";

  if (isGeminiEnabled && ai) {
    try {
      const prompt = `請為我產生關於台灣深度旅遊景點【${targetSpot}】的真實專業特色導覽解說文章。
- 專屬主題：${targetTheme}
- 導覽長度字數：${lStyle} (請嚴格遵守：若是「簡潔」請在 120-180 字內精煉摘要；若是「中等」請在 250-400 字內深入說明；若是「長文」請在 500-750 字內完整敘述文史脈絡、建築特色與現場看點)
- 表達風格：${vStyle} (若「經典」請用人文典雅、文學抒情的口吻；若「幽默」請用風趣詼諧、生動打趣但保留所有真實文史細節的口吻；若「教學」請用文化策展人、講授型深入淺出的口吻解析)
- 播報角色語音包設定：${vTone} 
  └ 可愛孩子：腔調活潑稚嫩，穿插擬聲詞，但內容仍聚焦現場景物。
  └ 專業的主播：腔調字字珠璣、四平八穩、富有磁性與深度新聞專題感。
  └ 英語播報：必須採用流暢道地的全英文 (English) 說書導覽，精準翻譯台灣地名人名與歷史背景。

請務必包含：
1. 景點真實的歷史或地理脈絡、開闢背景與重要人物
2. 現場建築構造、空間格局或地景特徵
3. 在地常民生活、飲食文化或現場必看的隱藏細節

請直接輸出導覽解說的核心內容文字，不需要任何 markdown 的程式碼標記（如 \`\`\` 等），也不要任何「好的，以下是...」之類的前言或結語，直接開始播報。`;

      const result = await generateGeminiWithFallback(prompt, {
        systemInstruction: `你是一位對全台灣各縣市（台北、新北、基隆、桃園、新竹、苗栗、台中、彰化、南投、雲林、嘉義、台南、高雄、屏東、宜蘭、花蓮、台東、澎湖、金門、馬祖）文史風土、建築美學與常民飲食聊若指掌的頂尖台灣深度導覽與說書大師。你擅長精準根據長度 (${lStyle})、風格 (${vStyle}) 與語音包 (${vTone}) 輸出富含真實歷史細節、文化溫度、現場感的導覽解說。`,
        temperature: 0.7
      });

      if (result && result.text) {
        return res.json({
          success: true,
          isAi: true,
          model: result.model,
          text: result.text,
          lengthStyle: lStyle,
          voiceStyle: vStyle,
          voiceTone: vTone
        });
      }
    } catch (e: any) {
      console.error("Gemini Guided Story Generation Failed, falling back to verified Taiwan story:", e);
    }
  }

  // Robust verified Taiwan fallback story
  const verifiedStory = resolveSpotStory(targetSpot, targetTheme);
  let baseContent = "";
  if (targetTheme === "建築特色") {
    baseContent = verifiedStory.architectureDetails;
  } else if (targetTheme === "在地飲食") {
    baseContent = verifiedStory.foodCulture;
  } else {
    baseContent = verifiedStory.historyContext;
  }
  if (!baseContent) {
    baseContent = verifiedStory.summary || verifiedStory.audioScript;
  }

  // Preserve and enrich the real factual baseContent with the selected voice & style
  let styledText = baseContent;

  if (vTone === "英語播報") {
    styledText = `Welcome to explore ${targetSpot} in Taiwan! Here is the authentic in-depth story focusing on its "${targetTheme}":\n\n${baseContent}\n\nTake your time to soak in the living heritage, local culinary traditions, and timeless beauty of Taiwan!`;
  } else if (vStyle === "幽默") {
    styledText = `💥 嘿！各位客官坐好了，聽我來扒一扒【${targetSpot}】的精彩身世！關於這裡的【${targetTheme}】啊，可不是一般般：\n\n${baseContent}\n\n是不是超有意思？大家一邊看、一邊品味，這才叫真真正正的深度台灣漫遊！`;
  } else if (vStyle === "教學") {
    styledText = `🎓 各位旅客，請翻開我們的台灣風土人文講義。今天在【${targetSpot}】，我們特別探討其【${targetTheme}】：\n\n${baseContent}\n\n請大家在現場特別留意其空間構造、歷史脈絡與在地常民生活的緊密連結。`;
  } else if (vTone === "可愛孩子") {
    styledText = `👶 哇！大哥哥大姊姊快看！這裡就是【${targetSpot}】唷！關於這裡的【${targetTheme}】藏著好多好多厲害的故事：\n\n${baseContent}\n\n是不是超級神奇？我們一起手牽手去現場探險吧，出發！`;
  }

  // Adjust length
  if (lStyle === "簡潔") {
    styledText = styledText.length > 160 ? styledText.slice(0, 150) + "...（以上為精華導讀，點擊切換長文以閱讀完整文史）" : styledText;
  } else if (lStyle === "長文") {
    styledText = `${styledText}\n\n💡 現場深度走讀提醒：探訪【${targetSpot}】時，不妨放慢腳步觀察建築角落的傳統工法紋理，向在地店家探詢老故事，感受時間在此沉澱的優雅底蘊。`;
  }

  return res.json({
    success: true,
    isAi: false,
    text: styledText,
    lengthStyle: lStyle,
    voiceStyle: vStyle,
    voiceTone: vTone
  });
});

// ENDPOINT 2: ITINERARY PLANNER
app.post("/api/itinerary-plan", async (req, res) => {
  const { districts, days, style, transport, budget, userNotes, county, guideLength, expressStyle, voicePack } = req.body;
  
  const numDays = Number(days) || 3;
  const targetCounty = county || "宜蘭縣";
  
  // Parse districts from input (could be array or string)
  let targetDistricts: string[] = [];
  if (Array.isArray(districts)) {
    targetDistricts = districts.filter(Boolean);
  } else if (typeof districts === "string") {
    targetDistricts = districts.split(/[,，、\s]+/).filter(Boolean);
  }
  
  if (targetDistricts.length === 0) {
    targetDistricts = targetCounty === "宜蘭縣" ? ["羅東", "冬山", "蘇澳"] : ["市中心", "著名景點", "特色街區"];
  }
  
  if (isGeminiEnabled && ai) {
    try {
      const prompt = `請為我規劃一份【${targetCounty}】自由行深度旅遊行程表，詳情如下：
- 想去的地區或自定義景點名稱：${targetDistricts.join("、")}
- 旅遊天數：共 ${numDays} 天
- 團隊風格：${style || "🌲 自然生態"}
- 交通方式：${transport || "🚗 汽車"}
- 預算模式：${budget || "💰 省錢"}
- 導覽長度偏好：${guideLength || "中等"}
- 表達風格偏好：${expressStyle || "經典"}
- 聽覺配音設定：${voicePack || "專業的主播"}${userNotes ? `\n- 旅客特別備註/需求（如飲食、住宿地點或特殊交通需求等）：${userNotes}` : ""}

請輸出為 JSON 格式，必須嚴格符合以下結構：
{
  "days": [
    {
      "dayNum": 1,
      "lodging": "推薦當天晚上在該目的地落腳的地方特色民宿、設計客棧、熱門飯店名稱與簡短推薦理由，如：'🏡 宜蘭精品旅店：檜木裝潢、近夜市' 或 '🏡 東京設計旅店：晴空塔景觀、地鐵直達'",
      "foodRecommend": "推薦今日的 2~3 樣目的地必吃特色美食或在地名產推薦，如：'🍜 午餐：特色甕窯雞、下午茶：手作甜點' 或 '🍜 午餐：正宗築地壽司、晚餐：道地池袋拉麵'",
      "activities": [
        {
          "time": "時間點 (例如 '10:00')",
          "title": "景點名稱 (例如 '清水寺'、'艾菲爾鐵塔' 或 旅客填寫的景點)",
          "cost": "預估花費 (例如 '門票 $150' 或 當地貨幣/免費)",
          "highlight": "一句話導覽亮點，寫明景點歷史/人文背景/自然景觀亮點故事簡述，如：'享受療癒大眾溫泉魚泡腳與日式森林散策' 或 '漫步在京都清水台上，欣賞春櫻或秋楓與古香古色的人文名勝'",
          "theme": "最推薦用什麼導覽主題解鎖 (必須是 '歷史背景'、'建築特色' 或 '在地飲食' 其中之一)"
        }
      ]
    }
  ]
}

注意事項：
1. 每天上午推薦1~2個景點，下午1~2個景點，夜晚推薦合適的夜市、景觀台、特色商圈或漫步點。
2. 密切配合想去的地區 ${targetDistricts.join("、")} 與所在的目的地城市/國家/區域 ${targetCounty}。
3. 住宿點、美食推薦應完美貼合團隊風格與當地特色（如自然生態可推薦森林民宿、豪華模式可推薦雙泉溫泉大飯店、五星酒店）。
4. 花費、亮點與交通工具必須符合：天數 ${numDays}、風格 ${style}、交通 ${transport}、預算 ${budget}。
5. 所有景點故事化亮點 (highlight) 的文筆風格，應完美貼合選定的表達風格【${expressStyle || "經典"}】（如「經典」要有人文感；「幽默」要風趣打趣、爆笑有趣；「教學」要深入淺出介紹地緣歷史；「英語播報」時請輸出中英雙語或英文高光解説）。
${userNotes ? `6. 同時滿足旅客的出遊特別需求：${userNotes} (例如在餐飲時段適當關照、或將住宿點納入自定義需求)。\n7. 所有景點亮點內容要故事化、具有文學感與人文溫度。請全程採用繁體中文輸出。` : "6. 所有景點亮點內容要故事化、具有文學感與人文溫度。請全程採用繁體中文輸出。"}`;

      const result = await generateGeminiWithFallback(prompt, {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNum: { type: Type.INTEGER },
                  lodging: { type: Type.STRING },
                  foodRecommend: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        title: { type: Type.STRING },
                        cost: { type: Type.STRING },
                        highlight: { type: Type.STRING },
                        theme: { type: Type.STRING }
                      },
                      required: ["time", "title", "cost", "highlight", "theme"]
                    }
                  }
                },
                required: ["dayNum", "lodging", "foodRecommend", "activities"]
              }
            }
          },
          required: ["days"]
        },
        systemInstruction: `你是一位對全台灣各縣市（包含台北、新北、基隆、桃園、新竹、苗栗、台中、彰化、南投、雲林、嘉義、台南、高雄、屏東、宜蘭、花蓮、台東、澎湖、金門、馬祖）聊若指掌的頂尖台灣深度導覽與旅程排程專家，精通當地秘境景點、歷史背景、建築特色、在地美食與交通串聯。你擅長輸出格式整潔完美、可以被程式直接讀取解析的標準 JSON 資料規格。`,
        temperature: 0.7
      });

      // Check geographic rationality / compatibility on server side for Taiwan
      const allTextsLower = [
        targetCounty,
        ...targetDistricts,
        userNotes || ""
      ].map(t => (t || "").toLowerCase());

      const hasNorth = allTextsLower.some(t => t.includes("台北") || t.includes("新北") || t.includes("基隆") || t.includes("桃園") || t.includes("九份") || t.includes("淡水") || t.includes("北投"));
      const hasSouth = allTextsLower.some(t => t.includes("高雄") || t.includes("台南") || t.includes("屏東") || t.includes("墾丁") || t.includes("恆春") || t.includes("安平") || t.includes("旗津"));
      const hasEast = allTextsLower.some(t => t.includes("花蓮") || t.includes("台東") || t.includes("太魯閣") || t.includes("伯朗大道") || t.includes("七星潭"));

      let geoWarningText = "";
      if (hasNorth && hasSouth && numDays <= 2) {
        geoWarningText = `⚠️ 跨界範圍提醒：偵測到您的行程跨越了「台灣北部」與「台灣南部（台南/高雄/墾丁）」。南北距離超過 300 公里，若天數僅有 1-2 天，大半時間將消耗在高速公路或長途交通中。建議規劃 3 天以上或搭乘高鐵串聯！\n\n`;
      } else if (hasEast && hasSouth && numDays <= 2) {
        geoWarningText = `⚠️ 跨界範圍提醒：偵測到您的行程涵蓋「花東地區」與「恆春墾丁」。中央山脈南端交通繞行耗時較長，若天數較短易舟車勞頓，建議適度聚焦單一地理區位！\n\n`;
      }

      const responseText = result.text || "";
      const parsed = JSON.parse(responseText.trim());
      let notes = getTravelNotes(style, transport, budget);
      if (geoWarningText) {
        notes = `${geoWarningText}${notes}`;
      }
      if (userNotes) {
        notes = `📌 您的自訂備註需求：${userNotes}\n${notes}`;
      }
      
      return res.json({
        success: true,
        isAi: true,
        itinerary: parsed.days,
        notes: notes
      });
      
    } catch (e: any) {
      console.error("Gemini Itinerary Generation Failed, falling back to dynamic template simulator:", e);
      // Fallback below
    }
  }

  // Fallback template tuned to targetCounty
  const filteredDays = DEFAULT_ITINERARY_ACTIVITIES.slice(0, numDays);
  
  const tunedItinerary = filteredDays.map((dayData, dIdx) => {
    // Dynamically replace names if county is not Yilan
    const isYilan = targetCounty === "宜蘭縣" || targetCounty.includes("宜蘭");
    return {
      dayNum: dayData.dayNum,
      lodging: isYilan 
        ? dayData.lodging 
        : `🏡 ${targetCounty}慢活特色設計商旅 / 優質人文住宿 (適合${style}風格團隊，享受舒適晚安氛圍)`,
      foodRecommend: isYilan 
        ? dayData.foodRecommend 
        : `🍜 ${targetCounty}在地排隊美食、名產老鋪巡禮與特色商圈傳統小吃`,
      activities: dayData.activities.map((act, aIdx) => {
        if (isYilan) return { ...act };
        // For non-Yilan simulation fallback
        const customTitle = targetDistricts[aIdx % targetDistricts.length] || "代表性人文地標";
        return {
          time: act.time,
          title: `${targetCounty}${customTitle}`,
          cost: act.cost,
          highlight: `探索【${targetCounty}】獨特的風土景致，感受專屬【${style}】風格的深度文化魅力。`,
          theme: act.theme
        };
      })
    };
  });

  // Check geo compatibility for fallback
  const allTextsLowerFallback = [
    targetCounty,
    ...targetDistricts,
    userNotes || ""
  ].map(t => (t || "").toLowerCase());

  const hasNorthFb = allTextsLowerFallback.some(t => t.includes("台北") || t.includes("新北") || t.includes("基隆") || t.includes("桃園") || t.includes("九份") || t.includes("淡水") || t.includes("北投"));
  const hasSouthFb = allTextsLowerFallback.some(t => t.includes("高雄") || t.includes("台南") || t.includes("屏東") || t.includes("墾丁") || t.includes("恆春") || t.includes("安平") || t.includes("旗津"));
  const hasEastFb = allTextsLowerFallback.some(t => t.includes("花蓮") || t.includes("台東") || t.includes("太魯閣") || t.includes("伯朗大道") || t.includes("七星潭"));

  let geoWarningTextFallback = "";
  if (hasNorthFb && hasSouthFb && numDays <= 2) {
    geoWarningTextFallback = `⚠️ 跨界範圍提醒：偵測到您的行程跨越了「台灣北部」與「台灣南部（台南/高雄/墾丁）」。南北距離超過 300 公里，若天數僅有 1-2 天，建議規劃 3 天以上或搭乘高鐵串聯！\n\n`;
  } else if (hasEastFb && hasSouthFb && numDays <= 2) {
    geoWarningTextFallback = `⚠️ 跨界範圍提醒：偵測到您的行程涵蓋「花東地區」與「恆春墾丁」。中央山脈南端交通繞行耗時較長，建議適度聚焦單一地理區位！\n\n`;
  }

  let notes = getTravelNotes(style, transport, budget);
  if (geoWarningTextFallback) {
    notes = `${geoWarningTextFallback}${notes}`;
  }
  if (userNotes) {
    notes = `📌 您的自訂備註需求：${userNotes}\n${notes}`;
  }

  return res.json({
    success: true,
    isAi: false,
    itinerary: tunedItinerary,
    notes: `${notes} (📢 已啟用的全台灣【${targetCounty}】深旅規劃模擬。在設定中配置 GEMINI_API_KEY 即可解鎖 live AI 實時大模型客製遊！)`
  });
});

// Setup Vite Dev Server / Prod Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production files from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${PORT}`);
    console.log(`Environment mode: ${process.env.NODE_ENV || "development"}`);
  });
}

startServer();
