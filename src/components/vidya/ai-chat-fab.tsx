import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CANNED = [
  {
    q: /count|number|math/i,
    a: "Let's make counting fun! Try building a tower of 5 blocks, then knock it down and count them again. I'll also unlock a bonus Number Jungle level with jumping frogs 🐸.",
  },
  {
    q: /story|read/i,
    a: "Here's a fresh 4-minute bedtime story: 'The Brave Little Elephant who found a rainbow'. Would you like it in Hindi, Marathi or English?",
  },
  {
    q: /weak|struggl|slow/i,
    a: "Based on the last 7 sessions I noticed attention drops after 8 minutes. Try 2 short 6-minute sessions per day and one memory game before bedtime.",
  },
  {
    q: /alphabet|letter/i,
    a: "Great! Today let's focus on the letter 'M'. I'll queue a tracing exercise, a 'find-the-M' animal hunt, and a song. Reward: 3 stars ⭐.",
  },
  {
    q: /activit|practice|suggest/i,
    a: "Try this: 1) Colour-sort 5 objects in your kitchen. 2) Sing an ABC song together. 3) Draw the shape you see the most today. I'll log it as home practice.",
  },
];

const answerFor = (msg: string) =>
  CANNED.find((c) => c.q.test(msg))?.a ??
  "I'm here to help! Try asking about counting, alphabet, stories, or what your child should practice today.";

export function AiChatFab() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi! I'm your VidyaSetu AI assistant. Ask me anything about your child's learning ✨" },
  ]);

  const send = () => {
    const t = input.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: answerFor(t) }]);
    }, 600);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-grad-purple text-white shadow-glow"
        aria-label="Open AI assistant"
      >
        {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-5 z-40 flex h-[70vh] max-h-[560px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-3xl border bg-card shadow-glow"
          >
            <div className="flex items-center gap-2 bg-grad-purple p-4 text-white">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display font-bold">VidyaSetu AI</div>
                <div className="text-xs opacity-80">Powered by Gemini · Online</div>
              </div>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask anything..."
                className="h-10 flex-1 rounded-full border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <Button size="icon" className="rounded-full" onClick={send}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
