// Alphabet Quiz — identify the letter from 4 choices
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Confetti } from "@/components/vidya/confetti";
import { adaptDifficulty } from "@/lib/ai-engine";
import { useLang } from "@/lib/lang-context";
import { VoiceTutorUi } from "@/components/vidya/voice-tutor-ui";
import type { LangCode } from "@/lib/i18n";

const MULTILINGUAL_ALPHABET: Record<LangCode, { letter: string; word: string; emoji: string; phonics: string }[]> = {
  en: [
    { letter: "A", word: "Apple", emoji: "🍎", phonics: "Aah" },
    { letter: "B", word: "Ball", emoji: "⚽", phonics: "Buh" },
    { letter: "C", word: "Cat", emoji: "🐱", phonics: "Kuh" },
    { letter: "D", word: "Dog", emoji: "🐶", phonics: "Duh" },
    { letter: "E", word: "Elephant", emoji: "🐘", phonics: "Eh" },
    { letter: "F", word: "Fish", emoji: "🐟", phonics: "Fuh" },
    { letter: "G", word: "Grapes", emoji: "🍇", phonics: "Guh" },
  ],
  hi: [
    { letter: "अ", word: "अनार", emoji: "🍎", phonics: "अ" },
    { letter: "आ", word: "आम", emoji: "🥭", phonics: "आ" },
    { letter: "इ", word: "इमली", emoji: "🫱", phonics: "इ" },
    { letter: "ई", word: "ईख", emoji: "🌾", phonics: "ई" },
    { letter: "उ", word: "उल्लू", emoji: "🦉", phonics: "उ" },
    { letter: "ऊ", word: "ऊन", emoji: "🧶", phonics: "ऊ" },
    { letter: "क", word: "कबूतर", emoji: "🐦", phonics: "क" },
  ],
  mr: [
    { letter: "अ", word: "अननस", emoji: "🍍", phonics: "अ" },
    { letter: "आ", word: "आंबा", emoji: "🥭", phonics: "आ" },
    { letter: "इ", word: "इमारत", emoji: "🏢", phonics: "इ" },
    { letter: "ई", word: "इस्त्री", emoji: "🔌", phonics: "ई" },
    { letter: "उ", word: "उखळ", emoji: "🥣", phonics: "उ" },
    { letter: "ऊ", word: "ऊस", emoji: "🌾", phonics: "ऊ" },
    { letter: "क", word: "कमळ", emoji: "🌸", phonics: "क" },
  ],
  gu: [
    { letter: "અ", word: "અનાનસ", emoji: "🍍", phonics: "અ" },
    { letter: "આ", word: "આમલી", emoji: "🥭", phonics: "આ" },
    { letter: "ઇ", word: "ઇમારત", emoji: "🏢", phonics: "ઇ" },
    { letter: "ઈ", word: "ઈશ્વર", emoji: "🙏", phonics: "ઈ" },
    { letter: "ઉ", word: "ઉંદર", emoji: "🐭", phonics: "ઉ" },
    { letter: "ઊ", word: "ઊંટ", emoji: "🐫", phonics: "ઊ" },
    { letter: "ક", word: "કમળ", emoji: "🌸", phonics: "ક" },
  ],
  ta: [
    { letter: "அ", word: "அம்மா", emoji: "👩", phonics: "அ" },
    { letter: "ஆ", word: "ஆடு", emoji: "🐐", phonics: "ஆ" },
    { letter: "இ", word: "இலை", emoji: "🍃", phonics: "இ" },
    { letter: "ஈ", word: "ஈசல்", emoji: "🪰", phonics: "ஈ" },
    { letter: "உ", word: "உதடு", emoji: "👄", phonics: "உ" },
    { letter: "ஊ", word: "ஊஞ்சல்", emoji: "🛝", phonics: "ஊ" },
    { letter: "எ", word: "எலி", emoji: "🐭", phonics: "எ" },
  ],
  te: [
    { letter: "అ", word: "అమ్మ", emoji: "👩", phonics: "అ" },
    { letter: "ఆ", word: "ఆవు", emoji: "🐄", phonics: "ఆ" },
    { letter: "ఇ", word: "ఇల్లు", emoji: "🏠", phonics: "ఇ" },
    { letter: "ఈ", word: "ఈల", emoji: "ఈ" },
    { letter: "ఉ", word: "ఉడుత", emoji: "🐿️", phonics: "ఉ" },
    { letter: "ఊ", word: "ఊయల", emoji: "🛝", phonics: "ఊ" },
    { letter: "క", word: "కలము", emoji: "🖋️", phonics: "క" },
  ],
  kn: [
    { letter: "ಅ", word: "ಅಮ್ಮ", emoji: "👩", phonics: "ಅ" },
    { letter: "ಆ", word: "ಆನೆ", emoji: "🐘", phonics: "ಆ" },
    { letter: "ಇ", word: "ಇಲಿ", emoji: "🐭", phonics: "ಇ" },
    { letter: "ಈ", word: "ಈಜು", emoji: "🏊", phonics: "ಈ" },
    { letter: "ಉ", word: "ಉಡುಪು", emoji: "👕", phonics: "ಉ" },
    { letter: "ಊ", word: "ಊಟ", emoji: "🍲", phonics: "ಊ" },
    { letter: "ಕ", word: "ಕನ್ನಡಕ", emoji: "👓", phonics: "ಕ" },
  ]
};

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function getQuestion(alphabetData: typeof MULTILINGUAL_ALPHABET.en, usedIndices: Set<number>) {
  const available = alphabetData.filter((_, i) => !usedIndices.has(i));
  if (available.length === 0) return null;
  const correct = available[Math.floor(Math.random() * available.length)];
  const correctIdx = alphabetData.indexOf(correct);
  
  const wrongPool = alphabetData.filter((_, i) => i !== correctIdx);
  const wrongs = shuffle(wrongPool).slice(0, 3);
  const options = shuffle([correct, ...wrongs]);
  return { correct, correctIdx, options };
}

