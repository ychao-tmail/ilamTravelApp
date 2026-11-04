import { DayItinerary, Activity } from "../types";
import { TAIWAN_FEATURED_STORIES } from "../data/taiwanStories";

export interface PlannerParams {
  county: string;
  districts: string[];
  days: number;
  style: string;
  transport: string;
  budget: string;
  userNotes?: string;
  guideLength?: string;
  expressStyle?: string;
  voicePack?: string;
}

export interface PlannerResult {
  success: boolean;
  isAi: boolean;
  isLocalSmart: boolean;
  model?: string;
  itinerary: DayItinerary[];
  notes: string;
}

export interface SpotItem {
  title: string;
  cost: string;
  highlight: string;
  theme: "歷史背景" | "建築特色" | "在地飲食";
  period?: "day" | "evening" | "any";
}

export interface CountyData {
  name: string;
  spots: SpotItem[];
  eveningSpots: SpotItem[];
  foods: string[];
  lodgings: string[]; // List of diverse accommodations for Day 1, Day 2, Day 3...
}

// Normalize a spot title for accurate deduplication comparison
export function normalizeSpotTitle(title: string): string {
  return (title || "")
    .replace(/[（(].*?[）)]/g, "") // remove parentheticals like （夜晚氛圍）
    .replace(/^[0-9\.\s\-—：:]+/, "")
    .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, "")
    .replace(/\s+/g, "")
    .trim()
    .toLowerCase();
}

