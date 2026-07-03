import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Gift, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLiveStats } from "@/lib/live-data";

// Global custom triggers so games can summon the Reward Box
declare global {
  interface Window {
    triggerRewardBox?: () => void;
  }
}

const REWARDS_POOL = [
  { id: "hat-explorer", name: "Explorer Hat", emoji: "🤠", type: "accessory" },
  { id: "crown-golden", name: "Golden Crown", emoji: "👑", type: "accessory" },
  { id: "pet-lion", name: "Baby Lion Sheru", emoji: "🦁", type: "pet" },
  { id: "pet-bird", name: "Chirpy Bird", emoji: "🐦", type: "pet" },
  { id: "theme-space", name: "Space Galaxy Theme", emoji: "🌌", type: "theme" }
];

export function RewardBoxModal() {
  const { addCollectible } = useLiveStats();
  const [open, setOpen] = useState(false);
  const [boxState, setBoxState] = useState<"closed" | "opening" | "opened">("closed");
  const [revealedReward, setRevealedReward] = useState<typeof REWARDS_POOL[number] | null>(null);

  useEffect(() => {
    window.triggerRewardBox = () => {
      // Pick a random reward
      const reward = REWARDS_POOL[Math.floor(Math.random() * REWARDS_POOL.length)];
      setRevealedReward(reward);
      setBoxState("closed");
      setOpen(true);
    };

    return () => {
      delete window.triggerRewardBox;
    };
  }, []);

  const openBox = () => {
    setBoxState("opening");
    
    // Play opening delay and particle effect
    setTimeout(() => {
      setBoxState("opened");
      if (revealedReward) {
        addCollectible(revealedReward.id);
        if (window.triggerMascotCelebrate) {
          window.triggerMascotCelebrate(`Awesome! You unlocked the ${revealedReward.name}! Check it out on your shelf! 🎁`);
        }
      }
    }, 1500);
  };

  const handleClose = () => {
    setOpen(false);
    setBoxState("closed");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-sm sm:rounded-3xl border-0 p-6 overflow-hidden">
        <DialogTitle className="sr-only">Mystery Reward Box</DialogTitle>
        
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center py-4">
          <AnimatePresence mode="wait">
            {boxState === "closed" && (
              /* Closed Box state */
              <motion.div
                key="closed"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-1 rounded-full bg-yellow-100 dark:bg-yellow-950 px-3 py-1 text-xs font-bold text-yellow-700 dark:text-yellow-400">
                  <Sparkles className="h-3.5 w-3.5" /> Surprise Reward Box!
                </div>
                
                <h3 className="font-display font-extrabold text-xl">You Unlocked a Mystery Chest!</h3>
                <p className="text-xs text-muted-foreground max-w-[240px] mx-auto">
                  Click the glowing box below to open it and claim your surprise accessory or pet!
                </p>

                {/* Animated pulsing gift box */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.08, 1],
                    rotate: [0, -2, 2, -2, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2.2, 
                    ease: "easeInOut" 
                  }}
                  onClick={openBox}
                  className="cursor-pointer select-none py-6 flex justify-center text-8xl filter drop-shadow-xl"
                >
                  🎁
                </motion.div>

                <Button
                  onClick={openBox}
                  className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold px-6"
                >
                  Open Reward Box! <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {boxState === "opening" && (
              /* Opening Box state with spinning light rays */
              <motion.div
                key="opening"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center gap-4"
              >
                {/* Rotating sparkles circle */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="text-8xl select-none filter drop-shadow-lg"
                >
                  ✨
                </motion.div>
                <h4 className="font-display font-extrabold text-lg text-indigo-600 animate-pulse">
                  Unlocking Magic Box...
                </h4>
              </motion.div>
            )}

            {boxState === "opened" && revealedReward && (
              /* Opened / Reward Revealed state */
              <motion.div
                key="opened"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  <Trophy className="h-3.5 w-3.5" /> Item Collected!
                </div>

                <h3 className="font-display font-extrabold text-2xl">Congratulations Aarav!</h3>
                <p className="text-xs text-muted-foreground">
                  You unlocked a new {revealedReward.type}:
                </p>

                {/* Big revealed accessory/pet */}
                <motion.div
                  initial={{ rotate: -15, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="text-9xl py-4 select-none filter drop-shadow-xl"
                >
                  {revealedReward.emoji}
                </motion.div>

                <div>
                  <span className="font-display font-extrabold text-lg block text-indigo-600">
                    {revealedReward.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Access it in your digital Room and Achievements shelf
                  </span>
                </div>

                <Button
                  onClick={handleClose}
                  className="w-full rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 mt-4 shadow-soft"
                >
                  Claim & Return
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
