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
  
  // Initialize story based on current language
  const [story] = useState(() => generateStory(lang as LangCode));
  const [step, setStep] = useState(0);
  const [questionUnlocked, setQuestionUnlocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const startTime = useMemo(() => Date.now(), []);

  const questions = useMemo(() => {
    return getQuestionsForStory(story.title, lang);
  }, [story.title, lang]);

  const currentQuestion = questions[step] || { q: "Do you like the story?", a: "yes" };

  // Speak the paragraph first when page loads
  useEffect(() => {
    if (finished) return;
    setQuestionUnlocked(false);
    
    // Speak the paragraph text
    const paragraphText = story.paragraphs[step];
    speakText(paragraphText, lang as LangCode, () => {
      // Auto-unlock question prompt after reading paragraph
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

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            {step === 0 && (
              <div className="text-xl font-display font-bold text-center text-primary mb-2">
                {story.title}
              </div>
            )}
            
            <div className="w-full rounded-3xl bg-card border shadow-card p-6 min-h-[120px] flex items-center text-center">
              <p className="text-base md:text-lg font-medium leading-relaxed">
                {story.paragraphs[step]}
              </p>
            </div>

            {/* AI Voice Question evaluation */}
            <div className="w-full rounded-3xl bg-purple-50/50 border-2 border-dashed border-brand-purple/20 p-5 mt-2 flex flex-col items-center">
              <span className="text-xs uppercase font-extrabold text-brand-purple mb-1">Comprehension Question</span>
              <p className="text-sm font-bold text-center text-foreground mb-3">{currentQuestion.q}</p>
              
              <VoiceTutorUi
                expectedAnswer={currentQuestion.a}
                instructionText={`${currentQuestion.q}`}
                onCorrect={() => {
                  setQuestionUnlocked(true);
                }}
                onIncorrect={() => {}}
                onCommand={(cmd) => {
                  if (cmd === "next" && questionUnlocked) {
                    nextStep();
                  }
                }}
                themeColor="bg-grad-purple"
                voiceFeedbackPhrase="Correct answer! Well done! You unlocked the next page."
              />
            </div>
            
            <Button 
              onClick={nextStep} 
              disabled={!questionUnlocked}
              size="lg" 
              className="mt-4 rounded-full bg-grad-purple text-white shadow-soft font-bold px-8"
            >
              {step === story.paragraphs.length - 1 ? "Finish Story 🎉" : "Next Page ➡️"}
            </Button>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-3xl bg-grad-purple p-6 text-center text-white shadow-glow"
        >
          <div className="text-5xl">🏰</div>
          <div className="mt-2 font-display text-2xl font-extrabold">Story Finished!</div>
          <div className="mt-1 text-xl">⭐⭐⭐</div>
          <p className="mt-3 rounded-2xl bg-white/20 p-3 text-left text-xs backdrop-blur">
            🤖 Gemini AI: Excellent reading session! Exploring stories builds imagination, vocabulary, and empathy. The more we read, the more we learn!
          </p>
        </motion.div>
      )}
    </div>
  );
}
