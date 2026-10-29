/**
 * Centralized API Client for DeepGo Taiwan
 * Supports Web preview & Capacitor Android APK environments.
 * Dual-Mode Resilience: Attempts cloud AI backend with timeout, seamlessly falling back
 * to local autonomous engine so mobile APK works 100% reliably anywhere, anytime.
 */

import { generateLocalSmartItinerary, PlannerParams } from "../services/localPlannerEngine";
import { resolveSpotStory } from "../data/taiwanStories";

// Production / Cloud Run service fallback URL
export const DEFAULT_CLOUD_BACKEND_URL = "https://ais-dev-4c77ogdycvrhx7f7azn4an-369482150771.asia-east1.run.app";

export function isNativePlatform(): boolean {
  if (typeof window === "undefined") return false;
  const isCapacitorScheme = window.location.protocol === "capacitor:" || window.location.protocol === "ionic:";
  const isLocalhostOrigin = window.location.hostname === "localhost" && window.location.port === "";
  return isCapacitorScheme || isLocalhostOrigin;
}

export function getApiBaseUrl(): string {
  if (typeof window === "undefined") return "";

  // 1. User manual override from App settings
  const customOverride = localStorage.getItem("deepgo_custom_api_url");
  if (customOverride && customOverride.trim()) {
    return customOverride.trim().replace(/\/+$/, "");
  }

  // 2. Environment variable injected at build/runtime
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  // 3. If running inside Capacitor APK on mobile and user has set a custom URL
  // If no custom URL is configured, return empty to prevent hanging on unreachable cloud endpoints
  if (isNativePlatform()) {
    return customOverride ? customOverride.trim().replace(/\/+$/, "") : "";
  }

  // 4. Default in Web preview mode: use relative URL to current origin
  return "";
}

export interface GuidedStoryRequest {
  spotName: string;
  theme: string;
  lengthStyle?: string;
  voiceStyle?: string;
  voiceTone?: string;
}

export interface GuidedStoryResponse {
  success: boolean;
  isAi: boolean;
  model?: string;
  text: string;
  lengthStyle: string;
  voiceStyle: string;
  voiceTone: string;
}

