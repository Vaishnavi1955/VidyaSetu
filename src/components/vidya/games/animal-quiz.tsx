// Animal Safari Quiz — identify the animal from 4 emoji choices
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Confetti } from "@/components/vidya/confetti";
import { useLang } from "@/lib/lang-context";
import { VoiceTutorUi } from "@/components/vidya/voice-tutor-ui";
import type { LangCode } from "@/lib/i18n";

const ANIMALS: { emoji: string; names: Record<LangCode, string>; sound: string; fact: string }[] = [
  { emoji: "🐘", names: { en: "Elephant", hi: "हाथी", mr: "हत्ती", gu: "હાથી", ta: "யானை", te: "ఏనుగు", kn: "ಆನೆ" }, sound: "Trumpet 🎺", fact: "Elephants never forget! They have amazing memories." },
  { emoji: "🦁", names: { en: "Lion", hi: "शेर", mr: "सिंह", gu: "સિંહ", ta: "சிங்கம்", te: "సింహం", kn: "ಸಿಂಹ" }, sound: "Roar 🌟", fact: "The lion is called the King of the Jungle!" },
  { emoji: "🐒", names: { en: "Monkey", hi: "बंदर", mr: "माकड", gu: "વાંદરો", ta: "குரங்கு", te: "కోతి", kn: "ಕೋತಿ" }, sound: "Chatter 🍌", fact: "Monkeys love bananas and are very clever!" },
  { emoji: "🦊", names: { en: "Fox", hi: "लोमड़ी", mr: "कोल्हा", gu: "શિયાળ", ta: "நரி", te: "నక్క", kn: "ನರಿ" }, sound: "Yelp 🌙", fact: "Foxes are the cleverest animals in the forest!" },
  { emoji: "🐸", names: { en: "Frog", hi: "मेंढक", mr: "बेडूक", gu: "દેડકો", ta: "தவளை", te: "కప్ప", kn: "ಕಪ್ಪೆ" }, sound: "Ribbit 💧", fact: "Frogs can jump 20 times their body length!" },
  { emoji: "🦋", names: { en: "Butterfly", hi: "तितली", mr: "फुलपाखरू", gu: "પતંગિયું", ta: "பட்டாம்பூச்சி", te: "సీతాకోకచిలుక", kn: "ಚಿಟ್ಟೆ" }, sound: "Flutter 🌸", fact: "Butterflies taste with their feet!" },
  { emoji: "🐬", names: { en: "Dolphin", hi: "डॉल्फिन", mr: "डॉल्फिन", gu: "ડોલ્ફિન", ta: "டால்பின்", te: "డాల్ఫిన్", kn: "ಡಾಲ್ಫಿನ್" }, sound: "Click 🌊", fact: "Dolphins are one of the smartest animals!" },
  { emoji: "🦄", names: { en: "Unicorn", hi: "गेंडा", mr: "एकशिंगी", gu: "યુનિકોર્ન", ta: "யூனிகோர்ன்", te: "యూనికార్న్", kn: "ಯೂನಿಕಾರ್ನ್" }, sound: "Magic ✨", fact: "Unicorns are magical creatures that can grant wishes!" },
  { emoji: "🐯", names: { en: "Tiger", hi: "बाघ", mr: "वाघ", gu: "વાઘ", ta: "புலி", te: "పులి", kn: "ಹುಲಿ" }, sound: "Growl 🔥", fact: "No two tigers have the same stripe pattern!" },
  { emoji: "🐨", names: { en: "Koala", hi: "कोआला", mr: "कोआला", gu: "કોઆલા", ta: "கோலா", te: "కోయాలా", kn: "ಕೋಲಾ" }, sound: "Snore 💤", fact: "Koalas sleep up to 22 hours a day!" },
  { emoji: "🦜", names: { en: "Parrot", hi: "तोता", mr: "पोपट", gu: "પોપટ", ta: "கிளி", te: "చిలుక", kn: "ಗಿಳಿ" }, sound: "Squawk 🗣️", fact: "Parrots can repeat words and sentences!" },
  { emoji: "🐧", names: { en: "Penguin", hi: "पेंगुइन", mr: "पेंग्विन", gu: "પેન્ગ્વિન", ta: "பென்குயின்", te: "పెంగ్విన్", kn: "ಪೆಂಗ್ವಿನ್" }, sound: "Waddle 🧊", fact: "Penguins wear their tuxedo forever!" },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

interface AnimalQuizProps {
  onComplete: (stars: number, xp: number) => void;
}

export function AnimalQuiz({ onComplete }: AnimalQuizProps) {
  const { t, lang } = useLang();
  const [usedIndices, setUsedIndices] = useState(new Set<number>());
  const [getQ] = useState(() => () => {
    const available = ANIMALS.map((_, i) => i).filter(i => !usedIndices.has(i));
    const correctIdx = available[Math.floor(Math.random() * available.length)];
    const correct = ANIMALS[correctIdx];
    const wrongs = shuffle(ANIMALS.filter((_, i) => i !== correctIdx)).slice(0, 3);
    const options = shuffle([correct, ...wrongs]);
    return { correct, correctIdx, options };
  });
  const [question, setQuestion] = useState(() => {
    const available = ANIMALS.map((_, i) => i);
    const correctIdx = available[Math.floor(Math.random() * available.length)];
    const correct = ANIMALS[correctIdx];
    const wrongs = shuffle(ANIMALS.filter((_, i) => i !== correctIdx)).slice(0, 3);
    const options = shuffle([correct, ...wrongs]);
    return { correct, correctIdx, options };
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [fact, setFact] = useState("");
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const TARGET = 5;

  const handleAnswer = useCallback((idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = ANIMALS[idx].emoji === question.correct.emoji;
    setIsCorrect(correct);
    setTotal(t2 => t2 + 1);
    if (correct) setScore(s => s + 1);
    setFact(correct
      ? `${question.correct.names[lang as LangCode]} says '${question.correct.sound}'. Fun fact: ${question.correct.fact}`
      : `This is a ${ANIMALS[idx].names[lang as LangCode]}! The correct answer was ${question.correct.names[lang as LangCode]} ${question.correct.emoji}. ${question.correct.fact}`
    );

    const newUsed = new Set([...usedIndices, question.correctIdx]);
    setUsedIndices(newUsed);

    setTimeout(() => {
      const newTotal = total + 1;
      if (newTotal >= TARGET || newUsed.size >= ANIMALS.length) {
        const s = score + (correct ? 1 : 0);
        const stars = s >= TARGET - 1 ? 3 : s >= Math.floor(TARGET * 0.6) ? 2 : 1;
        setShowConfetti(stars >= 2);
        setFinished(true);
        onComplete(stars, stars * 15);
      } else {
        // Build new question avoiding used
        const available = ANIMALS.map((_, i) => i).filter(i => !newUsed.has(i));
        if (available.length > 0) {
          const correctIdx = available[Math.floor(Math.random() * available.length)];
          const c = ANIMALS[correctIdx];
          const wrongs = shuffle(ANIMALS.filter((_, i) => i !== correctIdx)).slice(0, 3);
          const options = shuffle([c, ...wrongs]);
          setQuestion({ correct: c, correctIdx, options });
        }
        setSelected(null);
        setIsCorrect(null);
        setFact("");
      }
    }, 1400);
  }, [selected, question, usedIndices, total, score, lang, onComplete]);

  const finalScore = score;
  const finalStars = finalScore >= TARGET - 1 ? 3 : finalScore >= Math.floor(TARGET * 0.6) ? 2 : 1;

  return (
    <div className="flex flex-col items-center gap-5">
      <Confetti active={showConfetti} />

      <div className="flex w-full items-center justify-between text-sm font-bold">
        <span>🦁 {t("score")}: {score}/{total}</span>
        <span>Q {Math.min(total + 1, TARGET)}/{TARGET}</span>
      </div>

      {!finished ? (
        <>
          <motion.div
            key={question.correct.emoji}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-2 rounded-3xl bg-grad-green p-8 text-center shadow-glow"
          >
            <div className="text-8xl animate-bounce">{question.correct.emoji}</div>
            <div className="mt-2 text-sm font-bold text-white/80">{t("whichAnimal")}</div>
          </motion.div>

          <div className="grid w-full grid-cols-2 gap-3">
            {question.options.map((opt, i) => {
              const animalIdx = ANIMALS.indexOf(opt);
              const isThis = selected === animalIdx;
              const isCorrectOpt = opt.emoji === question.correct.emoji;
              return (
                <motion.button
                  key={opt.emoji}
                  whileHover={{ scale: selected !== null ? 1 : 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleAnswer(animalIdx)}
                  disabled={selected !== null}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all ${
                    selected !== null
                      ? isCorrectOpt
                        ? "border-emerald-500 bg-emerald-50"
                        : isThis
                        ? "border-red-400 bg-red-50"
                        : "border-border opacity-40"
                      : "border-border bg-card hover:border-primary cursor-pointer"
                  }`}
                >
                  {selected !== null && isCorrectOpt && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />}
                  {selected !== null && isThis && !isCorrectOpt && <XCircle className="h-4 w-4 shrink-0 text-red-500" />}
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="font-bold text-sm">{opt.names[lang as LangCode]}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Voice Tutor UI */}
          <VoiceTutorUi
            expectedAnswer={question.correct.names[lang as LangCode]}
            instructionText={`Which animal is this? Say the name of the animal!`}
            onCorrect={() => {
              const correctIdx = ANIMALS.findIndex(a => a.emoji === question.correct.emoji);
              handleAnswer(correctIdx);
            }}
            onIncorrect={() => {
              setFact(`That's okay! Try to say "${question.correct.names[lang as LangCode]}" clearly.`);
            }}
            themeColor="bg-grad-green"
          />

          <AnimatePresence>
            {fact && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`w-full rounded-2xl p-3 text-sm ${isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}
              >
                🤖 {fact}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-3xl bg-grad-green p-6 text-center text-white shadow-glow"
        >
          <div className="text-5xl">{finalStars >= 3 ? "🏆" : "🦁"}</div>
          <div className="mt-2 font-display text-2xl font-extrabold">{t("wellDone")}</div>
          <div className="mt-1 text-xl">{"⭐".repeat(finalStars)}</div>
          <div className="mt-2 text-sm opacity-90">{finalScore}/{TARGET} animals identified!</div>
          <p className="mt-3 rounded-2xl bg-white/20 p-3 text-left text-xs backdrop-blur">
            🤖 Gemini AI: {finalScore >= TARGET - 1 ? "Excellent nature vocabulary! Strong visual discrimination skills detected." : "Keep learning about animals! Nature walks and animal books will boost vocabulary."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