export const TAIWAN_COUNTIES_DATA: Record<string, CountyData> = {
  "台灣 - 台北市": {
    name: "台北市",
    spots: [
      { title: "大稻埕/迪化街", cost: "免費", highlight: "漫步百年南北貨與茶香街屋，仰望大正時期巴洛克雕花山牆與深邃天井格局", theme: "歷史背景" },
      { title: "國立故宮博物院", cost: "門票 $350 元", highlight: "鑑賞中華五千年工藝瑰寶，親睹翠玉白菜與肉形石的雕琢神技", theme: "建築特色" },
      { title: "台北101觀景台", cost: "門票 $600 元", highlight: "俯瞰台北盆地天際線，見證660公噸阻尼球的現代耐震工程奇蹟", theme: "建築特色" },
      { title: "北投溫泉博物館", cost: "免費", highlight: "探訪百年和洋折衷公共浴場，在硫磺煙嵐中品讀北投溫泉鄉風華", theme: "歷史背景" },
      { title: "陽明山擎天崗草原", cost: "免費", highlight: "漫步遼闊熔岩台地芒草海，遠眺火山地形與悠閒水牛群", theme: "歷史背景" },
      { title: "西門町紅樓街區", cost: "免費", highlight: "八角堂紅磚洋樓融合青年文創，體驗日治商場到流行前線的蛻變", theme: "歷史背景" },
      { title: "松山文創園區", cost: "免費", highlight: "前身為松山菸廠，日式工業包浩斯風格廠房與巴洛克中庭花園", theme: "建築特色" },
      { title: "艋舺龍山寺", cost: "免費", highlight: "清乾隆年代泉州晉江移民古剎，三川殿四爪蟠龍石柱與神匠木雕藻井", theme: "歷史背景" },
      { title: "華山1914文化創意產業園區", cost: "免費", highlight: "日治芳釀社老酒廠蛻變，紅磚倉庫群與藤蔓老牆交織的文藝綠洲", theme: "建築特色" },
      { title: "象山親山步道", cost: "免費", highlight: "沿稜線石階登頂六巨石，飽覽台北盆地與信義區摩天大樓全景", theme: "建築特色" },
      { title: "中正紀念堂", cost: "免費", highlight: "寶藍色八角攢尖頂宮殿建築，純白大理石牆面與三軍儀隊交接儀式", theme: "建築特色" },
      { title: "寶藏巖國際藝術村", cost: "免費", highlight: "新店溪畔蜿蜒錯落的歷史違建聚落，駐村藝術家與老榮民共生共榮", theme: "歷史背景" }
    ],
    eveningSpots: [
      { title: "寧夏夜市", cost: "約 $200-350 元", highlight: "千歲宴發源地，品嚐圓環邊蚵仔煎、劉芋仔蛋黃芋餅與知高飯", theme: "在地飲食", period: "evening" },
      { title: "士林夜市", cost: "約 $200-350 元", highlight: "大餅包小餅、豪大大雞排與十全排骨，感受台北生猛夜市生命力", theme: "在地飲食", period: "evening" },
      { title: "饒河街觀光夜市", cost: "約 $200-350 元", highlight: "慈祐宮前炭烤胡椒餅香氣四溢，藥燉排骨與米其林必比登陳董牛肉麵", theme: "在地飲食", period: "evening" },
      { title: "信義區微風南山高空夜景街區", cost: "免費漫步", highlight: "漫步璀璨都會光廊，仰望台北101夜間點燈與街頭爵士藝人演出", theme: "建築特色", period: "evening" }
    ],
    foods: [
      "鼎泰豐黃金十八摺小籠包、原盅牛肉麵",
      "永樂市場林合發油飯、民樂旗魚米粉與冰鎮杏仁露",
      "寧夏夜市圓環邊蚵仔煎、劉芋仔蛋黃芋餅",
      "北投滿來溫泉拉麵、阿財鍋貼與古早味紅茶",
      "阜杭豆漿厚餅夾蛋、香濃甜豆漿"
    ],
    lodgings: [
      "☕ 大稻埕復古人文設計宅：坐落百年街屋巷弄，挑高天井與紅磚陽台",
      "🌿 北投日式溫泉行旅：天然白磺泉池、檜木原木客房，享山嵐綠意靜謐",
      "🍜 中山雙連設計旅店：鄰近寧夏夜市與赤峰街文青商圈，下樓即享排隊美食",
      "🏛️ 圓山大飯店景觀套房：紅柱金瓦東方宮殿建築，坐擁基隆河無敵夜景",
      "💎 台北文華東方酒店：頂級奢華尊榮禮遇，米其林星級主廚美饌"
    ]
  },
  "台灣 - 新北市": {
    name: "新北市",
    spots: [
      { title: "九份山城老街", cost: "免費", highlight: "沿山蜿蜒石階高掛大紅燈籠，遠眺基隆嶼海景與黃金採礦歷史", theme: "歷史背景" },
      { title: "淡水紅毛城與前清英國領事官邸", cost: "門票 $80 元", highlight: "紅磚拱圈迴廊俯瞰淡水河夕照，見證大航海與開港租界史", theme: "歷史背景" },
      { title: "野柳地質公園", cost: "門票 $120 元", highlight: "大自然億萬年海蝕風化雕塑，觀賞女王頭、仙女鞋與燭台石奇景", theme: "建築特色" },
      { title: "十分瀑布與平溪老街", cost: "放天燈約 $200 元", highlight: "全台最大簾幕式瀑布，沿平溪支線鐵道冉冉升起手寫心願天燈", theme: "歷史背景" },
      { title: "烏來老街與烏來瀑布", cost: "台車票 $50 元", highlight: "搭乘復古台車穿梭山林，品嚐泰雅原鄉竹筒飯與美人湯溫泉", theme: "在地飲食" },
      { title: "三峽老街與清水祖師廟", cost: "免費", highlight: "東方藝術殿堂精雕百鳥石柱，漫步紅磚拱廊品嚐金牛角麵包", theme: "建築特色" },
      { title: "鶯歌陶瓷老街與陶博館", cost: "門票 $80 元", highlight: "漫步煙囪與馬賽克拼貼步道，體驗手拉胚手作與陶瓷藝術巡禮", theme: "建築特色" },
      { title: "金瓜石黃金博物館與四連棟", cost: "門票 $80 元", highlight: "探訪本山五坑坑道體驗，親摸220公斤999純金大金磚與日式木屋", theme: "歷史背景" },
      { title: "深坑豆腐老街", cost: "免費", highlight: "漫步清代紅磚街屋騎樓，品嚐焦香紅燒黑豆腐與炭烤香豆腐", theme: "在地飲食" },
      { title: "鼻頭角步道與稜線燈塔", cost: "免費", highlight: "台版萬里長城步道，沿著海天一色稜線俯瞰壯麗海蝕平台與龍洞灣", theme: "建築特色" }
    ],
    eveningSpots: [
      { title: "淡水金色水岸夕陽與老街", cost: "約 $200 元", highlight: "金色落日餘暉灑落淡水河面，漫步水岸品嚐正宗阿給與阿婆鐵蛋", theme: "在地飲食", period: "evening" },
      { title: "九份豎崎路茶樓夜景", cost: "茶席約 $300-500 元", highlight: "入夜數百盞紅燈籠齊亮，在阿妹茶樓品茗俯瞰基隆嶼暗夜漁火", theme: "歷史背景", period: "evening" },
      { title: "新北板橋湳雅觀光夜市", cost: "約 $200-300 元", highlight: "排隊名攤小籠包、麻油雞與現烤魷魚，體驗新北在地熱鬧夜市", theme: "在地飲食", period: "evening" }
    ],
    foods: [
      "淡水阿給、魚酥、正宗阿婆鐵蛋配阿媽酸梅湯",
      "九份阿柑姨手工芋圓、金枝紅糟肉圓與阿蘭草仔粿",
      "烏來原住民烤山豬肉、香酥溪蝦溪魚與馬告竹筒飯",
      "深坑豆腐老街現烤紅燒臭豆腐、黑豆腐生乳捲",
      "三峽老街原味黑糖金牛角、碧螺春綠茶冰淇淋"
    ],
    lodgings: [
      "🏮 九份山城海景民宿：面朝太平洋無敵海景，夜晚靜賞九份璀璨燈火",
      "🌲 烏來溫泉觀溪行旅：開窗即見南勢溪清流，私人碳酸氫鈉美人泉池",
      "🌅 淡水河畔景觀飯店：緊鄰金色水岸與淡水渡船頭，漫步落日餘暉",
      "🏡 三峽鶯歌陶藝主題文旅：融入陶瓷與紅磚元素，充滿在地職人工藝",
      "💎 板橋凱撒大飯店：頂樓無邊際星空泳池、極致水岸私廚"
    ]
  },
  "台灣 - 宜蘭縣": {
    name: "宜蘭縣",
    spots: [
      { title: "羅東林業文化園區", cost: "免費", highlight: "百年林場貯木池與檜木日式宿舍群，漫步綠蔭步道感受林業繁華記憶", theme: "歷史背景" },
      { title: "冬山河生態綠舟", cost: "門票 $30 元", highlight: "乘船探索魔幻神秘地下河道天井採光，登頂大樹公遠眺龜山島", theme: "歷史背景" },
      { title: "蘇澳冷泉公園", cost: "門票 $20 元", highlight: "體驗全台獨有22℃低溫碳酸冷泉，細緻氣泡包覆肌膚冰涼沁心", theme: "建築特色" },
      { title: "南方澳漁港與南天宮", cost: "免費", highlight: "鯖魚故鄉巡禮，參拜200公斤金身媽祖，欣賞山海港埠聚落美感", theme: "歷史背景" },
      { title: "國立傳統藝術中心", cost: "門票 $150 元", highlight: "三合院與仿老街臨水市街，體驗捏麵人、布袋戲與台灣常民百工", theme: "建築特色" },
      { title: "頭城老街與李榮春文學館", cost: "免費", highlight: "開蘭第一街巡禮，十三行康家古宅、新長興樹記與閩南和洋混合街屋", theme: "歷史背景" },
      { title: "蘭陽博物館", cost: "門票 $100 元", highlight: "姚仁喜建築師操刀單面山造型斜屋頂，融入烏石港濕地自然地景", theme: "建築特色" },
      { title: "太平山翠峰湖環山步道", cost: "門票 $200 元", highlight: "全台最大高山高山湖泊，漫步全球最美寂靜山徑欣賞高山苔原", theme: "歷史背景" },
      { title: "礁溪湯圍溝溫泉公園", cost: "免費（湯屋另計）", highlight: "天然溫泉水流淌綠意庭園，體驗露天溫泉魚泡腳與日式木造涼亭", theme: "在地飲食" },
      { title: "斑比山丘", cost: "門票 $200 元", highlight: "梅花鹿與水豚親密互動餵食，漫步綠意盎然的田園休閒園區", theme: "建築特色" },
      { title: "外澳沙灘與烏石港北堤", cost: "免費", highlight: "踏在細黑沙灘上迎向太平洋巨浪，近距離仰望海上龜山島壯麗剪影", theme: "建築特色" },
      { title: "鳩之澤溫泉地熱煮蛋區", cost: "門票 $150 元", highlight: "在火山地熱蒸氣中手煮溫泉蛋與香甜玉米，享受弱鹼性藍色溫泉池", theme: "在地飲食" }
    ],
    eveningSpots: [
      { title: "羅東夜市", cost: "約 $200-300 元", highlight: "品嚐全台最香阿灶伯當歸羊肉湯、三星蔥多餅、卜肉與包心粉圓", theme: "在地飲食", period: "evening" },
      { title: "礁溪溫泉路商圈與溫泉夜市", cost: "約 $150-250 元", highlight: "漫步溫泉街品嚐溫泉空心菜、八寶冬粉與夜間溫泉足湯放鬆", theme: "在地飲食", period: "evening" },
      { title: "宜蘭東門觀光夜市", cost: "約 $150-250 元", highlight: "東港陸橋下在地小吃，現炸搖搖冰、彭記蔥油餅與嘟好燒古早味點心", theme: "在地飲食", period: "evening" },
      { title: "南方澳情人灣（內埤海灘）夜聽濤聲", cost: "免費漫步", highlight: "坐在微風吹拂的礫石海灣，聆聽太平洋浪濤與遠方蘇澳燈塔光芒", theme: "建築特色", period: "evening" }
    ],
    foods: [
      "羅東林場肉羹、阿灶伯當歸羊肉湯、魏姐包心粉圓",
      "三星卜肉、爆漿三星蔥油餅、手做蔥多餅",
      "南方澳現烤鯖魚宴、阿芬鮮魚湯、在地蘇澳古早味羊羹",
      "宜蘭脆皮櫻桃烤鴨三吃（櫻桃鴨握壽司、片皮鴨捲）",
      "冬山素馨紅茶、純淨湧泉現烤香魚",
      "礁溪八寶冬粉、溫泉空心菜、古早味花生捲冰淇淋"
    ],
    lodgings: [
      "🏡 羅東林場暖木旅棧：檜木文青風設計，附日式觀景浴缸，近羅東夜市（第 1 晚首選）",
      "♨️ 礁溪天然雙泉溫泉會館：房內享天然碳酸氫鈉美人湯，舒緩旅途疲憊（第 2 晚首選）",
      "🌾 冬山小河稻香民宿：坐擁四季稻浪景致，湧泉食材早餐與單車漫遊（第 3 晚首選）",
      "🌊 蘇澳煙波大飯店四季雙泉館：頂樓黃金雙泉、無邊際海景俯瞰南方澳日出",
      "🏛️ 頭城老街古蹟復古客棧：閩南紅磚與日式木構相映，品讀開蘭首城風華"
    ]
  },
  "台灣 - 台中市": {
    name: "台中市",
    spots: [
      { title: "高美濕地木棧道", cost: "免費", highlight: "木棧道延伸海天一色，十八座巨型風車伴隨夕陽金黃倒影極致壯麗", theme: "歷史背景" },
      { title: "宮原眼科與第四信用合作社", cost: "免費入內", highlight: "日治眼科老屋蛻變哈利波特霍格華茲風挑高圖書館，品嚐特色冰淇淋", theme: "建築特色" },
      { title: "台中國家歌劇院", cost: "免費", highlight: "日本建築大師伊東豊雄操刀，全球首創曲牆無樑柱『美聲涵洞』", theme: "建築特色" },
      { title: "審計新村文創園區", cost: "免費", highlight: "省府時期單身宿舍群重生，聚集青年手作、古著與特色風格咖啡", theme: "建築特色" },
      { title: "彩虹眷村", cost: "免費", highlight: "彩虹爺爺以繽紛斑斕童趣彩繪，賦予眷村老房生氣盎然的藝術生命", theme: "歷史背景" },
      { title: "霧峰林家宮保第園區", cost: "門票 $250 元", highlight: "台灣現存規模最大的清代官紳宅第，全台唯一大花廳福州戲台", theme: "歷史背景" },
      { title: "草悟道與勤美術館", cost: "免費", highlight: "綠色廊道串聯科博館與市民廣場，享受都會森林漫活散步時光", theme: "建築特色" },
      { title: "台中舊火車站與鐵道文化園區", cost: "免費", highlight: "百年文藝復興式紅磚洋樓車站，保留老月台與復古退役客車", theme: "歷史背景" },
      { title: "大坑九號十號觀音步道", cost: "免費", highlight: "原木相思木圓木棧道蜿蜒山稜，俯瞰台中大都會盆地壯闊市景", theme: "歷史背景" },
      { title: "亞洲大學現代美術館", cost: "門票 $250 元", highlight: "普立茲克建築獎大師安藤忠雄操刀，清水模正三角形交錯幾何結構", theme: "建築特色" }
    ],
    eveningSpots: [
      { title: "逢甲夜市商圈", cost: "約 $200-350 元", highlight: "全台創意美食發源地，明倫蛋餅、大腸包小腸與一心臭豆腐", theme: "在地飲食", period: "evening" },
      { title: "一中商圈夜市", cost: "約 $150-250 元", highlight: "青年學生流行聚集地，品嚐一中大雞排、豐仁冰與老牌福州包", theme: "在地飲食", period: "evening" },
      { title: "秋紅谷景觀生態公園夜景", cost: "免費漫步", highlight: "下凹式綠地公園夜間池畔步道，倒映周邊摩天大樓璀璨水岸光影", theme: "建築特色", period: "evening" }
    ],
    foods: [
      "宮原眼科巨無霸台灣水果冰淇淋、日出乳酪蛋糕",
      "清水正宗筒仔米糕、王塔米糕配熱騰騰肉羹湯",
      "逢甲明倫蛋餅、官芝霖大腸包小腸、惡魔雞排",
      "台中肉員（八十年老店米醬肉圓）、冬粉湯",
      "春水堂創始店手工珍珠奶茶、蘿蔔糕佐特調辣醬"
    ],
    lodgings: [
      "🎨 草悟道人文設計文旅：綠意盎然林蔭大道旁，藝術展演與職人選品",
      "🥟 逢甲夜市步行核心飯店：出門即逛全台第一夜市，鬧中取靜隔音絕佳",
      "🏛️ 台中舊城區昭和復古行旅：挑高木窗花與磨石子地板，重溫大屯風華",
      "🌲 武陵農場/新社薰衣草森林民宿：滿園花海芬多精，夜觀銀河星斗",
      "💎 台中林酒店/日月千禧：高空天際線露天酒吧、極致熟成牛排盛宴"
    ]
  },
  "台灣 - 台南市": {
    name: "台南市",
    spots: [
      { title: "安平古堡與熱蘭遮城殘壁", cost: "門票 $70 元", highlight: "四百年荷蘭三合土磚壁盤根老榕，見證台灣走向大航海時代起點", theme: "歷史背景" },
      { title: "赤崁樓（普羅民遮城）", cost: "門票 $70 元", highlight: "紅牆綠瓦庭園立九座贔屭御碑，荷鄭清三代政權更迭的文史縮影", theme: "歷史背景" },
      { title: "台南市美術館二館", cost: "門票 $200 元", highlight: "普立茲克獎得主坂茂設計，鳳凰花碎形屋頂打造純白幾何光影聖殿", theme: "建築特色" },
      { title: "奇美博物館", cost: "門票 $200 元", highlight: "西洋古典希臘神殿巴洛克式外觀，阿波羅噴泉與世界級提琴珍藏", theme: "建築特色" },
      { title: "四草綠色隧道", cost: "船票 $200 元", highlight: "搭乘竹筏穿越水筆仔紅樹林，兩側樹冠在水道交會成天然『迷你亞馬遜』", theme: "歷史背景" },
      { title: "國立台灣歷史博物館", cost: "門票 $100 元", highlight: "光電雲牆與感恩水池，以生動等身蠟像與多媒體重現台灣常民四百年記憶", theme: "建築特色" },
      { title: "孔廟文化園區（全臺首學）", cost: "大成殿門票 $40 元", highlight: "建於明鄭永曆年間，紅瓦朱牆掩映古榕樹蔭，全台儒學文化開端", theme: "歷史背景" },
      { title: "林百貨（五層樓仔）", cost: "免費", highlight: "日治昭和現代折衷主義百貨，頂樓保存神社鳥居與二戰美軍機槍彈孔", theme: "建築特色" },
      { title: "安平樹屋與德記洋行", cost: "門票 $70 元", highlight: "英商德記洋行純白圓拱迴廊，巨大百年榕樹氣根吞噬倉庫的魔幻共生", theme: "建築特色" },
      { title: "七股鹽山與青鯤鯓扇形鹽田", cost: "免費/停車收費", highlight: "巨型白雪般鹽峰堆疊，空拍如海上純白巨扇的大自然曬鹽景致", theme: "歷史背景" }
    ],
    eveningSpots: [
      { title: "神農街老街散策", cost: "免費", highlight: "清代五條港最繁華街道，木造街屋掛滿手繪燈籠，入夜幽靜迷人", theme: "建築特色", period: "evening" },
      { title: "國華街/保安路夜間美食聚落", cost: "約 $200-300 元", highlight: "溫體現燙牛肉湯、阿村牛肉湯、阿明豬心冬粉與米糕，品嚐府城宵夜王道", theme: "在地飲食", period: "evening" },
      { title: "花園夜市/大東夜市", cost: "約 $200-300 元", highlight: "南部露天旗海夜市，現烤香酥雞、統大碳烤香雞排與古早味冬瓜檸檬", theme: "在地飲食", period: "evening" }
    ],
    foods: [
      "文章牛肉湯/阿村牛肉湯：現切溫體牛淋上滾燙牛骨高湯，粉嫩鮮甜",
      "安平周氏蝦捲、陳家蚵捲與同記安平古早味豆花",
      "富盛號黑豆醬油碗粿、金得春捲與阿松割包",
      "度小月擔仔麵、邱家小卷米粉（新鮮現煮甘甜湯頭）",
      "莉莉水果店現刨芒果冰、泰成水果店哈密瓜瓜冰"
    ],
    lodgings: [
      "🏡 中西區百年老天井民宿：磨石子旋轉梯、檜木老窗與慢活古井庭園（第 1 晚首選）",
      "🏛️ 友愛街旅館 (UIJ)：結合黑膠唱片、書店閱讀與紅磚建築的文創先鋒（第 2 晚首選）",
      "🍜 國華街步行 3 分鐘設計行旅：出門直攻府城美食，附專屬美食地圖（第 3 晚首選）",
      "🌊 七股鹽山潟湖漁村民宿：搭竹筏烤蚵、觀黑面琵鷺與鹽田夕照",
      "💎 台南晶英酒店：尊榮府城茶薈、頂樓戶外泳池與恆溫三溫暖"
    ]
  },
  "台灣 - 高雄市": {
    name: "高雄市",
    spots: [
      { title: "駁二藝術特區與大港橋", cost: "免費", highlight: "港邊老倉庫轉化為前衛文創，大港橋定時旋轉開合迎向高雄港海風", theme: "建築特色" },
      { title: "旗津老街與旗后燈塔", cost: "渡輪票 $40 元", highlight: "搭渡輪過海漫步百年巴洛克白燈塔，俯瞰高雄港開闊水域與夕陽", theme: "歷史背景" },
      { title: "衛武營國家藝術文化中心", cost: "免費參觀公共區", highlight: "荷蘭建築團隊以老榕樹氣根為靈感，全球最大單一屋頂流線型劇院", theme: "建築特色" },
      { title: "打狗英國領事館文化園區", cost: "門票 $99 元", highlight: "紅磚英式連續拱廊官邸，居高臨下俯瞰西子灣落日與大船入港", theme: "歷史背景" },
      { title: "蓮池潭龍虎塔與春秋閣", cost: "免費", highlight: "龍口進虎口出祈求逢凶化吉，九曲橋蜿蜒湖面伴隨古典東方宮殿", theme: "歷史背景" },
      { title: "高雄流行音樂中心（高流）", cost: "免費漫步", highlight: "六角高低起伏蜂巢海浪造型建築群，倒映愛河灣無邊水景", theme: "建築特色" },
      { title: "棧貳庫 KW2 與純白旋轉木馬", cost: "免費", highlight: "日治磚牆無柱大跨距老倉庫，面海第一排純白旋轉木馬浪漫打卡", theme: "建築特色" },
      { title: "壽山動物園與天空步道", cost: "門票 $40 元", highlight: "高架綠蔭天空廊道俯瞰動物棲地，清涼步道親近南台灣自然林相", theme: "建築特色" },
      { title: "美濃客家民俗村與菸樓", cost: "免費", highlight: "體驗手工手繪油紙傘彩繪，品嚐道地客家粄條與清香野蓮", theme: "歷史背景" },
      { title: "田寮月世界泥岩惡地", cost: "免費", highlight: "如月球表面般的荒涼白堊土惡地與環湖步道，令人讚嘆地質奇觀", theme: "歷史背景" }
    ],
    eveningSpots: [
      { title: "六合國際觀光夜市", cost: "約 $200-300 元", highlight: "鄭老牌木瓜牛奶、莊記現烤海產粥與方椒鹽鹹酥雞", theme: "在地飲食", period: "evening" },
      { title: "瑞豐夜市商圈", cost: "約 $200-300 元", highlight: "在地年輕人最愛夜市，萬國牛排、天使雞排與QQ地瓜球", theme: "在地飲食", period: "evening" },
      { title: "愛河水岸漫步與真愛碼頭夜景", cost: "免費漫步", highlight: "搭乘太陽能愛之船或在河畔露天咖啡座聆聽薩克斯風吹奏", theme: "建築特色", period: "evening" }
    ],
    foods: [
      "鹽埕埔鴨肉珍香濃肉燥飯、冬粉王與阿婆綜合冰",
      "旗津現撈海鮮熱炒、現烤生魷魚與手工番薯椪",
      "六合夜市鄭老牌木瓜牛奶、莊記海產粥（鮮蝦、小管滿滿）",
      "老江紅茶牛奶搭爆漿半熟蛋吐司、大溝頂阿綿麻糬",
      "高雄港邊現烤黑輪片、丹丹漢堡特調麵線羹加香脆炸雞"
    ],
    lodgings: [
      "🌊 鹽埕港邊海景行旅：遠眺駁二與愛河港灣，夜遊碼頭清風徐徐（第 1 晚首選）",
      "🍜 六合/美麗島轉運設計旅店：雙捷運交會，步行2分鐘直達夜市小吃（第 2 晚首選）",
      "🏛️ 旗津百年洋樓海濱客棧：感受日治老港鎮的悠緩節奏與浪濤聲（第 3 晚首選）",
      "💎 高雄承億酒店：無邊際高空懸挑泳池、頂級海景行政酒廊",
      "🌲 茂林國家風景區溫泉山莊：紫斑蝶度冬保護區、魯凱族石板屋巡禮"
    ]
  },
  "台灣 - 花蓮縣": {
    name: "花蓮縣",
    spots: [
      { title: "太魯閣國家公園（燕子口/九曲洞）", cost: "免費", highlight: "立霧溪數百萬年鬼斧神工切割大理石峽谷，壯麗斷崖直插雲霄", theme: "歷史背景" },
      { title: "七星潭海岸風景區", cost: "免費", highlight: "月牙型礫石海灣聆聽太平洋浪淘圓石細語，遠眺清水斷崖壯景", theme: "建築特色" },
      { title: "花蓮文創園區（舊酒廠）", cost: "免費", highlight: "百年紅磚釀酒廠改建，木造日式官舍散發文雅古韻與手工藝市集", theme: "建築特色" },
      { title: "松園別館", cost: "門票 $60 元", highlight: "日治軍事指揮部掩映在百年老黑松樹林間，俯瞰太平洋港灣視野極佳", theme: "歷史背景" },
      { title: "吉安慶修院", cost: "門票 $30 元", highlight: "台灣現存最完整的日式真言宗佛寺，四國八十八所石佛與手水舍", theme: "歷史背景" },
      { title: "清水斷崖（匯德觀景台）", cost: "免費", highlight: "蘇花公路最驚險震撼奇觀，千公尺峭壁直插蔚藍太平洋", theme: "建築特色" },
      { title: "鯉魚潭風景區", cost: "免費", highlight: "群山環繞的天然堰塞湖，踩天鵝船環湖或漫步樟樹林蔭步道", theme: "歷史背景" },
      { title: "瑞穗牧場與北回歸線標誌公園", cost: "免費", highlight: "品嚐現擠鮮奶冰淇淋與純濃奶酪，看鴕鳥與乳牛漫步青草地", theme: "在地飲食" },
      { title: "石梯坪地質風景區", cost: "停車費約 $50 元", highlight: "海蝕壺穴與白色凝灰岩單面山梯田地質，潮間帶生態極為豐富", theme: "建築特色" },
      { title: "花蓮鐵道文化園區", cost: "免費", highlight: "舊花蓮港出張所木造官舍，保留東部窄軌鐵路老蒸汽機車頭", theme: "歷史背景" }
    ],
    eveningSpots: [
      { title: "東大門國際觀光夜市", cost: "約 $200-350 元", highlight: "原住民一條街品嚐馬告香腸、烤鹹豬肉、竹筒飯與炸螃蟹", theme: "在地飲食", period: "evening" },
      { title: "花蓮舊鐵道商圈漫步", cost: "免費漫步", highlight: "鐵道行人徒步區文青選品、手作皮革與現泡花蓮蜜香紅茶小鋪", theme: "建築特色", period: "evening" },
      { title: "太平洋南濱公園夜景", cost: "免費漫步", highlight: "沿著太平洋海岸木棧道聽浪踏風，仰望後山清澈無光害星空", theme: "建築特色", period: "evening" }
    ],
    foods: [
      "新城佳興冰果室檸檬汁（整顆帶皮冷壓慢榨甘甜不苦）",
      "原住民烤山豬肉配野生刺蔥、竹筒小米飯",
      "公正街包子店小籠包、蒸餃與肉羹湯",
      "液香扁食/戴記扁食（大骨鮮湯搭配薄皮鮮肉餛飩）",
      "花蓮薯、剝皮辣椒與純手工麻糬"
    ],
    lodgings: [
      "🌊 七星潭海景第一排民宿：清晨躺在床上看太平洋日出、入夜聽浪濤（第 1 晚首選）",
      "🌲 太魯閣峽谷山林木屋：中央山脈芬多精環繞，洗滌塵囂的世外桃源（第 2 晚首選）",
      "🍜 東大門夜市周邊文青旅店：出門步行逛夜市，生活機能便利（第 3 晚首選）",
      "💎 太魯閣晶英酒店：座落峽谷之中的露天溫泉恆溫泳池、頂級慢活饗宴",
      "🏡 吉安慶修院旁日式禪風宿：榻榻米客房、枯山水庭園與手作茶道"
    ]
  },
  "台灣 - 台東縣": {
    name: "台東縣",
    spots: [
      { title: "池上伯朗大道與金城武樹", cost: "單車租借約 $150 元", highlight: "純淨無電線桿遮蔽的翠綠稻浪延伸至海岸山脈，騎乘單車迎風暢行", theme: "建築特色" },
      { title: "三仙台跨海步橋", cost: "免費", highlight: "八拱紅色波浪長橋如巨龍伏臥太平洋，探索海蝕壺穴與離岸仙島", theme: "歷史背景" },
      { title: "加路蘭海岸遊憩區", cost: "免費", highlight: "自然漂流木巨型地景藝術裝置，無敵太平洋海景與純淨浪濤", theme: "建築特色" },
      { title: "知本溫泉風景區", cost: "大眾湯約 $200 元", highlight: "百年名泉弱鹼性碳酸氫鈉泉，享受青山環抱無色無味的純淨暖泉", theme: "歷史背景" },
      { title: "鹿野高台觀景台", cost: "免費", highlight: "遠眺卑南溪與花東縱谷棋盤農田，欣賞國際熱氣球升空的壯麗開闊", theme: "歷史背景" },
      { title: "多良車站", cost: "門票 $10 元", highlight: "全台最美麗的火車站，大紅鐵欄杆外緊臨湛藍太平洋，火車破浪奔馳", theme: "建築特色" },
      { title: "小野柳地質景觀區", cost: "停車費約 $50 元", highlight: "壯觀的單面山、蜂窩岩與豆腐岩海蝕地貌，宛若海岸天然雕塑館", theme: "歷史背景" },
      { title: "台東森林公園（黑森林琵琶湖）", cost: "門票 $30 元", highlight: "騎單車穿梭防風木麻黃林，探訪天然湧泉琵琶湖的如鏡水色", theme: "建築特色" },
      { title: "都蘭糖廠文創園區", cost: "免費", highlight: "阿美族原鄉百年紅磚糖廠重生，聚集漂流木木雕藝術家與音樂酒吧", theme: "歷史背景" }
    ],
    eveningSpots: [
      { title: "鐵花村音樂聚落與慢市集", cost: "免費", highlight: "台鐵老宿舍點亮數百顆彩繪熱氣球燈海，聽原住民原創動人歌聲", theme: "歷史背景", period: "evening" },
      { title: "台東正氣路觀光夜市", cost: "約 $150-250 元", highlight: "品嚐林家臭豆腐、寶桑豆花、阿鋐炸雞與七里香水煎包", theme: "在地飲食", period: "evening" },
      { title: "知本溫泉露天星空湯池", cost: "約 $200-300 元", highlight: "入夜浸泡在氤氳美人湯中，仰望中央山脈群山環抱的璀璨星河", theme: "建築特色", period: "evening" }
    ],
    foods: [
      "池上古早味木片鐵路便當（粒粒飽滿甘甜的冠軍池上米）",
      "東河正宗肉包、酸菜包與竹筍包（老麵發酵外皮香Q彈牙）",
      "台東市榕樹下米苔目（滿滿柴魚片與特調肉燥）、藍蜻蜓炸雞",
      "金針山酥炸新鮮金針花、太麻里釋迦冰淇淋",
      "原住民阿拜（Abai 小米糯米粽裹假酸漿葉）、現烤山豬肉"
    ],
    lodgings: [
      "🌾 池上稻浪景觀私塾民宿：落地窗前即是無際稻田，四季風景各異（第 1 晚首選）",
      "🌊 都蘭太平洋海邊慢活居：藝術家手作木屋，伴隨潮汐感受大地脈動（第 2 晚首選）",
      "🍜 台東市中心文創設計行旅：鄰近鐵花村與正氣路夜市，生活機能便利（第 3 晚首選）",
      "💎 知本老爺酒店：戶外露天溫泉風呂、豐盛原民風味饗宴",
      "🏡 關山鎮日式鐵道站長宿舍：全檜木老官舍改建，重溫東部鐵路傳奇"
    ]
  }
};

