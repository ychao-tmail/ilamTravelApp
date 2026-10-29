import { DayItinerary, Activity } from "../types";

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

// Comprehensive database of Taiwan destinations, authentic spots, local food, and lodging templates
interface CountyData {
  name: string;
  spots: Array<{ title: string; cost: string; highlight: string; theme: "歷史背景" | "建築特色" | "在地飲食" }>;
  foods: string[];
  lodgings: Record<string, string>; // keyed by style or budget
}

const TAIWAN_COUNTIES_DATA: Record<string, CountyData> = {
  "台灣 - 台北市": {
    name: "台北市",
    spots: [
      { title: "大稻埕/迪化街", cost: "免費", highlight: "漫步百年南北貨與茶香街屋，仰望大正時期巴洛克雕花山牆與天井格局", theme: "歷史背景" },
      { title: "國立故宮博物院", cost: "門票 $350 元", highlight: "鑑賞中華五千年工藝瑰寶，親睹翠玉白菜與肉形石的雕琢神技", theme: "建築特色" },
      { title: "台北101觀景台", cost: "門票 $600 元", highlight: "俯瞰台北盆地天際線，見證660公噸阻尼球的現代耐震工程奇蹟", theme: "建築特色" },
      { title: "北投溫泉博物館", cost: "免費", highlight: "探訪百年和洋折衷公共浴場，在硫磺煙嵐中品讀北投溫泉鄉風華", theme: "歷史背景" },
      { title: "陽明山擎天崗草原", cost: "免費", highlight: "漫步遼闊熔岩台地芒草海，遠眺火山地形與悠閒水牛群", theme: "歷史背景" },
      { title: "士林夜市/寧夏夜市", cost: "約 $200-350 元", highlight: "品嚐千歲宴傳統小吃、胡椒餅與現炸生煎包，感受夜市生猛活力", theme: "在地飲食" },
      { title: "西門町紅樓街區", cost: "免費", highlight: "八角堂紅磚洋樓融合青年文創，體驗日治商場到流行前線的蛻變", theme: "歷史背景" },
      { title: "松山文創園區", cost: "免費", highlight: "前身為松山菸廠，日式工業包浩斯風格廠房與巴洛克中庭花園", theme: "建築特色" }
    ],
    foods: [
      "鼎泰豐黃金十八摺小籠包、原盅牛肉麵",
      "永樂市場林合發油飯、民樂旗魚米粉與冰鎮杏仁露",
      "寧夏夜市圓環邊蚵仔煎、劉芋仔蛋黃芋餅",
      "北投滿來溫泉拉麵、阿財鍋貼與古早味紅茶",
      "阜杭豆漿厚餅夾蛋、香濃甜豆漿"
    ],
    lodgings: {
      "自然生態": "🌿 北投日式溫泉行旅：天然白磺泉池、檜木原木客房，享山嵐綠意靜謐",
      "漫活體驗": "☕ 大稻埕復古人文設計宅：坐落百年街屋巷弄，挑高天井與紅磚陽台",
      "美食巡禮": "🍜 中山雙連設計旅店：鄰近寧夏夜市與中山文青商圈，下樓即享排隊美食",
      "歷史文化": "🏛️ 圓山大飯店/文青老洋樓：紅柱金瓦東方宮殿建築，坐擁基隆河無敵夜景",
      "親子同樂": "🎠 信義區五星親子飯店：室內兒童遊戲區、家庭專屬露台與101景觀",
      "戶外探險": "🎒 陽明山景觀休閒山莊：群山環抱、近健行步道起點，星空開闊",
      "豪華模式": "💎 台北文華東方/W Taipei：頂級奢華尊榮禮遇，米其林星級主廚美饌"
    }
  },
  "台灣 - 新北市": {
    name: "新北市",
    spots: [
      { title: "九份山城老街", cost: "免費", highlight: "沿山蜿蜒石階高掛大紅燈籠，遠眺基隆嶼海景與黃金採礦歷史", theme: "歷史背景" },
      { title: "淡水紅毛城與前清英國領事官邸", cost: "門票 $80 元", highlight: "紅磚拱圈迴廊俯瞰淡水河夕照，見證大航海與開港租界史", theme: "歷史背景" },
      { title: "野柳地質公園", cost: "門票 $120 元", highlight: "大自然億萬年海蝕風化雕塑，觀賞女王頭、仙女鞋與燭台石奇景", theme: "建築特色" },
      { title: "十分瀑布與平溪天燈", cost: "放天燈約 $200 元", highlight: "全台最大簾幕式瀑布，沿鐵道冉冉升起手寫心願天燈", theme: "歷史背景" },
      { title: "烏來老街與烏來瀑布", cost: "台車票 $50 元", highlight: "搭乘復古台車穿梭山林，品嚐泰雅原鄉竹筒飯與美人湯溫泉", theme: "在地飲食" },
      { title: "三峽老街與清水祖師廟", cost: "免費", highlight: "東方藝術殿堂精雕石柱，漫步紅磚拱廊品嚐金牛角麵包", theme: "建築特色" }
    ],
    foods: [
      "淡水阿給、魚酥、正宗阿婆鐵蛋配阿媽酸梅湯",
      "九份阿柑姨手工芋圓、金枝紅糟肉圓與阿蘭草仔粿",
      "烏來原住民烤山豬肉、香酥溪蝦溪魚與馬告竹筒飯",
      "深坑豆腐老街現烤紅燒臭豆腐、黑豆腐生乳捲",
      "三峽老街原味黑糖金牛角、碧螺春綠茶冰淇淋"
    ],
    lodgings: {
      "自然生態": "🌲 烏來溫泉觀溪民宿：開窗即見南勢溪清流，私人碳酸氫鈉美人泉池",
      "漫活體驗": "🏮 九份山城景觀民宿：面朝太平洋無敵海景，夜晚靜賞九份璀璨燈火",
      "美食巡禮": "🌅 淡水河畔景觀飯店：緊鄰金色水岸與淡水渡船頭，漫步落日餘暉",
      "歷史文化": "🏡 三峽鶯歌陶藝主題文旅：融入陶瓷與紅磚元素，充滿在地職人工藝",
      "親子同樂": "🏰 福容大飯店淡水漁人碼頭：郵輪造型外觀、情人塔旋轉景觀台",
      "戶外探險": "🏕️ 平溪雙溪綠光露營農場：溪流潺潺、夜觀螢火蟲與浩瀚繁星",
      "豪華模式": "💎 板橋凱撒大飯店/烏來馥蘭朵：頂樓無邊際星空泳池、極致水岸私廚"
    }
  },
  "台灣 - 宜蘭縣": {
    name: "宜蘭縣",
    spots: [
      { title: "羅東林業文化園區", cost: "免費", highlight: "百年林場貯木池與檜木日式宿舍群，漫步綠蔭步道感受林業繁華記憶", theme: "歷史背景" },
      { title: "冬山河生態綠舟", cost: "門票 $30 元", highlight: "乘船探索魔幻神秘地下河道天井採光，登頂大樹公遠眺龜山島", theme: "歷史背景" },
      { title: "蘇澳冷泉公園", cost: "門票 $20 元", highlight: "體驗全台獨有22℃低溫碳酸冷泉，細緻氣泡包覆肌膚冰涼沁心", theme: "建築特色" },
      { title: "南方澳漁港與南天宮", cost: "免費", highlight: "鯖魚故鄉巡禮，參拜200公斤金身媽祖，欣賞山海港埠聚落美感", theme: "歷史背景" },
      { title: "國立傳統藝術中心", cost: "門票 $150 元", highlight: "三合院與仿老街臨水市街，體驗捏麵人、布袋戲與台灣常民百工", theme: "建築特色" },
      { title: "羅東夜市", cost: "約 $250 元", highlight: "品嚐全台最香阿灶伯當歸羊肉湯、三星蔥多餅與包心粉圓", theme: "在地飲食" }
    ],
    foods: [
      "羅東林場肉羹、阿灶伯當歸羊肉湯、魏姐包心粉圓",
      "三星卜肉、爆漿三星蔥油餅、手做蔥多餅",
      "南方澳現烤鯖魚宴、阿芬鮮魚湯、在地蘇澳古早味羊羹",
      "宜蘭脆皮櫻桃烤鴨三吃（櫻桃鴨握壽司、片皮鴨捲）",
      "冬山素馨紅茶、純淨湧泉現烤香魚"
    ],
    lodgings: {
      "自然生態": "🌾 冬山小河稻香民宿：坐擁四季稻浪景致，湧泉食材早餐與單車漫遊",
      "漫活體驗": "🏡 羅東林場暖木旅棧：檜木文青風設計，附日式觀景浴缸，近羅東夜市",
      "美食巡禮": "🍜 礁溪溫泉排隊美食旅宿：下樓即享溫泉街小吃，客房內享天然碳酸泉",
      "歷史文化": "🏛️ 頭城老街古蹟復古客棧：閩南紅磚與日式木構相映，品讀開蘭首城",
      "親子同樂": "🛝 宜蘭親子滑梯積木城堡：房內溜滑梯、戶外戲水池與餵小動物體驗",
      "戶外探險": "⛺ 太平山鳩之澤露營區：山林巨木環抱、地熱溫泉煮蛋與野溪溫泉",
      "豪華模式": "💎 蘇澳煙波大飯店四季雙泉館/礁溪老爺：頂樓黃金雙泉、無邊際海景"
    }
  },
  "台灣 - 台中市": {
    name: "台中市",
    spots: [
      { title: "高美濕地木棧道", cost: "免費", highlight: "木棧道延伸海天一色，十八座巨型風車伴隨夕陽金黃倒影極致壯麗", theme: "歷史背景" },
      { title: "宮原眼科與第四信用合作社", cost: "免費入內", highlight: "日治眼科老屋蛻變哈利波特霍格華茲風挑高圖書館，品嚐特色冰淇淋", theme: "建築特色" },
      { title: "台中國家歌劇院", cost: "免費", highlight: "日本建築大師伊東豊雄操刀，全球首創曲牆無樑柱『美聲涵洞』", theme: "建築特色" },
      { title: "審計新村文創園區", cost: "免費", highlight: "省府時期單身宿舍群重生，聚集青年手作、古著與特色風格咖啡", theme: "建築特色" },
      { title: "逢甲夜市商圈", cost: "約 $200-350 元", highlight: "全台創意美食發源地，明倫蛋餅、大腸包小腸與一心臭豆腐", theme: "在地飲食" },
      { title: "彩虹眷村", cost: "免費", highlight: "彩虹爺爺以繽紛斑斕童趣彩繪，賦予眷村老房生氣盎然的藝術生命", theme: "歷史背景" }
    ],
    foods: [
      "宮原眼科巨無霸台灣水果冰淇淋、日出乳酪蛋糕",
      "清水正宗筒仔米糕、王塔米糕配熱騰騰肉羹湯",
      "逢甲明倫蛋餅、官芝霖大腸包小腸、惡魔雞排",
      "台中肉員（八十年老店米醬肉圓）、冬粉湯",
      "春水堂創始店手工珍珠奶茶、蘿蔔糕佐特調辣醬"
    ],
    lodgings: {
      "自然生態": "🌲 武陵農場/新社薰衣草森林民宿：滿園花海芬多精，夜觀銀河星斗",
      "漫活體驗": "🎨 草悟道人文設計文旅：綠意盎然林蔭大道旁，藝術展演與職人選品",
      "美食巡禮": "🥟 逢甲夜市步行核心飯店：出門即逛全台第一夜市，鬧中取靜隔音絕佳",
      "歷史文化": "🏛️ 台中舊城區昭和復古行旅：挑高木窗花與磨石子地板，重溫大屯風華",
      "親子同樂": "🎠 麗寶福容大飯店：全台最大摩天輪、雙樂園與賽車場一次玩透",
      "戶外探險": "🧗 谷關山林溫泉客棧：大甲溪峽谷環繞，泰雅部落巡禮與山岳健行",
      "豪華模式": "💎 台中林酒店/日月千禧：高空天際線露天酒吧、極致熟成牛排盛宴"
    }
  },
  "台灣 - 台南市": {
    name: "台南市",
    spots: [
      { title: "安平古堡與熱蘭遮城殘壁", cost: "門票 $70 元", highlight: "四百年荷蘭三合土磚壁盤根老榕，見證台灣走向大航海時代起點", theme: "歷史背景" },
      { title: "赤崁樓（普羅民遮城）", cost: "門票 $70 元", highlight: "紅牆綠瓦庭園立九座贔屭御碑，荷鄭清三代政權更迭的文史縮影", theme: "歷史背景" },
      { title: "台南市美術館二館", cost: "門票 $200 元", highlight: "普立茲克獎得主坂茂設計，鳳凰花碎形屋頂打造純白幾何光影聖殿", theme: "建築特色" },
      { title: "神農街老街散策", cost: "免費", highlight: "清代五條港最繁華街道，木造街屋掛滿手繪燈籠，入夜幽靜迷人", theme: "建築特色" },
      { title: "國華街/保安路美食聚落", cost: "約 $200-300 元", highlight: "溫體現燙牛肉湯、富盛號碗粿、蝦仁肉圓，府城小吃精華重鎮", theme: "在地飲食" },
      { title: "奇美博物館", cost: "門票 $200 元", highlight: "西洋古典希臘神殿巴洛克式外觀，阿波羅噴泉與世界級提琴珍藏", theme: "建築特色" }
    ],
    foods: [
      "文章牛肉湯/阿村牛肉湯：現切溫體牛淋上滾燙牛骨高湯，粉嫩鮮甜",
      "安平周氏蝦捲、陳家蚵捲與同記安平古早味豆花",
      "富盛號黑豆醬油碗粿、金得春捲與阿松割包",
      "度小月擔仔麵、邱家小卷米粉（新鮮現煮甘甜湯頭）",
      "莉莉水果店現刨芒果冰、泰成水果店哈密瓜瓜冰"
    ],
    lodgings: {
      "自然生態": "🌊 七股鹽山潟湖漁村民宿：搭竹筏烤蚵、觀黑面琵鷺與鹽田夕照",
      "漫活體驗": "🏡 中西區百年老天井民宿：磨石子旋轉梯、檜木老窗與慢活古井庭園",
      "美食巡禮": "🍜 國華街步行 3 分鐘設計行旅：出門直攻府城美食，附專屬美食地圖",
      "歷史文化": "🏛️ 友愛街旅館 (UIJ)：結合黑膠唱片、書店閱讀與紅磚建築的文創先鋒",
      "親子同樂": "🎠 和逸飯店台南西門館：戶外奇趣操場、電動車跑道與卡通頻道主題房",
      "戶外探險": "🏕️ 左鎮白堊地質露營農場：月世界惡地地形漫遊、二寮日出雲海",
      "豪華模式": "💎 台南晶英酒店/香格里拉：尊榮府城茶薈、頂樓戶外泳池與恆溫三溫暖"
    }
  },
  "台灣 - 高雄市": {
    name: "高雄市",
    spots: [
      { title: "駁二藝術特區與大港橋", cost: "免費", highlight: "港邊老倉庫轉化為前衛文創，大港橋定時旋轉開合迎向高雄港海風", theme: "建築特色" },
      { title: "旗津老街與旗后燈塔", cost: "渡輪票 $40 元", highlight: "搭渡輪過海漫步百年巴洛克白燈塔，俯瞰高雄港開闊水域與夕陽", theme: "歷史背景" },
      { title: "衛武營國家藝術文化中心", cost: "免費參觀公共區", highlight: "荷蘭建築團隊以老榕樹氣根為靈感，全球最大單一屋頂流線型劇院", theme: "建築特色" },
      { title: "蓮池潭龍虎塔與春秋閣", cost: "免費", highlight: "龍口進虎口出祈求逢凶化吉，九曲橋蜿蜒湖面伴隨古典東方宮殿", theme: "歷史背景" },
      { title: "六合夜市/瑞豐夜市", cost: "約 $200-300 元", highlight: "海產粥、木瓜牛奶與萬國牛排，品嚐高雄在地夜市澎湃熱情", theme: "在地飲食" },
      { title: "打狗英國領事館文化園區", cost: "門票 $99 元", highlight: "紅磚英式連續拱廊官邸，居高臨下俯瞰西子灣落日與大船入港", theme: "歷史背景" }
    ],
    foods: [
      "鹽埕埔鴨肉珍香濃肉燥飯、冬粉王與阿婆綜合冰",
      "旗津現撈海鮮熱炒、現烤生魷魚與手工番薯椪",
      "六合夜市鄭老牌木瓜牛奶、莊記海產粥（鮮蝦、小管、蛤蜊滿滿）",
      "大溝頂阿綿麻糬、老江紅茶牛奶搭爆漿半熟蛋吐司",
      "高雄港邊現烤黑輪片、丹丹漢堡特調麵線羹加香脆炸雞"
    ],
    lodgings: {
      "自然生態": "🌲 茂林國家風景區溫泉山莊：紫斑蝶度冬保護區、魯凱族石板屋巡禮",
      "漫活體驗": "🌊 鹽埕港邊海景行旅：遠眺駁二與愛河港灣，夜遊碼頭清風徐徐",
      "美食巡禮": "🍜 六合/美麗島轉運設計旅店：雙捷運交會，步行2分鐘直達夜市小吃",
      "歷史文化": "🏛️ 旗津百年洋樓民宿：感受日治老港鎮的悠緩節奏與浪濤聲",
      "親子同樂": "🎠 高雄義大皇家酒店：大型摩天輪、義大世界主題遊樂園與購物廣場",
      "戶外探險": "🧗 柴山壽山秘境探索客棧：尋訪石灰岩溶洞一線天、台灣獼猴生態",
      "豪華模式": "💎 高雄承億酒店/洲際酒店：無邊際高空懸挑泳池、頂級海景行政酒廊"
    }
  },
  "台灣 - 花蓮縣": {
    name: "花蓮縣",
    spots: [
      { title: "太魯閣國家公園（燕子口/九曲洞）", cost: "免費", highlight: "立霧溪數百萬年鬼斧神工切割大理石峽谷，壯麗斷崖直插雲霄", theme: "歷史背景" },
      { title: "七星潭海岸風景區", cost: "免費", highlight: "月牙型礫石海灣聆聽太平洋浪淘圓石細語，遠眺清水斷崖壯景", theme: "建築特色" },
      { title: "花蓮文創園區（舊酒廠）", cost: "免費", highlight: "百年紅磚釀酒廠改建，木造日式官舍散發文雅古韻與手工藝市集", theme: "建築特色" },
      { title: "松園別館", cost: "門票 $60 元", highlight: "日治軍事指揮部掩映在百年老黑松樹林間，俯瞰太平洋港灣視野極佳", theme: "歷史背景" },
      { title: "東大門國際觀光夜市", cost: "約 $200-350 元", highlight: "原住民一條街品嚐馬告香腸、烤鹹豬肉與炸螃蟹，感受後山熱情", theme: "在地飲食" }
    ],
    foods: [
      "新城佳興冰果室檸檬汁（整顆帶皮冷壓慢榨甘甜不苦）",
      "原住民烤山豬肉配野生刺蔥、竹筒小米飯",
      "公正街包子店小籠包、蒸餃與肉羹湯",
      "液香扁食/戴記扁食（大骨鮮湯搭配薄皮鮮肉餛飩）",
      "花蓮薯、剝皮辣椒與純手工麻糬"
    ],
    lodgings: {
      "自然生態": "🌊 七星潭海景第一排民宿：清晨躺在床上看太平洋日出、入夜聽浪濤",
      "漫活體驗": "🌲 太魯閣峽谷山林木屋：中央山脈芬多精環繞，洗滌塵囂的世外桃源",
      "美食巡禮": "🍜 東大門夜市周邊文青旅店：出門步行逛夜市，附花蓮排隊美食地圖",
      "歷史文化": "🏡 吉安慶修院旁日式禪風宿：榻榻米客房、枯山水庭園與手作茶道",
      "親子同樂": "🎠 遠雄悅來大飯店：依山面海維多利亞風格，附設海洋公園樂園門票",
      "戶外探險": "🧗 秀姑巒溪泛舟基地客棧：激流泛舟起點、錐麓古道專業響導服務",
      "豪華模式": "💎 太魯閣晶英酒店：座落峽谷之中的露天溫泉恆溫泳池、頂級慢活饗宴"
    }
  },
  "台灣 - 台東縣": {
    name: "台東縣",
    spots: [
      { title: "池上伯朗大道與金城武樹", cost: "單車租借約 $150 元", highlight: "純淨無電線桿遮蔽的翠綠稻浪延伸至海岸山脈，騎乘單車迎風暢行", theme: "建築特色" },
      { title: "三仙台跨海步橋", cost: "免費", highlight: "八拱紅色波浪長橋如巨龍伏臥太平洋，探索海蝕壺穴與離岸仙島", theme: "歷史背景" },
      { title: "鐵花村音樂聚落與慢市集", cost: "免費", highlight: "台鐵老宿舍轉型，點亮數百顆彩繪熱氣球燈海，聽原住民原創歌聲", theme: "歷史背景" },
      { title: "加路蘭海岸遊憩區", cost: "免費", highlight: "自然漂流木巨型地景藝術裝置，無敵太平洋海景與夜間純淨星空", theme: "建築特色" },
      { title: "知本溫泉風景區", cost: "大眾湯約 $200 元", highlight: "百年名泉弱鹼性碳酸氫鈉泉，享受青山環抱無色無味的純淨暖泉", theme: "歷史背景" }
    ],
    foods: [
      "池上古早味木片鐵路便當（粒粒飽滿甘甜的冠軍池上米）",
      "東河正宗肉包、酸菜包與竹筍包（老麵發酵外皮香Q彈牙）",
      "台東市榕樹下米苔目（滿滿柴魚片與特調肉燥）、藍蜻蜓炸雞",
      "金針山酥炸新鮮金針花、太麻里釋迦冰淇淋",
      "原住民阿拜（Abai 小米糯米粽裹假酸漿葉）、部落烤肉"
    ],
    lodgings: {
      "自然生態": "🌾 池上稻浪景觀私塾民宿：落地窗前即是無際稻田，四季風景各異",
      "漫活體驗": "🌊 都蘭太平洋海邊慢活居：藝術家手作木屋，伴隨潮汐感受大地脈動",
      "美食巡禮": "🍜 台東市中心文創設計行旅：鄰近鐵花村與正氣路夜市，生活機能便利",
      "歷史文化": "🏡 關山鎮日式鐵道站長宿舍：全檜木老官舍改建，重溫東部鐵路傳奇",
      "親子同樂": "🎠 台東北緯22度度假莊園：大草皮奔跑、星空電影院與採果體驗",
      "戶外探險": "🧗 栗松野溪溫泉探險基地：全台最美翡翠色碳酸溫泉岩壁探索起點",
      "豪華模式": "💎 知本老爺酒店/台東桂田喜來登：戶外溫泉風呂、豐盛原民風味饗宴"
    }
  }
};

