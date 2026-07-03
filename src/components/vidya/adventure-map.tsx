import { motion } from "framer-motion";
import { Lock, Sparkles, Star } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { WORLDS } from "@/lib/mock-data";

interface AdventureMapProps {
  onSelectWorld: (worldId: string) => void;
}

export function AdventureMap({ onSelectWorld }: AdventureMapProps) {
  const { t } = useLang();

  // Find world coordinates for SVG mapping
  const nodes = WORLDS.map((w, idx) => {
    // Lay nodes out in a winding path: S-curve coordinates
    const coords = [
      { x: 12, y: 15, bg: "from-green-400 to-emerald-600" }, // Alphabet (Forest)
      { x: 38, y: 22, bg: "from-blue-400 to-indigo-600" },   // Number (Ocean)
      { x: 62, y: 12, bg: "from-purple-400 to-indigo-600" }, // Animal (Space)
      { x: 84, y: 25, bg: "from-yellow-400 to-orange-500" }, // Color (Jungle)
      { x: 74, y: 55, bg: "from-pink-400 to-rose-600" },     // Story (Castle)
      { x: 48, y: 68, bg: "from-teal-400 to-cyan-600" },     // Shape (Island)
      { x: 22, y: 52, bg: "from-rose-400 to-red-600" },      // Emotion (Garden)
      { x: 12, y: 82, bg: "from-cyan-400 to-blue-600" }      // Puzzle (Memory Match)
    ];

    return {
      ...w,
      ...coords[idx]
    };
  });

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-card overflow-hidden relative">
      <div className="mb-4">
        <h3 className="font-display font-extrabold text-base flex items-center gap-1.5">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          {t("myWorld") || "Daily Adventure Map"}
        </h3>
        <p className="text-xs text-muted-foreground">Follow the glowing path to complete daily exercises</p>
      </div>

      {/* SVG Canvas Map Container */}
      <div className="relative w-full aspect-[2/1] rounded-2xl bg-sky-50 dark:bg-slate-950 overflow-hidden border">
        {/* Sky/Ocean clouds overlay background */}
        <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-5">
          <div className="absolute top-2 left-6 h-12 w-28 bg-white rounded-full blur-md" />
          <div className="absolute top-16 right-12 h-10 w-24 bg-white rounded-full blur-md" />
          <div className="absolute bottom-8 left-1/3 h-14 w-32 bg-white rounded-full blur-md" />
        </div>

        {/* Winding Connection Paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>

          {/* Draw connecting paths */}
          {nodes.map((node, i) => {
            if (i === nodes.length - 1) return null;
            const nextNode = nodes[i + 1];
            const isUnlocked = !nextNode.locked;

            return (
              <path
                key={`path-${i}`}
                d={`M ${node.x} ${node.y} Q ${(node.x + nextNode.x) / 2} ${(node.y + nextNode.y) / 2 + (i % 2 === 0 ? 5 : -5)} ${nextNode.x} ${nextNode.y}`}
                fill="none"
                stroke={isUnlocked ? "url(#pathGrad)" : "rgba(203, 213, 225, 0.4)"}
                strokeWidth={isUnlocked ? "2" : "1.5"}
                strokeDasharray={isUnlocked ? "0" : "3,3"}
                className={isUnlocked ? "animate-pulse" : ""}
                style={{
                  strokeLinecap: "round"
                }}
              />
            );
          })}
        </svg>

        {/* Interactive Floating Nodes */}
        {nodes.map((w) => {
          return (
            <div
              key={w.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{ left: `${w.x}%`, top: `${w.y}%` }}
            >
              <motion.button
                whileHover={w.locked ? {} : { scale: 1.1, y: -4 }}
                whileTap={w.locked ? {} : { scale: 0.95 }}
                disabled={w.locked}
                onClick={() => onSelectWorld(w.id)}
                className={`relative flex flex-col items-center select-none group`}
              >
                {/* Glowing ring around unlocked node */}
                {!w.locked && (
                  <div className="absolute inset-[-5px] rounded-full border border-indigo-400 border-dashed animate-spin pointer-events-none opacity-40 group-hover:opacity-100" style={{ animationDuration: "12s" }} />
                )}

                {/* Floating Island Circular Node */}
                <div className={`h-11 w-11 sm:h-14 sm:w-14 grid place-items-center rounded-full text-white font-extrabold shadow-soft text-xl sm:text-2xl bg-gradient-to-br ${
                  w.locked 
                    ? "from-slate-300 to-slate-400 border-slate-400 cursor-not-allowed" 
                    : `${w.bg} border-white/20`
                } border-2`}>
                  {w.locked ? <Lock className="h-4.5 w-4.5 text-slate-100" /> : w.emoji}
                </div>

                {/* Title badge overlay below */}
                <div className={`mt-1.5 px-2 py-0.5 rounded-full border text-[9px] sm:text-[10px] font-extrabold shadow-soft leading-none transition-all ${
                  w.locked
                    ? "bg-slate-200 text-slate-500 border-slate-300"
                    : "bg-white text-slate-800 border-slate-200 group-hover:bg-indigo-600 group-hover:text-white"
                }`}>
                  {t(w.id as any) || w.name}
                </div>

                {/* Stars/Progress badge overlay above */}
                {!w.locked && w.progress > 0 && (
                  <div className="absolute top-[-8px] right-[-5px] bg-yellow-400 text-yellow-950 text-[8px] font-extrabold px-1 py-0.5 rounded-md flex items-center leading-none border border-white">
                    <Star className="h-2 w-2 fill-yellow-950 mr-0.5" />
                    {w.progress}%
                  </div>
                )}
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
