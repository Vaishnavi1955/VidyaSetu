import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, Bot, CornerDownLeft, Sparkles, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceAssistant } from "@/hooks/use-voice-assistant";
import { speakText } from "@/lib/voice-engine";
import { useLang } from "@/lib/lang-context";

interface Character {
  id: string;
  name: string;
  emoji: string;
  color: string;
  initialGreeting: string;
  fallbackReplies: string[];
  patterns: { keywords: RegExp; reply: string }[];
}

const CHARACTERS: Character[] = [
  {
    id: "astronaut",
    name: "Astronaut Alex",
    emoji: "👨‍🚀",
    color: "bg-blue-600",
    initialGreeting: "Greetings, Space Cadet Aarav! I am floating in my rocket ship looking at Earth. Do you know what planet we live on?",
    fallbackReplies: [
      "That is amazing! Up here, there is zero gravity so my food floats around! Do you like stars?",
      "Cool! The Moon is our closest neighbor. Should we fly our rocket there next?",
      "Space is so big and beautiful. Let's sing a space song: Twinkle Twinkle Little Star!"
    ],
    patterns: [
      { keywords: /earth/i, reply: "Yes! Earth is our blue planet. It's beautiful from up here! 🌍" },
      { keywords: /star|stars|moon/i, reply: "Stars are hot glowing balls of fire! The moon glows in the dark. 🌟" },
      { keywords: /rocket|ship|fly/i, reply: "Zoom! My rocket flies at super speed to reach space! 🚀" }
    ]
  },
  {
    id: "lion",
    name: "Sheru the Lion",
    emoji: "🦁",
    color: "bg-amber-500",
    initialGreeting: "Roar! Hello Aarav, I am Sheru, king of the grassy plains! I love running in the wild. What is your favorite animal?",
    fallbackReplies: [
      "Roar-some! Animals are so cool. I love taking long naps under big trees. What do you like to eat?",
      "That is neat! My paws are very big and help me run super fast. Do you want to try roaring with me? Roar!",
      "Jungle life is full of adventures! My friends are monkeys and birds. Who is your best friend?"
    ],
    patterns: [
      { keywords: /eat|food|meat|fruit/i, reply: "I love meat, but monkeys love bananas 🍌 and elephants love leaves! 🌿" },
      { keywords: /roar|sound/i, reply: "Roar! That was a loud roar, Aarav! You are a brave lion cub! 🦁" },
      { keywords: /cat|dog|pet/i, reply: "Cats are my little cousins! They go meow, and dogs go woof! 🐶" }
    ]
  },
  {
    id: "doctor",
    name: "Dr. Divya",
    emoji: "👩‍⚕️",
    color: "bg-emerald-600",
    initialGreeting: "Hello Aarav! I am Dr. Divya. I help children stay strong and healthy! Did you eat any healthy fruits today?",
    fallbackReplies: [
      "Excellent! Fruits give us magic vitamins to play all day long. Remember to sleep 9 hours!",
      "Wonderful! Washing our hands with soap keeps tiny bugs away. Wash, wash, wash!",
      "Staying active makes our muscles happy. Let's do 3 jumps together! Hop, hop, hop!"
    ],
    patterns: [
      { keywords: /yes|apple|banana|mango/i, reply: "Yum! Fruits are superfoods that make you grow strong! 🍎" },
      { keywords: /no|pizza|candy/i, reply: "Candies are okay sometimes, but crunchy carrots and apples make your teeth strong! 🥕" },
      { keywords: /soap|wash|hand/i, reply: "Yes! Washing hands for 20 seconds makes germs go bye-bye! 🧼" }
    ]
  }
];

