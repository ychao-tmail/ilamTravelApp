// Intelligent Location Service for DeepGo Taiwan
// Supports:
// 1. Mobile Network / Cellular IP Geolocation (4G/5G 行動網路基地台/IP定位，無需任何GPS硬體權限，室內外皆可秒速定位)
// 2. Android / Browser Geolocation (Coarse Network provider first, then Fine GPS)
// 3. Taiwan County Boundary Matching (自動對照全台22縣市)
// 4. LocalStorage fast caching for instant startup

export interface DetectedLocation {
  lat: number;
  lng: number;
  name: string;
  countyName: string;
  source: "network" | "gps" | "cache" | "manual";
  accuracyDesc: string;
}

export const TAIWAN_COUNTIES = [
  { name: "基隆市", countyKey: "台灣 - 基隆市", region: "北部", lat: 25.1276, lng: 121.7392 },
  { name: "台北市", countyKey: "台灣 - 台北市", region: "北部", lat: 25.0375, lng: 121.5637 },
  { name: "新北市", countyKey: "台灣 - 新北市", region: "北部", lat: 25.0118, lng: 121.4657 },
  { name: "桃園市", countyKey: "台灣 - 桃園市", region: "北部", lat: 24.9936, lng: 121.3010 },
  { name: "新竹市", countyKey: "台灣 - 新竹縣市", region: "北部", lat: 24.8138, lng: 120.9675 },
  { name: "新竹縣", countyKey: "台灣 - 新竹縣市", region: "北部", lat: 24.8387, lng: 121.0177 },
  { name: "苗栗縣", countyKey: "台灣 - 苗栗縣", region: "中部", lat: 24.5602, lng: 120.8214 },
  { name: "台中市", countyKey: "台灣 - 台中市", region: "中部", lat: 24.1477, lng: 120.6736 },
  { name: "彰化縣", countyKey: "台灣 - 彰化縣", region: "中部", lat: 24.0815, lng: 120.5385 },
  { name: "南投縣", countyKey: "台灣 - 南投縣", region: "中部", lat: 23.9609, lng: 120.9719 },
  { name: "雲林縣", countyKey: "台灣 - 雲林縣", region: "中部", lat: 23.7092, lng: 120.4313 },
  { name: "嘉義市", countyKey: "台灣 - 嘉義縣市", region: "南部", lat: 23.4801, lng: 120.4491 },
  { name: "嘉義縣", countyKey: "台灣 - 嘉義縣市", region: "南部", lat: 23.4518, lng: 120.2559 },
  { name: "台南市", countyKey: "台灣 - 台南市", region: "南部", lat: 22.9997, lng: 120.2270 },
  { name: "高雄市", countyKey: "台灣 - 高雄市", region: "南部", lat: 22.6273, lng: 120.3014 },
  { name: "屏東縣", countyKey: "台灣 - 屏東縣 (含墾丁)", region: "南部", lat: 22.5519, lng: 120.5487 },
  { name: "宜蘭縣", countyKey: "台灣 - 宜蘭縣", region: "東部", lat: 24.7570, lng: 121.7530 },
  { name: "花蓮縣", countyKey: "台灣 - 花蓮縣", region: "東部", lat: 23.9872, lng: 121.6016 },
  { name: "台東縣", countyKey: "台灣 - 台東縣", region: "東部", lat: 22.7583, lng: 121.1444 },
  { name: "澎湖縣", countyKey: "台灣 - 澎湖群島", region: "離島", lat: 23.5712, lng: 119.5793 },
  { name: "金門縣", countyKey: "台灣 - 金門列島", region: "離島", lat: 24.4493, lng: 118.3766 },
  { name: "連江縣", countyKey: "台灣 - 連江馬祖", region: "離島", lat: 26.1557, lng: 119.9396 }
];

export function calcDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Map any lat/lng to the closest Taiwan County
export function findClosestTaiwanCounty(lat: number, lng: number) {
  let closest = TAIWAN_COUNTIES[1]; // default Taipei
  let minDistance = Infinity;

  for (const item of TAIWAN_COUNTIES) {
    const dist = calcDistanceKm(lat, lng, item.lat, item.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = item;
    }
  }

  return { county: closest, distanceKm: minDistance };
}

const CACHE_KEY = "deepgo_user_cached_location";

export function getCachedLocation(): DetectedLocation | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.lat && parsed.lng) {
        return {
          ...parsed,
          source: "cache"
        };
      }
    }
  } catch (e) {
    // Ignore JSON errors
  }
  return null;
}

export function saveCachedLocation(loc: DetectedLocation) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(loc));
  } catch (e) {
    console.warn("Could not save location cache:", e);
  }
}

// 1. Mobile Network / Cellular IP Geolocation (無需GPS硬體權限，行動網路與Wi-Fi即刻秒通)
export async function fetchMobileNetworkLocation(): Promise<DetectedLocation | null> {
  // Try HTTPS ipwho.is first
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch("https://ipwho.is/", { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.latitude && data.longitude) {
        const lat = Number(data.latitude);
        const lng = Number(data.longitude);
        const { county } = findClosestTaiwanCounty(lat, lng);
        const locName = `${county.name}（📶 行動網路基地台）`;

        const result: DetectedLocation = {
          lat,
          lng,
          name: locName,
          countyName: county.name,
          source: "network",
          accuracyDesc: data.city ? `${data.city} · 行動網路` : "行動網路定位"
        };
        saveCachedLocation(result);
        return result;
      }
    }
  } catch (e) {
    // Try fallback
  }

  // Fallback: ip-api.com
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const res = await fetch("http://ip-api.com/json/?fields=status,country,regionName,city,lat,lon", {
      signal: controller.signal
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === "success" && data.lat && data.lon) {
        const lat = Number(data.lat);
        const lng = Number(data.lon);
        const { county } = findClosestTaiwanCounty(lat, lng);
        const locName = `${county.name}（📶 行動網路基地台）`;

        const result: DetectedLocation = {
          lat,
          lng,
          name: locName,
          countyName: county.name,
          source: "network",
          accuracyDesc: data.city ? `${data.city} · 行動網路` : "行動網路定位"
        };
        saveCachedLocation(result);
        return result;
      }
    }
  } catch (e) {
    // Both network IP lookups failed (offline)
  }

  return null;
}

// 2. Hardware / Browser Geolocation
// First tries coarse network location (enableHighAccuracy: false), then falls back or refines
export function fetchDeviceGeolocation(highAccuracy = false): Promise<DetectedLocation> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation not supported by device/environment"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const { county } = findClosestTaiwanCounty(lat, lng);
        const sourceLabel = highAccuracy ? "🛰️ GPS 精準" : "📶 基地台/Wi-Fi";
        const locName = `${county.name}（${sourceLabel}）`;

        const result: DetectedLocation = {
          lat,
          lng,
          name: locName,
          countyName: county.name,
          source: highAccuracy ? "gps" : "network",
          accuracyDesc: `${Math.round(pos.coords.accuracy || 50)} 公尺範圍內`
        };
        saveCachedLocation(result);
        resolve(result);
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: highAccuracy,
        timeout: highAccuracy ? 8000 : 5000,
        maximumAge: 60000
      }
    );
  });
}