interface AlphabetQuizProps {
  onComplete: (stars: number, xp: number) => void;
}

export function AlphabetQuiz({ onComplete }: AlphabetQuizProps) {
  const { t, lang } = useLang();
  const alphabetData = MULTILINGUAL_ALPHABET[lang as LangCode] || MULTILINGUAL_ALPHABET.en;

  const [usedIndices, setUsedIndices] = useState(new Set<number>());
  const [question, setQuestion] = useState(() => getQuestion(alphabetData, new Set()));
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

  // Reload questions when language changes
  useEffect(() => {
    const data = MULTILINGUAL_ALPHABET[lang as LangCode] || MULTILINGUAL_ALPHABET.en;
    setUsedIndices(new Set());
    setQuestion(getQuestion(data, new Set()));
    setSelected(null);
    setIsCorrect(null);
    setScore(0);
    setTotal(0);
    setFinished(false);
    setAiHint("");
  }, [lang]);

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
      if (newUsed.size >= TARGET || newUsed.size >= alphabetData.length) {
        const stars = score + (correct ? 1 : 0) >= TARGET - 1 ? 3 : score + (correct ? 1 : 0) >= Math.floor(TARGET * 0.6) ? 2 : 1;
        setShowConfetti(stars >= 2);
        setFinished(true);
        onComplete(stars, stars * 15);
      } else {
        setQuestion(getQuestion(alphabetData, newUsed));
        setSelected(null);
        setIsCorrect(null);
        setAiHint("");
      }
    }, 1500);
  }, [selected, question, usedIndices, score, total, correctStreak, wrongStreak, t, alphabetData, onComplete]);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <Confetti active={showConfetti} />

      {!finished && question ? (
        <div className="w-full flex flex-col items-center gap-6">
          {/* Phonics tutor voice instruction */}
          <div className="w-full">
            <VoiceTutorUi
              expectedPhrase={question.correct.letter}
              instructionText={`${t("whichLetter")} "${question.correct.word}"`}
              successText={t("correctAnswer")}
              onSuccess={() => handleAnswer(question.correct.letter)}
            />
          </div>

          <div className="text-6xl font-bold p-6 bg-slate-50 dark:bg-slate-900 border rounded-3xl min-w-[120px] text-center select-none shadow-soft">
            {question.correct.letter}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {question.options.map(opt => (
              <Button
                key={opt.letter}
                onClick={() => handleAnswer(opt.letter)}
                variant="outline"
                className={`h-24 rounded-3xl flex flex-col gap-2 font-display text-lg font-extrabold transition-all border-2 ${
                  selected === opt.letter
                    ? isCorrect
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-red-500 bg-red-50 text-red-700"
                    : "hover:scale-[1.03] hover:shadow-soft"
                }`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <span>{opt.word}</span>
              </Button>
            ))}
          </div>

          {aiHint && (
            <div className={`p-4 rounded-2xl border text-xs font-bold leading-relaxed text-center max-w-sm ${
              isCorrect ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"
            }`}>
              {aiHint}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-3xl border bg-card p-6 shadow-card text-center space-y-4 w-full">
          <span className="text-5xl">🏆🎉</span>
          <h3 className="font-display font-extrabold text-2xl">{t("wellDone")}</h3>
          <p className="text-sm text-muted-foreground">
            You successfully finished the alphabet matching practice! Keep collecting stars!
          </p>
        </div>
      )}
    </div>
  );
}