export function VoiceRoleplay() {
  const { lang } = useLang();
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [history, setHistory] = useState<{ sender: "child" | "buddy"; text: string }[]>([]);
  const [isAiReplying, setIsAiReplying] = useState(false);

  // Use voice hook to capture children's speech
  const {
    transcript,
    isListening,
    startListening,
    stopListening
  } = useVoiceAssistant({
    expectedPhrase: "hello", // Dummy trigger, we evaluate transcripts dynamically
    lang,
    onSuccess: () => {},
    onFailure: () => {}
  });

  // Greet child when character changes
  useEffect(() => {
    if (!selectedChar) return;
    
    setHistory([{ sender: "buddy", text: selectedChar.initialGreeting }]);
    speakText(selectedChar.initialGreeting, lang);
  }, [selectedChar]);

  // When speech transcript changes, add to history when finalized
  const handleVoiceInputFinished = (spokenText: string) => {
    if (!spokenText.trim() || !selectedChar) return;

    // Add user question to timeline
    const userMsg = spokenText.trim();
    setHistory(prev => [...prev, { sender: "child", text: userMsg }]);
    setIsAiReplying(true);

    // AI logic response
    setTimeout(() => {
      let reply = "";
      const match = selectedChar.patterns.find(p => p.keywords.test(userMsg));
      if (match) {
        reply = match.reply;
      } else {
        const fallbacks = selectedChar.fallbackReplies;
        reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }

      setHistory(prev => [...prev, { sender: "buddy", text: reply }]);
      setIsAiReplying(false);
      speakText(reply, lang);
    }, 1200);
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        handleVoiceInputFinished(transcript);
      }
    } else {
      startListening();
    }
  };

  // If browser finished recognition, trigger reply
  useEffect(() => {
    if (!isListening && transcript && selectedChar) {
      handleVoiceInputFinished(transcript);
    }
  }, [isListening]);

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-card max-w-xl mx-auto">
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-indigo-600" />
          <h3 className="font-display font-extrabold text-base">Voice Roleplay</h3>
        </div>
        {selectedChar && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-full h-8"
            onClick={() => {
              stopListening();
              setSelectedChar(null);
              setHistory([]);
            }}
          >
            <RefreshCw className="mr-1 h-3.5 w-3.5" /> Change Buddy
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!selectedChar ? (
          /* Selection Screen */
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <p className="text-xs text-muted-foreground mb-4">Pick a friendly companion to speak with using your microphone:</p>
            <div className="grid gap-3">
              {CHARACTERS.map(char => (
                <button
                  key={char.id}
                  onClick={() => setSelectedChar(char)}
                  className="flex items-center justify-between p-4 rounded-2xl border bg-background hover:bg-muted text-left transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{char.emoji}</span>
                    <div>
                      <span className="font-display font-extrabold text-sm block">{char.name}</span>
                      <span className="text-xs text-muted-foreground">Tap to speak together</span>
                    </div>
                  </div>
                  <span className="text-indigo-600 font-extrabold text-xs">Chat 💬</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Conversation Screen */
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-[400px]"
          >
            {/* Conversation Feed */}
            <div className="flex-1 overflow-y-auto space-y-3 p-1">
              {history.map((h, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 max-w-[85%] ${h.sender === "child" ? "ml-auto flex-row-reverse" : ""}`}
                >
                  <div className={`grid h-8 w-8 place-items-center rounded-full shrink-0 text-sm ${
                    h.sender === "child" ? "bg-slate-200 text-slate-800" : `${selectedChar.color} text-white`
                  }`}>
                    {h.sender === "child" ? <User className="h-4 w-4" /> : selectedChar.emoji}
                  </div>
                  <div className={`rounded-2xl px-3 py-2 text-sm font-semibold leading-relaxed shadow-soft ${
                    h.sender === "child"
                      ? "bg-indigo-600 text-white"
                      : "bg-muted text-foreground"
                  }`}>
                    {h.text}
                  </div>
                </div>
              ))}

              {isAiReplying && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground p-1 animate-pulse">
                  <span>{selectedChar.name} is thinking...</span>
                </div>
              )}
            </div>

            {/* Mic control triggers */}
            <div className="border-t pt-4 flex flex-col items-center gap-2">
              {isListening && (
                <span className="text-xs font-bold text-red-500 animate-pulse">
                  Listening: "{transcript || "speak now..."}"
                </span>
              )}
              
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMic}
                  className={`grid h-16 w-16 place-items-center rounded-full text-white shadow-glow ${
                    isListening ? "bg-red-500 animate-pulse" : "bg-indigo-600"
                  }`}
                  title={isListening ? "Stop listening" : "Start speaking"}
                >
                  {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </motion.button>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {isListening ? "Tap red button to send speech" : "Tap blue microphone to reply with your voice"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
