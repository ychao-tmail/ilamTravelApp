import { useState } from "react";
import { Award, BookOpen, Clock, Copy, Edit3, MapPin, Share2, Check, X, Sparkles } from "lucide-react";
import { DayItinerary } from "../types";
import { resolveSpotStory } from "../data/taiwanStories";

interface ColearnTabProps {
  onCopyItinerary: (title: string, daysNum: number, districts: string[], plan: DayItinerary[]) => void;
  onRemixItinerary: (daysNum: number, districts: string[]) => void;
  onChangeTab: (tab: string) => void;
}

interface PublicItinerary {
  id: string;
  title: string;
  days: string;
  region: string;
  badge: "⭐ 官方精選" | "🎖 在地達人" | "🏫 教育認證";
  copiedCount: number;
  author: string;
  category: "official" | "expert" | "edu";
  desc: string;
  plan: DayItinerary[];
}

const PUBLIC_ITINERARIES: PublicItinerary[] = [
  {
    id: "pub_1",
    title: "台北文風・大稻埕洋樓、故宮藝術與101夜色二日行",
    days: "2 天 1 夜",
    region: "大同區、士林區、信義區",
    badge: "⭐ 官方精選",
    copiedCount: 1842,
    author: "台北觀光文化走讀隊",
    category: "official",
    desc: "貫穿台北百年商貿發展脈絡，走訪迪化街紅磚騎樓茶商傳奇，朝聖故宮國寶，夜登台北101觀景台。",
    plan: [
      {
        dayNum: 1,
        lodging: "🏡 大稻埕老洋樓設計旅宿：百年前茶商大宅改建，挑高天井與紅磚花磚",
        foodRecommend: "🍜 必吃：永樂市場林合發油飯、旗魚米粉湯、百年老店茂豐杏仁露",
        activities: [
          { time: "10:00", title: "大稻埕/迪化街", cost: "免費", highlight: "漫步巴洛克立面山牆老街，細品茶香與布莊南北貨文化", theme: "歷史背景" },
          { time: "15:00", title: "台北101", cost: "門票 $600 元", highlight: "登頂89樓觀景台俯瞰台北盆地，探訪重達660公噸金色風阻尼球", theme: "建築特色" }
        ]
      },
      {
        dayNum: 2,
        lodging: "無 (傍晚結束回程)",
        foodRecommend: "🍽️ 必吃：故宮晶華多寶格文人名點、士林夜市生煎包與十全排骨",
        activities: [
          { time: "09:30", title: "國立故宮博物院", cost: "門票 $350 元", highlight: "依外雙溪山勢而建的宮殿式殿堂，細賞翠玉白菜與歷代青銅陶瓷", theme: "歷史背景" }
        ]
      }
    ]
  },
  {
    id: "pub_2",
    title: "台南府城古蹟漫步・安平古堡與國華街小吃二日遊",
    days: "2 天 1 夜",
    region: "安平區、中西區",
    badge: "🎖 在地達人",
    copiedCount: 1450,
    author: "台南老文史推廣 謝老師",
    category: "expert",
    desc: "回到大航海時代熱蘭遮城出發點！親撫四百年荷式紅磚殘壁，穿梭赤崁樓與神農街老屋巷弄。",
    plan: [
      {
        dayNum: 1,
        lodging: "🏡 安平運河水岸老宅民宿：木造斜頂閣樓，開窗即攬運河日落金光",
        foodRecommend: "🍜 必吃：周氏蝦捲、新鮮溫體牛肉湯、同記安平傳統豆花",
        activities: [
          { time: "10:00", title: "安平古堡", cost: "門票 $70 元", highlight: "四百年熱蘭遮城三合土紅磚殘壁，伴古榕盤根錯節的大航海記憶", theme: "歷史背景" },
          { time: "15:00", title: "赤崁樓", cost: "門票 $70 元", highlight: "贔屭馱御碑與閩南歇山重簷樓閣，見證鄭氏王朝與清代府城風華", theme: "建築特色" }
        ]
      },
      {
        dayNum: 2,
        lodging: "無 (品嚐美食後回程)",
        foodRecommend: "🥢 必吃：國華街富盛號碗粿、金得春捲、阿松割包與義豐冬瓜茶",
        activities: [
          { time: "10:30", title: "神農街", cost: "免費", highlight: "清代五條港木造老街屋，紅燈籠與鐵窗花交織的靜謐時光", theme: "建築特色" }
        ]
      }
    ]
  },
  {
    id: "pub_3",
    title: "宜蘭溪南常民風土・百年木香與冷泉三日遊",
    days: "3 天 2 夜",
    region: "羅東、冬山、蘇澳",
    badge: "⭐ 官方精選",
    copiedCount: 1248,
    author: "宜蘭溪南文化推廣處",
    category: "official",
    desc: "整合羅東至蘇澳最具歷史保育價值的常民生活地景，重溫林場肉羹與冷泉彈珠汽水的往昔情懷。",
    plan: [
      {
        dayNum: 1,
        lodging: "🏡 羅東林場暖木旅棧：檜木文青風設計，步行可達羅東夜市",
        foodRecommend: "🍜 必吃：林場肉羹（一甲子排隊名店）、阿灶伯當歸羊肉湯、魏姐包心粉圓",
        activities: [
          { time: "10:00", title: "羅東林業文化園區", cost: "免費", highlight: "百年林業貯木池與日式檜木舊樟木宿舍群", theme: "歷史背景" },
          { time: "18:00", title: "羅東夜市", cost: "約 $250 元", highlight: "聚集道地三星蔥多餅與常民經典美食", theme: "在地飲食" }
        ]
      },
      {
        dayNum: 2,
        lodging: "🌾 冬山小河稻香民宿：坐擁四季變化的稻浪景致、附湧泉湧香早餐",
        foodRecommend: "🍵 必吃：冬山老街古早米粉羹、廣興做田人黑糖麻糬與素馨茶香",
        activities: [
          { time: "09:00", title: "冬山河生態綠舟", cost: "門票 $30 元", highlight: "遊船探訪如魔幻神殿般的神秘地下水道河港", theme: "歷史背景" },
          { time: "14:00", title: "斑比山丘", cost: "門票 $200 元", highlight: "與極其療癒親民的梅花鹿、呆萌水豚親密互動餵食", theme: "建築特色" }
        ]
      },
      {
        dayNum: 3,
        lodging: "🌊 蘇澳煙波大飯店四季雙泉館：頂樓浴場坐擁全台首創冷熱雙湯池",
        foodRecommend: "🐟 必吃：新鮮現炸烤南方澳鯖魚、阿芬鮮魚湯、冷泉手工羊羹",
        activities: [
          { time: "09:00", title: "蘇澳冷泉", cost: "門票 $120 元", highlight: "體驗 22℃ 豐沛清涼帶有微氣泡的天然碳酸冷泉", theme: "歷史背景" },
          { time: "11:30", title: "南方澳漁港", cost: "免費", highlight: "全國著名鯖魚故鄉，朝聖南天宮純金媽祖殿堂", theme: "在地飲食" }
        ]
      }
    ]
  },
  {
    id: "pub_4",
    title: "南投日月潭與清境農場・水色高山生態三日遊",
    days: "3 天 2 夜",
    region: "魚池鄉、仁愛鄉",
    badge: "⭐ 官方精選",
    copiedCount: 968,
    author: "台灣山岳國家風景走讀隊",
    category: "official",
    desc: "結合全台最大高山湖泊與雲端青青草原，品味台茶18號紅玉紅茶香與高山雲海奇景。",
    plan: [
      {
        dayNum: 1,
        lodging: "🏡 日月潭向山水岸湖景飯店：臨窗飽覽水社大山日出倒影",
        foodRecommend: "🍵 必吃：台茶18號紅玉冷泡茶、伊達邵阿薩姆紅茶香菇茶葉蛋",
        activities: [
          { time: "10:30", title: "日月潭", cost: "遊湖船票 $300 元", highlight: "搭船橫渡拉魯島水波，漫步團紀彥大師清水模向山遊客中心", theme: "建築特色" }
        ]
      },
      {
        dayNum: 2,
        lodging: "🏡 清境歐風木造都鐸山莊：壁爐原木香氣與高山觀星陽台",
        foodRecommend: "🥘 必吃：魯媽媽雲南擺夷錦灑包料魚、高山甜甘藍與羊乳冰棒",
        activities: [
          { time: "09:30", title: "清境農場", cost: "門票 $200 元", highlight: "青青草原綿羊剪毛秀，雲端高空步道遠眺奇萊連峰險峰", theme: "自然生態" }
        ]
      },
      {
        dayNum: 3,
        lodging: "無 (回程)",
        foodRecommend: "🍱 必吃：埔里酒廠紹興酒香腸、紹興米糕甜米釀冰棒",
        activities: [
          { time: "10:00", title: "埔里酒廠", cost: "免費", highlight: "百年愛蘭甘泉釀酒歷史，撫摸九二一地震倒塌酒甕修復文脈", theme: "歷史背景" }
        ]
      }
    ]
  },
  {
    id: "pub_5",
    title: "花蓮太魯閣大理石地質與七星潭海風共學營",
    days: "2 天 1 夜",
    region: "秀林鄉、新城鄉",
    badge: "🏫 教育認證",
    copiedCount: 730,
    author: "東台灣地質人文研究社",
    category: "edu",
    desc: "地質專家領路！實地觸摸數百萬年板塊擠壓大理石壺穴，在七星潭月牙灣傾聽礫石滾浪交響樂。",
    plan: [
      {
        dayNum: 1,
        lodging: "🏕️ 太魯閣晶英酒店或天祥青年活動中心：座落立霧溪大理石峽谷幽靜山壁間",
        foodRecommend: "🍖 必吃：新城老街佳興檸檬汁、原鄉馬告烤香腸與竹筒香飯",
        activities: [
          { time: "09:30", title: "太魯閣國家公園", cost: "免費", highlight: "徒步燕子口步道與九曲洞峭壁，探究立霧溪下切侵蝕大理石奇景", theme: "歷史背景" }
        ]
      },
      {
        dayNum: 2,
        lodging: "無 (地質探索營圓滿結業)",
        foodRecommend: "🐟 必吃：七星潭柴魚博物館現刨柴魚花、花蓮炸彈蔥油餅與公正包子",
        activities: [
          { time: "09:00", title: "七星潭", cost: "免費", highlight: "月牙灣鵝卵石灘自然觀察，遠眺清水斷崖垂直峭拔插入深藍太平洋", theme: "建築特色" }
        ]
      }
    ]
  },
  {
    id: "pub_6",
    title: "高雄港都藝文・駁二老倉庫與旗津海風二日行",
    days: "2 天 1 夜",
    region: "鹽埕區、旗津區",
    badge: "🎖 在地達人",
    copiedCount: 885,
    author: "港都海風背包客 阿傑",
    category: "expert",
    desc: "從重工業港都到當代藝文新都！走訪老倉庫鋼雕、搭渡輪登旗津島看八角純白燈塔。",
    plan: [
      {
        dayNum: 1,
        lodging: "🏡 鹽埕老旅社新生設計旅店：融入老台灣磨石子地坪與港灣工業風",
        foodRecommend: "🦆 必吃：鹽埕埔鴨肉珍、冬粉王、阿婆冰與大溝頂虱目魚肚湯",
        activities: [
          { time: "11:00", title: "駁二藝術特區", cost: "免費", highlight: "第三船渠砂糖老倉庫變身前衛展場，戶外大型鋼雕與彩繪壁畫漫步", theme: "建築特色" }
        ]
      },
      {
        dayNum: 2,
        lodging: "無 (傍晚返程)",
        foodRecommend: "🦑 必吃：旗津廟前路烤小管、現炸旗魚黑輪包蛋與海之冰大碗公冰",
        activities: [
          { time: "10:00", title: "旗津老街與燈塔", cost: "渡輪 $30 元", highlight: "登頂旗後山純白八角巴洛克燈塔，俯瞰高雄第一港口萬噸貨輪進出", theme: "歷史背景" }
        ]
      }
    ]
  }
];

