// Animal Safari Quiz — identify the animal from 4 emoji choices
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Confetti } from "@/components/vidya/confetti";
import { useLang } from "@/lib/lang-context";
import { VoiceTutorUi } from "@/components/vidya/voice-tutor-ui";
import type { LangCode } from "@/lib/i18n";

const ANIMALS: { emoji: string; names: Record<LangCode, string>; sound: string; fact: Record<LangCode, string> }[] = [
  { 
    emoji: "🐘", 
    names: { en: "Elephant", hi: "हाथी", mr: "हत्ती", gu: "હાથી", ta: "யானை", te: "ఏనుగు", kn: "ಆನೆ" }, 
    sound: "Trumpet 🎺", 
    fact: {
      en: "Elephants never forget! They have amazing memories.",
      hi: "हाथी कभी नहीं भूलते! उनकी याददाश्त कमाल की होती है।",
      mr: "हत्ती कधीही विसरत नाहीत! त्यांची स्मरणशक्ती अप्रतिम असते।",
      gu: "હાથી ક્યારેય ભૂલતા નથી! તેમની યાદશક્તિ અદ્ભુત હોય છે.",
      ta: "யானைகள் எதையும் மறப்பதில்லை! அவற்றிற்கு அற்புதமான நினைவாற்றல் உண்டு.",
      kn: "ಆನೆಗಳು ಎಂದಿಗೂ ಮರೆಯುವುದಿಲ್ಲ! ಅವುಗಳಿಗೆ ಅದ್ಭುತ ನೆನಪಿನ ಶಕ್ತಿ ಇದೆ.",
      te: "ఏనుగులు ఎప్పటికీ మర్చిపోవు! వాటికి అద్భుతమైన జ్ఞాపకశక్తి ఉంటుంది."
    }
  },
  { 
    emoji: "🦁", 
    names: { en: "Lion", hi: "शेर", mr: "सिंह", gu: "સિંહ", ta: "சிங்கம்", te: "సింహం", kn: "ಸಿಂಹ" }, 
    sound: "Roar 🌟", 
    fact: {
      en: "The lion is called the King of the Jungle!",
      hi: "शेर को जंगल का राजा कहा जाता है!",
      mr: "सिंहाला जंगलाचा राजा म्हणतात!",
      gu: "સિંહને જંગલનો રાજા કહેવામાં આવે છે!",
      ta: "சிங்கம் காட்டின் ராஜா என்று அழைக்கப்படுகிறது!",
      kn: "ಸಿಂಹವನ್ನು ಕಾಡಿನ ರಾಜ ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ!",
      te: "సింహాన్ని అడవికి రాజు అని పిలుస్తారు!"
    }
  },
  { 
    emoji: "🐒", 
    names: { en: "Monkey", hi: "बंदर", mr: "माकड", gu: "વાંદરો", ta: "குரங்கு", te: "కోతి", kn: "ಕೋತಿ" }, 
    sound: "Chatter 🍌", 
    fact: {
      en: "Monkeys love bananas and are very clever!",
      hi: "बंदरों को केले बहुत पसंद हैं और वे बहुत चालाक होते हैं!",
      mr: "माकडांना केळी खूप आवडतात आणि ते खूप हुशार असतात!",
      gu: "વાંદરાઓને કેળાં ખૂબ ગમે છે અને તેઓ ખૂબ હોંશિયાર હોય છે!",
      ta: "குரங்குகளுக்கு வாழைப்பழம் மிகவும் பிடிக்கும், அவை மிகவும் புத்திசாலிகள்!",
      kn: "ಕೋತಿಗಳಿಗೆ ಬಾಳೆಹಣ್ಣು ತುಂಬಾ ಇಷ್ಟ ಮತ್ತು ಅವು ತುಂಬಾ ಚಾಣಾಕ್ಷವಾಗಿರುತ್ತವೆ!",
      te: "కోతులకు అరటిపండ్లు అంటే చాలా ఇష్టం మరియు అవి చాలా తెలివైనవి!"
    }
  },
  { 
    emoji: "🦊", 
    names: { en: "Fox", hi: "लोमड़ी", mr: "कोल्हा", gu: "શિયાળ", ta: "நரி", te: "నక్క", kn: "ನರಿ" }, 
    sound: "Yelp 🌙", 
    fact: {
      en: "Foxes are the cleverest animals in the forest!",
      hi: "लोमड़ी जंगल की सबसे चालाक जानवर होती है!",
      mr: "कोल्हा हा जंगलातील सर्वात हुशार प्राणी आहे!",
      gu: "શિયાળ જંગલમાં સૌથી હોંશિયાર પ્રાણી છે!",
      ta: "காட்டில் உள்ள விலங்குகளில் நரி மிகவும் தந்திரமானது!",
      kn: "ನರಿಗಳು ಕಾಡಿನಲ್ಲಿ ಅತ್ಯಂತ ಚಾಣಾಕ್ಷ ಪ್ರಾಣಿಗಳು!",
      te: "అడవిలో నక్కలు అత్యంత తెలివైన జంతువులు!"
    }
  },
  { 
    emoji: "🐸", 
    names: { en: "Frog", hi: "मेंढक", mr: "बेडूक", gu: "દેડકો", ta: "தவளை", te: "కప్ప", kn: "ಕಪ್ಪೆ" }, 
    sound: "Ribbit 💧", 
    fact: {
      en: "Frogs can jump 20 times their body length!",
      hi: "मेंढक अपने शरीर की लंबाई से 20 गुना कूद सकते हैं!",
      mr: "बेडूक त्यांच्या शरीराच्या लांबीच्या 20 पट उडी मारू शकतात!",
      gu: "દેડકાઓ તેમના શરીરની લંબાઈ કરતાં 20 ગણો કૂદકો મારી શકે છે!",
      ta: "தவளைகள் தங்கள் உடலின் நீளத்தை விட 20 மடங்கு அதிகமாக குதிக்கக்கூடும்!",
      kn: "ಕಪ್ಪೆಗಳು ತಮ್ಮ ದೇಹದ ಉದ್ದಕ್ಕಿಂತ 20 ಪಟ್ಟು ಹೆಚ್ಚು ಜಿಗಿಯಬಲ್ಲವು!",
      te: "కప్పలు తమ శరీర పొడవు కంటే 20 రెట్లు దూకగలవు!"
    }
  },
  { 
    emoji: "🦋", 
    names: { en: "Butterfly", hi: "तितली", mr: "फुलपाखरू", gu: "પતંગિયું", ta: "பட்டாம்பூச்சி", te: "சீతాకోకచిలుక", kn: "ಚಿಟ್ಟೆ" }, 
    sound: "Flutter 🌸", 
    fact: {
      en: "Butterflies taste with their feet!",
      hi: "तितलियाँ अपने पैरों से स्वाद लेती हैं!",
      mr: "फुलपाखरे त्यांच्या पायाने चव घेतात!",
      gu: "પતંગિયાં તેમના પગ વડે સ્વાદ લે છે!",
      ta: "பட்டாம்பூச்சிகள் தங்களது கால்களால் சுவையை உணர்கின்றன!",
      kn: "ಚಿಟ್ಟೆಗಳು ತಮ್ಮ ಕಾಲುಗಳಿಂದ ರುಚಿ ನೋಡುತ್ತವೆ!",
      te: "సీతాకోకచిలుకలు వాటి కాళ్లతో రుచి చూస్తాయి!"
    }
  }
];