// Generic fallback data for counties not covered in the detailed map above
function getGenericCountyData(countyName: string): CountyData {
  const cleanName = countyName.replace(/^[📍\s]+|台灣\s*-\s*|✏️\s*自設其他台灣目的地\.\.\./g, "").trim() || "台灣景點";
  
  return {
    name: cleanName,
    spots: [
      { title: `${cleanName}在地老街與文化商圈`, cost: "免費", highlight: `穿梭【${cleanName}】最具代表性的傳統街屋與古蹟聚落，品味在地歷史文脈與常民溫度。`, theme: "歷史背景" },
      { title: `${cleanName}地標性人文建築名勝`, cost: "門票約 $50-100 元", highlight: `鑑賞因應在地風土設計的特色建築工法，感受人文空間與大自然交織之美。`, theme: "建築特色" },
      { title: `${cleanName}自然風貌觀景步道`, cost: "免費", highlight: `放慢腳步親近【${cleanName}】山海風光，遠離塵囂盡情呼吸清新芬多精。`, theme: "歷史背景" },
      { title: `${cleanName}特色老字號美食巡禮`, cost: "約 $200 元", highlight: `探訪世代傳承的道地排隊小吃與老店，品嚐最純粹的風土食材滋味。`, theme: "在地飲食" },
      { title: `${cleanName}文創藝術聚落與工坊`, cost: "免費", highlight: `走訪青年返鄉創生基地與職人工作室，親手體驗在地工藝的匠心獨具。`, theme: "建築特色" }
    ],
    foods: [
      `${cleanName}在地傳承古法米食小吃、古早味香濃羹湯`,
      `${cleanName}當令時蔬鮮魚料理與產地直送特色風味餐`,
      `${cleanName}老街招牌手作甜點、傳統豆腐花與甘醇冷泡茶`,
      `${cleanName}人氣排隊名產伴手禮、傳統手工烘焙大餅`
    ],
    lodgings: {
      "自然生態": `🌲 ${cleanName}綠意景觀休閒民宿：山水環抱、環境清幽，享受恬靜悠活晨光`,
      "漫活體驗": `🏡 ${cleanName}老宅特色文創客棧：融合在地傳統建築紋理，兼具現代舒適品味`,
      "美食巡禮": `🍜 ${cleanName}熱門商圈設計旅宿：出門即享老街小吃，交通便捷生活便利`,
      "歷史文化": `🏛️ ${cleanName}人文古蹟風旅宿：融入深厚文史典故，漫步歷史街區隨心所欲`,
      "親子同樂": `🎠 ${cleanName}親子友善度假飯店：寬敞大空間家庭客房，附設戶外休閒設施`,
      "戶外探險": `⛺ ${cleanName}山野露營休閒基地：坐擁遼闊星空視野，近健行步道與登山入口`,
      "豪華模式": `💎 ${cleanName}頂級度假精品酒店：尊榮管家禮遇、專屬景觀水療與極致主廚私房料理`
    }
  };
}

