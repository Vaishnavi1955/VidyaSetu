import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, HelpCircle, Heart, X, Volume2, Shield } from "lucide-react";
import { useLiveStats } from "@/lib/live-data";
import { speakText, isTtsSupported } from "@/lib/voice-engine";
import { useLang } from "@/lib/lang-context";
import { Button } from "@/components/ui/button";
import type { LangCode } from "@/lib/i18n";

export type MascotExpression = "idle" | "happy" | "sad" | "thinking" | "speaking";

const LOCALIZED_GREETINGS: Record<LangCode, (streak: number, cadet: boolean) => string> = {
  en: (streak, cadet) => `Hi ${cadet ? "Space Cadet " : ""}Aarav! You have a ${streak}-day streak! 🔥 Let's play a game together!`,
  hi: (streak, cadet) => `नमस्ते ${cadet ? "अंतरिक्ष यात्री " : ""}आरव! तुम्हारी ${streak} दिनों की सीखने की लकीर है! 🔥 चलो मिलकर एक खेल खेलते हैं!`,
  mr: (streak, cadet) => `नमस्कार ${cadet ? "अंतराळवीर " : ""}आरव! तुझी ${streak} दिवसांची अभ्यासाची मालिका आहे! 🔥 चला सोबत मिळून एक खेळ खेळूया!`,
  gu: (streak, cadet) => `નમસ્તે ${cadet ? "અંતરિક્ષ યાત્રી " : ""}આરવ! તારી ${streak} દિવસની ધારો છે! 🔥 ચાલો સાથે મળીને એક રમત રમીએ!`,
  ta: (streak, cadet) => `வணக்கம் ${cadet ? "விண்வெளி வீரர் " : ""}ஆரவ்! உனக்கு ${streak} நாட்கள் தொடர் சாதனை உள்ளது! 🔥 வா ஒரு விளையாட்டு விளையாடுவோம்!`,
  kn: (streak, cadet) => `ನಮಸ್ತೆ ${cadet ? "ಗಗನಯಾತ್ರಿ " : ""}ಆರವ್! ನಿನಗೆ ${streak} ದಿನಗಳ ಯಶಸ್ವಿ ಸರಣಿ ಇದೆ! 🔥 ಬನ್ನಿ ಜೊತೆಯಾಗಿ ಆಟವಾಡೋಣ!`,
  te: (streak, cadet) => `ನಮಸ್ತೆ ${cadet ? "ಅಂತರಿಕ್ಷ ಯಾತ್ರಿಕ " : ""}ಆರವ್! ನಿನಗೆ ${streak} ದಿನಗಳ ಸತತ ಗೆಲುವಿನ ಲೈನ್ ಇದೆ! 🔥 ಬನ್ನಿ ಒಟ್ಟಿಗೆ ಆಟವಾಡೋಣ!`,
};

const LOCALIZED_CELEBRATIONS: Record<LangCode, string> = {
  en: "Woohoo! Awesome job, Aarav! You got it right! ⭐",
  hi: "अरे वाह! बहुत बढ़िया आरव! तुम्हारा जवाब बिल्कुल सही है! ⭐",
  mr: "शाब्बास! खूपच छान आरव! तुझे उत्तर अगदी बरोबर आहे! ⭐",
  gu: "વાહ! ખૂબ જ સરસ આરવ! તારો જવાબ સાચો છે! ⭐",
  ta: "சூப்பர்! அருமை ஆரவ்! நீ சரியாக விடையளித்தாய்! ⭐",
  kn: "ಅದ್ಭುತ! ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ ಆರವ್! ನಿನ್ನ ಉತ್ತರ ಸರಿಯಾಗಿದೆ! ⭐",
  te: "భలే చెప్పావు! చాలా బాగా చేసావు ఆరవ్! నీ సమాధానం సరైనది! ⭐",
};

