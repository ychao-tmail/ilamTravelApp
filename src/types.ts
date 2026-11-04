export interface MealRecommend {
  type: "lunch" | "dinner" | "dessert" | "snack" | "food";
  name: string;
  dish: string;
  cost: string;
  highlight: string;
  location?: string;
  article?: string;          // 深度美食介紹專文
  audioScript?: string;      // 語音說書朗讀文稿
  tips?: string[];           // 老饕私房吃法/推薦點餐秘笈
  categoryLabel?: string;    // 例如「🥢 傳奇老店」「🏮 夜市必吃」「🍧 古早甜品」
}

export interface Activity {
  time: string;
  title: string;
  cost: string;
  highlight: string;
  theme: string;
  location?: string;
  distanceFromPrevKm?: number;
  travelTimeDesc?: string;
}

export interface DayItinerary {
  dayNum: number;
  areaFocus?: string;         // 當日核心遊歷生活圈/行政區
  dayTotalDistanceKm?: number;// 當日預估總移動里程
  activities: Activity[];
  lodging?: string;           // 每日住宿推薦
  lodgingLocation?: string;   // 住宿導航地址/名稱
  foodRecommend?: string;     // 每日美食推薦 (相容字串)
  lunch?: MealRecommend;      // 專屬午餐推薦小卡
  dinner?: MealRecommend;     // 專屬晚餐/夜市推薦小卡
  meals?: MealRecommend[];    // 一家一張小卡：多間獨立美食小卡清單
}

export interface Spot {
  id: string;
  name: string;
  intro: string;
  location: string;
  region?: string; // 北部, 中部, 南部, 東部, 離島
  county?: string;
  icon: string;
  tags?: string[];
  lat?: number;
  lng?: number;
  distanceKm?: number;
}

export interface PlannerPreferences {
  districts: string[];
  days: number;
  style: string;
  transport: string;
  budget: string;
  userNotes?: string;
}

export interface SavedItinerary {
  id: string;
  title: string;
  days: number;
  regions: string[];
  plan: DayItinerary[];
  createdAt: string;
}
