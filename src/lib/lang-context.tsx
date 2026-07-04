// ─── VidyaSetu Live Language Context ─────────────────────────────────────────
// Global React context for language state shared across all dashboards

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { LangCode } from "./i18n";
import { t as translate, type Translations } from "./i18n";

interface LangContextValue {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: keyof Translations) => string;
}

export const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => translate("en", key),
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    try {
      const storedStats = localStorage.getItem("vs_live_stats");
      if (storedStats) {
        const statsObj = JSON.parse(storedStats);
        if (statsObj.languageCode) {
          return statsObj.languageCode as LangCode;
        }
      }
      return (localStorage.getItem("vs_lang") as LangCode) || "en";
    } catch {
      return "en";
    }
  });

  const setLang = (l: LangCode) => {
    setLangState(l);
    try {
      localStorage.setItem("vs_lang", l);
      const storedStats = localStorage.getItem("vs_live_stats");
      if (storedStats) {
        const statsObj = JSON.parse(storedStats);
        statsObj.languageCode = l;
        localStorage.setItem("vs_live_stats", JSON.stringify(statsObj));
      }
    } catch {}
  };

  const tFn = (key: keyof Translations) => translate(lang, key);

  return (
    <LangContext.Provider value={{ lang, setLang, t: tFn }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