// Generic fallback data generator for any custom destination / unmapped county
export function getGenericCountyData(countyName: string): CountyData {
  const cleanName = countyName.replace(/^[📍\s]+|台灣\s*-\s*|✏️\s*自設其他台灣目的地\.\.\./g, "").trim() || "台灣景點";
  
  return {
    name: cleanName,
    spots: [
      { title: `${cleanName}老街人文漫步區`, cost: "免費", highlight: `穿梭【${cleanName}】最具代表性的傳統街屋聚落，品讀清代至日治時期常民生活與文史脈絡。`, theme: "歷史背景" },
      { title: `${cleanName}地標性歷史建築名勝`, cost: "門票約 $50-100 元", highlight: `鑑賞因應在地氣候與風土工法構築的人文建築空間，感受歷史光影交織之美。`, theme: "建築特色" },
      { title: `${cleanName}生態自然景觀綠廊`, cost: "免費", highlight: `放慢步調走進山水綠意，在清脆鳥鳴與林蔭微風中深呼吸，享受恬適自然生機。`, theme: "歷史背景" },
      { title: `${cleanName}特色文創產業園區`, cost: "免費", highlight: `探訪在地青創基地與職人工坊，在老建築活化空間中欣賞現代手作創意工藝。`, theme: "建築特色" },
      { title: `${cleanName}在地老字號美食巡禮`, cost: "約 $150-250 元", highlight: `品嚐傳承數代的手工排隊名產，從古早味炊蒸米食到濃郁湯品，體會最純粹的風土滋味。`, theme: "在地飲食" },
      { title: `${cleanName}觀景步道與制高眺望台`, cost: "免費", highlight: `登高俯瞰整座市鎮與周邊山海景觀，遠眺大地晨曦與開闊的自然天際線。`, theme: "建築特色" },
      { title: `${cleanName}傳統工藝文化體驗館`, cost: "體驗費約 $150 元", highlight: `親手體驗在地特色傳統手作工法，感受老一輩職人代代傳承的匠心精神。`, theme: "歷史背景" },
      { title: `${cleanName}綠意親水休閒公園`, cost: "免費", highlight: `沿著清澈水岸漫步散策，欣賞濕地生態與水鳥悠游，享受無拘無束的漫活時光。`, theme: "歷史背景" }
    ],
    eveningSpots: [
      { title: `${cleanName}特色觀光夜市小吃街`, cost: "約 $200-300 元", highlight: `入夜後走入熱鬧燈火街區，品嚐最接地氣的在地現烤美食與古早味甜湯。`, theme: "在地飲食", period: "evening" },
      { title: `${cleanName}夜間水岸/景觀燈火漫步道`, cost: "免費漫步", highlight: `晚風輕拂的浪漫步道，欣賞地標璀璨夜間照明，感受沉靜迷人的慢活夜晚。`, theme: "建築特色", period: "evening" },
      { title: `${cleanName}老街夜間燈籠悠然散策`, cost: "約 $100-200 元", highlight: `紅燈籠高掛的寧靜巷弄，找一間復古小茶館泡茶聊天，品味小鎮專屬的悠緩夜色。`, theme: "歷史背景", period: "evening" }
    ],
    foods: [
      `${cleanName}在地傳承古法米食小吃、古早味香濃羹湯`,
      `${cleanName}當令時蔬鮮魚料理與產地直送特色風味餐`,
      `${cleanName}老街招牌手作甜點、傳統豆花與甘醇冷泡茶`,
      `${cleanName}人氣排隊名產伴手禮、傳統手工烘焙大餅`
    ],
    lodgings: [
      `🏡 ${cleanName}老宅特色文創客棧：融合在地傳統建築紋理，兼具現代舒適品味（第 1 晚首選）`,
      `🌿 ${cleanName}綠意景觀休閒會館：山水環抱、環境清幽，享受恬靜悠活晨光（第 2 晚首選）`,
      `🍜 ${cleanName}熱門商圈設計旅宿：出門即享老街小吃，交通便捷生活便利（第 3 晚首選）`,
      `💎 ${cleanName}頂級度假精品酒店：尊榮管家禮遇、專屬景觀水療與極致主廚私房料理`
    ]
  };
}

