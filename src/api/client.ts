/**
 * Centralized API Client for DeepGo Taiwan
 * Supports Web preview & Capacitor Android APK environments.
 * In Web preview, uses relative path `/api/*`.
 * In Native APK, routes to VITE_API_BASE_URL or default Cloud Run deployment.
 */

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

  // 3. If running inside Capacitor APK on mobile, connect to Cloud Run service
  if (isNativePlatform()) {
    return DEFAULT_CLOUD_BACKEND_URL;
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
  model?: string;
  itinerary: any[];
  notes: string;
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
    const targetUrl = `${baseUrl}/api/guided-story`;
    const start = performance.now();
    try {
      // Send a lightweight check probe
      const res = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spotName: "連線測試",
          theme: "歷史背景",
          lengthStyle: "簡潔",
          voiceStyle: "經典",
          voiceTone: "專業的主播"
        })
      });
      const latencyMs = Math.round(performance.now() - start);
      return { ok: res.ok, url: baseUrl || window.location.origin, latencyMs };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      return { ok: false, url: baseUrl || window.location.origin, latencyMs, error: err?.message || "無法連線至伺服器" };
    }
  },

  async generateGuidedStory(params: GuidedStoryRequest): Promise<GuidedStoryResponse> {
    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/api/guided-story`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`API 請求失敗: HTTP ${response.status}`);
    }

    return await response.json();
  },

  async generateItineraryPlan(params: ItineraryPlanRequest): Promise<ItineraryPlanResponse> {
    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/api/itinerary-plan`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`API 請求失敗: HTTP ${response.status}`);
    }

    return await response.json();
  }
};
