// Memory Match Game — flip cards to find matching pairs
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/vidya/confetti";
import { analyzeMemory } from "@/lib/ai-engine";
import { useLang } from "@/lib/lang-context";
import { speakText } from "@/lib/voice-engine";
import { VoiceTutorUi } from "@/components/vidya/voice-tutor-ui";
import type { LangCode } from "@/lib/i18n";

const EMOJI_NAMES: Record<string, Record<LangCode, string>> = {
  "🐘": { en: "Elephant", hi: "हाथी", mr: "हत्ती", gu: "હાથી", ta: "யானை", te: "ఏనుగు", kn: "ಆನೆ" },
  "🦁": { en: "Lion", hi: "शेर", mr: "सिंह", gu: "સિંહ", ta: "சிங்கம்", te: "సింహం", kn: "ಸಿಂಹ" },
  "🐒": { en: "Monkey", hi: "बंदर", mr: "माकड", gu: "વાંદરો", ta: "குரங்கு", te: "కోతి", kn: "ಕೋತಿ" },
  "🦊": { en: "Fox", hi: "लोमड़ी", mr: "कोल्हा", gu: "શિયાળ", ta: "நரி", te: "నక్క", kn: "ನರಿ" },
  "🍎": { en: "Apple", hi: "सेब", mr: "सफरचंद", gu: "સફરજન", ta: "ஆப்பிள்", te: "ఆపిల్", kn: "ಸೇಬು" },
  "🍌": { en: "Banana", hi: "केला", mr: "केळे", gu: "કેળું", ta: "வாழைப்பழம்", te: "అరటిపండు", kn: "ಬಾಳೆಹಣ್ಣು" },
  "🚀": { en: "Rocket", hi: "रॉकेट", mr: "रॉकेट", gu: "રોકેટ", ta: "ராக்கெட்", te: "రాకెట్", kn: "ರಾಕೆಟ್" },
  "⭐": { en: "Star", hi: "तारा", mr: "तारा", gu: "તારો", ta: "நட்சத்திரம்", te: "నక్షత్రం", kn: "ನಕ್ಷತ್ರ" }
};

const CARD_SETS = [
  ["🐘", "🦁", "🐒", "🦊"],
  ["🍎", "🍌", "🚀", "⭐"],
];

const LOCALIZED_INSTRUCTIONS: Record<LangCode, string> = {
  en: "Tap cards to find matching pairs!",
  hi: "जोड़े खोजने के लिए कार्ड पर टैप करें!",
  mr: "जोड्या शोधण्यासाठी कार्डवर टॅप करा!",
  gu: "જોડ શોધવા માટે કાર્ડ્સ પર ટૅપ કરો!",
  ta: "பொருந்தும் ஜோடிகளைக் கண்டறிய கார்டுகளைத் தட்டவும்!",
  kn: "ಹೊಂದುವ ಜೋಡಿಗಳನ್ನು ಹುಡುಕಲು ಕಾರ್ಡ್‌ಗಳನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ!",
  te: "సరిపోలే జంటలను కనుగొనడానికి కార్డ్‌లను నొక్కండి!",
};

const LOCALIZED_MATCH_ANNOUNCEMENTS: Record<LangCode, (name: string) => string> = {
  en: (name) => `Match! That is a ${name}`,
  hi: (name) => `सही जोड़ा! यह एक ${name} है`,
  mr: (name) => `योग्य जोडी! हा ${name} आहे`,
  gu: (name) => `સાચી જોડ! આ એક ${name} છે`,
  ta: (name) => `சரியான ஜோடி! இது ஒரு ${name}`,
  kn: (name) => `ಸರಿಯಾದ ಜೋಡಿ! ಇದು ${name}`,
  te: (name) => `సరైన జంట! ఇది ఒక ${name}`,
};

interface Card { id: number; emoji: string; flipped: boolean; matched: boolean; }

