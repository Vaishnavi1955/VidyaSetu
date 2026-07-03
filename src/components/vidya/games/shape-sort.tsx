// Shape Sort Game — click the correct shape name or match shape to outline
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Confetti } from "@/components/vidya/confetti";
import { useLang } from "@/lib/lang-context";
import { VoiceTutorUi } from "@/components/vidya/voice-tutor-ui";
import type { LangCode } from "@/lib/i18n";

const SHAPES: { emoji: string; svg: string; names: Record<LangCode, string>; sides: number; color: string }[] = [
  { emoji: "🔴", svg: "circle", names: { en: "Circle", hi: "वृत्त", mr: "वर्तुळ", gu: "વર્તુળ", ta: "வட்டம்", te: "వృత్తం", kn: "ವೃತ್ತ" }, sides: 0, color: "bg-red-400" },
  { emoji: "🔺", svg: "triangle", names: { en: "Triangle", hi: "त्रिकोण", mr: "त्रिकोण", gu: "ત્રિકોણ", ta: "முக்கோணம்", te: "త్రిభుజం", kn: "ತ್ರಿಕೋಣ" }, sides: 3, color: "bg-amber-400" },
  { emoji: "⬜", svg: "square", names: { en: "Square", hi: "वर्ग", mr: "चौरस", gu: "ચોરસ", ta: "சதுரம்", te: "చతురస్రం", kn: "ಚೌಕ" }, sides: 4, color: "bg-blue-400" },
  { emoji: "🟩", svg: "rectangle", names: { en: "Rectangle", hi: "आयत", mr: "आयत", gu: "લંબચોરસ", ta: "செவ்வகம்", te: "దీర్ఘచతురస్రం", kn: "ಆಯತ" }, sides: 4, color: "bg-green-400" },
  { emoji: "⭐", svg: "star", names: { en: "Star", hi: "तारा", mr: "तारा", gu: "તારો", ta: "நட்சத்திரம்", te: "నక్షత్రం", kn: "ನಕ್ಷತ್ರ" }, sides: 5, color: "bg-yellow-400" },
  { emoji: "💎", svg: "diamond", names: { en: "Diamond", hi: "हीरा", mr: "हिरा", gu: "હીરો", ta: "வைரம்", te: "వజ్రం", kn: "ವಜ್ರ" }, sides: 4, color: "bg-purple-400" },
  { emoji: "⬡", svg: "hexagon", names: { en: "Hexagon", hi: "षट्भुज", mr: "षटकोन", gu: "ષટ્કોણ", ta: "அறுகோணம்", te: "షడ్భుజి", kn: "ಷಡ್ಭುಜ" }, sides: 6, color: "bg-pink-400" },
  { emoji: "🌙", svg: "crescent", names: { en: "Crescent", hi: "अर्धचंद्र", mr: "चंद्रकोर", gu: "અર્ધચંદ્ર", ta: "பிறை", te: "చంద్రవంక", kn: "ಚಂದ್ರಕಲೆ" }, sides: 0, color: "bg-slate-400" },
];

const SVG_SHAPES: Record<string, React.FC<{ className?: string }>> = {
  circle: ({ className }) => <svg viewBox="0 0 100 100" className={className}><circle cx="50" cy="50" r="42" /></svg>,
  triangle: ({ className }) => <svg viewBox="0 0 100 100" className={className}><polygon points="50,8 92,92 8,92" /></svg>,
  square: ({ className }) => <svg viewBox="0 0 100 100" className={className}><rect x="10" y="10" width="80" height="80" /></svg>,
  rectangle: ({ className }) => <svg viewBox="0 0 100 60" className={className}><rect x="5" y="5" width="90" height="50" /></svg>,
  star: ({ className }) => <svg viewBox="0 0 100 100" className={className}><polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" /></svg>,
  diamond: ({ className }) => <svg viewBox="0 0 100 100" className={className}><polygon points="50,5 95,50 50,95 5,50" /></svg>,
  hexagon: ({ className }) => <svg viewBox="0 0 100 100" className={className}><polygon points="50,5 90,27 90,73 50,95 10,73 10,27" /></svg>,
  crescent: ({ className }) => <svg viewBox="0 0 100 100" className={className}><path d="M65 15 A40 40 0 1 0 65 85 A30 30 0 1 1 65 15Z" /></svg>,
};

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

interface ShapeSortProps {
  onComplete: (stars: number, xp: number) => void;
}

