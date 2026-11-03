/**
 * OpenAI GPT Client Service for DeepGo Taiwan
 * Provides direct OpenAI API integration for:
 * 1. Story & Voice Script Generation (GPT-4o / GPT-4o-mini)
 * 2. Itinerary Planning with JSON schema output
 * 
 * Works in both:
 * - Native Mobile Capacitor APK (client-direct with API key)
 * - Web Browser environment
 */

import { GuidedStoryRequest, GuidedStoryResponse, ItineraryPlanRequest, ItineraryPlanResponse } from "../api/client";

// Storage keys
const OPENAI_API_KEY_STORAGE = "deepgo_openai_api_key";
const OPENAI_MODEL_STORAGE = "deepgo_openai_model";
const AI_ENGINE_STORAGE = "deepgo_ai_engine"; // 'gpt' | 'gemini' | 'local'

export function getOpenAIApiKey(): string {
  if (typeof window === "undefined") {
    return process.env.OPENAI_API_KEY || "";
  }
  const stored = localStorage.getItem(OPENAI_API_KEY_STORAGE);
  if (stored && stored.trim()) {
    return stored.trim();
  }
  const envKey = (import.meta as any).env?.VITE_OPENAI_API_KEY;
  if (envKey && envKey.trim()) {
    return envKey.trim();
  }
  return "";
}

export function setOpenAIApiKey(key: string | null) {
  if (typeof window === "undefined") return;
  if (!key || !key.trim()) {
    localStorage.removeItem(OPENAI_API_KEY_STORAGE);
  } else {
    localStorage.setItem(OPENAI_API_KEY_STORAGE, key.trim());
  }
}

export function getSelectedOpenAIModel(): string {
  if (typeof window === "undefined") return "gpt-4o-mini";
  return localStorage.getItem(OPENAI_MODEL_STORAGE) || "gpt-4o-mini";
}

export function setSelectedOpenAIModel(model: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(OPENAI_MODEL_STORAGE, model);
}

export function getSelectedAiEngine(): "gpt" | "gemini" | "local" {
  if (typeof window === "undefined") return "gemini";
  return (localStorage.getItem(AI_ENGINE_STORAGE) as any) || "gemini";
}

export function setSelectedAiEngine(engine: "gpt" | "gemini" | "local") {
  if (typeof window === "undefined") return;
  localStorage.setItem(AI_ENGINE_STORAGE, engine);
}

// Test OpenAI Connection
export async function testOpenAIConnection(key?: string): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const activeKey = key?.trim() || getOpenAIApiKey();
  if (!activeKey) {
    return { ok: false, latencyMs: 0, error: "未設定 OpenAI API Key" };
  }

  const start = performance.now();
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${activeKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "hi" }],
        max_tokens: 5
      })
    });

    const latencyMs = Math.round(performance.now() - start);

    if (res.ok) {
      return { ok: true, latencyMs };
    } else {
      const errJson = await res.json().catch(() => ({}));
      const msg = errJson?.error?.message || `HTTP ${res.status}`;
      return { ok: false, latencyMs, error: msg };
    }
  } catch (e: any) {
    const latencyMs = Math.round(performance.now() - start);
    return { ok: false, latencyMs, error: e?.message || "網路連線失敗" };
  }
}