export interface ItineraryPlanRequest {
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

export interface ItineraryPlanResponse {
  success: boolean;
  isAi: boolean;
  isLocalSmart?: boolean;
  model?: string;
  itinerary: any[];
  notes: string;
}

// Timeout fetch wrapper (defaults to 4500ms)
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 4500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export const apiClient = {
  getBaseUrl: getApiBaseUrl,

  setCustomBaseUrl(url: string | null) {
    if (!url || !url.trim()) {
      localStorage.removeItem("deepgo_custom_api_url");
    } else {
      localStorage.setItem("deepgo_custom_api_url", url.trim());
    }
  },

  async checkServerHealth(): Promise<{ ok: boolean; url: string; latencyMs: number; error?: string }> {
    const baseUrl = getApiBaseUrl();
    
    // In native mobile APK without custom server, local autonomous engine is active
    if (isNativePlatform() && !baseUrl) {
      return {
        ok: true,
        url: "DeepGo 離線原生智慧引擎（無須連網）",
        latencyMs: 1
      };
    }

    const targetUrl = `${baseUrl || ""}/api/guided-story`;
    const start = performance.now();
    try {
      const res = await fetchWithTimeout(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spotName: "連線測試",
          theme: "歷史背景",
          lengthStyle: "簡潔",
          voiceStyle: "經典",
          voiceTone: "專業的主播"
        })
      }, 3500);
      const latencyMs = Math.round(performance.now() - start);
      return { ok: res.ok, url: baseUrl || window.location.origin, latencyMs };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      return {
        ok: false,
        url: baseUrl || window.location.origin,
        latencyMs,
        error: isNativePlatform() ? "未連接自訂雲端伺服器，已啟用離線本機原生智慧引擎" : (err?.message || "無法連線至雲端伺服器")
      };
    }
  },

  async generateGuidedStory(params: GuidedStoryRequest): Promise<GuidedStoryResponse> {
    const baseUrl = getApiBaseUrl();

    // If a cloud backend is available (web preview or custom URL set), try it first with timeout
    if (baseUrl || !isNativePlatform()) {
      try {
        const endpoint = `${baseUrl || ""}/api/guided-story`;
        const response = await fetchWithTimeout(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params)
        }, 5000);

        if (response.ok) {
          const json = await response.json();
          if (json && json.text) {
            return json;
          }
        }
      } catch (e) {
        console.warn("Cloud guided story call timed out or failed, switching to local verified story:", e);
      }
    }

    // High-fidelity fallback preserving verified authentic content and requested voice styles
    const targetSpot = params.spotName || "台灣景點";
    const targetTheme = params.theme || "歷史背景";
    const lStyle = params.lengthStyle || "中等";
    const vStyle = params.voiceStyle || "經典";
    const vTone = params.voiceTone || "專業的主播";

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

    let styledText = baseContent;
    if (vTone === "英語播報") {
      styledText = `Welcome to explore ${targetSpot} in Taiwan! Authentic in-depth story on "${targetTheme}":\n\n${baseContent}\n\nEnjoy the rich culture and heritage!`;
    } else if (vStyle === "幽默") {
      styledText = `💥 各位客官坐好囉！聽我來扒一扒【${targetSpot}】的精彩身世！關於這裡的【${targetTheme}】：\n\n${baseContent}\n\n這才叫真真正正的深度台灣漫遊！`;
    } else if (vStyle === "教學") {
      styledText = `🎓 各位旅客，請翻開台灣風土人文講義。今天在【${targetSpot}】，我們特別講授其【${targetTheme}】：\n\n${baseContent}\n\n請大家在現場特別留意其空間構造、歷史脈絡與生活細節。`;
    } else if (vTone === "可愛孩子") {
      styledText = `👶 哇！大哥哥大姊姊快看！這裡就是【${targetSpot}】唷！\n\n${baseContent}\n\n是不是超級神奇？我們一起去探險吧！`;
    }

    if (lStyle === "簡潔" && styledText.length > 160) {
      styledText = styledText.slice(0, 150) + "...（以上為精華摘要）";
    }

    return {
      success: true,
      isAi: false,
      text: styledText,
      lengthStyle: lStyle,
      voiceStyle: vStyle,
      voiceTone: vTone
    };
  },

  async generateItineraryPlan(params: ItineraryPlanRequest): Promise<ItineraryPlanResponse> {
    const baseUrl = getApiBaseUrl();

    // If a cloud backend is available (web preview or custom URL set), try it first with timeout
    if (baseUrl || !isNativePlatform()) {
      try {
        const endpoint = `${baseUrl || ""}/api/itinerary-plan`;
        const response = await fetchWithTimeout(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params)
        }, 6000);

        if (response.ok) {
          const json = await response.json();
          if (json && json.success && Array.isArray(json.itinerary)) {
            return json;
          }
        }
      } catch (e) {
        console.warn("Cloud itinerary call timed out or failed, switching to local autonomous planner engine:", e);
      }
    }

    // Seamless autonomous fallback engine (guarantees itinerary generation in offline APK!)
    const localResult = generateLocalSmartItinerary({
      county: params.county,
      districts: params.districts,
      days: params.days,
      style: params.style,
      transport: params.transport,
      budget: params.budget,
      userNotes: params.userNotes,
      guideLength: params.guideLength,
      expressStyle: params.expressStyle,
      voicePack: params.voicePack
    });

    return {
      success: true,
      isAi: false,
      isLocalSmart: true,
      model: "DeepGo Local Autonomous Engine",
      itinerary: localResult.itinerary,
      notes: `${localResult.notes}\n(✨ 已啟用深旅離線原生智慧引擎，無需連網隨時隨地秒開完整排程！)`
    };
  }
};
