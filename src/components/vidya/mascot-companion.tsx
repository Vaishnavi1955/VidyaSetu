import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, HelpCircle, Heart, X, Volume2, Shield } from "lucide-react";
import { useLiveStats } from "@/lib/live-data";
import { speakText, isTtsSupported } from "@/lib/voice-engine";
import { useLang } from "@/lib/lang-context";
import { Button } from "@/components/ui/button";

export type MascotExpression = "idle" | "happy" | "sad" | "thinking" | "speaking";

// Global custom triggers so games can cause reactions
declare global {
  interface Window {
    triggerMascotCelebrate?: (customText?: string) => void;
    triggerMascotComfort?: (customText?: string) => void;
    triggerMascotHint?: (hintText: string) => void;
    triggerMascotSpeak?: (text: string) => void;
  }
}

export function MascotCompanion() {
  const { stats } = useLiveStats();
  const { lang, t } = useLang();
  const [expression, setExpression] = useState<MascotExpression>("idle");
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Auto-greeting on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const greeting = `Hi ${stats.selectedCollectibleTheme !== "default" ? "Space Cadet" : ""} Aarav! You have a ${stats.streakDays}-day streak! 🔥 Let's play a game together!`;
      say(greeting, "happy");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Set up global listeners so games can hook in
  useEffect(() => {
    window.triggerMascotCelebrate = (customText?: string) => {
      const text = customText || "Woohoo! Awesome job, Aarav! You got it right! ⭐";
      say(text, "happy");
    };

    window.triggerMascotComfort = (customText?: string) => {
      const text = customText || "That's okay, Aarav! Mistakes help us learn. Try again! ❤️";
      say(text, "sad");
    };

    window.triggerMascotHint = (hintText: string) => {
      say(`Here is a little clue: ${hintText} 🤔`, "thinking");
    };

    window.triggerMascotSpeak = (text: string) => {
      say(text, "speaking");
    };

    return () => {
      delete window.triggerMascotCelebrate;
      delete window.triggerMascotComfort;
      delete window.triggerMascotHint;
      delete window.triggerMascotSpeak;
    };
  }, [lang, isMuted]);

  const say = (text: string, expr: MascotExpression = "speaking", durationMs = 6000) => {
    setExpression(expr);
    setBubbleText(text);
    
    if (!isMuted && isTtsSupported()) {
      speakText(text, lang, () => {
        setExpression("idle");
      });
    } else {
      setTimeout(() => {
        setExpression("idle");
      }, durationMs);
    }
  };

  const handleMascotClick = () => {
    // Generate helpful custom hints/conversations based on status
    const prompts = [
      `Hey Aarav! We have unlocked the ${stats.collectibles.length} collectibles in our Room! Let's check them out.`,
      `Your current score is ${stats.xp} XP. Let's aim for 2000! 🚀`,
      `Would you like to play Story Castle or count numbers today? Let's count! 🐸`,
      `Remember, if you ever feel tired, we can take a stretch break together! 🙆‍♂️`
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    say(randomPrompt, "happy");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-5 z-40 flex flex-col items-end">
      {/* Speech Bubble */}
      <AnimatePresence>
        {bubbleText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-3 max-w-[240px] rounded-3xl border bg-card p-4 shadow-glow relative"
          >
            {/* Speech bubble pointer */}
            <div className="absolute bottom-[-8px] right-8 w-4 h-4 bg-card border-r border-b rotate-45" />
            <button 
              onClick={() => setBubbleText(null)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <p className="text-sm font-bold text-foreground leading-relaxed pr-3 select-none">
              {bubbleText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {/* Floating actions menu */}
        <div className="flex flex-col gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full shadow-soft bg-card border-border"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute Mascot" : "Mute Mascot"}
          >
            <Volume2 className={`h-4 w-4 ${isMuted ? "text-muted-foreground line-through" : "text-primary"}`} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full shadow-soft bg-card border-border"
            onClick={handleMascotClick}
            title="Ask Vidy for advice"
          >
            <HelpCircle className="h-4 w-4 text-purple-500" />
          </Button>
        </div>

        {/* Mascot Character Avatar SVG */}
        <motion.div
          whileHover={{ y: -4 }}
          onClick={handleMascotClick}
          className="cursor-pointer select-none drop-shadow-lg relative"
        >
          {/* Sparkles around mascot when celebrating */}
          {expression === "happy" && (
            <div className="absolute inset-[-10px] pointer-events-none">
              <Sparkles className="h-5 w-5 text-yellow-400 absolute top-0 left-0 animate-bounce" />
              <Sparkles className="h-4 w-4 text-yellow-300 absolute top-2 right-1 animate-pulse" />
              <Heart className="h-4 w-4 text-red-400 absolute bottom-1 left-2 animate-bounce" />
            </div>
          )}

          <svg
            width="80"
            height="85"
            viewBox="0 0 80 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Body base (with breathing animation) */}
            <motion.g
              animate={{
                y: expression === "happy" ? [0, -10, 0, -10, 0] : [0, 2, 0],
                rotate: expression === "happy" ? [0, -5, 5, -5, 0] : 0,
              }}
              transition={{
                y: { repeat: expression === "happy" ? 1 : Infinity, duration: expression === "happy" ? 0.6 : 3, ease: "easeInOut" },
                rotate: { duration: 0.6 }
              }}
            >
              {/* Ears / Antennas */}
              <path d="M22 25 L12 12 L28 19 Z" fill="#6366F1" />
              <path d="M58 25 L68 12 L52 19 Z" fill="#6366F1" />
              
              {/* Inner Ears */}
              <path d="M20 22 L14 14 L24 18 Z" fill="#A5B4FC" />
              <path d="M60 22 L66 14 L56 18 Z" fill="#A5B4FC" />

              {/* Head / Body Circle (Cute rounded buddy) */}
              <circle cx="40" cy="42" r="28" fill="url(#buddyGrad)" stroke="#4F46E5" strokeWidth="2.5" />

              {/* Belly patch */}
              <ellipse cx="40" cy="54" rx="18" ry="12" fill="#FFFFFF" opacity="0.9" />

              {/* Belly Logo / Mood Screen */}
              {expression === "happy" && <Heart className="h-4 w-4 text-red-500 fill-red-500 absolute" style={{ transform: "translate(32px, 46px)" }} />}
              {expression === "sad" && <Heart className="h-4 w-4 text-blue-400 absolute" style={{ transform: "translate(32px, 46px)" }} />}
              {expression === "thinking" && <HelpCircle className="h-4 w-4 text-amber-500 absolute" style={{ transform: "translate(32px, 46px)" }} />}
              {(expression === "idle" || expression === "speaking") && <Sparkles className="h-4 w-4 text-indigo-500 absolute" style={{ transform: "translate(32px, 46px)" }} />}

              {/* Eyes Container */}
              <g>
                {/* Left Eye */}
                {expression === "sad" ? (
                  // Sad curved eyes
                  <path d="M26 38 Q32 34 32 38" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" fill="none" />
                ) : expression === "thinking" ? (
                  // Thinking flat eyes
                  <path d="M26 36 H34" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" fill="none" />
                ) : (
                  // Circular blinking eyes
                  <motion.ellipse
                    cx="30"
                    cy="36"
                    rx="4.5"
                    animate={{
                      ry: expression === "happy" ? 6 : [4.5, 0.2, 4.5],
                    }}
                    transition={{
                      ry: { repeat: Infinity, duration: 4, repeatDelay: 3 }
                    }}
                    fill="#1F2937"
                  />
                )}

                {/* Right Eye */}
                {expression === "sad" ? (
                  <path d="M48 38 Q48 34 54 38" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" fill="none" />
                ) : expression === "thinking" ? (
                  <path d="M46 32 L54 36" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" fill="none" />
                ) : (
                  <motion.ellipse
                    cx="50"
                    cy="36"
                    rx="4.5"
                    animate={{
                      ry: expression === "happy" ? 6 : [4.5, 0.2, 4.5],
                    }}
                    transition={{
                      ry: { repeat: Infinity, duration: 4, repeatDelay: 3 }
                    }}
                    fill="#1F2937"
                  />
                )}

                {/* Cheek blushes */}
                {(expression === "happy" || expression === "idle") && (
                  <>
                    <circle cx="23" cy="42" r="3" fill="#F87171" opacity="0.6" />
                    <circle cx="57" cy="42" r="3" fill="#F87171" opacity="0.6" />
                  </>
                )}
              </g>

              {/* Mouth */}
              {expression === "happy" ? (
                // Big smile
                <path d="M36 43 Q40 48 44 43" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none" />
              ) : expression === "sad" ? (
                // Frown
                <path d="M37 45 Q40 42 43 45" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none" />
              ) : expression === "speaking" ? (
                // Speaking open circle mouth
                <motion.ellipse
                  cx="40"
                  cy="44"
                  rx="3"
                  animate={{ ry: [1.5, 4, 1.5] }}
                  transition={{ repeat: Infinity, duration: 0.25 }}
                  fill="#1F2937"
                />
              ) : (
                // Standard small smile
                <path d="M38 43 Q40 45 42 43" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              )}
            </motion.g>
          </svg>

          {/* Glowing pedestal base */}
          <div className="h-1.5 w-14 mx-auto bg-black/10 rounded-full blur-[1px]" />
        </motion.div>
      </div>

      {/* Gradient Definitions */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="buddyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
