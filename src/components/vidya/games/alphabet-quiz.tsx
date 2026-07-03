// Alphabet Quiz — identify the letter from 4 choices
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Confetti } from "@/components/vidya/confetti";
import { adaptDifficulty } from "@/lib/ai-engine";
import { useLang } from "@/lib/lang-context";
import { VoiceTutorUi } from "@/components/vidya/voice-tutor-ui";

const ALPHABET_DATA = [
  { letter: "A", word: "Apple", emoji: "🍎", phonics: "Aah" },
  { letter: "B", word: "Ball", emoji: "⚽", phonics: "Buh" },
  { letter: "C", word: "Cat", emoji: "🐱", phonics: "Kuh" },
  { letter: "D", word: "Dog", emoji: "🐶", phonics: "Duh" },
  { letter: "E", word: "Elephant", emoji: "🐘", phonics: "Eh" },
  { letter: "F", word: "Fish", emoji: "🐟", phonics: "Fuh" },
  { letter: "G", word: "Grapes", emoji: "🍇", phonics: "Guh" },
  { letter: "H", word: "Hat", emoji: "🎩", phonics: "Huh" },
  { letter: "I", word: "Ice cream", emoji: "🍦", phonics: "Ih" },
  { letter: "J", word: "Jug", emoji: "🫙", phonics: "Juh" },
  { letter: "K", word: "Kite", emoji: "🪁", phonics: "Kuh" },
  { letter: "L", word: "Lion", emoji: "🦁", phonics: "Luh" },
  { letter: "M", word: "Mango", emoji: "🥭", phonics: "Muh" },
  { letter: "N", word: "Nest", emoji: "🪹", phonics: "Nuh" },
  { letter: "O", word: "Orange", emoji: "🍊", phonics: "Oh" },
  { letter: "P", word: "Parrot", emoji: "🦜", phonics: "Puh" },
  { letter: "Q", word: "Queen", emoji: "👑", phonics: "Kwuh" },
  { letter: "R", word: "Rainbow", emoji: "🌈", phonics: "Ruh" },
  { letter: "S", word: "Sun", emoji: "☀️", phonics: "Suh" },
  { letter: "T", word: "Tiger", emoji: "🐯", phonics: "Tuh" },
  { letter: "U", word: "Umbrella", emoji: "☂️", phonics: "Uh" },
  { letter: "V", word: "Van", emoji: "🚐", phonics: "Vuh" },
  { letter: "W", word: "Watermelon", emoji: "🍉", phonics: "Wuh" },
  { letter: "X", word: "Xylophone", emoji: "🎵", phonics: "Zuh" },
  { letter: "Y", word: "Yo-yo", emoji: "🪀", phonics: "Yuh" },
  { letter: "Z", word: "Zebra", emoji: "🦓", phonics: "Zuh" },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function getQuestion(usedIndices: Set<number>) {
  const available = ALPHABET_DATA.filter((_, i) => !usedIndices.has(i));
  if (available.length === 0) return null;
  const correct = available[Math.floor(Math.random() * available.length)];
  const correctIdx = ALPHABET_DATA.indexOf(correct);
  // Pick 3 wrong options
  const wrongPool = ALPHABET_DATA.filter((_, i) => i !== correctIdx);
  const wrongs = shuffle(wrongPool).slice(0, 3);
  const options = shuffle([correct, ...wrongs]);
  return { correct, correctIdx, options };
}

interface AlphabetQuizProps {
  onComplete: (stars: number, xp: number) => void;
}

export function AlphabetQuiz({ onComplete }: AlphabetQuizProps) {
  const { t } = useLang();
  const [usedIndices, setUsedIndices] = useState(new Set<number>());
  const [question, setQuestion] = useState(() => getQuestion(new Set()));
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [aiHint, setAiHint] = useState("");
  const [finished, setFinished] = useState(false);
  const TARGET = 5;

  const handleAnswer = useCallback((letter: string) => {
    if (selected || !question) return;
    setSelected(letter);
    const correct = letter === question.correct.letter;
    setIsCorrect(correct);
    setTotal(t2 => t2 + 1);

    if (correct) {
      setScore(s => s + 1);
      setCorrectStreak(c => c + 1);
      setWrongStreak(0);
      setAiHint(`${t("correctAnswer")} '${question.correct.letter}' says '${question.correct.phonics}' — like in '${question.correct.word}' ${question.correct.emoji}`);
    } else {
      setWrongStreak(w => w + 1);
      setCorrectStreak(0);
      setAiHint(`${t("wrongAnswer")} '${question.correct.letter}' is for '${question.correct.word}' ${question.correct.emoji}. Says '${question.correct.phonics}'!`);
    }

    const newUsed = new Set([...usedIndices, question.correctIdx]);
    setUsedIndices(newUsed);

    setTimeout(() => {
      if (newUsed.size >= TARGET || newUsed.size >= ALPHABET_DATA.length) {
        const stars = score + (correct ? 1 : 0) >= TARGET - 1 ? 3 : score + (correct ? 1 : 0) >= Math.floor(TARGET * 0.6) ? 2 : 1;
        setShowConfetti(stars >= 2);
        setFinished(true);
        onComplete(stars, stars * 15);
      } else {
        setQuestion(getQuestion(newUsed));
        setSelected(null);
        setIsCorrect(null);
        setAiHint("");

        // Adapt difficulty
        const { reason } = adaptDifficulty(correctStreak + (correct ? 1 : 0), wrongStreak + (!correct ? 1 : 0));
        if (reason.includes("Increasing") || reason.includes("Switching")) {
          setTimeout(() => setAiHint(reason), 100);
        }
      }
    }, 1200);
  }, [selected, question, usedIndices, score, correctStreak, wrongStreak, t, onComplete]);

  if (!question) return null;

  const finalStars = score >= TARGET - 1 ? 3 : score >= Math.floor(TARGET * 0.6) ? 2 : 1;

  return (
    <div className="flex flex-col items-center gap-5">
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
            key={question.correct.letter}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-2 rounded-3xl bg-grad-yellow p-8 text-center shadow-glow"
          >
            <div className="text-7xl">{question.correct.emoji}</div>
            <div className="mt-2 text-sm font-bold text-white/80">{t("whichLetter")}</div>
            <div className="text-lg font-bold text-white">{question.correct.word}</div>
          </motion.div>

          {/* Options */}
          <div className="grid w-full grid-cols-2 gap-3">
            {question.options.map(opt => {
              const isThis = selected === opt.letter;
              const correct = opt.letter === question.correct.letter;
              return (
                <motion.button
                  key={opt.letter}
                  whileHover={{ scale: selected ? 1 : 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleAnswer(opt.letter)}
                  disabled={!!selected}
                  className={`flex items-center justify-center gap-3 rounded-2xl border-2 p-4 text-2xl font-extrabold transition-all ${
                    selected
                      ? correct
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : isThis
                        ? "border-red-400 bg-red-50 text-red-600"
                        : "border-border opacity-50"
                      : "border-border bg-card hover:border-primary hover:bg-primary/5 cursor-pointer"
                  }`}
                >
                  {selected && correct && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                  {selected && isThis && !correct && <XCircle className="h-5 w-5 text-red-500" />}
                  {opt.letter}
                </motion.button>
              );
            })}
          </div>

          {/* Voice Tutor UI */}
          <VoiceTutorUi
            expectedAnswer={question.correct.word}
            instructionText={`Find the letter ${question.correct.letter} for ${question.correct.word}. Can you say ${question.correct.word}?`}
            onCorrect={() => handleAnswer(question.correct.letter)}
            onIncorrect={() => {
              // Highlight mistake and allow try again
              setAiHint(`Pronunciation check: Try to say "${question.correct.word}" clearly. Focus on the "${question.correct.phonics}" sound!`);
            }}
            onCommand={(cmd) => {
              if (cmd === "next" && selected) {
                // If they say 'next' after answering, do nothing (handled automatically by timeout)
              }
            }}
            themeColor="bg-grad-green"
          />

          {/* AI hint */}
          <AnimatePresence>
            {aiHint && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`w-full rounded-2xl p-3 text-sm font-bold ${
                  isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                🤖 {aiHint}
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
          <div className="text-5xl">{finalStars >= 3 ? "🏆" : finalStars === 2 ? "🥈" : "🥉"}</div>
          <div className="mt-2 font-display text-2xl font-extrabold">{t("wellDone")}</div>
          <div className="mt-1 text-xl">{"⭐".repeat(finalStars)}</div>
          <div className="mt-2 text-sm opacity-90">{score}/{TARGET} {t("score")}</div>
          <p className="mt-3 rounded-2xl bg-white/20 p-3 text-left text-xs backdrop-blur">
            🤖 Gemini AI: {score >= TARGET - 1 ? "Outstanding alphabet recognition! Phonics awareness is developing beautifully." : score >= Math.floor(TARGET * 0.6) ? "Good progress! Practice the letters you missed using tracing exercises." : "Keep practicing! Daily 10-minute alphabet games will build strong letter recognition."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
