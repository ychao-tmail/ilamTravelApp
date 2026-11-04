/**
 * Comprehensive Taiwanese Culinary Stories & Food Database
 * Provides structured individual food cards, precise navigation addresses,
 * rich cultural history articles, and audio guide scripts.
 */

import { MealRecommend, DayItinerary } from "../types";

export interface FoodStoryItem {
  id: string;
  name: string;
  aliases: string[];
  type: "lunch" | "dinner" | "snack" | "dessert" | "food";
  categoryLabel: string;
  dish: string;
  cost: string;
  location: string;
  county: string;
  highlight: string;
  article: string;
  audioScript: string;
  tips: string[];
}

export const TAIWAN_FOOD_STORIES: FoodStoryItem[] = [
  // ===== 宜蘭縣 (Yilan) =====
  {
    id: "food_yilan_linchang_rougeng",
    name: "羅東林場肉羹",
    aliases: ["林場肉羹", "羅東肉羹"],
    type: "lunch",
    categoryLabel: "🥢 一甲子林業肉羹傳奇",
    dish: "招牌純肉羹湯、肉羹麵、肉捲、特調五香醋",
    cost: "約 $60 - $100 元",
    location: "宜蘭縣羅東鎮中正北路109號 (羅東林場正對面)",
    county: "宜蘭縣",
    highlight: "創立超過60年，以大骨高湯慢火勾芡，溫體豬後腿肉手切裹粉，伴隨烏醋蒜香熱氣蒸騰。",
    article: `【羅東林場肉羹】一碗熱羹湯，溫熱了百年前太平山林業工人的粗礪歲月。
座落於昔日羅東竹林車站與貯木池正對面，這家老店見證了羅東因檜木而興盛的黃金年代。當年由太平山運送檜木抵達平原的鐵道工人與搬運苦力，清晨出工前體力消耗極大，店家特選每日現宰的新鮮溫體豬後腿肉，切成粗厚肉條，僅裹上極薄的特製地瓜粉，保留純肉扎實彈牙的鮮甜口感。

高湯則以大骨熬煮數小時，加入清甜筍絲以極濃稠的古法勾芡，能長久保溫抗禦蘭陽平原冬日刺骨的濕冷陰雨。端上桌時，肉羹滿溢碗緣，淋上一匙店家精釀的特調五香黑醋與少許白胡椒，酸爽蒜香在舌尖炸裂，這份質樸、豪邁又濃郁的味道，已成為所有宜蘭遊子心中最深層的原鄉記憶。`,
    audioScript: "歡迎來到羅東林場肉羹。這碗熱氣騰騰的肉羹，在羅東林場對面飄香了一甲子。當年太平山伐木工人清晨開工前，一定要來這裡喝上一碗濃濃的肉羹湯暖胃補體力。純後腿肉手切扎實，裹上薄粉滑嫩彈牙，記得一定要淋上一匙店家特調的烏醋與胡椒粉，這就是最道地的宜蘭古早味！",
    tips: [
      "老饕吃法：桌上的特製五香烏醋與辣椒醬是靈魂，各加一匙更能帶出肉羹鮮甜。",
      "假日用餐人潮眾多，建議提早於上午 10:30 前或下午 14:00 後造訪免久候。",
      "吃完肉羹可漫步至正對面羅東林業文化園區，走讀昔日貯木池木棧道。"
    ]
  },
  {
    id: "food_yilan_azao_lamb",
    name: "阿灶伯當歸羊肉湯",
    aliases: ["阿灶伯", "阿灶伯當歸羊肉", "當歸羊肉湯"],
    type: "dinner",
    categoryLabel: "🏮 羅東夜市排隊霸主",
    dish: "招牌當歸羊肉湯、沙茶羊肉炒麵、黃金脆皮臭豆腐",
    cost: "約 $90 - $180 元",
    location: "宜蘭縣羅東鎮民權路 (羅東夜市第1094號攤位)",
    county: "宜蘭縣",
    highlight: "滿溢整碗的厚切嫩羊肉片，中藥當歸枸杞古法溫補清甜，搭配甘醇自製辣腐乳醬。",
    article: `【阿灶伯當歸羊肉湯】無論盛夏或寒冬，羅東夜市裡永遠大排長龍的傳奇地標。
阿灶伯之所以能在美食雲集的羅東夜市傲視群雄，關鍵在於對中藥湯頭與肉質溫度的精準掌控。店家精選多味天然中藥材與大骨細火慢燉，熬出清澈不油膩、回甘帶有淡淡當歸芳香的琥珀色高湯，完全沒有一般人畏懼的羶味。

點餐後，師傅以滾燙高湯即時汆燙鮮嫩羊肉片，鋪滿整碗幾乎看不到底下的湯，分量極度慷慨。羊肉軟嫩多汁帶有膠質彈性，沾上特製的甘甜辣腐乳沾醬，再配上一盤炸得外層金黃香酥、內裡水嫩如布丁的自製臭豆腐與酸甜泡菜，堪稱台灣夜市溫補小吃的巔峰之作。`,
    audioScript: "來到羅東夜市，如果沒吃過阿灶伯，等於沒來過羅東！阿灶伯以中藥材與大骨熬出的當歸湯頭，甘甜清亮、毫無腥羶。滿滿一整碗的嫩羊肉片，沾上特調辣腐乳醬，再配上一盤金黃酥脆的臭豆腐，這份溫暖的滋味，每年吸引百萬饕客千里迢迢前來朝聖。",
    tips: [
      "建議搭配招牌沙茶羊肉炒麵或麵線，香濃沙茶醬汁裹覆細麵極具飽足感。",
      "排隊人潮常橫跨夜市通道，外帶專用隊伍速度較快，亦可考慮外帶至夜市廣場享用。"
    ]
  },
  {
    id: "food_yilan_wei_baoxin",
    name: "魏姐包心粉圓",
    aliases: ["魏姐", "包心粉圓", "晶圓包心粉圓"],
    type: "dessert",
    categoryLabel: "🍧 宜蘭原創甜品名產",
    dish: "包心布丁綜合豆花、包心芝麻粉圓焦糖雪沙、熱桂圓紫米燒",
    cost: "約 $55 - $80 元",
    location: "宜蘭縣羅東鎮公正路206號 (羅東夜市商圈)",
    county: "宜蘭縣",
    highlight: "全台獨創將飽滿萬丹紅豆包裹於特製木薯粉圓中，熱騰騰軟糯粉圓遇上沁涼綿密豆花。",
    article: `【魏姐包心粉圓】宜蘭原創冷熱交織的甜蜜發明。
過去傳統粉圓多為實心黑糖珍珠，1991年創辦人經過無數次研發試驗，突破工法限制，成功將整粒煮透的飽滿紅豆包裹在晶瑩剔透的地瓜木薯粉圓中，成就了「咬破Q彈外皮、迸出綿密紅豆沙」的驚艷口感。

品嚐包心粉圓有一道嚴格的經典儀式：粉圓出鍋時始終保持微熱溫潤狀態，獨立盛裝。食用時不要一次全倒進冰品，而是以小勺分次將溫熱的包心粉圓舀入特製焦糖冰沙與有機鹽滷手工豆花中。熱粉圓的軟糯遇上冰沙的脆爽，在口中激盪出冰火交融的絕妙多重層次。`,
    audioScript: "吃過羅東的包心粉圓嗎？創辦人別出心裁將一整顆飽滿紅豆包進Q彈的木薯粉圓裡，創造出獨步全台的口感。吃的時候記得分批把溫熱的粉圓舀進冰涼豆花裡，一冷一熱在口中交融，是宜蘭夜市散步最完美的甜點句點。",
    tips: [
      "不可將熱粉圓一次整碗倒入冰沙，否則粉圓遇冷易迅速變硬；分次舀取口感最佳。",
      "冬季推薦「包心桂圓紫米熱湯」，暖胃養顏且甜而不膩。"
    ]
  },
  {
    id: "food_yilan_sanxing_scallion_cake",
    name: "義豐蔥油派與三星蔥多餅",
    aliases: ["三星蔥多餅", "義豐蔥油派", "蔥油餅", "三星蔥油餅"],
    type: "snack",
    categoryLabel: "🌱 蘭陽地寶三星蔥手作",
    dish: "現煎黃金千層蔥油派、爆漿三星蔥肉多餅、手作蔥香捲餅",
    cost: "約 $40 - $65 元",
    location: "宜蘭縣羅東鎮民生路130號 (羅東夜市口)",
    county: "宜蘭縣",
    highlight: "每日產地直送頂級三星青蔥，多層次螺旋手擀酥皮，高溫半煎炸出滿口蔥甜湯汁。",
    article: `【義豐蔥油派與三星蔥多餅】蘭陽平原肥沃土壤孕育出的綠金盛宴。
宜蘭三星鄉地處蘭陽溪上游，擁有雪山山脈純淨天然湧泉與日夜溫差大的微型氣候，種植出的三星蔥蔥白特長、肉質厚嫩且多汁無辛嗆感。

羅東老字號蔥油派堅持每日早晨自農場直送現採青蔥，師傅以傳統燙麵法反覆揉捏麵糰，包入堆疊如小山的切段青蔥與特調豬油黑胡椒香料。以半煎半炸方式在厚鐵板上慢火翻煎，金黃表皮層層酥脆如千層派，咬開瞬間，鮮甜爆汁的蔥香熱氣撲鼻而來，是遊歷宜蘭絕不可錯過的在地真味。`,
    audioScript: "宜蘭的三星蔥因為水質清甜、氣候濕潤，蔥白特別長而且甜美多汁。這家蔥油派將滿滿新鮮三星蔥包進千層手擀麵皮中，外皮煎到金黃酥脆，一口咬下滿口都是清甜蔥汁，每一口都是蘭陽土地的自然餽贈！",
    tips: [
      "剛出鍋時內部蔥汁非常滾燙，建議先咬一小口散熱後再細品。",
      "加一顆現煎半熟土雞蛋，蛋黃濃稠與蔥香結合風味倍增。"
    ]
  },

  // ===== 台北市 (Taipei) =====
  {
    id: "food_tpe_linhefa",
    name: "永樂市場林合發油飯店",
    aliases: ["林合發油飯", "林合發", "永樂市場油飯"],
    type: "lunch",
    categoryLabel: "🥢 百年大稻埕國寶油飯",
    dish: "百年古法麻油香菇肉絲油飯、酥炸大雞腿、滷鴨蛋",
    cost: "約 $70 - $140 元",
    location: "台北市大同區迪化街一段21號 (永樂市場1樓1441號攤位)",
    county: "台北市",
    highlight: "創立於清光緒20年（1894年），精選台灣長糯米以黑麻油純古法木甑炊蒸，郭台銘彌月油飯首選。",
    article: `【永樂市場林合發油飯】傳承逾130年，台北大稻埕最厚重的人文味覺印記。
創立於清光緒年間，林合發油飯代代堅守極為繁複的純手工古法。挑選存放一年的優質長糯米，以大木甑蒸至粒粒分明透亮，再拌入低溫煸香的上等北港純黑麻油與紅蔥酥。

上層鋪滿以特製醬汁滷透的埔里冬菇、上等黑豬肉絲與蝦米，米粒油亮不膩、黏糯彈牙且越嚼越香。百年來，無論是昔日大稻埕富商名門添丁滿月，乃至當代政商名流，都以提著林合發印有大紅雙喜的油飯盒為最高禮節。`,
    audioScript: "清光緒年間就創立的林合發油飯，是大稻埕的百年傳奇。每粒長糯米都吸飽了純黑麻油與紅蔥頭的香氣，鋪滿爆香的冬菇與黑豬肉絲，口感粒粒分明、Q彈不油膩。這份飄香超過一個世紀的古法滋味，絕對值得您清晨早起排隊！",
    tips: [
      "營業時間自上午 7:30 開始，每日手工限量出鍋，通常中午 12:00 前即全數售罄，務必提早前往。",
      "必點「油飯加滷鴨蛋與大雞腿」，大骨滷汁入味極深。"
    ]
  },
  {
    id: "food_tpe_minle_mifen",
    name: "民樂旗魚米粉湯",
    aliases: ["民樂旗魚米粉", "旗魚米粉", "永樂旗魚米粉"],
    type: "lunch",
    categoryLabel: "🐟 大稻埕碼頭晨光老味",
    dish: "招牌旗魚細米粉湯、現炸紅燒肉（三層/赤肉）、現炸蚵仔、炸魷魚",
    cost: "約 $45 - $120 元",
    location: "台北市大同區民樂街3號 (永樂市場正門旁)",
    county: "台北市",
    highlight: "以大量新鮮旗魚骨慢火熬煮出天然乳白甘甜高湯，爽脆細米粉伴隨現炸紅燒肉，開工必吃。",
    article: `【民樂旗魚米粉湯】大稻埕碼頭勞動生活的最真實縮影。
早年大稻埕碼頭工人天未亮就得搬運茶箱與南北貨，這家位於民樂街轉角的米粉攤，就是苦力們一天的體力源泉。店家以新鮮旗魚肉切塊爆香，再用大量魚骨細火慢燉，熬出泛著油花、鮮甜濃稠的乳白色高湯。

米粉特選吸水性佳的細米粉，久煮不爛依然爽口有勁。再配上一盤現點現炸、外皮紅麴粉酥脆、肉質軟嫩多汁的紅燒肉與金黃炸豆腐，一葷一湯，濃縮了老台北最踏實暖心的市井滋味。`,
    audioScript: "民樂旗魚米粉湯是大稻埕人最溫暖的早餐記憶。旗魚骨熬成的湯頭鮮甜醇厚，搭配清脆細米粉與旗魚肉末。一定要加點一盤外酥內嫩的招牌紅燒肉，沾上甜辣醬，熱氣騰騰下肚，讓人全身充滿精神。",
    tips: [
      "紅燒肉可依個人喜好選擇「三層肉（帶油花軟嫩）」或「赤肉（瘦肉扎實）」。",
      "營業時間僅至中午 12:30，下午不營業。"
    ]
  },
  {
    id: "food_tpe_almond_dew",
    name: "顏記杏仁露與阿伯迪化街冰品",
    aliases: ["顏記杏仁露", "阿伯杏仁露", "迪化街杏仁露"],
    type: "dessert",
    categoryLabel: "🍧 永樂市場甲子和風甜湯",
    dish: "古早味杏仁露、石花凍綠豆湯、紅豆牛奶杏仁冰",
    cost: "約 $45 - $65 元",
    location: "台北市大同區迪化街一段21號 (永樂市場1樓大門側)",
    county: "台北市",
    highlight: "傳承日治時期天然石花菜提煉的晶瑩杏仁豆腐凍，澆上古法慢火熬煮的二砂糖水與碎冰。",
    article: `【顏記杏仁露】漫步迪化街歷史風華時最沁人心脾的清雅滋味。
創立於民國初年，店家堅持不添加人工香精防腐劑，採用天然野生石花菜熬煮成天然果凍膠質，加入純南杏仁研磨提煉，冷卻凝結成如白玉般滑溜細嫩的杏仁露。

盛碗時，以鐵勺俐落切塊，鋪上一匙熬得綿密透爛的紅豆或綠豆，舀入厚厚一層碎冰，最後淋上焦香清甜的黃金砂糖水。入口滑潤甘涼，淡淡杏仁幽香在喉頭漫開，生津止渴，是老台北人夏日午後最難以割捨的雅緻時光。`,
    audioScript: "走累了大稻埕，不妨到永樂市場前來一碗顏記杏仁露。用天然石花菜和杏仁古法熬煮的杏仁凍，晶瑩剔透，加入碎冰和糖水，口感清爽不嗆鼻，滿口都是百年商街古雅純淨的滋味。",
    tips: [
      "若不習慣傳統純杏仁味，可點「綠豆露」或「紅豆綠豆雙拼」，口感同樣晶瑩Q脆。"
    ]
  },
  {
    id: "food_tpe_shilin_night_market",
    name: "士林夜市生煎包與十全排骨",
    aliases: ["士林夜市生煎包", "十全排骨", "士林夜市美食"],
    type: "dinner",
    categoryLabel: "🏮 國際觀光夜市代表",
    dish: "大上海生煎包、海友十全藥燉排骨、豪大大雞排、阿輝麵線",
    cost: "約 $150 - $280 元",
    location: "台北市士林區大東路、文林路與基河路 (士林夜市商圈)",
    county: "台北市",
    highlight: "全台知名度最高夜市，米其林必比登推薦四十年老字號藥燉排骨，底部酥脆爆汁生煎包。",
    article: `【士林夜市美饌聚落】台北規模最宏大、歷史最悠久的國際級庶民美食殿堂。
圍繞著香火鼎盛的士林慈诚宮媽祖廟逐步擴張，士林夜市匯集了無數揚名海內外的金字招牌。其中榮獲米其林必比登推介的「海友十全排骨」，以熟地、當歸、黃耆等十五味漢方藥材大鍋細熬數小時，排骨軟爛骨肉分離，深黑色的湯汁散發甘甜溫潤的藥香。

而陽明戲院旁的「大上海生煎包」，麵皮厚實有嚼勁，在平底大油鍋中煎至底層金黃焦脆，包入青蔥鮮肉餡或高麗菜蝦米餡，熱騰騰出鍋時咬開爆出滿口鮮湯，每一攤都承載著台灣庶民飲食文化的極致熱情。`,
    audioScript: "士林夜市是台北夜生活的璀璨明珠！這裡有米其林推薦、熬了四十年的十全藥燉排骨，湯頭溫補甘甜；還有底層煎得金黃酥脆的大上海生煎包，一咬開肉汁四溢。穿梭在人聲鼎沸的街巷中，這就是最熱鬧道地的台灣夜市魅力。",
    tips: [
      "藥燉排骨建議沾取特製豆瓣辣醬食用，肉香層次更為鮮明。",
      "假日人潮自傍晚 18:00 開始湧現，建議搭乘台北捷運至劍潭站1號出口步行抵達。"
    ]
  },

  // ===== 台南市 (Tainan) =====
  {
    id: "food_tnn_beef_soup",
    name: "文章牛肉湯 (安平旗艦店)",
    aliases: ["文章牛肉湯", "台南牛肉湯", "六千牛肉湯"],
    type: "lunch",
    categoryLabel: "🥩 府城現宰溫體牛傳奇",
    dish: "特選新鮮現切溫體牛肉湯、牛肉燥飯、麻油牛心、蔥爆牛舌",
    cost: "約 $120 - $250 元",
    location: "台南市安平區安平路300號",
    county: "台南市",
    highlight: "每日自善化牛墟清晨直送的新鮮溫體黃牛肉，滾燙牛骨蔬果清湯現淋至碗中，粉嫩鮮甜無比。",
    article: `【文章牛肉湯】台南府城享譽全台的味覺代表作。
台南人之所以能獨享現燙溫體牛肉湯，源自鄰近善化擁有台灣最大的肉牛拍賣交易中心。每日清晨與午後，剛宰殺未經冷凍排酸的新鮮溫體牛，以最短時效火速專車送抵安平。

師傅依據牛肉紋理，俐落地以手刀薄切出油花均勻的肉片放入大碗，隨即舀起一勺以牛大骨、牛腩、洋蔥、甘蔗慢火熬製一整夜的高溫滾湯直接衝入碗中。牛肉瞬間由鮮紅轉為極致粉嫩，肉質軟嫩多汁帶有乳香，湯頭清甜回甘，搭配一碗油亮生香的牛肉燥飯，是最震撼靈魂的台南晨光饗宴。`,
    audioScript: "台南的溫體牛肉湯是所有老饕心中的聖殿。文章牛肉湯每天從善化牛墟直送現宰溫體牛肉，師傅將薄切牛肉放入碗中，直接沖入滾燙的大骨蔬菜高湯。肉質粉紅軟嫩，湯頭甘醇鮮甜，配上一碗牛肉燥飯，這口鮮甜保證讓您終生難忘！",
    tips: [
      "牛肉上桌時正處於最完美的5分熟粉紅色，建議立即品嚐避免泡久肉質過熟變硬。",
      "先品嚐原味湯頭的清甜，肉片可沾取少量台南古早味甜油膏與現切薑絲。"
    ]
  },
  {
    id: "food_tnn_zhoushi_shrimp",
    name: "周氏蝦捲 (安平總店)",
    aliases: ["周氏蝦捲", "安平蝦捲", "台南蝦捲"],
    type: "lunch",
    categoryLabel: "🦐 安平海港古早味名產",
    dish: "招牌現炸黃金蝦捲、白北魚羹、古早味肉燥飯、杏仁豆腐",
    cost: "約 $80 - $160 元",
    location: "台南市安平區安平路408-1號",
    county: "台南市",
    highlight: "傳承五十年，嚴選新鮮火燒蝦與黑豬絞肉，以特製豬腹絞油（豬網油）手工包裹酥炸。",
    article: `【周氏蝦捲】台南安平歷史最悠久的國宴級經典小吃。
五十年代由周莊春霖老先生在安平運河旁擺攤起家，原名「明新號」，因品質實在深受在地漁民喜愛。其美味秘密在於選用台灣西南沿海特產、甜度極高的「新鮮火燒蝦」，搭配新鮮魚漿、黑豬絞肉、芹菜與青蔥調和餡料。

最講究的是傳統包覆手法：不用一般春捲皮，而是以天然稀有的豬腹絞網油包裹餡料，沾上特調裹粉後入高溫油鍋翻炸。起鍋後外皮薄脆輕盈毫不油膩，內餡飽滿鮮嫩多汁，佐以特調芥末醬與甜油膏，鹹甜辛香相得益彰。`,
    audioScript: "來到安平老街，一定要嚐嚐周氏蝦捲。嚴選肉質鮮甜的野生火燒蝦，用傳統豬網油手工包捲下鍋現炸。外皮金黃酥脆，內餡蝦肉彈牙多汁，沾上一點芥末醬油膏，五十年的古法好手藝，每一口都是安平港的海味精華。",
    tips: [
      "蝦捲沾醬推薦比例：兩滴甜醬油膏搭配少許現磨綠芥末，微嗆微甜最能提昇海味蝦甜。"
    ]
  },
  {
    id: "food_tnn_tongji_tofu",
    name: "同記安平豆花 (總店)",
    aliases: ["同記安平豆花", "安平豆花", "同記豆花"],
    type: "dessert",
    categoryLabel: "🍧 府城鹽滷黃豆花始祖",
    dish: "傳統白豆花（紅豆/綠豆/珍珠/檸檬）、黑豆豆花、手作粉圓冰",
    cost: "約 $40 - $60 元",
    location: "台南市安平區安北路433號",
    county: "台南市",
    highlight: "創辦人黃慶同挑著扁擔起家，五十載堅持純天然非基改非基因改造黃豆，古法鹽滷凝固，入口即化。",
    article: `【同記安平豆花】純手工凝結出的極致綿密回憶。
1970年創辦人黃慶同夫婦挑著沉重的扁擔木桶，在安平大街小巷穿梭叫賣。同記豆花之所以能聞名全台，在於始終堅持「絕不添加任何石膏或防腐劑」，精選頂級非基改黃豆磨製濃郁豆漿，以古法地瓜粉與天然鹽滷自然點漿凝結。

質地比布丁更細緻柔嫩，放入口中幾乎無須咀嚼便化為甘美豆香。配上以二砂糖慢火炒香後熬製的微焦香甘醇糖水，無論搭配熬至鬆軟的萬丹紅豆、爽口綠豆，或是Q彈無比的小白珍珠，都將傳統台灣甜品的純粹之美展現得淋漓盡致。`,
    audioScript: "走進安平，同記安平豆花是一定要歇腳品嚐的甜點。創辦人當年挑著扁擔叫賣，五十年來堅持古法鹽滷製作，豆花軟嫩到入口即化，伴隨著焦香甘醇的二砂糖水與萬丹紅豆，甜而不膩，充滿老台南最樸實醇厚的人情味。",
    tips: [
      "偏愛清爽風味者，強烈推薦「檸檬白豆花」，微酸微甜在炎熱府城極為消暑解膩。"
    ]
  },

  // ===== 南投縣 (Nantou) =====
  {
    id: "food_ntu_sun_moon_lake_egg",
    name: "日月潭金盆阿嬤阿薩姆香菇茶葉蛋",
    aliases: ["阿嬤香菇茶葉蛋", "玄光寺茶葉蛋", "阿薩姆香菇茶葉蛋", "伊達邵茶葉蛋"],
    type: "snack",
    categoryLabel: "🥚 日月潭水岸世紀香氣",
    dish: "阿薩姆紅玉紅茶香菇茶葉蛋、原民現烤小米香腸、邵族竹筒飯",
    cost: "約 $15 - $60 元",
    location: "南投縣魚池鄉日月村玄光碼頭 / 伊達邵商店街",
    county: "南投縣",
    highlight: "座落玄光碼頭旁，以魚池台茶18號紅玉紅茶葉、在地埔里黑早冬菇與特選漢方中藥慢火慢燉。",
    article: `【日月潭阿薩姆香菇茶葉蛋】湖光山色中飄散超過一甲子的濃郁香氣。
遊客搭船抵達玄光碼頭，未見其店先聞其香。阿嬤自民國40年代起在湖畔擺攤，這顆小小的茶葉蛋之所以成為全台灣最具傳奇色彩的小吃，關鍵在於無可取代的在地風土食材：南投魚池鄉特產的頂級「台茶18號紅玉紅茶」，茶湯自帶肉桂與薄荷甜香；再加上埔里高山段木黑早香菇與私房中藥老滷。

經過數日反覆慢火熬煮與浸泡入味，蛋殼裂出如青花瓷般的美麗紋理，蛋白Q彈入味、蛋黃綿密濕潤帶有淡淡菇香與茶香，一顆入口，唇齒留香。`,
    audioScript: "搭船遊日月潭，絕不能錯過玄光寺碼頭的阿嬤香菇茶葉蛋。用在地頂級的紅玉紅茶，加上埔里黑早香菇與中藥老滷汁慢火熬煮，茶香與菇香完全滲透進蛋黃裡，一剝開香氣四溢，是日月潭湖畔最經典的美食記憶。",
    tips: [
      "剝殼時先輕敲整顆蛋身使碎紋均勻，茶香滷汁滲出時趁熱享用風味最盛。"
    ]
  },

  // ===== 台中市 (Taichung) =====
  {
    id: "food_txg_qingshui_migao",
    name: "清水王塔米糕與阿財米糕",
    aliases: ["清水米糕", "王塔米糕", "阿財米糕"],
    type: "lunch",
    categoryLabel: "🌾 海線傳承九十載糯米香",
    dish: "招牌筒仔米糕（鑲滷三層肉、蚵乾）、乾麵、抄手、鑲肉油豆腐湯",
    cost: "約 $45 - $90 元",
    location: "台中市清水區中興街30-1號 (鄰近高美濕地車程15分鐘)",
    county: "台中市",
    highlight: "台中海線最具代表性傳統小吃，圓糯米填入鋁罐蒸透，鑲入肥瘦勻稱黑豬三層肉與少見甘美蚵乾。",
    article: `【清水王塔米糕】台中海線九十年屹立不搖的米食工藝典範。
創立於1930年代，清水米糕不同於南部油飯或北部筒仔米糕，最大特徵在於獨特的「蚵乾」配料與特製圓糯米。師傅將特選陳年圓糯米浸泡洗淨，依序將大塊黑豬五花肉、紅蔥頭以及沿海日曬的高級蚵乾填入圓筒小罐中，放入檜木蒸籠高溫蒸透。

倒扣出碗時，粒粒晶瑩飽滿的糯米吸足了肉汁與海味海味，鋪上自製辣醬與香菜，鹹香濃郁中帶著一絲甘美，是探訪高美濕地前不可錯過的台中海線經典之最。`,
    audioScript: "前往高美濕地前，一定要先到清水品嚐馳名全台的王塔米糕。圓糯米吸收了五花肉與海風日曬蚵乾的濃郁精華，淋上特調甜辣醬，米粒粒粒分明、軟糯不爛，傳承近百年的好手藝，每一口都是海線最地道的古早滋味。",
    tips: [
      "吃米糕時一定要加一匙台中特製甜辣醬，拌勻後享用最能提味。"
    ]
  }
];

