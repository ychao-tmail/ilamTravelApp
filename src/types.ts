export interface Activity {
  time: string;
  title: string;
  cost: string;
  highlight: string;
  theme: string;
}

export interface DayItinerary {
  dayNum: number;
  activities: Activity[];
  lodging?: string;      // 每日住宿推薦
  foodRecommend?: string; // 每日美食推薦
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
