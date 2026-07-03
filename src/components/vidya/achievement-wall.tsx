import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Share2, Palette, Star, ShieldCheck, Heart, User, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiveStats } from "@/lib/live-data";
import { BADGES } from "@/lib/mock-data";

interface ThemeItem {
  id: string;
  name: string;
  emoji: string;
  bgClass: string;
  textColor: string;
  accentColor: string;
}

const ROOM_THEMES: ThemeItem[] = [
  { id: "default", name: "Classic Room", emoji: "🏠", bgClass: "bg-amber-50/70 border-amber-200 dark:bg-slate-900/90", textColor: "text-amber-900 dark:text-amber-100", accentColor: "border-amber-400" },
  { id: "space", name: "Space Galaxy", emoji: "🌌", bgClass: "bg-slate-950 border-indigo-900 text-indigo-100", textColor: "text-indigo-100", accentColor: "border-indigo-500" },
  { id: "ocean", name: "Deep Ocean", emoji: "🌊", bgClass: "bg-sky-950 border-cyan-900 text-cyan-100", textColor: "text-cyan-100", accentColor: "border-cyan-500" },
  { id: "jungle", name: "Wild Jungle", emoji: "🌴", bgClass: "bg-emerald-950 border-green-900 text-emerald-100", textColor: "text-emerald-100", accentColor: "border-green-500" }
];