/**
 * Normalizes input name for fuzzy matching
 */
function normalizeName(input: string): string {
  return input
    .replace(/^今日美饌[：:]*/g, "")
    .replace(/^今日特色美食推薦[：:]*/g, "")
    .replace(/^美食推薦[：:]*/g, "")
    .replace(/^🍜|🥢|🏮|🍧|🍽️|🥟|🐟|🍵|🥩|🥚|🌾/g, "")
    .replace(/[（(].*?[）)]/g, "")
    .trim();
}

/**
 * Resolve authentic food story item from local Taiwan food database,
 * or intelligently synthesize a realistic, high-quality culinary article if not cached.
 */
export function resolveFoodStory(rawName: string, countyHint?: string): MealRecommend {
  const clean = normalizeName(rawName);

  // 1. Direct match or alias match
  const matched = TAIWAN_FOOD_STORIES.find((item) => {
    if (clean.includes(item.name) || item.name.includes(clean)) return true;
    return item.aliases.some((alias) => clean.includes(alias) || alias.includes(clean));
  });

  if (matched) {
    return {
      type: matched.type,
      name: matched.name,
      dish: matched.dish,
      cost: matched.cost,
      highlight: matched.highlight,
      location: matched.location,
      article: matched.article,
      audioScript: matched.audioScript,
      tips: matched.tips,
      categoryLabel: matched.categoryLabel
    };
  }

  // 2. Synthesize high-quality authentic food profile
  let categoryLabel = "🥢 在地人氣美饌";
  let dish = "店家招牌私房手作名物";
  let cost = "約 $80 - $180 元";
  let defaultLocation = countyHint ? `${countyHint.replace(/^台灣\s*-\s*/, "")}老街商圈或精華夜市` : "台灣精選美食商圈";

  if (clean.includes("夜市") || clean.includes("攤")) {
    categoryLabel = "🏮 觀光夜市代表";
    dish = "在地人氣排隊小吃群";
  } else if (clean.includes("豆花") || clean.includes("冰") || clean.includes("甜") || clean.includes("露")) {
    categoryLabel = "🍧 傳統古早冰品甜湯";
    cost = "約 $45 - $75 元";
  } else if (clean.includes("肉羹") || clean.includes("湯") || clean.includes("麵") || clean.includes("飯")) {
    categoryLabel = "🍜 世代相傳古早風味";
    cost = "約 $70 - $130 元";
  }

  const generatedArticle = `【${clean}】深植於當地的舌尖記憶與老饕行腳推薦。
座落於當地的生活圈核心，【${clean}】長年堅持古法備料與細緻手藝。精選在地優質農漁產食材，遵循傳統慢火料理精神，呈現出質樸、真誠且層次豐富的經典風貌。

無論是清晨出工前的暖胃溫補，或是午後黃昏街坊鄰里的散步小點，這裡始終保持著熱騰騰的人情味與鼎沸炊煙。走訪現場時，放慢步調品嚐其招牌品項，細細體會台灣在地飲食文化中對食材原味與火候傳承的最高敬意。`;

  const generatedAudio = `歡迎來到【${clean}】。這裡是在地備受喜愛的經典美食，堅持嚴選食材與傳統手藝慢火細做。來到現場，請務必品嚐他們的招牌必吃品項，在熱氣騰騰的香氣中，感受最質樸道地的台灣風土滋味！`;

  return {
    type: "food",
    name: clean,
    dish,
    cost,
    highlight: `嚴選在地食材與傳統老手藝，現點現做熱騰騰出鍋，深受在地人與老饕一致盛讚推薦。`,
    location: defaultLocation,
    article: generatedArticle,
    audioScript: generatedAudio,
    tips: [
      "老饕指南：建議品嚐店家招牌人氣第一名品項，風味最能體現老手藝精華。",
      "熱門時段人潮較多，可稍避開正餐尖峰時段以獲更悠閒的品味體驗。"
    ],
    categoryLabel
  };
}