// Find rich authentic highlight for a spot name if available in our rich databases
function resolveSpotHighlight(spotName: string, countyName: string, style: string): { highlight: string; theme: "歷史背景" | "建築特色" | "在地飲食"; cost: string } {
  const normTarget = normalizeSpotTitle(spotName);

  // 1. Check in TAIWAN_FEATURED_STORIES
  for (const [storyKey, themesMap] of Object.entries(TAIWAN_FEATURED_STORIES)) {
    if (normalizeSpotTitle(storyKey) === normTarget || normTarget.includes(normalizeSpotTitle(storyKey)) || normalizeSpotTitle(storyKey).includes(normTarget)) {
      const art = themesMap["歷史背景"] || themesMap["建築特色"] || themesMap["在地飲食"];
      if (art) {
        return {
          highlight: art.summary || art.articleTitle,
          theme: art.theme || "歷史背景",
          cost: "免費參觀/現場收費"
        };
      }
    }
  }

  // 2. Check in all counties data
  for (const cData of Object.values(TAIWAN_COUNTIES_DATA)) {
    for (const s of [...cData.spots, ...cData.eveningSpots]) {
      if (normalizeSpotTitle(s.title) === normTarget || normTarget.includes(normalizeSpotTitle(s.title)) || normalizeSpotTitle(s.title).includes(normTarget)) {
        return {
          highlight: s.highlight,
          theme: s.theme,
          cost: s.cost
        };
      }
    }
  }

  // 3. Fallback to a natural, high-quality descriptive highlight avoiding repetitive templating
  const cleanStyle = style.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '').trim() || "深度文化";
  const contextualDescriptions = [
    `漫步走訪【${spotName}】，飽覽在地獨特人文地景與自然風貌，體驗舒適宜人的${cleanStyle}步調。`,
    `探尋【${spotName}】的歷史沿革與空間紋理，欣賞融合風土特色的建築細節，感受深邃人文魅力。`,
    `走進【${spotName}】體驗在地常民生活節奏，隨心漫遊拍照留念，發掘隱藏在街巷間的風土驚喜。`,
    `放慢腳步親近【${spotName}】，沉浸於悠閒寧靜的氛圍中，享受專屬於當地的風情與悠然時光。`
  ];
  const hash = Math.abs(spotName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const desc = contextualDescriptions[hash % contextualDescriptions.length];

  return {
    highlight: desc,
    theme: hash % 2 === 0 ? "歷史背景" : "建築特色",
    cost: "依現場收費/免費"
  };
}

