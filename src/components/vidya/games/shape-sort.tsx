// Shape Sort Game — click the correct shape name or match shape to outline
import { useState, useCallback, useEffect } from "react";
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
  { emoji: "💎", svg: "diamond", names: { en: "Diamond", hi: "हीरा", mr: "हिरा", gu: "હીરો", ta: "வைரம்", te: "வజ్రం", kn: "ವಜ್ರ" }, sides: 4, color: "bg-purple-400" },
];

const SVG_SHAPES: Record<string, React.FC<{ className?: string }>> = {
  circle: ({ className }) => <svg viewBox="0 0 100 100" className={className}><circle cx="50" cy="50" r="42" /></svg>,
  triangle: ({ className }) => <svg viewBox="0 0 100 100" className={className}><polygon points="50,8 92,92 8,92" /></svg>,
  square: ({ className }) => <svg viewBox="0 0 100 100" className={className}><rect x="10" y="10" width="80" height="80" /></svg>,
  rectangle: ({ className }) => <svg viewBox="0 0 100 60" className={className}><rect x="5" y="5" width="90" height="50" /></svg>,
  star: ({ className }) => <svg viewBox="0 0 100 100" className={className}><polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" /></svg>,
  diamond: ({ className }) => <svg viewBox="0 0 100 100" className={className}><polygon points="50,5 95,50 50,95 5,50" /></svg>,
};

const LOCALIZED_SHAPE_SUCCESS: Record<LangCode, (name: string, sides: number) => string> = {
  en: (name, sides) => `Correct! A ${name} has ${sides === 0 ? "no" : sides} sides!`,
  hi: (name, sides) => `सही! एक ${name} की ${sides === 0 ? "कोई भुजा नहीं" : sides + " भुजाएं"} होती हैं!`,
  mr: (name, sides) => `बरोबर! एका ${name} ला ${sides === 0 ? "एकही बाजू नसते" : sides + " बाजू असतात"}!`,
  gu: (name, sides) => `સાચું! એક ${name} ને ${sides === 0 ? "કોઈ બાજુ હોતી નથી" : sides + " બાજુઓ"} હોય છે!`,
  ta: (name, sides) => `சரி! ஒரு ${name} பக்கங்களுக்கு ${sides === 0 ? "பக்கங்கள் இல்லை" : sides + " பக்கங்கள் உள்ளன"}!`,
  kn: (name, sides) => `ಸರಿ! ಒಂದು ${name} ಗೆ ${sides === 0 ? "ಯಾವುದೇ ಬದಿಗಳಿಲ್ಲ" : sides + " ಬದಿಗಳಿವೆ"}!`,
  te: (name, sides) => `సరైనది! ఒక ${name} కి ${sides === 0 ? "భుజాలు లేవు" : sides + " భుజాలు ఉన్నాయి"}!`,
};

const LOCALIZED_SHAPE_FAILURE: Record<LangCode, (name: string, sides: number) => string> = {
  en: (name, sides) => `Try again! A ${name} has ${sides === 0 ? "curved edges" : sides + " sides"}!`,
  hi: (name, sides) => `फिर कोशिश करो! एक ${name} की ${sides === 0 ? "घुमावदार किनारे" : sides + " भुजाएं"} होती हैं!`,
  mr: (name, sides) => `पुन्हा प्रयत्न करा! एका ${name} ला ${sides === 0 ? "वक्र कडा" : sides + " बाजू"} असतात!`,
  gu: (name, sides) => `ફરીપ્રયાસ કરો! એક ${name} ને ${sides === 0 ? "વળાંકવાળી કિનારીઓ" : sides + " બાજુઓ"} હોય છે!`,
  ta: (name, sides) => `மீண்டும் முயற்சி செய்க! ஒரு ${name} பக்கங்களுக்கு ${sides === 0 ? "வளைந்த விளிம்புகள்" : sides + " பக்கங்கள் உள்ளன"}!`,
  kn: (name, sides) => `ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ! ಒಂದು ${name} ಗೆ ${sides === 0 ? "ಬಾಗಿದ ಅಂಚುಗಳು" : sides + " ಬದಿಗಳಿವೆ"}!`,
  te: (name, sides) => `మళ్ళీ ప్రయత్నించండి! ఒక ${name} కి ${sides === 0 ? "వంగిన అంచులు" : sides + " భుజాలు ఉన్నాయి"}!`,
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

  // Restart/reset game when language shifts
  useEffect(() => {
    const pool = shuffle(SHAPES);
    setQuestion({ correct: pool[0], options: shuffle(pool.slice(0, 4)) });
    setSelected(null);
    setIsCorrect(null);
    setScore(0);
    setTotal(0);
    setFeedback("");
    setFinished(false);
  }, [lang]);

  const handleAnswer = useCallback((shapeSvg: string) => {
    if (selected) return;
    setSelected(shapeSvg);
    const correct = shapeSvg === question.correct.svg;
    setIsCorrect(correct);
    setTotal(t2 => t2 + 1);
    if (correct) setScore(s => s + 1);

    const shapeName = question.correct.names[lang as LangCode];
    const successTemp = LOCALIZED_SHAPE_SUCCESS[lang as LangCode] || LOCALIZED_SHAPE_SUCCESS.en;
    const failTemp = LOCALIZED_SHAPE_FAILURE[lang as LangCode] || LOCALIZED_SHAPE_FAILURE.en;

    setFeedback(correct
      ? successTemp(shapeName, question.correct.sides)
      : failTemp(shapeName, question.correct.sides)
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
    }, 1500);
  }, [selected, question, total, score, lang, onComplete]);

  const finalScore = score;
  const CorrectSVG = SVG_SHAPES[question.correct.svg];

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <Confetti active={showConfetti} />

      {!finished ? (
        <div className="w-full flex flex-col items-center gap-6">
          {/* Phonics audio trigger instruction */}
          <div className="w-full">
            <VoiceTutorUi
              expectedPhrase={question.correct.names[lang as LangCode]}
              instructionText={`${t("sortShapes") || "Click the"} "${question.correct.names[lang as LangCode]}"`}
              successText={t("correctAnswer")}
              onSuccess={() => handleAnswer(question.correct.svg)}
            />
          </div>

          <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 border rounded-3xl min-h-[140px] max-w-sm w-full shadow-soft">
            <CorrectSVG className="h-24 w-24 fill-indigo-600 stroke-indigo-800 dark:fill-indigo-400 dark:stroke-indigo-300" />
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {question.options.map(opt => (
              <Button
                key={opt.svg}
                onClick={() => handleAnswer(opt.svg)}
                variant="outline"
                className={`h-16 rounded-2xl font-display text-base font-extrabold border-2 transition-all ${
                  selected === opt.svg
                    ? isCorrect
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-red-500 bg-red-50 text-red-700"
                    : "hover:scale-[1.03] hover:shadow-soft"
                }`}
              >
                {opt.names[lang as LangCode]}
              </Button>
            ))}
          </div>

          {feedback && (
            <div className={`p-4 rounded-2xl border text-xs font-bold leading-relaxed text-center max-w-sm ${
              isCorrect ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"
            }`}>
              {feedback}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-3xl border bg-card p-6 shadow-card text-center space-y-4 w-full">
          <span className="text-5xl">🏆🔺</span>
          <h3 className="font-display font-extrabold text-2xl">{t("wellDone")}</h3>
          <p className="text-sm text-muted-foreground">
            Shape classification practice completed!
          </p>
        </div>
      )}
    </div>
  );
}
