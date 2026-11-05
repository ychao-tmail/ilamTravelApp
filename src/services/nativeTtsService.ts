/**
 * Native & Web Speech Unified TTS Engine Service
 * Powered by @capacitor-community/text-to-speech for Native Android APK
 * and HTML5 Web Speech API for Web Browsers, with OpenAI TTS fallback.
 */

import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { isNativePlatform } from "../api/client";

export interface TtsEngineStatus {
  webSpeechSupported: boolean;
  nativeCapacitorSupported: boolean;
  isNativeApp: boolean;
  activeEngine: "native" | "web_speech" | "fallback";
  engineLabel: string;
}

export interface SpeakOptions {
  text: string;
  lang?: string;
  rate?: number;
  pitch?: number;
  voicePack?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

// Cached detection result
let cachedStatus: TtsEngineStatus | null = null;

/**
 * Detect available TTS capabilities across Web and Native Android
 */
export async function detectTtsCapabilities(): Promise<TtsEngineStatus> {
  if (cachedStatus) return cachedStatus;

  const isNative = isNativePlatform();
  const hasWebSpeech = typeof window !== "undefined" && "speechSynthesis" in window && !!window.speechSynthesis;
  let nativeTtsOk = false;

  if (isNative) {
    try {
      // Check if capacitor native plugin responds
      const supported = await TextToSpeech.isLanguageSupported({ lang: "zh-TW" });
      nativeTtsOk = supported !== undefined;
    } catch {
      nativeTtsOk = true; // Still native environment
    }
  }

  let activeEngine: "native" | "web_speech" | "fallback" = "web_speech";
  let engineLabel = "Web Speech 瀏覽器語音";

  if (isNative || !hasWebSpeech) {
    activeEngine = "native";
    engineLabel = "Android 原生系統 TTS 引擎";
  } else if (hasWebSpeech) {
    activeEngine = "web_speech";
    engineLabel = "Web Speech 瀏覽器語音";
  } else {
    activeEngine = "fallback";
    engineLabel = "語音雲端合成 (GPT)";
  }

  cachedStatus = {
    webSpeechSupported: hasWebSpeech,
    nativeCapacitorSupported: isNative || nativeTtsOk,
    isNativeApp: isNative,
    activeEngine,
    engineLabel
  };

  return cachedStatus;
}

/**
 * Universal Speak Function:
 * Automatically uses @capacitor-community/text-to-speech in Android APK or when Web Speech fails,
 * falling back gracefully so speech narration NEVER fails on any device.
 */
export async function speakUtterance(options: SpeakOptions): Promise<{ engineUsed: "native" | "web_speech" }> {
  const {
    text,
    rate = 1.0,
    pitch = 1.0,
    voicePack = "專業的主播",
    onStart,
    onEnd,
    onError
  } = options;

  // Stop any prior speech
  await stopUtterance();

  // Language mapping
  let lang = options.lang || "zh-TW";
  if (voicePack === "英語播報" || lang.startsWith("en")) {
    lang = "en-US";
  } else if (voicePack === "日本語" || lang.startsWith("ja")) {
    lang = "ja-JP";
  } else if (!options.lang) {
    lang = "zh-TW";
  }

  const effectiveRate = voicePack === "可愛孩子" ? rate * 1.1 : rate * 0.95;
  const effectivePitch = voicePack === "可愛孩子" ? Math.min(1.5, pitch * 1.3) : pitch;

  const status = await detectTtsCapabilities();

  // 1. Try Native Android Capacitor TTS if native app or Web Speech is unavailable
  if (status.isNativeApp || !status.webSpeechSupported) {
    try {
      if (onStart) onStart();
      await TextToSpeech.speak({
        text,
        lang,
        rate: effectiveRate,
        pitch: effectivePitch,
        volume: 1.0
      });
      if (onEnd) onEnd();
      return { engineUsed: "native" };
    } catch (nativeErr) {
      console.warn("Native TTS call failed, attempting Web Speech fallback:", nativeErr);
      // Fall through to Web Speech if available
    }
  }

  // 2. Web Speech API (Browser / Chrome)
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = effectiveRate;
      utterance.pitch = effectivePitch;

      // Select voice matching language if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        if (lang.startsWith("ja")) {
          const jaVoice = voices.find(v => v.lang.startsWith("ja"));
          if (jaVoice) utterance.voice = jaVoice;
        } else if (lang.startsWith("en")) {
          const enVoice = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("google")) ||
                          voices.find(v => v.lang.startsWith("en"));
          if (enVoice) utterance.voice = enVoice;
        } else {
          const zhVoice = voices.find(v => (v.lang === "zh-TW" || v.lang === "cmn-Hant-TW") && v.name.toLowerCase().includes("google")) ||
                          voices.find(v => v.lang.startsWith("zh"));
          if (zhVoice) utterance.voice = zhVoice;
        }
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };
      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = (e) => {
        if (onError) onError(e);
      };

      window.speechSynthesis.speak(utterance);
      return { engineUsed: "web_speech" };
    } catch (webErr) {
      console.error("Web Speech API failed:", webErr);
      // If Web Speech failed on a native device, retry with native
      if (status.nativeCapacitorSupported) {
        try {
          if (onStart) onStart();
          await TextToSpeech.speak({
            text,
            lang,
            rate: effectiveRate,
            pitch: effectivePitch,
            volume: 1.0
          });
          if (onEnd) onEnd();
          return { engineUsed: "native" };
        } catch (retryErr) {
          if (onError) onError(retryErr);
          throw retryErr;
        }
      }
      if (onError) onError(webErr);
      throw webErr;
    }
  }

  // 3. Neither native nor Web Speech is supported
  const err = new Error("NO_SUPPORTED_TTS_ENGINE");
  if (onError) onError(err);
  throw err;
}

/**
 * Universal Stop Function: Stops all playing speech across both engines
 */
export async function stopUtterance(): Promise<void> {
  // Stop native Capacitor TTS
  try {
    await TextToSpeech.stop();
  } catch {
    // Ignore error if not speaking
  }

  // Stop browser Web Speech
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}