const LOCALIZED_COMFORTS: Record<LangCode, string> = {
  en: "That's okay, Aarav! Mistakes help us learn. Try again! ❤️",
  hi: "कोई बात नहीं आरव! गलतियों से ही हम सीखते हैं। फिर से कोशिश करो! ❤️",
  mr: "काही हरकत नाही आरव! चुकांमधूनच आपण शिकतो। पुन्हा प्रयत्न कर! ❤️",
  gu: "કાંઈ વાંધો નહીં આરવ! ભૂલોથી જ આપણે શીખીએ છીએ. ફરી પ્રયાસ કર! ❤️",
  ta: "பரவாயில்லை ஆரவ்! தவறுகள் நமக்கு கற்றுக்கொடுக்கும். மீண்டும் முயற்சி செய்! ❤️",
  kn: "ಪರವಾಗಿಲ್ಲ ಆರವ್! ತಪ್ಪುಗಳಿಂದಲೇ ನಾವು ಕಲಿಯುವುದು. ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸು! ❤️",
  te: "పర్వాలేదు ఆరవ్! తప్పుల నుండే మనం నేర్చుకుంటాము. మళ్లీ ప్రయత్నించు! ❤️",
};

const LOCALIZED_HINT_PREFIXES: Record<LangCode, (hint: string) => string> = {
  en: (hint) => `Here is a little clue: ${hint} 🤔`,
  hi: (hint) => `यहाँ तुम्हारे लिए एक छोटा संकेत है: ${hint} 🤔`,
  mr: (hint) => `येथे तुझ्यासाठी एक छोटा संकेत आहे: ${hint} 🤔`,
  gu: (hint) => `અહીં તારા માટે એક નાનું સૂચન છે: ${hint} 🤔`,
  ta: (hint) => `உனக்காக ஒரு சிறிய குறிப்பு: ${hint} 🤔`,
  kn: (hint) => `ನಿನಗಾಗಿ ಒಂದು ಸಣ್ಣ ಸುಳಿವು ಇಲ್ಲಿದೆ: ${hint} 🤔`,
  te: (hint) => `నీ కోసం ఒక చిన్న క్లూ ఇక్కడ ఉంది: ${hint} 🤔`,
};

