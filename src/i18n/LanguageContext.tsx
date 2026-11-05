/**
 * Language Context & Translation Hook for React
 * Supports instant switching between zh-TW, en, and ja.
 * Includes local AI translation caching for long-form attraction/food articles.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { SupportedLanguage, TranslationDict, TRANSLATIONS } from "./translations";

interface LanguageContextType {
  currentLang: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof TranslationDict, ...args: any[]) => string;
  translateArticle: (text: string, cacheKey: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "deepgo_preferred_lang";
const TRANS_CACHE_PREFIX = "deepgo_trans_cache_";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLangState] = useState<SupportedLanguage>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
      if (saved && (saved === "zh-TW" || saved === "en" || saved === "ja")) {
        return saved;
      }
      // Auto-detect browser language if possible
      const navLang = navigator.language?.toLowerCase() || "";
      if (navLang.startsWith("ja")) return "ja";
      if (navLang.startsWith("en")) return "en";
    }
    return "zh-TW";
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLangState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = currentLang;
    }
  }, [currentLang]);

  // Translation lookup helper with string formatting support
  const t = (key: keyof TranslationDict, ...args: any[]): string => {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS["zh-TW"];
    let text = dict[key] || TRANSLATIONS["zh-TW"][key] || String(key);
    
    if (args && args.length > 0) {
      args.forEach((arg) => {
        text = text.replace(/%[sd]/, String(arg));
      });
    }
    return text;
  };

  /**
   * Translates long-form Chinese stories/articles to target language (en or ja)
   * with automatic persistent local caching in localStorage.
   */
  const translateArticle = async (text: string, cacheKey: string): Promise<string> => {
    if (currentLang === "zh-TW" || !text) {
      return text;
    }

    const fullCacheKey = `${TRANS_CACHE_PREFIX}${currentLang}_${cacheKey}`;
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(fullCacheKey);
      if (cached) {
        return cached;
      }
    }

    // Call robust translation via apiClient (Gemini / OpenAI / Fallback)
    try {
      const { apiClient } = await import("../api/client");
      const translated = await apiClient.translateText(text, currentLang, cacheKey);
      if (translated && translated.trim()) {
        if (typeof window !== "undefined") {
          localStorage.setItem(fullCacheKey, translated);
        }
        return translated;
      }
    } catch (e) {
      console.warn("AI translation call failed, returning original:", e);
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t, translateArticle }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