const LOCALIZED_SAFARI_SOUNDS: Record<LangCode, (name: string, sound: string, fact: string) => string> = {
  en: (name, sound, fact) => `${name} says '${sound}'. Fun fact: ${fact}`,
  hi: (name, sound, fact) => `${name} '${sound}' की आवाज़ करता है। मज़ेदार तथ्य: ${fact}`,
  mr: (name, sound, fact) => `${name} '${sound}' असा आवाज करतो। मनोरंजक तथ्य: ${fact}`,
  gu: (name, sound, fact) => `${name} '${sound}' અવાજ કરે છે. મજેદાર હકીકત: ${fact}`,
  ta: (name, sound, fact) => `${name} '${sound}' என்று சத்தம் போடும். சுவாரஸ்யமான உண்மை: ${fact}`,
  kn: (name, sound, fact) => `${name} '${sound}' ಶಬ್ದ ಮಾಡುತ್ತದೆ. ಆಸಕ್ತಿದಾಯಕ ಸಂಗತಿ: ${fact}`,
  te: (name, sound, fact) => `${name} '${sound}' అంటుంది. ఆసక్తికరమైన నిజం: ${fact}`,
};

const LOCALIZED_SAFARI_MISSED: Record<LangCode, (wrongName: string, rightName: string, emoji: string, fact: string) => string> = {
  en: (wn, rn, em, fact) => `This is a ${wn}! The correct answer was ${rn} ${em}. ${fact}`,
  hi: (wn, rn, em, fact) => `यह एक ${wn} है! सही उत्तर ${rn} ${em} था। ${fact}`,
  mr: (wn, rn, em, fact) => `हा ${wn} आहे! योग्य उत्तर ${rn} ${em} होते। ${fact}`,
  gu: (wn, rn, em, fact) => `આ એક ${wn} છે! સાચો જવાબ ${rn} ${em} હતો. ${fact}`,
  ta: (wn, rn, em, fact) => `இது ஒரு ${wn}! சரியான விடை ${rn} ${em}. ${fact}`,
  kn: (wn, rn, em, fact) => `ಇದು ${wn}! ಸರಿಯಾದ ಉತ್ತರ ${rn} ${em}. ${fact}`,
  te: (wn, rn, em, fact) => `ఇది ఒక ${wn}! సరైన సమాధానం ${rn} ${em}. ${fact}`,
};

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