interface MemoryMatchProps {
  onComplete: (stars: number, xp: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildDeck(set: string[]): Card[] {
  return shuffle([...set, ...set]).map((emoji, i) => ({
    id: i, emoji, flipped: false, matched: false,
  }));
}

export function MemoryMatch({ onComplete }: MemoryMatchProps) {
  const { t, lang } = useLang();
  
  // Initial instruction speaking reactive to language change
  useEffect(() => {
    const text = LOCALIZED_INSTRUCTIONS[lang as LangCode] || LOCALIZED_INSTRUCTIONS.en;
    speakText(text, lang as LangCode);
  }, [lang]);

  const [setIndex] = useState(() => Math.floor(Math.random() * CARD_SETS.length));
  const [cards, setCards] = useState<Card[]>(() => buildDeck(CARD_SETS[setIndex]));
  const [selected, setSelected] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [pairsFound, setPairsFound] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [won, setWon] = useState(false);
  const [insight, setInsight] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const totalPairs = CARD_SETS[setIndex].length;

  useEffect(() => {
    if (won) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [won]);

  useEffect(() => {
    if (pairsFound === totalPairs) {
      setWon(true);
      const analysis = analyzeMemory(pairsFound, attempts, seconds);
      setInsight(analysis.insight);
      const stars = attempts <= totalPairs + 2 ? 3 : attempts <= totalPairs + 5 ? 2 : 1;
      onComplete(stars, stars * 20);
    }
  }, [pairsFound, totalPairs, attempts, seconds, onComplete]);

  const flipCard = useCallback((id: number) => {
    if (isChecking) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched || selected.length >= 2) return;

    const newSelected = [...selected, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setAttempts(a => a + 1);
      setIsChecking(true);
      const [a, b] = newSelected;
      const ca = cards.find(c => c.id === a)!;
      const cb = cards.find(c => c.id === b)!;

      setTimeout(() => {
        if (ca.emoji === cb.emoji) {
          setCards(prev => prev.map(c => newSelected.includes(c.id) ? { ...c, matched: true } : c));
          setPairsFound(p => p + 1);
          
          const localizedNameMap = EMOJI_NAMES[ca.emoji] || { en: "Match" };
          const name = localizedNameMap[lang as LangCode] || localizedNameMap.en;
          const matchTemp = LOCALIZED_MATCH_ANNOUNCEMENTS[lang as LangCode] || LOCALIZED_MATCH_ANNOUNCEMENTS.en;
          
          speakText(matchTemp(name), lang as LangCode);
        } else {
          setCards(prev => prev.map(c => newSelected.includes(c.id) ? { ...c, flipped: false } : c));
        }
        setSelected([]);
        setIsChecking(false);
      }, 1000);
    }
  }, [selected, cards, isChecking, lang]);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <Confetti active={won} />

      {!won ? (
        <div className="w-full flex flex-col items-center gap-6">
          <div className="flex w-full items-center justify-between text-sm font-bold">
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {seconds}s</span>
            <span>🧩 {t("pairsFound") || "Pairs"}: {pairsFound}/{totalPairs}</span>
            <span>🔢 {t("attempts") || "Attempts"}: {attempts}</span>
          </div>

          <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
            {cards.map(card => {
              const isFlipped = card.flipped || card.matched;
              return (
                <div
                  key={card.id}
                  onClick={() => flipCard(card.id)}
                  className={`aspect-square rounded-2xl flex items-center justify-center text-4xl border-2 transition-all cursor-pointer select-none ${
                    isFlipped
                      ? card.matched
                        ? "border-green-500 bg-green-50 text-green-700 shadow-soft"
                        : "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-soft"
                      : "border-slate-200 bg-slate-100 hover:scale-105"
                  }`}
                >
                  {isFlipped ? card.emoji : "❓"}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border bg-card p-6 shadow-card text-center space-y-4 w-full">
          <span className="text-5xl">🏆🎉</span>
          <h3 className="font-display font-extrabold text-2xl">{t("wellDone")}</h3>
          <p className="text-sm text-muted-foreground">{insight}</p>
        </div>
      )}
    </div>
  );
}
