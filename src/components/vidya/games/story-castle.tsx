import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Confetti } from "@/components/vidya/confetti";
import { useLang } from "@/lib/lang-context";
import { generateStory } from "@/lib/ai-engine";
import { Button } from "@/components/ui/button";
import { VoiceTutorUi } from "@/components/vidya/voice-tutor-ui";
import { useLiveStats } from "@/lib/live-data";
import { speakText } from "@/lib/voice-engine";
import type { LangCode } from "@/lib/i18n";

interface StoryCastleProps {
  onComplete: (stars: number, xp: number) => void;
}

function getQuestionsForStory(title: string, lang: string): { q: string; a: string }[] {
  if (lang === "hi") {
    return [
      { q: "पेड़ पर छोटू क्या गिनता था?", a: "आम" },
      { q: "सभी फलों को किसने मिला दिया था?", a: "हाथी" },
      { q: "हाथी ने छोटू को इनाम में क्या दिया?", a: "सितारा" },
      { q: "छोटू ने किसे गिनना सिखाया?", a: "दोस्तों" },
    ];
  }
  if (lang === "mr") {
    return [
      { q: "झाडावर छोटू काय मोजायचा?", a: "आंबे" },
      { q: "सर्व फळे कोणी एकत्र मिसळली होती?", a: "हत्ती" },
      { q: "हत्तीने छोटूला काय बक्षीस दिले?", a: "तारा" },
      { q: "छोटूने कोणाला मोजायला शिकवले?", a: "मित्रांना" },
    ];
  }
  if (lang === "ta") {
    return [
      { q: "மரத்தில் சிட்டு என்ன எண்ணியது?", a: "மாம்பழங்களை" },
      { q: "எல்லா பழங்களையும் கலைத்தது யார்?", a: "யானை" },
      { q: "யானை சிட்டுக்கு என்ன கொடுத்தது?", a: "நட்சத்திரம்" },
      { q: "சிட்டு யாருக்கு எண்ண கற்றுக்கொடுத்தது?", a: "நண்பர்களுக்கு" },
    ];
  }
  if (lang === "gu") {
    return [
      { q: "છોટુ ઝાડ પર શું ગણતો હતો?", a: "કેરી" },
      { q: "બધાં ફળો કોણે ભેળવી દીધાં?", a: "હાથી" },
      { q: "હાથીએ છોટુને શું આપ્યું?", a: "સ્ટાર" },
      { q: "છોટુએ કોને ગણતરી શીખવી?", a: "મિત્રો" },
    ];
  }
  if (lang === "kn") {
    return [
      { q: "ಚಿಟ್ಟಿ ಮರದ ಹಣ್ಣುಗಳಲ್ಲಿ ಏನನ್ನು ಎಣಿಸುತ್ತಿತ್ತು?", a: "ಮಾವಿನ ಹಣ್ಣು" },
      { q: "ಎಲ್ಲಾ ಹಣ್ಣುಗಳನ್ನು ಮಿಶ್ರ ಮಾಡಿದ್ದು ಯಾರು?", a: "ಆನೆ" },
      { q: "ಆನೆ ಚಿಟ್ಟಿಗೆ ಏನು ಕೊಟ್ಟಿತು?", a: "ನಕ್ಷತ್ರ" },
      { q: "ಚಿಟ್ಟಿ ಯಾರಿಗೆ ಎಣಿಕೆ ಕಲಿಸಿತು?", a: "ಗೆಳೆಯರಿಗೆ" },
    ];
  }
  if (lang === "te") {
    return [
      { q: "చెట్టుపై చిట్టి ఏం లెక్కించేది?", a: "మామిడిపండ్లు" },
      { q: "అన్ని పళ్ళను ఎవరు కలిపేశారు?", a: "ఏనుగు" },
      { q: "ఏనుగు చిట్టికి ఏమి ఇచ్చింది?", a: "నక్షత్రం" },
      { q: "చిట్టి ఎవరికి లెక్కించడం నేర్పింది?", a: "స్నేహితులకు" },
    ];
  }
  if (title.includes("Rani") || title.includes("रानी")) {
    return [
      { q: "Where did Rani love to go?", a: "forest" },
      { q: "What blew the letters away?", a: "wind" },
      { q: "What did Rani do to the letters?", a: "sing" },
      { q: "What appeared in the sky?", a: "rainbow" },
    ];
  }
  return [
    { q: "What did Chotu count on his tree?", a: "mangoes" },
    { q: "Who mixed up all the fruits?", a: "elephant" },
    { q: "What did the elephant give to Chotu?", a: "gold star" },
    { q: "Who did Chotu teach to count?", a: "friends" },
  ];
}

export function StoryCastle({ onComplete }: StoryCastleProps) {
  const { lang, t } = useLang();
  const { logReadingSession } = useLiveStats();
  
  // Track story state and update when language changes
  const [story, setStory] = useState(() => generateStory(lang as LangCode));
  const [step, setStep] = useState(0);
  const [questionUnlocked, setQuestionUnlocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const startTime = useMemo(() => Date.now(), []);

  useEffect(() => {
    setStory(generateStory(lang as LangCode));
    setStep(0);
    setFinished(false);
  }, [lang]);

  const questions = useMemo(() => {
    return getQuestionsForStory(story.title, lang);
  }, [story.title, lang]);

  const currentQuestion = questions[step] || { q: "Do you like the story?", a: "yes" };

  // Speak the paragraph first when page loads or language changes
  useEffect(() => {
    if (finished) return;
    setQuestionUnlocked(false);
    
    const paragraphText = story.paragraphs[step];
    speakText(paragraphText, lang as LangCode, () => {
      // Completed reading paragraph
    });
  }, [step, story, finished, lang]);

  const nextStep = () => {
    if (step < story.paragraphs.length - 1) {
      setStep(s => s + 1);
    } else {
      setFinished(true);
      const totalTimeSec = Math.round((Date.now() - startTime) / 1000);
      logReadingSession(story.title, 88, totalTimeSec);
      onComplete(3, 30); // 3 stars, 30 XP for reading a story!
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <Confetti active={finished} />

      {!finished ? (
        <div className="w-full flex flex-col items-center gap-6">
          {/* Story Progress */}
          <div className="flex gap-1 w-full justify-center">
            {story.paragraphs.map((_, i) => (
              <div key={i} className={`h-2 w-8 rounded-full transition-all ${i <= step ? "bg-grad-purple" : "bg-muted"}`} />
            ))}
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-card w-full text-center space-y-4">
            <h3 className="font-display font-extrabold text-xl text-indigo-700 dark:text-indigo-400">
              {story.title}
            </h3>
            <p className="text-base font-medium leading-relaxed max-w-lg mx-auto text-slate-800 dark:text-slate-200">
              {story.paragraphs[step]}
            </p>
          </div>

          {/* Interactive Voice Quiz overlay to test reading check */}
          <div className="w-full">
            <VoiceTutorUi
              expectedPhrase={currentQuestion.a}
              instructionText={currentQuestion.q}
              successText={t("correctAnswer")}
              onSuccess={nextStep}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border bg-card p-6 shadow-card text-center space-y-4 w-full">
          <span className="text-5xl">🏰🎉</span>
          <h3 className="font-display font-extrabold text-2xl">{t("wellDone")}</h3>
          <p className="text-sm text-muted-foreground">
            🤖 Gemini AI: Excellent reading session! Exploring stories builds imagination, vocabulary, and empathy. The more we read, the more we learn!
          </p>
        </div>
      )}
    </div>
  );
}
