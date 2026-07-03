import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Confetti } from "@/components/vidya/confetti";
import { useLang } from "@/lib/lang-context";
import { VoiceTutorUi } from "@/components/vidya/voice-tutor-ui";

const EMOTION_DATA = [
  { id: "happy", name: "Happy", emoji: "😊" },
  { id: "sad", name: "Sad", emoji: "😢" },
  { id: "angry", name: "Angry", emoji: "😡" },
  { id: "surprised", name: "Surprised", emoji: "😲" },
  { id: "scared", name: "Scared", emoji: "😨" },
  { id: "silly", name: "Silly", emoji: "🤪" },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function getQuestion(usedIndices: Set<number>) {
  const available = EMOTION_DATA.filter((_, i) => !usedIndices.has(i));
  if (available.length === 0) return null;
  const correct = available[Math.floor(Math.random() * available.length)];
  const correctIdx = EMOTION_DATA.indexOf(correct);
  const wrongPool = EMOTION_DATA.filter((_, i) => i !== correctIdx);
  const wrongs = shuffle(wrongPool).slice(0, 3);
  const options = shuffle([correct, ...wrongs]);
  return { correct, correctIdx, options };
}

interface EmotionGardenProps {
  onComplete: (stars: number, xp: number) => void;
}

export function EmotionGarden({ onComplete }: EmotionGardenProps) {
  const { t } = useLang();
  const [usedIndices, setUsedIndices] = useState(new Set<number>());
  const [question, setQuestion] = useState(() => getQuestion(new Set()));
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [finished, setFinished] = useState(false);
  const TARGET = 5;

  const handleAnswer = useCallback((emotionId: string) => {
    if (selected || !question) return;
    setSelected(emotionId);
    const correct = emotionId === question.correct.id;
    setIsCorrect(correct);
    setTotal(t => t + 1);

    if (correct) {
      setScore(s => s + 1);
    }

    const newUsed = new Set([...usedIndices, question.correctIdx]);
    setUsedIndices(newUsed);

    setTimeout(() => {
      if (newUsed.size >= TARGET || newUsed.size >= EMOTION_DATA.length) {
        const finalScore = score + (correct ? 1 : 0);
        const stars = finalScore >= TARGET - 1 ? 3 : finalScore >= Math.floor(TARGET * 0.6) ? 2 : 1;
        setShowConfetti(stars >= 2);
        setFinished(true);
        onComplete(stars, stars * 15);
      } else {
        setQuestion(getQuestion(newUsed));
        setSelected(null);
        setIsCorrect(null);
      }
    }, 1200);
  }, [selected, question, usedIndices, score, onComplete]);

  if (!question) return null;

  const finalStars = score >= TARGET - 1 ? 3 : score >= Math.floor(TARGET * 0.6) ? 2 : 1;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <Confetti active={showConfetti} />

      {/* Progress */}
      <div className="flex w-full items-center justify-between text-sm font-bold">
        <span>🎯 {t("score")}: {score}/{total}</span>
        <div className="flex gap-1">
          {Array.from({ length: TARGET }).map((_, i) => (
            <div key={i} className={`h-2 w-8 rounded-full transition-all ${i < score ? "bg-grad-green" : "bg-muted"}`} />
          ))}
        </div>
        <span>Q {Math.min(total + 1, TARGET)}/{TARGET}</span>
      </div>

      {!finished ? (
        <>
          {/* Question card */}
          <motion.div
            key={question.correct.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-2 rounded-3xl bg-grad-green p-8 text-center shadow-glow border w-full text-white"
          >
            <div className="text-sm font-bold opacity-90 uppercase tracking-wider">Who is feeling...</div>
            <div className="text-4xl font-display font-extrabold">
              {question.correct.name}?
            </div>
          </motion.div>

          {/* Options */}
          <div className="grid w-full grid-cols-2 gap-4 mt-4">
            {question.options.map(opt => {
              const isThis = selected === opt.id;
              const correct = opt.id === question.correct.id;
              return (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: selected ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(opt.id)}
                  disabled={!!selected}
                  className={`relative aspect-square w-full max-w-[120px] mx-auto rounded-3xl flex flex-col items-center justify-center gap-2 shadow-card border-4 transition-all ${
                    selected
                      ? correct
                        ? "border-emerald-500 bg-emerald-50"
                        : isThis
                        ? "border-red-400 bg-red-50"
                        : "border-border opacity-50 bg-card"
                      : "border-border bg-card hover:border-primary cursor-pointer"
                  }`}
                >
                  <span className="text-6xl drop-shadow-md">{opt.emoji}</span>
                  {selected && correct && <CheckCircle2 className="absolute top-2 right-2 h-6 w-6 text-emerald-500 drop-shadow-md bg-white rounded-full" />}
                  {selected && isThis && !correct && <XCircle className="absolute top-2 right-2 h-6 w-6 text-red-500 drop-shadow-md bg-white rounded-full" />}
                </motion.button>
              );
            })}
          </div>

          {/* Voice Tutor UI */}
          <VoiceTutorUi
            expectedAnswer={question.correct.name}
            instructionText={`Who is feeling ${question.correct.name}? Let's say ${question.correct.name}!`}
            onCorrect={() => handleAnswer(question.correct.id)}
            onIncorrect={() => {}}
            themeColor="bg-grad-green"
          />
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-3xl bg-grad-green p-6 text-center text-white shadow-glow"
        >
          <div className="text-5xl">{finalStars >= 3 ? "🏆" : finalStars === 2 ? "🥈" : "🥉"}</div>
          <div className="mt-2 font-display text-2xl font-extrabold">Emotion Expert!</div>
          <div className="mt-1 text-xl">{"⭐".repeat(finalStars)}</div>
          <div className="mt-2 text-sm opacity-90">{score}/{TARGET} correct</div>
          <p className="mt-3 rounded-2xl bg-white/20 p-3 text-left text-xs backdrop-blur">
            🤖 Gemini AI: Great job identifying feelings! Understanding emotions helps build empathy and social skills.
          </p>
        </motion.div>
      )}
    </div>
  );
}