const CLIENT_STORIES: Record<string, Record<string, string>> = {
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
  "安平古堡": {
    "歷史背景": "建於1624年，初名熱蘭遮城，是荷蘭東印度公司統治台灣與開展東亞航海貿易的大本營，也是近代台灣走向世界大航海時代的歷史起點，鄭成功收復後改名安平。",
    "建築特色": "現存珍貴紅磚殘壁採用糯米、糖漿、蚵灰與砂石調合的「三合土」古法砌築，攀附百年老榕樹盤根錯節，散發歷經四百年歲月洗禮的古樸蒼涼美感。",
    "在地飲食": "安平港邊現炸香脆周氏蝦捲、新鮮滾燙牛肉湯，再配一碗綿密細緻的同記安平豆花，每一口都是府城深厚悠遠的時光沉澱。"
  },
  "赤崁樓": {
    "歷史背景": "建於1653年荷治時期（普羅民遮城），清代與日治數次修築改建。乾隆皇帝平定林爽文事件所賜的九座贔屭馱御碑並列樓前，承載台南古都三百年風雲聚散。",
    "建築特色": "紅瓦飛簷的閩南歇山重簷頂樓閣，基座殘存荷蘭紅磚厚重拱門地窖，庭園綠意盎然，文昌閣供奉魁星爺，文風鼎盛。",
    "在地飲食": "赤崁樓旁歷史名店度小月擔仔麵、度小月椪餅，還有義豐冬瓜茶與武廟肉圓，散步穿梭古巷即可飽餐一頓府城經典小吃。"
  },
  "神農街": {
    "歷史背景": "原名北勢街，是清代台南五條港商貿鼎盛時期的中心大街。商賈雲集、貨物裝卸船運繁忙，至今仍完整維繫清代常民街道紋理。",
    "建築特色": "兩層樓高、進深狹長的木結構街屋，一樓為店面兼起居室，二樓設有外推小木門直通街道以吊掛貨物，掛滿手繪傳統燈籠，夜色迷人。",
    "在地飲食": "老街內改建的小酒館、手作割包、古法黑糖飲與現烤日式鯛魚燒，在靜謐石板路中品味新舊交織的浪漫。"
  },
  "日月潭": {
    "歷史背景": "台灣最大的高山天然湖泊，以拉魯島為界，東半部形如日輪，西半部狀似月鉤。自古為邵族原住民聚居的聖地，日治時期引濁水溪水開鑿發電工程，造就現今水波浩渺的日月奇景。",
    "建築特色": "湖畔向山行政暨遊客中心由日本建築大師團紀彥操刀，低矮清水模建築如手臂般環抱湖景，無邊際水池與日月潭水天相接，是當代地景建築名作。",
    "在地飲食": "魚池鄉馳名中外的台茶18號紅玉紅茶，茶湯帶著淡淡天然肉桂香與薄荷涼感；搭配伊達邵碼頭現烤阿薩姆紅茶香菇蛋、山豬肉刈包，回味悠長。"
  },
  "清境農場": {
    "歷史背景": "民國50年代為安置滇緬退役異域孤軍而開闢，將荒蕪高山闢建為溫帶農場。今日轉型為高山觀光農牧休閒勝地，見證了一段艱辛拓荒的歲月。",
    "建築特色": "綿延於青翠山巒的綿羊城堡、白色木棧道與高空景觀步道，映襯著歐風木造民宿群與遠方奇萊連峰，交織成宛如瑞士阿爾卑斯山的清麗風光。",
    "在地飲食": "特色擺夷風味料理（錦灑、包料魚、雲南汽鍋雞）是滇緬退伍軍人帶來的家鄉味；加上高山鮮甜高麗菜與新鮮羊乳冰棒，滋味獨特。"
  },
  "太魯閣國家公園": {
    "歷史背景": "歷經數百萬年菲律賓海板塊碰撞擠壓抬升，立霧溪長年湍急切割侵蝕，造就世界上最震撼的大理石高山峽谷奇觀，亦承載太魯閣族狩獵與中橫公路開拓的人文悲壯史。",
    "建築特色": "中橫公路一鑿一斧人工開鑿於險峻岩壁間，燕子口懸崖絕壁上的溶穴壺穴、九曲洞迴廊與長春祠瀑布飛流，展現鬼斧神工自然地質與人力抗衡的驚奇。",
    "在地飲食": "新城老街酸甜沁涼的佳興檸檬汁、原住民特色馬告香腸與竹筒飯，是健行步道後補充能量的最佳山海野趣選擇。"
  },
  "七星潭": {
    "歷史背景": "七星潭並非潭水，而是美麗的月牙灣礫石海岸。早年原住民聚居的小湖泊被日治機場填平，村民遷至海灣旁，仍延續舊名七星潭，流傳著討海人觀星辨位的航海傳說。",
    "建築特色": "海濱長堤鋪設單車步道，圓潤的鵝卵石灘隨海浪沖刷發出清脆滾石聲，遠眺北側清水斷崖宛如屏風矗立大海之上，視野震撼。",
    "在地飲食": "海邊必嚐柴魚博物館現刨柴魚片、曼波魚海鮮湯與花蓮手工麻糬，滿嘴海洋鮮味。"
  },
  "駁二藝術特區": {
    "歷史背景": "原為高雄港第三船渠旁存放魚粉與砂糖的陳舊港邊倉庫群，見證了高雄重工業與海運鼎盛時代。2001年由在地藝術家群起推動再生，蛻變為南台灣最具指標性的前衛文創園地。",
    "建築特色": "紅磚與斜頂檜木桁架老倉庫改裝，保留重工業粗獷桁樑與鐵道遺跡，搭配巨型戶外鋼雕公仔與立體彩繪壁畫，將冷硬碼頭轉化為充滿活力的海風美學空間。",
    "在地飲食": "鹽埕埔老街區的鴨肉珍、冬粉王、阿婆冰與碳烤三明治，滿載老高雄討海人與碼頭工人的生猛熱情滋味。"
  },
  "旗津老街與燈塔": {
    "歷史背景": "旗津是高雄市的發祥地，清代設有砲台與海關。島上天后宮建於康熙年間，為高雄最早的媽祖廟，庇佑世代討海人家平安。",
    "建築特色": "高雄燈塔（旗後燈塔）建於日治大正七年，八角形純白磚造塔身與巴洛克式山牆建築，雄踞旗後山頂，居高臨下可飽覽高雄港灣出入巨輪。",
    "在地飲食": "旗津廟前路烤小管鮮脆噴香、旗魚黑輪現包水煮蛋現炸外酥內嫩，再來一碗大碗公水果冰，海風輕拂中暢快淋漓。"
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
    "在地飲食": "現撈、現殺、現爆鹽烤的『鯖魚料理』是港邊的靈魂。搭配熱騰騰的南方澳厚嫩米粉羹，海風微鹹，鮮魚滾燙，每一口都浸透了討海人的堅韌與豪邁。"
  },
  "羅東夜市": {
    "歷史背景": "羅東夜市圍繞著羅東中山公園，是羅東常民生活與商業發展的心臟。自日治時期的集市匯聚起，逐漸發展成如今聞名全台的繁華夜市。",
    "建築特色": "夜市攤位與街區規劃井然有序，中山公園老樹成蔭、廟宇宮殿點綴其間，展現出極具台灣常民情懷與親和力的夜市景觀。",
    "在地飲食": "以蘭陽溪優良水質灌溉出的三星蔥，製成了外酥內嫩、香氣撲鼻的蔥多餅。還有當歸羊肉湯與包心粉圓，是來宜蘭絕對不可錯過的深夜排隊名物。"
  },
  "斑比山丘": {
    "歷史背景": "斑比山丘融合了冬山鄉在地友善農業與動物保育理念，是一處以大自然與小動物共生為主題的療癒系教育基地。",
    "建築特色": "採用純白與溫暖木質調的森林系設計，流線型的圍籬與原木色調的建築完美座落在冬山河上游的綠色山谷中，極具當代自然美學風範。",
    "在地飲食": "園區結合了在地特產如冬山素馨茶，創製出獨特的「美美子手作甜點」與茶香冰淇淋。在這裡一邊眺望青山，一邊品嚐療癒甜點，是一大享受。"
  }
};

