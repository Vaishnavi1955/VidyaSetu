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

const EMOJI_NAMES: Record<string, string> = {
  "🐘": "Elephant", "🦁": "Lion", "🐒": "Monkey", "🦊": "Fox", "🐸": "Frog", "🦋": "Butterfly", "🐬": "Dolphin", "🦄": "Unicorn",
  "🍎": "Apple", "🍌": "Banana", "🍓": "Strawberry", "🍊": "Orange", "🍇": "Grapes", "🍉": "Watermelon", "🍑": "Peach", "🥭": "Mango",
  "🔵": "Blue", "🔴": "Red", "🟡": "Yellow", "🟢": "Green", "🟣": "Purple", "🟠": "Orange", "🟤": "Brown", "⚪": "White",
  "🚀": "Rocket", "⭐": "Star", "🌙": "Moon", "☀️": "Sun", "🌈": "Rainbow", "⚡": "Lightning", "❄️": "Snowflake", "🔥": "Fire"
};

const CARD_SETS = [
  ["🐘", "🦁", "🐒", "🦊", "🐸", "🦋", "🐬", "🦄"],
  ["🍎", "🍌", "🍓", "🍊", "🍇", "🍉", "🍑", "🥭"],
  ["🔵", "🔴", "🟡", "🟢", "🟣", "🟠", "🟤", "⚪"],
  ["🚀", "⭐", "🌙", "☀️", "🌈", "⚡", "❄️", "🔥"],
];

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
  
  // Initial instruction
  useEffect(() => {
    speakText("Tap cards to find matching pairs!", lang as any);
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

  // Timer
  useEffect(() => {
    if (won) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [won]);

  // Check for win
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
          const name = EMOJI_NAMES[ca.emoji] || "Match";
          speakText(`Match! That is a ${name}`, lang as any);
        } else {
          setCards(prev => prev.map(c => newSelected.includes(c.id) ? { ...c, flipped: false } : c));
        }
        setSelected([]);
        setIsChecking(false);
      }, 700);
    }
  }, [cards, selected, isChecking]);

  const restart = () => {
    setCards(buildDeck(CARD_SETS[setIndex]));
    setSelected([]);
    setAttempts(0);
    setPairsFound(0);
    setSeconds(0);
    setWon(false);
    setInsight("");
  };

  const stars = won ? (attempts <= totalPairs + 2 ? 3 : attempts <= totalPairs + 5 ? 2 : 1) : 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <Confetti active={won} />

      {/* Stats bar */}
      <div className="flex w-full items-center justify-between rounded-2xl bg-muted/50 px-4 py-2 text-sm font-bold">
        <span>🃏 {t("pairsFound")}: {pairsFound}/{totalPairs}</span>
        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {seconds}s</span>
        <span>🎯 {t("attempts")}: {attempts}</span>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cards.map(card => (
          <motion.button
            key={card.id}
            onClick={() => flipCard(card.id)}
            disabled={card.matched || card.flipped || isChecking}
            whileHover={{ scale: card.matched || card.flipped ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative h-16 w-16 rounded-2xl text-3xl shadow-card transition-all sm:h-20 sm:w-20 sm:text-4xl ${
              card.matched ? "bg-grad-green text-white shadow-glow" :
              card.flipped ? "bg-grad-blue text-white" :
              "bg-muted hover:bg-primary/10 cursor-pointer"
            }`}
          >
            <AnimatePresence mode="wait">
              {card.flipped || card.matched ? (
                <motion.span
                  key="face"
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: 90 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {card.emoji}
                </motion.span>
              ) : (
                <motion.span
                  key="back"
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: 90 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center text-muted-foreground"
                >
                  ❓
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Win overlay */}
      {won && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-3xl bg-grad-green p-6 text-center text-white shadow-glow"
        >
          <Trophy className="mx-auto h-12 w-12" />
          <div className="mt-2 font-display text-2xl font-extrabold">{t("youWon")} 🎉</div>
          <div className="mt-1 text-lg">{"⭐".repeat(stars)}</div>
          <div className="mt-1 text-sm opacity-90">{attempts} {t("attempts")} · {seconds} {t("timeSeconds")}</div>
          <p className="mt-3 rounded-2xl bg-white/20 p-3 text-left text-xs leading-relaxed backdrop-blur">
            🤖 <strong>AI Memory Analysis:</strong> {insight}
          </p>
          <Button onClick={restart} variant="outline" className="mt-4 rounded-full border-white/50 bg-white/20 text-white hover:bg-white/30">
            <RotateCcw className="mr-1 h-4 w-4" /> Play Again
          </Button>
        </motion.div>
      )}

      {!won && (
        <p className="text-center text-xs text-muted-foreground">
          {t("tapToFlip")} {t("findPairs")}
        </p>
      )}
    </div>
  );
}