// Generate Guided Story with GPT
export async function generateGptGuidedStory(params: GuidedStoryRequest): Promise<GuidedStoryResponse> {
  const apiKey = getOpenAIApiKey();
  const model = getSelectedOpenAIModel();

  const targetSpot = params.spotName || "台灣景點";
  const targetTheme = params.theme || "歷史背景";
  const lStyle = params.lengthStyle || "中等";
  const vStyle = params.voiceStyle || "經典";
  const vTone = params.voiceTone || "專業的主播";

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

  const systemInstruction = `你是一位對全台灣各縣市（台北、新北、基隆、桃園、新竹、苗栗、台中、彰化、南投、雲林、嘉義、台南、高雄、屏東、宜蘭、花蓮、台東、澎湖、金門、馬祖）文史風土、建築美學與常民飲食聊若指掌的頂尖台灣深度導覽與說書大師。你擅長精準根據長度 (${lStyle})、風格 (${vStyle}) 與語音包 (${vTone}) 輸出富含真實歷史細節、文化溫度、現場感的導覽解說。`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1200
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `OpenAI API returned HTTP ${res.status}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim() || "";

  if (!text) {
    throw new Error("OpenAI returned empty text");
  }

  return {
    success: true,
    isAi: true,
    model: `OpenAI ${model}`,
    text: text,
    lengthStyle: lStyle,
    voiceStyle: vStyle,
    voiceTone: vTone
  };
}

// Generate Itinerary with GPT
export async function generateGptItineraryPlan(params: ItineraryPlanRequest): Promise<ItineraryPlanResponse> {
  const apiKey = getOpenAIApiKey();
  const model = getSelectedOpenAIModel();

  const numDays = Number(params.days) || 3;
  const targetCounty = params.county || "台灣 - 台北市";
  const targetDistricts = params.districts && params.districts.length > 0 
    ? params.districts 
    : ["代表性人文古蹟", "在地文創園區", "知名夜市美食"];

  const prompt = `請為我規劃一份【${targetCounty}】自由行深度旅遊行程表，詳情如下：
- 想去的地區或自定義景點名稱：${targetDistricts.join("、")}
- 旅遊天數：共 ${numDays} 天
- 團隊風格：${params.style || "🌲 自然生態"}
- 交通方式：${params.transport || "🚗 汽車"}
- 預算模式：${params.budget || "💰 省錢"}
- 導覽長度偏好：${params.guideLength || "中等"}
- 表達風格偏好：${params.expressStyle || "經典"}
- 聽覺配音設定：${params.voicePack || "專業的主播"}${params.userNotes ? `\n- 旅客特別備註/需求：${params.userNotes}` : ""}

請輸出合法的純 JSON 格式（不要使用 \`\`\`json 標記，直接輸出以 { 開始的 JSON 字串），必須嚴格符合以下結構：
{
  "days": [
    {
      "dayNum": 1,
      "lodging": "推薦當天晚上在該目的地落腳的地方特色民宿、設計客棧或飯店名稱與簡短推薦理由",
      "foodRecommend": "推薦今日的 2~3 樣目的地必吃特色美食或在地名產推薦",
      "activities": [
        {
          "time": "時間點 (例如 '10:00')",
          "title": "景點名稱",
          "cost": "預估花費 (例如 '門票 $150' 或 '免費')",
          "highlight": "一句話導覽亮點，寫明景點歷史/人文背景/建築特色亮點故事簡述",
          "theme": "最推薦用什麼導覽主題解鎖 (必須是 '歷史背景'、'建築特色' 或 '在地飲食' 其中之一)"
        }
      ]
    }
  ]
}

注意事項：
1. 每天上午推薦1~2個景點，下午1~2個景點，夜晚推薦合適的夜市、景觀台或特色商圈。
2. 住宿點、美食推薦應貼合風格【${params.style}】與預算【${params.budget}】。
3. 景點故事亮點 (highlight) 的文筆風格應配合【${params.expressStyle || "經典"}】。全程繁體中文輸出。`;

  const systemInstruction = `你是一位對全台灣各縣市（包含台北、新北、基隆、桃園、新竹、苗栗、台中、彰化、南投、雲林、嘉義、台南、高雄、屏東、宜蘭、花蓮、台東、澎湖、金門、馬祖）聊若指掌的頂尖台灣深度導覽與旅程排程專家。你擅長輸出格式標準、無多餘雜質的合法 JSON 資料。`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2500
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `OpenAI API returned HTTP ${res.status}`);
  }

  const data = await res.json();
  const rawContent = data?.choices?.[0]?.message?.content?.trim() || "";

  let parsed: any;
  try {
    parsed = JSON.parse(rawContent);
  } catch (e) {
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("無法解析 OpenAI 回傳的 JSON 行程資料");
    }
  }

  const daysArray = parsed.days || parsed.itinerary || [];

  const notes = `💡 行前溫馨小秘笈（OpenAI ${model} 智慧客製）：
- 本行程依據您的【${params.style}】出遊偏好與【${params.transport}】交通方式為您專屬訂製。
- 已為您串聯【${targetCounty}】${targetDistricts.join("、")}的深度文史與空間景點。
- 點擊「我的行程」分頁可隨時查閱每日細部規劃、預估花費與解鎖深度語音說書詞！${params.userNotes ? `\n📌 特別需求備註：${params.userNotes}` : ""}`;

  return {
    success: true,
    isAi: true,
    model: `OpenAI ${model}`,
    itinerary: daysArray,
    notes: notes
  };
}
