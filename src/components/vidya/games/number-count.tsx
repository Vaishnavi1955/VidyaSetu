// Number Count Game — count the objects and pick the right number
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Confetti } from "@/components/vidya/confetti";
import { adaptDifficulty } from "@/lib/ai-engine";
import { useLang } from "@/lib/lang-context";
import { VoiceTutorUi } from "@/components/vidya/voice-tutor-ui";
import type { LangCode } from "@/lib/i18n";

const OBJECTS = ["🍎", "🍌", "⭐", "🐸", "🐠", "🌸", "🍭", "🦋", "🎈", "🌙"];

const LOCALIZED_COUNT_TEMPLATES: Record<LangCode, (count: number, obj: string) => string> = {
  en: (count, obj) => `There are ${count} ${obj}!`,
  hi: (count, obj) => `यहाँ ${count} ${obj} हैं!`,
  mr: (count, obj) => `येथे ${count} ${obj} आहेत!`,
  gu: (count, obj) => `અહીં ${count} ${obj} છે!`,
  ta: (count, obj) => `இங்கே ${count} ${obj} உள்ளன!`,
  kn: (count, obj) => `ಇಲ್ಲಿ ${count} ${obj} ಇವೆ!`,
  te: (count, obj) => `ఇక్కడ ${count} ${obj} ఉన్నాయి!`,
};

const LOCALIZED_TRY_AGAIN_TEMPLATES: Record<LangCode, (count: number, obj: string) => string> = {
  en: (count, obj) => `Count again: there are ${count} ${obj}!`,
  hi: (count, obj) => `फिर से गिनें: यहाँ ${count} ${obj} हैं!`,
  mr: (count, obj) => `पुन्हा मोजा: येथे ${count} ${obj} आहेत!`,
  gu: (count, obj) => `ફરી ગણો: અહીં ${count} ${obj} છે!`,
  ta: (count, obj) => `மீண்டும் எண்ணுங்கள்: இங்கே ${count} ${obj} உள்ளன!`,
  kn: (count, obj) => `ಮತ್ತೊಮ್ಮೆ ಎಣಿಸಿ: ಇಲ್ಲಿ ${count} ${obj} ಇವೆ!`,
  te: (count, obj) => `మళ్ళీ లెక్కించండి: ఇక్కడ ${count} ${obj} ఉన్నాయి!`,
};

function generateQuestion(difficulty: "easy" | "medium" | "hard") {
  const ranges = { easy: [1, 5], medium: [3, 10], hard: [7, 15] };
  const [min, max] = ranges[difficulty];
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];

  const opts = new Set<number>([count]);
  while (opts.size < 4) {
    const offset = (Math.random() < 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 3));
    const val = count + offset;
    if (val > 0 && val <= max + 3) opts.add(val);
  }
  const options = [...opts].sort(() => Math.random() - 0.5);
  return { count, obj, options };
}

interface NumberCountProps {
  onComplete: (stars: number, xp: number) => void;
}