export function AchievementWall() {
  const { stats, selectTheme } = useLiveStats();
  const [showCertDialog, setShowCertDialog] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const activeTheme = ROOM_THEMES.find(t => t.id === stats.selectedCollectibleTheme) || ROOM_THEMES[0];

  const handleShare = () => {
    setShareSuccess(true);
    setTimeout(() => {
      setShareSuccess(false);
    }, 2500);
    
    if (navigator.share) {
      navigator.share({
        title: "Aarav's Learning Achievement",
        text: `Aarav just completed a milestone in VidyaSetu! Check out Aarav's digital room achievement.`,
        url: window.location.href
      }).catch(() => {});
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Digital Playroom Section */}
      <div className={`rounded-3xl border p-6 shadow-card transition-all duration-500 relative overflow-hidden ${activeTheme.bgClass}`}>
        {/* Background visual effects based on theme */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          {stats.selectedCollectibleTheme === "space" && (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950/0 to-slate-950/0" />
          )}
          {stats.selectedCollectibleTheme === "ocean" && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-cyan-900/30 via-sky-950/0" />
          )}
          {stats.selectedCollectibleTheme === "jungle" && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-green-900/30 via-emerald-950/0" />
          )}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/20 pb-4 mb-6">
          <div>
            <h3 className={`font-display font-extrabold text-lg flex items-center gap-1.5 ${activeTheme.textColor}`}>
              Aarav's Digital Achievement Room
            </h3>
            <p className="text-xs text-muted-foreground">Customize themes to decorate your room shelf</p>
          </div>

          {/* Theme Selector */}
          <div className="flex gap-1.5 flex-wrap">
            {ROOM_THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => selectTheme(theme.id)}
                className={`h-8 px-2.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1 shrink-0 ${
                  stats.selectedCollectibleTheme === theme.id
                    ? "bg-white text-slate-900 border-white scale-105 shadow-glow"
                    : "bg-black/20 text-white border-transparent hover:bg-black/30"
                }`}
              >
                <span>{theme.emoji}</span>
                <span className="hidden sm:inline">{theme.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Shelf representation grid holding trophies/unlocked items */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 min-h-[160px]">
          {/* Trophy 1 */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-soft">
            <span className="text-4xl animate-bounce" style={{ animationDuration: "3s" }}>🏆</span>
            <span className="text-xs font-extrabold text-yellow-400 mt-2">Star Solver</span>
          </div>

          {/* Trophy 2 */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-soft">
            <span className="text-4xl animate-bounce" style={{ animationDuration: "3.5s" }}>🥇</span>
            <span className="text-xs font-extrabold text-yellow-400 mt-2">7-Day Streak</span>
          </div>

          {/* Unlocked Accessories */}
          {stats.collectibles.map((col, i) => {
            const label = col.includes("hat") ? "Explorer Hat 🤠" : "Treasure Badge 🏅";
            return (
              <motion.div
                key={col}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-soft"
              >
                <span className="text-4xl">{col.includes("hat") ? "🤠" : "🏅"}</span>
                <span className="text-xs font-extrabold text-cyan-400 mt-2 text-center leading-tight">{label}</span>
              </motion.div>
            );
          })}

          {/* Empty placeholders on the shelf */}
          {stats.collectibles.length < 2 && (
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-dashed border-white/10 text-white/30 text-xs">
              <span>🔒 Mystery Box</span>
              <span className="text-[10px] mt-1">Unlock with stars</span>
            </div>
          )}
        </div>

        {/* The Wooden Shelf Board visual */}
        <div className="relative z-10 h-3 w-full bg-gradient-to-r from-amber-700 to-amber-900 rounded-full shadow-lg border border-amber-950 mt-1" />
      </div>

      {/* Badges Grid & Certificate Box */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Badges checklist */}
        <div className="rounded-3xl border bg-card p-5 shadow-card">
          <h4 className="font-display font-extrabold text-base mb-3 flex items-center gap-1.5">
            <Award className="h-5 w-5 text-indigo-600" />
            Badges Milestones
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {BADGES.map(b => (
              <div
                key={b.id}
                className="flex flex-col items-center p-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border text-center text-[10px] font-bold"
              >
                <span className="text-2xl">{b.icon}</span>
                <span className="mt-1 leading-tight text-slate-800 dark:text-slate-200">{b.name}</span>
                <span className="text-[9px] text-muted-foreground mt-0.5">{b.requirement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate trigger card */}
        <div className="rounded-3xl border bg-card p-5 shadow-card bg-grad-blue text-white flex flex-col justify-between">
          <div>
            <h4 className="font-display font-extrabold text-lg flex items-center gap-1.5">
              <ShieldCheck className="h-5 w-5 text-yellow-300" />
              VidyaSetu Diploma
            </h4>
            <p className="text-xs text-blue-100 mt-2 leading-relaxed">
              Generate a printable learning diploma certifying Aarav's tracing, phonetics, and speech achievements.
            </p>
          </div>
          <Button
            onClick={() => setShowCertDialog(true)}
            className="w-full rounded-2xl bg-white text-indigo-700 hover:bg-slate-100 font-extrabold h-11 mt-4 shadow-soft"
          >
            Open Certificate 🎓
          </Button>
        </div>
      </div>

      {/* Diploma Certificate Dialog Popup */}
      <Dialog open={showCertDialog} onOpenChange={setShowCertDialog}>
        <DialogContent className="max-w-xl sm:rounded-3xl border-0 p-6">
          {/* Certificate Board Border layout */}
          <div className="border-[8px] border-double border-indigo-900 p-6 rounded-2xl bg-amber-50/20 text-center relative overflow-hidden">
            
            {/* Watermark seal behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <Award className="h-96 w-96 text-indigo-950" />
            </div>

            <button
              onClick={() => setShowCertDialog(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="text-xs font-bold tracking-widest text-indigo-800 uppercase block mb-1">
              Certificate of Completion
            </span>
            <h3 className="font-serif text-3xl font-extrabold text-indigo-950 leading-tight">
              DIPLOMA OF EXCELLENCE
            </h3>

            <div className="my-6">
              <span className="text-xs text-muted-foreground block">Proudly presented to</span>
              <span className="font-serif text-2xl font-extrabold text-indigo-600 block mt-1 underline">
                Aarav
              </span>
              <p className="text-xs text-slate-800 font-bold max-w-sm mx-auto mt-3 leading-relaxed">
                For demonstrating exceptional pronunciation accuracy, handwriting tracing scores, and active daily learning streaks in VidyaSetu AI.
              </p>
            </div>

            <div className="flex items-center justify-between border-t pt-4 text-[10px] text-muted-foreground">
              <div>
                <span className="block font-bold text-slate-700">VidyaSetu AI Coach</span>
                <span className="block font-serif text-indigo-600 italic">Vidy the Buddy</span>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-full bg-yellow-400 text-yellow-950 border border-yellow-600 font-bold">
                SEAL
              </div>
              <div>
                <span className="block font-bold text-slate-700">Date Issued</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button
              onClick={handleShare}
              className={`rounded-full shadow-soft font-bold h-10 px-5 flex items-center gap-1.5 ${
                shareSuccess ? "bg-green-600 hover:bg-green-500" : "bg-indigo-600 hover:bg-indigo-500"
              }`}
            >
              {shareSuccess ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {shareSuccess ? "Link Copied!" : "Share Certificate"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
