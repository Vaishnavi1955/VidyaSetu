// Number Count Game — count the objects and pick the right number
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Confetti } from "@/components/vidya/confetti";
import { adaptDifficulty } from "@/lib/ai-engine";
import { useLang } from "@/lib/lang-context";
import { VoiceTutorUi } from "@/components/vidya/voice-tutor-ui";

const OBJECTS = ["🍎", "🍌", "⭐", "🐸", "🐠", "🌸", "🍭", "🦋", "🎈", "🌙"];

function generateQuestion(difficulty: "easy" | "medium" | "hard") {
  const ranges = { easy: [1, 5], medium: [3, 10], hard: [7, 15] };
  const [min, max] = ranges[difficulty];
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];

  // Generate 4 options with count as one of them
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
  const { t } = useLang();
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

    if (correct) {
      setScore(s => s + 1);
      const { level, reason } = adaptDifficulty(newCorrectStreak, newWrongStreak);
      setDifficulty(level);
      setAiMessage(newCorrectStreak >= 3 ? `🚀 ${reason}` : `${t("correctAnswer")} There are ${question.count} ${question.obj}!`);
    } else {
      const { level, reason } = adaptDifficulty(newCorrectStreak, newWrongStreak);
      setDifficulty(level);
      setAiMessage(newWrongStreak >= 2 ? `💙 ${reason}` : `${t("wrongAnswer")} Count again: there are ${question.count} ${question.obj}!`);
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
    }, 1100);
  }, [selected, question, correctStreak, wrongStreak, total, score, difficulty, t, onComplete]);

  const finalScore = score;
  const finalStars = finalScore >= TARGET - 1 ? 3 : finalScore >= Math.floor(TARGET * 0.6) ? 2 : 1;

  return (
    <div className="flex flex-col items-center gap-5">
      <Confetti active={showConfetti} />

      {/* Progress */}
      <div className="flex w-full items-center justify-between text-sm font-bold">
        <span>🔢 {t("score")}: {score}/{total}</span>
        <span className={`rounded-full px-3 py-1 text-xs ${
          difficulty === "hard" ? "bg-red-100 text-red-700" :
          difficulty === "medium" ? "bg-amber-100 text-amber-700" :
          "bg-emerald-100 text-emerald-700"
        }`}>
          {difficulty === "hard" ? "⚡ Hard" : difficulty === "medium" ? "🔥 Medium" : "🌱 Easy"}
        </span>
        <span>Q {Math.min(total + 1, TARGET)}/{TARGET}</span>
      </div>

      {!finished ? (
        <>
          {/* Objects display */}
          <motion.div
            key={question.count + question.obj}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full rounded-3xl bg-gradient-to-br from-sky-100 to-indigo-100 p-6 shadow-card"
          >
            <p className="mb-4 text-center text-sm font-bold text-slate-600">{t("howManyObjects")}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: question.count }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
                  className="text-4xl select-none"
                >
                  {question.obj}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Number options */}
          <div className="grid w-full grid-cols-4 gap-2">
            {question.options.map(opt => {
              const isThis = selected === opt;
              const correct = opt === question.count;
              return (
                <motion.button
                  key={opt}
                  whileHover={{ scale: selected !== null ? 1 : 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleAnswer(opt)}
                  disabled={selected !== null}
                  className={`rounded-2xl p-4 text-2xl font-extrabold transition-all ${
                    selected !== null
                      ? correct
                        ? "bg-grad-green text-white shadow-glow"
                        : isThis
                        ? "bg-red-400 text-white"
                        : "bg-muted opacity-40"
                      : "bg-card border-2 border-border hover:border-primary hover:bg-primary/5 cursor-pointer shadow-card"
                  }`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {/* Voice Tutor UI */}
          <VoiceTutorUi
            expectedAnswer={question.count.toString()}
            instructionText={`How many objects can you see? Let's count them together: one, two, three... Can you say the number?`}
            onCorrect={() => handleAnswer(question.count)}
            onIncorrect={() => {
              setAiMessage(`Count carefully! Let's count the ${question.obj} again.`);
            }}
            themeColor="bg-grad-blue"
          />

          {/* AI message */}
          <AnimatePresence>
            {aiMessage && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`w-full rounded-2xl p-3 text-sm font-bold ${
                  isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                🤖 {aiMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-3xl bg-grad-blue p-6 text-center text-white shadow-glow"
        >
          <div className="text-5xl">{finalStars >= 3 ? "🏆" : finalStars === 2 ? "🌟" : "⭐"}</div>
          <div className="mt-2 font-display text-2xl font-extrabold">{t("wellDone")}</div>
          <div className="mt-1 text-xl">{"⭐".repeat(finalStars)}</div>
          <div className="mt-2 text-sm opacity-90">{finalScore}/{TARGET} correct!</div>
          <p className="mt-3 rounded-2xl bg-white/20 p-3 text-left text-xs backdrop-blur">
            🤖 Gemini AI: {finalScore >= TARGET - 1 ? "Excellent number recognition! Your counting fluency is above average for this age." : finalScore >= Math.floor(TARGET * 0.6) ? "Good counting skills! Practice with real objects at home — count steps, spoons, buttons." : "Keep counting! Daily practice with 5–10 objects will build strong number sense over time."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