export function NumberCount({ onComplete }: NumberCountProps) {
  const { t, lang } = useLang();
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [question, setQuestion] = useState(() => generateQuestion("easy"));
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [aiMessage, setAiMessage] = useState("");
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const TARGET = 6;

  // Restart/reset game when language changes
  useEffect(() => {
    setDifficulty("easy");
    setQuestion(generateQuestion("easy"));
    setSelected(null);
    setIsCorrect(null);
    setScore(0);
    setTotal(0);
    setCorrectStreak(0);
    setWrongStreak(0);
    setFinished(false);
    setAiMessage("");
  }, [lang]);

  const handleAnswer = useCallback((num: number) => {
    if (selected !== null) return;
    setSelected(num);
    const correct = num === question.count;
    setIsCorrect(correct);
    setTotal(t2 => t2 + 1);

    const newCorrectStreak = correct ? correctStreak + 1 : 0;
    const newWrongStreak = !correct ? wrongStreak + 1 : 0;
    setCorrectStreak(newCorrectStreak);
    setWrongStreak(newWrongStreak);

    const speakTemp = LOCALIZED_COUNT_TEMPLATES[lang as LangCode] || LOCALIZED_COUNT_TEMPLATES.en;
    const retryTemp = LOCALIZED_TRY_AGAIN_TEMPLATES[lang as LangCode] || LOCALIZED_TRY_AGAIN_TEMPLATES.en;

    if (correct) {
      setScore(s => s + 1);
      const { level, reason } = adaptDifficulty(newCorrectStreak, newWrongStreak);
      setDifficulty(level);
      setAiMessage(newCorrectStreak >= 3 ? `🚀 ${reason}` : `${t("correctAnswer")} ${speakTemp(question.count, question.obj)}`);
    } else {
      const { level, reason } = adaptDifficulty(newCorrectStreak, newWrongStreak);
      setDifficulty(level);
      setAiMessage(newWrongStreak >= 2 ? `💙 ${reason}` : `${t("wrongAnswer")} ${retryTemp(question.count, question.obj)}`);
    }

    const newTotal = total + 1;
    setTimeout(() => {
      if (newTotal >= TARGET) {
        const s = score + (correct ? 1 : 0);
        const stars = s >= TARGET - 1 ? 3 : s >= Math.floor(TARGET * 0.6) ? 2 : 1;
        setShowConfetti(stars >= 2);
        setFinished(true);
        onComplete(stars, stars * 18);
      } else {
        setQuestion(generateQuestion(difficulty));
        setSelected(null);
        setIsCorrect(null);
        setAiMessage("");
      }
    }, 1500);
  }, [selected, question, correctStreak, wrongStreak, total, score, difficulty, lang, t, onComplete]);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <Confetti active={showConfetti} />

      {!finished ? (
        <div className="w-full flex flex-col items-center gap-6">
          <div className="flex w-full items-center justify-between text-sm font-bold">
            <span>🔢 {t("score")}: {score}/{total}</span>
            <span className={`rounded-full px-3 py-1 text-xs ${
              difficulty === "hard" ? "bg-red-100 text-red-700" :
              difficulty === "medium" ? "bg-amber-100 text-amber-700" :
              "bg-emerald-100 text-emerald-700"
            }`}>
              {difficulty.toUpperCase()}
            </span>
          </div>

          {/* Voice instruction using expected number digit */}
          <div className="w-full">
            <VoiceTutorUi
              expectedPhrase={question.count.toString()}
              instructionText={t("howManyObjects")}
              successText={t("correctAnswer")}
              onSuccess={() => handleAnswer(question.count)}
            />
          </div>

          {/* Grid visual container of objects */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-6 bg-slate-50 dark:bg-slate-900 border rounded-3xl min-h-[120px] max-w-sm w-full shadow-soft select-none">
            {Array.from({ length: question.count }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: i * 0.05 }}
                className="text-4xl"
              >
                {question.obj}
              </motion.span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {question.options.map(opt => (
              <Button
                key={opt}
                onClick={() => handleAnswer(opt)}
                variant="outline"
                className={`h-16 rounded-2xl font-display text-xl font-extrabold border-2 transition-all ${
                  selected === opt
                    ? isCorrect
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-red-500 bg-red-50 text-red-700"
                    : "hover:scale-[1.03] hover:shadow-soft"
                }`}
              >
                {opt}
              </Button>
            ))}
          </div>

          {aiMessage && (
            <div className={`p-4 rounded-2xl border text-xs font-bold leading-relaxed text-center max-w-sm ${
              isCorrect ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"
            }`}>
              {aiMessage}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-3xl border bg-card p-6 shadow-card text-center space-y-4 w-full">
          <span className="text-5xl">🏆🎉</span>
          <h3 className="font-display font-extrabold text-2xl">{t("wellDone")}</h3>
          <p className="text-sm text-muted-foreground">
            You successfully completed the counting challenge! Keep counting!
          </p>
        </div>
      )}
    </div>
  );
}