const LOCALIZED_PROMPTS: Record<LangCode, (collectiblesCount: number, xp: number) => string[]> = {
  en: (col, xp) => [
    `Hey Aarav! We have unlocked the ${col} collectibles in our Room! Let's check them out.`,
    `Your current score is ${xp} XP. Let's aim for even higher! 🚀`,
    `Would you like to play Story Castle or count numbers today? Let's count! 🐸`,
    `Remember, if you ever feel tired, we can take a stretch break together! 🙆‍♂️`
  ],
  hi: (col, xp) => [
    `नमस्ते आरव! हमने अपने कमरे में ${col} खिलौने अनलॉक कर लिए हैं! चलो उन्हें देखें।`,
    `तुम्हारा स्कोर ${xp} XP है। चलो इसे और बढ़ाते हैं! 🚀`,
    `आज तुम कहानी महल खेलोगे या संख्या जंगल में गिनना चाहोगे? चलो गिनते हैं! 🐸`,
    `याद रखो आरव, अगर तुम थक जाओ तो हम मिलकर थोड़ा आराम कर सकते हैं! 🙆‍♂️`
  ],
  mr: (col, xp) => [
    `आरव! आपण आपल्या खोलीत ${col} खेळणी उघडली आहेत! चला ती पाहूया।`,
    `तुझा गुण ${xp} XP आहे। चला आणखी वाढवूया! 🚀`,
    `आज तुला गोष्ट वाचायला आवडेल की मोजायला? चला मोजूया! 🐸`,
    `लक्षात ठेव आरव, थकल्यासारखे वाटले तर आपण थोडी विश्रांती घेऊ शकतो! 🙆‍♂️`
  ],
  gu: (col, xp) => [
    `હે આરવ! આપણે ઓરડામાં ${col} રમકડાં અનલૉક કર્યાં છે! ચાલો તેને જોઈએ.`,
    `તારો સ્કોર ${xp} XP છે. ચાલો તેને હજુ વધારીએ! 🚀`,
    `આજે તારે વાર્તા રમવી છે કે સંખ્યા જંગલમાં ગણતरी કરવી છે? ચાલો ગણીએ! 🐸`,
    `યાદ રાખજે આરવ, જો તું થાકી જાય તો આપણે થોડો આરામ કરી શકીએ છીએ! 🙆‍♂️`
  ],
  ta: (col, xp) => [
    `ஹே ஆரவ்! நமது அறையில் ${col} பொம்மைகளைத் திறந்துள்ளோம்! வா பார்க்கலாம்.`,
    `உன் மதிப்பெண் ${xp} XP. அதை இன்னும் அதிகமாக்குவோம்! 🚀`,
    `இன்று கதை மாளிகை விளையாடலாமா அல்லது எண்களை எண்ணலாமா? வா எண்ணுவோம்! 🐸`,
    `நினைவிருக்கட்டும் ஆரவ், களைப்பாக இருந்தால் நாம் சிறிது ஓய்வு எடுத்துக்கொள்ளலாம்! 🙆‍♂️`
  ],
  kn: (col, xp) => [
    `ಹೇ ಆರವ್! ನಾವು ಕೋಣೆಯಲ್ಲಿ ${col} ಆಟಿಕೆಗಳನ್ನು ಅನ್ಲಾಕ್ ಮಾಡಿದ್ದೇವೆ! ಬನ್ನಿ ನೋಡೋಣ.`,
    `ನಿನ್ನ ಅಂಕಗಳು ${xp} XP. ಇನ್ನು ಹೆಚ್ಚು ಮಾಡೋಣ! 🚀`,
    `ಇಂದು ಕಥೆ ಓದುತ್ತೀಯಾ ಅಥವಾ ಎಣಿಕೆ ಮಾಡುತ್ತೀಯಾ? ಬನ್ನಿ ಎಣಿಸೋಣ! 🐸`,
    `ನೆನಪಿಡಿ ಆರವ್, ದಣಿವಾದರೆ ನಾವು ಸ್ವಲ್ಪ ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಬಹುದು! 🙆‍♂️`
  ],
  te: (col, xp) => [
    `ఆరవ్! మనం రూములో ${col} ఆటవస్తువులను అన్లాక్ చేశాము! పద చూద్దాం.`,
    `నీ స్కోరు ${xp} XP. దాన్ని మరింత పెంచుదాం! 🚀`,
    `ఈరోజు కథ చదువుతావా లేక లెక్కలు వేస్తాवा? పద లెక్కిద్దాం! 🐸`,
    `గుర్తుంచుకో ఆరవ్, అలసిపోతే మనం కాసేపు విశ్రాంతి తీసుకుందాం! 🙆‍♂️`
  ]
};

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

  // Auto-greeting on mount or language changes
  useEffect(() => {
    const greetingTemp = LOCALIZED_GREETINGS[lang as LangCode] || LOCALIZED_GREETINGS.en;
    const isCadet = stats.selectedCollectibleTheme !== "default";
    const greeting = greetingTemp(stats.streakDays, isCadet);
    
    const timer = setTimeout(() => {
      say(greeting, "happy");
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [lang]);

  // Set up global listeners so games can hook in
  useEffect(() => {
    window.triggerMascotCelebrate = (customText?: string) => {
      const celebrateText = LOCALIZED_CELEBRATIONS[lang as LangCode] || LOCALIZED_CELEBRATIONS.en;
      const text = customText || celebrateText;
      say(text, "happy");
    };

    window.triggerMascotComfort = (customText?: string) => {
      const comfortText = LOCALIZED_COMFORTS[lang as LangCode] || LOCALIZED_COMFORTS.en;
      const text = customText || comfortText;
      say(text, "sad");
    };

    window.triggerMascotHint = (hintText: string) => {
      const hintTemp = LOCALIZED_HINT_PREFIXES[lang as LangCode] || LOCALIZED_HINT_PREFIXES.en;
      say(hintTemp(hintText), "thinking");
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
      speakText(text, lang as LangCode, () => {
        setExpression("idle");
      });
    } else {
      setTimeout(() => {
        setExpression("idle");
      }, durationMs);
    }
  };

  const handleMascotClick = () => {
    const poolTemp = LOCALIZED_PROMPTS[lang as LangCode] || LOCALIZED_PROMPTS.en;
    const prompts = poolTemp(stats.collectibles.length, stats.xp);
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