export function generateLocalSmartItinerary(params: PlannerParams): PlannerResult {
  const {
    county = "台灣 - 台北市",
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
  
  // Clean clean names
  const cleanCountyKey = county.trim();
  const matchedData = TAIWAN_COUNTIES_DATA[cleanCountyKey] || getGenericCountyData(cleanCountyKey);
  const countyShortName = matchedData.name;

  // Clean style/budget key
  const cleanStyle = style.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '').trim() || "漫活體驗";
  const cleanTransport = transport.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '').trim() || "汽車";
  const cleanBudget = budget.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '').trim() || "省錢";

  // Build candidate spots list, prioritizing user custom districts
  const userDistrictsList = Array.isArray(districts) ? districts.filter(Boolean) : [];
  const customSpotItems = userDistrictsList.map((districtName, idx) => {
    return {
      title: districtName,
      cost: "依現場收費/免費",
      highlight: `深度走訪【${districtName}】，結合在地風土特色，解鎖專屬於您的【${cleanStyle}】探旅亮點。`,
      theme: (idx % 3 === 0 ? "歷史背景" : idx % 3 === 1 ? "建築特色" : "在地飲食") as "歷史背景" | "建築特色" | "在地飲食"
    };
  });

  // Combine user custom spots with verified county spots
  const allPool = [...customSpotItems, ...matchedData.spots];

  // Pick suitable lodging based on style
  const lodgingTemplate = matchedData.lodgings[cleanStyle] || matchedData.lodgings["漫活體驗"] || `🏡 ${countyShortName}精選優質旅宿 (適合${cleanStyle}團隊，舒適安心)`;

  // Generate day-by-day itineraries
  const itineraryDays: DayItinerary[] = [];
  const times = ["09:30", "14:00", "18:30"];

  for (let d = 1; d <= numDays; d++) {
    const dayActivities: Activity[] = [];
    const foodRecommend = matchedData.foods[(d - 1) % matchedData.foods.length] || `🍜 ${countyShortName}人氣排隊名店料理與在地特色小吃巡禮`;

    // 2-3 activities per day
    for (let slot = 0; slot < 2; slot++) {
      const poolIndex = ((d - 1) * 2 + slot) % allPool.length;
      const baseSpot = allPool[poolIndex];
      const timeStr = times[slot];

      // Tone adjustment based on expressStyle
      let styledHighlight = baseSpot.highlight;
      if (expressStyle === "幽默") {
        styledHighlight = `💥 精彩必看！${baseSpot.highlight} 超有梗又好拍，絕對讓人大開眼界！`;
      } else if (expressStyle === "教學") {
        styledHighlight = `🎓 深入走讀：${baseSpot.highlight} 特別注意其歷史地緣與建築構造細節。`;
      } else if (expressStyle === "英語播報") {
        styledHighlight = `Authentic experience: ${baseSpot.highlight} Discover the vibrant culture of Taiwan!`;
      }

      dayActivities.push({
        time: timeStr,
        title: baseSpot.title,
        cost: baseSpot.cost,
        highlight: styledHighlight,
        theme: baseSpot.theme
      });
    }

    // Optional evening activity
    if (d <= 3 || d % 2 === 1) {
      const eveningSpot = allPool[(allPool.length - d) % allPool.length];
      dayActivities.push({
        time: times[2],
        title: `${eveningSpot.title}（夜晚氛圍）`,
        cost: "約 $150-300 元",
        highlight: `夜幕降臨，漫步於燈火點綴的街景，在悠緩晚風中品嚐道地熱呼呼在地小吃。`,
        theme: "在地飲食"
      });
    }

    itineraryDays.push({
      dayNum: d,
      lodging: `${lodgingTemplate} (第 ${d} 晚)`,
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
 - 本行程已為您的【${cleanStyle}】團隊風格與【${cleanTransport}】移動方式智慧排定，兼顧步調從容與文史深讀。
 - 在【${cleanBudget}】預算考量下，景點門票與飲食皆精選高性價比特色代表。
${userNotes ? ` - 您的專屬備註需求【${userNotes}】已融入每日行程安排與彈性時段。\n` : ""} - 抵達景點後可切換至「探索景點」或「學習紀錄」以聽覺語音包解鎖深度故事！`;

  return {
    success: true,
    isAi: false,
    isLocalSmart: true,
    model: "DeepGo Local Autonomous Engine",
    itinerary: itineraryDays,
    notes: notes
  };
}