interface AnimalQuizProps {
  onComplete: (stars: number, xp: number) => void;
}

export function AnimalQuiz({ onComplete }: AnimalQuizProps) {
  const { t, lang } = useLang();
  const [usedIndices, setUsedIndices] = useState(new Set<number>());
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

  // Restart quiz when language shifts
  useEffect(() => {
    setUsedIndices(new Set());
    const available = ANIMALS.map((_, i) => i);
    const correctIdx = available[Math.floor(Math.random() * available.length)];
    const correct = ANIMALS[correctIdx];
    const wrongs = shuffle(ANIMALS.filter((_, i) => i !== correctIdx)).slice(0, 3);
    const options = shuffle([correct, ...wrongs]);
    setQuestion({ correct, correctIdx, options });
    setSelected(null);
    setIsCorrect(null);
    setScore(0);
    setTotal(0);
    setFact("");
    setFinished(false);
  }, [lang]);

  const handleAnswer = useCallback((idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = ANIMALS[idx].emoji === question.correct.emoji;
    setIsCorrect(correct);
    setTotal(t2 => t2 + 1);
    if (correct) setScore(s => s + 1);

    const speakTemp = LOCALIZED_SAFARI_SOUNDS[lang as LangCode] || LOCALIZED_SAFARI_SOUNDS.en;
    const missTemp = LOCALIZED_SAFARI_MISSED[lang as LangCode] || LOCALIZED_SAFARI_MISSED.en;

    const correctName = question.correct.names[lang as LangCode];
    const wrongName = ANIMALS[idx].names[lang as LangCode];
    const correctFact = question.correct.fact[lang as LangCode] || question.correct.fact.en;

    setFact(correct
      ? speakTemp(correctName, question.correct.sound, correctFact)
      : missTemp(wrongName, correctName, question.correct.emoji, correctFact)
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
    }, 2000);
  }, [selected, question, usedIndices, total, score, lang, onComplete]);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <Confetti active={showConfetti} />

      {!finished ? (
        <div className="w-full flex flex-col items-center gap-6">
          {/* Phonics audio trigger instruction */}
          <div className="w-full">
            <VoiceTutorUi
              expectedPhrase={question.correct.names[lang as LangCode]}
              instructionText={`${t("whichAnimal")} "${question.correct.names[lang as LangCode]}"`}
              successText={t("correctAnswer")}
              onSuccess={() => {
                const correctIdx = question.options.findIndex(o => o.emoji === question.correct.emoji);
                if (correctIdx !== -1) handleAnswer(question.correctIdx);
              }}
            />
          </div>

          <div className="text-8xl select-none p-6 bg-slate-50 dark:bg-slate-900 border rounded-3xl min-h-[140px] flex items-center justify-center shadow-soft">
            {question.correct.emoji}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {question.options.map((opt, i) => {
              const globalIdx = ANIMALS.indexOf(opt);
              return (
                <Button
                  key={i}
                  onClick={() => handleAnswer(globalIdx)}
                  variant="outline"
                  className={`h-16 rounded-2xl font-display text-base font-extrabold border-2 transition-all ${
                    selected === globalIdx
                      ? isCorrect
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-red-500 bg-red-50 text-red-700"
                      : "hover:scale-[1.03] hover:shadow-soft"
                  }`}
                >
                  {opt.names[lang as LangCode]}
                </Button>
              );
            })}
          </div>

          {fact && (
            <div className={`p-4 rounded-2xl border text-xs font-bold leading-relaxed text-center max-w-sm ${
              isCorrect ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"
            }`}>
              {fact}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-3xl border bg-card p-6 shadow-card text-center space-y-4 w-full">
          <span className="text-5xl">🏆🦁</span>
          <h3 className="font-display font-extrabold text-2xl">{t("wellDone")}</h3>
          <p className="text-sm text-muted-foreground">
            Safari animal exploration practice complete!
          </p>
        </div>
      )}
    </div>
  );
}