export default function ColearnTab({ onCopyItinerary, onRemixItinerary, onChangeTab }: ColearnTabProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "official" | "expert" | "edu">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewItinerary, setPreviewItinerary] = useState<PublicItinerary | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleCopyClick = (item: PublicItinerary) => {
    const daysNum = parseInt(item.days) || 3;
    const districts = item.region.split("、").map(d => d.trim());
    onCopyItinerary(item.title, daysNum, districts, item.plan);
    showToast("📋 已複製到「我的行程」，可前往規劃微調！");
  };

  const handleRemixClick = (item: PublicItinerary) => {
    const daysNum = parseInt(item.days) || 3;
    const districts = item.region.split("、").map(d => d.trim());
    onRemixItinerary(daysNum, districts);
    showToast("✏️ 範本已成功改編並載入「AI規劃頁」，即刻出航！");
    setTimeout(() => {
      onChangeTab("planner");
    }, 1200);
  };

  const filteredList = PUBLIC_ITINERARIES.filter(item => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  return (
    <div className="space-y-6 fade-in p-1 relative">
      {/* Toast Alert Notice */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-sm bg-[#13294B] text-[#E8A02C] border-2 border-[#E8A02C] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-bold leading-relaxed">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#13294B] to-[#12366b] text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 text-9xl font-black select-none pointer-events-none">
          👥
        </div>
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-[#E8A02C]/20 border border-[#E8A02C]/40 text-[#E8A02C] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            <BookOpen className="w-3 h-3" />
            <span>台灣全境深度文史</span>
          </div>
          <h2 className="text-lg font-black tracking-tight font-display">行程共學交流</h2>
          <p className="text-xs text-gray-300 leading-relaxed max-w-[90%]">
            探索與研討全台各地文化、親身體驗在地風土。你既可以輕鬆複製各縣市精選行程，也可以隨手進行 AI 自訂與改編。
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block font-mono">
          🗂️ 篩選行程視角
        </span>
        <div className="grid grid-cols-4 gap-1.5 bg-gray-150 p-1 rounded-xl">
          <button
            onClick={() => setActiveFilter("all")}
            className={`text-xs py-2 px-1 rounded-lg text-center font-bold tracking-tight transition-all duration-150 ${
              activeFilter === "all"
                ? "bg-[#13294B] text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setActiveFilter("official")}
            className={`text-xs py-2 px-1 rounded-lg text-center font-bold tracking-tight transition-all duration-150 ${
              activeFilter === "official"
                ? "bg-[#13294B] text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            ⭐ 官方
          </button>
          <button
            onClick={() => setActiveFilter("expert")}
            className={`text-xs py-2 px-1 rounded-lg text-center font-bold tracking-tight transition-all duration-150 ${
              activeFilter === "expert"
                ? "bg-[#13294B] text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            🎖 在地
          </button>
          <button
            onClick={() => setActiveFilter("edu")}
            className={`text-xs py-2 px-1 rounded-lg text-center font-bold tracking-tight transition-all duration-150 ${
              activeFilter === "edu"
                ? "bg-[#13294B] text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            🏫 教育
          </button>
        </div>
      </div>

      {/* Public Itinerary Cards List */}
      <div className="space-y-4">
        {filteredList.map((item) => (
          <div
            key={item.id}
            id={`colearn-card-${item.id}`}
            className="bg-white border border-gray-150 rounded-2xl p-4.5 space-y-3.5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
          >
            {/* Top Row: Tag / Days / Author */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#13294B] bg-[#13294B]/5 border border-[#13294B]/20 px-2.5 py-0.5 rounded-full">
                {item.badge}
              </span>
              <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[10px]">
                <Clock className="w-3 h-3" />
                <span>{item.days}</span>
              </div>
            </div>

            {/* Title & description */}
            <div className="space-y-1">
              <h3 className="text-[14px] font-black text-gray-900 leading-snug">
                {item.title}
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>

            {/* Region / Copy Count Info Line */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>區域: <strong>{item.region}</strong></span>
              </div>
              <div className="flex items-center gap-1 font-mono font-bold text-[#E8A02C]">
                <span>🔁 被複製 {item.copiedCount} 次</span>
              </div>
            </div>

            {/* Inner Preview / Highlights of the itinerary */}
            <div className="bg-[#FAF8F5] rounded-xl p-3 border border-gray-100 space-y-1.5">
              <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">
                📍 焦點景點摘要：
              </span>
              <div className="flex flex-wrap gap-1">
                {item.plan.flatMap(day => day.activities).map((act, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-white border border-gray-200 rounded-lg px-2 py-0.5 text-gray-700"
                  >
                    {act.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Buttons Group (📋 複製行程, ✏️ 改編, and optionally 📖 雲端預習) */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleCopyClick(item)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 transition-all focus:outline-none shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                  <span>📋 複製行程</span>
                </button>

                <button
                  onClick={() => handleRemixClick(item)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#E8A02C] hover:bg-[#d69022] text-white rounded-xl text-xs font-bold transition-all focus:outline-none shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-white" />
                  <span>✏️ 改編</span>
                </button>
              </div>

              {item.category === "edu" && (
                <button
                  onClick={() => setPreviewItinerary(item)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all focus:outline-none shadow-xs cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>📖 雲端預習</span>
                </button>
              )}
            </div>
          </div>
        ))}
        
        {filteredList.length === 0 && (
          <div className="text-center py-10 space-y-2">
            <Share2 className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs text-gray-400">目前尚無符合該篩選類別的公開行程。</p>
          </div>
        )}
      </div>

      {/* Cloud Pre-reading / Preview Modal */}
      {previewItinerary && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4.5 border-b border-gray-100 flex items-center justify-between bg-indigo-50/50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600 animate-pulse" />
                <div>
                  <h3 className="font-black text-sm text-gray-900 tracking-tight">出發前，先讀懂這個地方</h3>
                  <p className="text-[10px] text-indigo-700 font-bold">📖 雲端故事導覽 • 智能預習</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewItinerary(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1 bg-gray-50/50 max-h-[60vh]">
              {/* Itinerary brief */}
              <div className="bg-white border border-gray-150 rounded-2xl p-4 space-y-2 shadow-xs">
                <span className="text-[9px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                  {previewItinerary.badge}
                </span>
                <h4 className="text-xs font-black text-gray-900 leading-snug">
                  {previewItinerary.title}
                </h4>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  {previewItinerary.desc}
                </p>
              </div>

              {/* Guided spots list */}
              <div className="space-y-5">
                {previewItinerary.plan.flatMap((day) =>
                  day.activities.map((act) => {
                    const spotName = act.title;
                    const histStory = resolveSpotStory(spotName, "歷史背景");
                    const archStory = resolveSpotStory(spotName, "建築特色");
                    const foodStory = resolveSpotStory(spotName, "在地飲食");

                    return (
                      <div key={spotName} className="bg-white border border-gray-150 rounded-2xl p-4.5 space-y-3.5 shadow-xs">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-sm">📍</span>
                            <h5 className="font-extrabold text-[13px] text-gray-900 truncate">
                              {spotName}
                            </h5>
                          </div>
                          <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-mono">
                            {act.theme || "文化探索"}
                          </span>
                        </div>

                        {/* Stories subsections */}
                        <div className="space-y-3 text-[11px] text-gray-600 leading-relaxed font-semibold">
                          <div className="space-y-1">
                            <strong className="text-indigo-800 font-black flex items-center gap-1">
                              📜 歷史背景 • 身世溯源
                            </strong>
                            <p className="bg-indigo-50/30 p-2.5 rounded-xl border border-indigo-100/30 text-gray-700 font-medium">
                              {histStory.summary || histStory.historyContext.slice(0, 160) + "..."}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <strong className="text-[#a1551b] font-black flex items-center gap-1">
                              🧱 建築特色 • 空間密碼
                            </strong>
                            <p className="bg-amber-50/40 p-2.5 rounded-xl border border-amber-100/30 text-gray-700 font-medium">
                              {archStory.architectureDetails.slice(0, 160) + "..."}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <strong className="text-[#2a7a2a] font-black flex items-center gap-1">
                              😋 在地飲食 • 尋味指南
                            </strong>
                            <p className="bg-emerald-50/30 p-2.5 rounded-xl border border-emerald-100/30 text-gray-700 font-medium">
                              {foodStory.foodCulture.slice(0, 160) + "..."}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end bg-white">
              <button
                onClick={() => setPreviewItinerary(null)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg focus:outline-none cursor-pointer"
              >
                我了解了，期待出發！
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