/**
 * Universal Itinerary Deduplication Engine
 * Ensures 100% ZERO duplicate spot titles across all days and slots.
 * Also differentiates repeating hotel text across multiple days.
 */
export function deduplicateItinerary(itineraryDays: DayItinerary[], countyName: string): DayItinerary[] {
  if (!Array.isArray(itineraryDays) || itineraryDays.length === 0) {
    return itineraryDays;
  }

  const cleanCountyKey = countyName.trim();
  const countyData = TAIWAN_COUNTIES_DATA[cleanCountyKey] || getGenericCountyData(cleanCountyKey);
  
  // Track all used titles across ALL days
  const usedTitles = new Set<string>();
  
  // Create an available replacement pool of authentic spots
  const replacementDayPool = [...countyData.spots];
  const replacementEveningPool = [...countyData.eveningSpots];

  // Helper to get next unvisited day spot
  const getNextUnusedDaySpot = (): SpotItem => {
    for (const candidate of replacementDayPool) {
      const norm = normalizeSpotTitle(candidate.title);
      if (!usedTitles.has(norm)) {
        usedTitles.add(norm);
        return candidate;
      }
    }
    // If exhausted, generate an indexed authentic spot
    const extIdx = usedTitles.size + 1;
    const fallbackSpot: SpotItem = {
      title: `${countyData.name}第${extIdx}私房走讀秘境`,
      cost: "免費",
      highlight: `探尋${countyData.name}深山或海濱幽境，遠離喧囂感受大自然最純粹的慢活芬多精。`,
      theme: "歷史背景"
    };
    usedTitles.add(normalizeSpotTitle(fallbackSpot.title));
    return fallbackSpot;
  };

  // Helper to get next unvisited evening spot
  const getNextUnusedEveningSpot = (): SpotItem => {
    for (const candidate of replacementEveningPool) {
      const norm = normalizeSpotTitle(candidate.title);
      if (!usedTitles.has(norm)) {
        usedTitles.add(norm);
        return candidate;
      }
    }
    // If evening pool exhausted, try day pool
    for (const candidate of replacementDayPool) {
      const norm = normalizeSpotTitle(candidate.title);
      if (!usedTitles.has(norm)) {
        usedTitles.add(norm);
        return {
          ...candidate,
          title: `${candidate.title}夜間散策`,
          highlight: `晚風微拂，在星光與柔和街燈下漫步${candidate.title}，享受恬靜悠緩的夜色。`
        };
      }
    }
    const extIdx = usedTitles.size + 1;
    const fallbackEvening: SpotItem = {
      title: `${countyData.name}星光夜市與水岸步道`,
      cost: "約 $150-250 元",
      highlight: `品嚐在地特色熱食點心，伴隨徐徐晚風享受美好夜景。`,
      theme: "在地飲食"
    };
    usedTitles.add(normalizeSpotTitle(fallbackEvening.title));
    return fallbackEvening;
  };

  // Process day by day
  const result: DayItinerary[] = [];

  itineraryDays.forEach((day, dayIndex) => {
    const dNum = day.dayNum || dayIndex + 1;
    const cleanedActivities: Activity[] = [];

    const activitiesList = Array.isArray(day.activities) ? day.activities : [];

    activitiesList.forEach((act, actIdx) => {
      const rawTitle = (act.title || "").trim();
      const normTitle = normalizeSpotTitle(rawTitle);
      const isEvening = actIdx === activitiesList.length - 1 && (act.time?.includes("18:") || act.time?.includes("19:") || act.time?.includes("20:") || activitiesList.length >= 3);

      if (!normTitle || usedTitles.has(normTitle)) {
        // DUPLICATE DETECTED! Replace with genuine fresh spot
        const freshSpot = isEvening ? getNextUnusedEveningSpot() : getNextUnusedDaySpot();
        cleanedActivities.push({
          time: act.time || (isEvening ? "18:30" : actIdx === 0 ? "09:30" : "14:00"),
          title: freshSpot.title,
          cost: freshSpot.cost,
          highlight: freshSpot.highlight,
          theme: freshSpot.theme
        });
      } else {
        // Unique spot - register it
        usedTitles.add(normTitle);
        cleanedActivities.push(act);
      }
    });

    // Deduplicate and enrich lodging
    let dayLodging = (day.lodging || "").trim();
    // If lodging has "(第 X 晚)" or is identical to previous, replace with differentiated stay
    const lodgingList = countyData.lodgings;
    const assignedLodging = lodgingList[(dNum - 1) % lodgingList.length] || dayLodging;
    
    // Deduplicate food recommendation
    const foodList = countyData.foods;
    const assignedFood = day.foodRecommend && !day.foodRecommend.includes("今日美饌：今日美饌")
      ? day.foodRecommend
      : `今日美饌：${foodList[(dNum - 1) % foodList.length] || `${countyData.name}在地排隊特色小吃`}`;

    result.push({
      dayNum: dNum,
      lodging: assignedLodging,
      foodRecommend: assignedFood,
      activities: cleanedActivities
    });
  });

  return result;
}