export function ShapeSort({ onComplete }: ShapeSortProps) {
  const { t, lang } = useLang();
  const [getQuestion] = useState(() => () => {
    const pool = shuffle(SHAPES);
    const correct = pool[0];
    const options = pool.slice(0, 4);
    return { correct, options: shuffle(options) };
  });

  const [question, setQuestion] = useState(() => {
    const pool = shuffle(SHAPES);
    const correct = pool[0];
    const options = pool.slice(0, 4);
    return { correct, options: shuffle(options) };
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const TARGET = 5;

  const handleAnswer = useCallback((shapeSvg: string) => {
    if (selected) return;
    setSelected(shapeSvg);
    const correct = shapeSvg === question.correct.svg;
    setIsCorrect(correct);
    setTotal(t2 => t2 + 1);
    if (correct) setScore(s => s + 1);

    const shapeName = question.correct.names[lang as LangCode];
    setFeedback(correct
      ? `${t("correctAnswer")} A ${shapeName} has ${question.correct.sides === 0 ? "no" : question.correct.sides} sides!`
      : `${t("wrongAnswer")} That was not a ${shapeName}. A ${shapeName} has ${question.correct.sides === 0 ? "curved edges" : question.correct.sides + " sides"}!`
    );

    setTimeout(() => {
      const newTotal = total + 1;
      if (newTotal >= TARGET) {
        const s = score + (correct ? 1 : 0);
        const stars = s >= TARGET - 1 ? 3 : s >= Math.floor(TARGET * 0.6) ? 2 : 1;
        setShowConfetti(stars >= 2);
        setFinished(true);
        onComplete(stars, stars * 15);
      } else {
        const pool = shuffle(SHAPES);
        const newCorrect = pool[0];
        const newOptions = pool.slice(0, 4);
        setQuestion({ correct: newCorrect, options: shuffle(newOptions) });
        setSelected(null);
        setIsCorrect(null);
        setFeedback("");
      }
    }, 1200);
  }, [selected, question, total, score, lang, t, onComplete]);

  const finalScore = score;
  const finalStars = finalScore >= TARGET - 1 ? 3 : finalScore >= Math.floor(TARGET * 0.6) ? 2 : 1;
  const CorrectSVG = SVG_SHAPES[question.correct.svg];

  return (
    <div className="flex flex-col items-center gap-5">
      <Confetti active={showConfetti} />

      <div className="flex w-full items-center justify-between text-sm font-bold">
        <span>🔺 {t("score")}: {score}/{total}</span>
        <span>Q {Math.min(total + 1, TARGET)}/{TARGET}</span>
      </div>

      {!finished ? (
        <>
          {/* Show shape, ask name */}
          <motion.div
            key={question.correct.svg}
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="flex flex-col items-center gap-3 rounded-3xl bg-muted/50 p-8"
          >
            <p className="text-sm font-bold text-muted-foreground">{t("sortShapes")}</p>
            <div className={`rounded-2xl p-4 ${question.correct.color} shadow-glow`}>
              {CorrectSVG && <CorrectSVG className="h-24 w-24 fill-white" />}
            </div>
            <p className="text-sm text-muted-foreground">What shape is this?</p>
          </motion.div>

          {/* Shape name options */}
          <div className="grid w-full grid-cols-2 gap-3">
            {question.options.map(opt => {
              const isThis = selected === opt.svg;
              const isCorrectOpt = opt.svg === question.correct.svg;
              return (
                <motion.button
                  key={opt.svg}
                  whileHover={{ scale: selected ? 1 : 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleAnswer(opt.svg)}
                  disabled={!!selected}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left font-bold transition-all ${
                    selected
                      ? isCorrectOpt
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : isThis
                        ? "border-red-400 bg-red-50 text-red-600"
                        : "border-border opacity-40"
                      : "border-border bg-card hover:border-primary cursor-pointer"
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span>{opt.names[lang as LangCode]}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Voice Tutor UI */}
          <VoiceTutorUi
            expectedAnswer={question.correct.names[lang as LangCode]}
            instructionText={`What shape is this? Say the name of the shape!`}
            onCorrect={() => handleAnswer(question.correct.svg)}
            onIncorrect={() => {
              setFeedback(`Try again! Can you say "${question.correct.names[lang as LangCode]}"?`);
            }}
            themeColor="bg-grad-yellow"
          />

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`w-full rounded-2xl p-3 text-sm font-bold ${isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
              >
                🤖 {feedback}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-3xl bg-grad-purple p-6 text-center text-white shadow-glow"
        >
          <div className="text-5xl">{finalStars >= 3 ? "🏆" : "🔺"}</div>
          <div className="mt-2 font-display text-2xl font-extrabold">{t("wellDone")}</div>
          <div className="mt-1 text-xl">{"⭐".repeat(finalStars)}</div>
          <div className="mt-2 text-sm opacity-90">{finalScore}/{TARGET} shapes identified!</div>
          <p className="mt-3 rounded-2xl bg-white/20 p-3 text-left text-xs backdrop-blur">
            🤖 Gemini AI: {finalScore >= TARGET - 1 ? "Excellent spatial awareness! Shape recognition supports early geometry and writing readiness." : "Shape recognition is developing well! Try sorting household objects by shape daily."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