/**
 * Intelligent Parser:
 * Splits composite/legacy foodRecommend strings or meals into an array of INDIVIDUAL food cards.
 * Guarantees that "一家一張小卡" is strictly enforced for every single day!
 */
export function parseFoodRecommendIntoMealCards(day: DayItinerary, countyHint?: string): MealRecommend[] {
  const cards: MealRecommend[] = [];
  const addedNames = new Set<string>();

  // Helper to add card with deduplication
  const addCard = (meal: MealRecommend) => {
    const norm = normalizeName(meal.name);
    if (!norm || addedNames.has(norm)) return;
    addedNames.add(norm);

    // Enrich with database article if missing
    const enriched = resolveFoodStory(meal.name, countyHint);
    cards.push({
      ...enriched,
      ...meal,
      name: meal.name || enriched.name,
      location: meal.location || enriched.location,
      dish: meal.dish || enriched.dish,
      cost: meal.cost || enriched.cost,
      article: meal.article || enriched.article,
      audioScript: meal.audioScript || enriched.audioScript,
      tips: meal.tips || enriched.tips,
      categoryLabel: meal.categoryLabel || enriched.categoryLabel
    });
  };

  // 1. If explicit meals array already exists, use it
  if (day.meals && Array.isArray(day.meals) && day.meals.length > 0) {
    for (const m of day.meals) {
      addCard(m);
    }
  }

  // 2. Add structured lunch if present
  if (day.lunch) {
    addCard({ ...day.lunch, type: "lunch", categoryLabel: "🥢 在地午餐推薦" });
  }

  // 3. Add structured dinner if present
  if (day.dinner) {
    addCard({ ...day.dinner, type: "dinner", categoryLabel: "🏮 晚餐 / 夜市推薦" });
  }

  // 4. Parse composite foodRecommend string (e.g., "羅東林場肉羹、阿灶伯當歸羊肉湯、魏姐包心粉圓")
  if (day.foodRecommend && typeof day.foodRecommend === "string") {
    let raw = day.foodRecommend.trim();
    // Remove prefix like "今日美饌：" or "🍜"
    raw = raw.replace(/^今日美饌[：:]*/g, "").replace(/^美食推薦[：:]*/g, "").replace(/^🍜|🍽️/g, "").trim();

    // Split on delimiters: '、', ',', '，', '/', '與', '+', '&'
    const segments = raw
      .split(/[、,，/與+&]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const seg of segments) {
      const cleanSeg = normalizeName(seg);
      if (cleanSeg && !addedNames.has(cleanSeg)) {
        const enriched = resolveFoodStory(cleanSeg, countyHint);
        addCard(enriched);
      }
    }
  }

  // Fallback default if completely empty
  if (cards.length === 0) {
    cards.push(resolveFoodStory("在地特色小吃巡禮", countyHint));
  }

  return cards;
}