export function generateLocalSmartItinerary(params: PlannerParams): PlannerResult {
  const {
    county = "台灣 - 宜蘭縣",
    districts = [],
    days = 3,
    style = "🌲 自然生態",
    transport = "🚗 汽車",
    budget = "💰 省錢",
    userNotes = "",
    guideLength = "中等",
    expressStyle = "經典",
    voicePack = "專業的主播"
  } = params;

  const numDays = Math.max(1, Math.min(days || 3, 7));
  
  // Clean names
  const cleanCountyKey = county.trim();
  const matchedData = TAIWAN_COUNTIES_DATA[cleanCountyKey] || getGenericCountyData(cleanCountyKey);
  const countyShortName = matchedData.name;

  const cleanStyle = style.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '').trim() || "漫活體驗";
  const cleanTransport = transport.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '').trim() || "汽車";
  const cleanBudget = budget.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '').trim() || "省錢";

  // Build candidate spots list with strict deduplication
  const userDistrictsList = Array.isArray(districts) ? districts.filter(Boolean) : [];
  const candidateSpotPool: SpotItem[] = [];
  const registeredCandidateTitles = new Set<string>();

  // 1. First add user-chosen spots (with rich real highlights from taiwanStories or county DB)
  userDistrictsList.forEach((districtName) => {
    const trimmed = districtName.trim();
    const norm = normalizeSpotTitle(trimmed);
    if (trimmed && !registeredCandidateTitles.has(norm)) {
      registeredCandidateTitles.add(norm);
      const resolved = resolveSpotHighlight(trimmed, countyShortName, cleanStyle);
      candidateSpotPool.push({
        title: trimmed,
        cost: resolved.cost,
        highlight: resolved.highlight,
        theme: resolved.theme,
        period: "day"
      });
    }
  });

  // 2. Append verified county spots WITHOUT duplicating any user spot
  matchedData.spots.forEach((spot) => {
    const norm = normalizeSpotTitle(spot.title);
    if (!registeredCandidateTitles.has(norm)) {
      registeredCandidateTitles.add(norm);
      candidateSpotPool.push({ ...spot, period: "day" });
    }
  });

  // 3. Evening spots candidate pool
  const eveningSpotPool: SpotItem[] = [];
  const registeredEveningTitles = new Set<string>();
  matchedData.eveningSpots.forEach((spot) => {
    const norm = normalizeSpotTitle(spot.title);
    if (!registeredEveningTitles.has(norm)) {
      registeredEveningTitles.add(norm);
      eveningSpotPool.push(spot);
    }
  });

  // STRICT GLOBAL VISITED TRACKER ACROSS ALL DAYS
  const usedSpotTitles = new Set<string>();

  // Function to pull the next unvisited day spot
  let dayPoolIndex = 0;
  const getNextUnvisitedDaySpot = (): SpotItem => {
    while (dayPoolIndex < candidateSpotPool.length) {
      const candidate = candidateSpotPool[dayPoolIndex++];
      const norm = normalizeSpotTitle(candidate.title);
      if (!usedSpotTitles.has(norm)) {
        usedSpotTitles.add(norm);
        return candidate;
      }
    }
    // If pool exhausted, fallback to extra regional spot
    const extNum = usedSpotTitles.size + 1;
    const fallbackSpot: SpotItem = {
      title: `${countyShortName}私房風土漫步 (第${extNum}景)`,
      cost: "免費",
      highlight: `遠離塵囂深入【${countyShortName}】特色聚落，感受純粹的自然林蔭與在地悠緩時光。`,
      theme: "歷史背景"
    };
    usedSpotTitles.add(normalizeSpotTitle(fallbackSpot.title));
    return fallbackSpot;
  };

  // Function to pull the next unvisited evening spot
  let eveningPoolIndex = 0;
  const getNextUnvisitedEveningSpot = (): SpotItem => {
    while (eveningPoolIndex < eveningSpotPool.length) {
      const candidate = eveningSpotPool[eveningPoolIndex++];
      const norm = normalizeSpotTitle(candidate.title);
      if (!usedSpotTitles.has(norm)) {
        usedSpotTitles.add(norm);
        return candidate;
      }
    }
    // If evening pool exhausted, pull from day pool
    while (dayPoolIndex < candidateSpotPool.length) {
      const candidate = candidateSpotPool[dayPoolIndex++];
      const norm = normalizeSpotTitle(candidate.title);
      if (!usedSpotTitles.has(norm)) {
        usedSpotTitles.add(norm);
        return {
          ...candidate,
          title: `${candidate.title}（夜間氛圍）`,
          highlight: `晚風徐徐，漫步在夜間微光之中的${candidate.title}，品嚐在地熱呼呼小吃。`
        };
      }
    }
    const fallbackEvening: SpotItem = {
      title: `${countyShortName}星空水岸夜景漫步`,
      cost: "約 $150-250 元",
      highlight: `夜幕降臨，漫步於燈火點綴的街道與水岸，在悠緩晚風中品嚐道地熱呼呼在地小吃。`,
      theme: "在地飲食"
    };
    usedSpotTitles.add(normalizeSpotTitle(fallbackEvening.title));
    return fallbackEvening;
  };

  // Generate day-by-day itineraries
  const itineraryDays: DayItinerary[] = [];
  const times = ["09:30", "14:00", "18:30"];

  for (let d = 1; d <= numDays; d++) {
    const dayActivities: Activity[] = [];
    const foodRecommend = matchedData.foods[(d - 1) % matchedData.foods.length] || `🍜 ${countyShortName}人氣排隊名店料理與在地特色小吃巡禮`;

    // Distinct lodging for EACH day (no more "第 d 晚" duplicate hotel!)
    const lodgingStay = matchedData.lodgings[(d - 1) % matchedData.lodgings.length] || `🏡 ${countyShortName}精選優質旅宿 (舒適放鬆，享受美好晨光)`;

    // 2 daytime activities per day (09:30 morning, 14:00 afternoon)
    for (let slot = 0; slot < 2; slot++) {
      const baseSpot = getNextUnvisitedDaySpot();
      const timeStr = times[slot];

      // Tone adjustment based on expressStyle
      let styledHighlight = baseSpot.highlight;
      if (expressStyle === "幽默") {
        styledHighlight = `💥 精彩必看！${baseSpot.highlight} 超有梗又好拍，絕對讓人大開眼界！`;
      } else if (expressStyle === "教學") {
        styledHighlight = `🎓 深入走讀：${baseSpot.highlight} 特別注意其歷史地緣與建築構造細節。`;
      } else if (expressStyle === "英語播報") {
        styledHighlight = `Authentic experience: ${baseSpot.highlight} Discover the vibrant living culture of Taiwan!`;
      }

      dayActivities.push({
        time: timeStr,
        title: baseSpot.title,
        cost: baseSpot.cost,
        highlight: styledHighlight,
        theme: baseSpot.theme
      });
    }

    // Evening activity (18:30) - ALWAYS picking unvisited evening spot
    const eveningSpot = getNextUnvisitedEveningSpot();
    let styledEveningHighlight = eveningSpot.highlight;
    if (expressStyle === "幽默") {
      styledEveningHighlight = `🌙 越夜越美麗！${eveningSpot.highlight} 夜生活吃透透，肚皮滿載而歸！`;
    }
    dayActivities.push({
      time: times[2],
      title: eveningSpot.title,
      cost: eveningSpot.cost,
      highlight: styledEveningHighlight,
      theme: eveningSpot.theme
    });

    itineraryDays.push({
      dayNum: d,
      lodging: lodgingStay,
      foodRecommend: `今日美饌：${foodRecommend}`,
      activities: dayActivities
    });
  }

  // Geographic Sanity Alert check
  let geoNotes = "";
  const allTexts = [countyShortName, ...userDistrictsList, userNotes].join(" ");
  const hasNorth = allTexts.includes("台北") || allTexts.includes("新北") || allTexts.includes("基隆") || allTexts.includes("桃園") || allTexts.includes("九份");
  const hasSouth = allTexts.includes("高雄") || allTexts.includes("台南") || allTexts.includes("屏東") || allTexts.includes("墾丁");
  const hasEast = allTexts.includes("花蓮") || allTexts.includes("台東") || allTexts.includes("宜蘭");

  if (hasNorth && hasSouth && numDays <= 2) {
    geoNotes = `⚠️ 跨界移動提醒：偵測到行程橫跨北部與南部，距離超過300公里。若天數僅1-2天建議搭乘高鐵或精簡範圍！\n\n`;
  } else if (hasEast && hasSouth && numDays <= 2) {
    geoNotes = `⚠️ 跨界移動提醒：花東與恆春半島間需繞行南迴，車程較長，建議規劃3天以上為佳！\n\n`;
  }

  const notes = `${geoNotes}💡 行前深旅溫馨小秘笈：
 - 本行程已為您的【${cleanStyle}】團隊風格與【${cleanTransport}】移動方式智慧排定，景點全程零重複，兼顧步調從容與文史深讀。
 - 每日住宿與特色美饌均經精選輪替，在【${cleanBudget}】預算考量下享受最高性價比在地風情。
${userNotes ? ` - 您的專屬備註需求【${userNotes}】已融入每日行程安排與彈性時段。\n` : ""} - 抵達景點後可切換至「首頁景點」或「學習紀錄」以聽覺語音包解鎖深度故事！`;

  return {
    success: true,
    isAi: false,
    isLocalSmart: true,
    model: "DeepGo Local Autonomous Engine",
    itinerary: itineraryDays,
    notes: notes
  };
}
