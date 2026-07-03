import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Trophy, Star, Coins } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/vidya/app-shell";
import { useLang } from "@/lib/lang-context";
import { useLiveStats } from "@/lib/live-data";

// Playground Components
import { ArLearning } from "@/components/vidya/ar-learning";
import { StoryCreator } from "@/components/vidya/story-creator";
import { VoiceRoleplay } from "@/components/vidya/voice-roleplay";
import { HandwritingChecker } from "@/components/vidya/handwriting-checker";

export const Route = createFileRoute("/playground")({ component: PlaygroundPage });

function PlaygroundPage() {
  const { t } = useLang();
  const { stats } = useLiveStats();

  const NAV = [
    { to: "/child", label: "Dashboard", icon: <ArrowLeft className="h-4 w-4" /> }
  ];

  return (
    <AppShell role="child" title="Magic Playground 🪄" nav={NAV}>
      {/* Top Header Card with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-grad-purple p-6 rounded-3xl text-white shadow-glow mb-6 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        
        <div>
          <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold mb-2">
            <Sparkles className="h-3.5 w-3.5" /> AI Sandbox Mode
          </div>
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Explore & Learn!</h2>
          <p className="text-xs text-purple-100 mt-1 max-w-md leading-relaxed">
            Practice pronunciation, draw shapes, talk to characters, and scan objects to earn star points!
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2 text-xs font-bold flex gap-3 shrink-0 select-none">
            <span className="flex items-center gap-1 text-yellow-300">⭐ {stats.stars}</span>
            <span className="flex items-center gap-1 text-green-300">🪙 {stats.coins}</span>
            <span className="flex items-center gap-1 text-pink-300">🔥 {stats.streakDays}</span>
          </div>

          <Link to="/child">
            <Button className="rounded-full bg-white text-indigo-700 hover:bg-slate-100 font-extrabold shadow-soft">
              <ArrowLeft className="mr-1 h-4 w-4" /> {t("back") || "Dashboard"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid containing all five interactive AI items */}
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Custom Story Generation Card */}
          <StoryCreator />
          
          {/* Voice Chat with Characters */}
          <VoiceRoleplay />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Camera Scanning Classifier & Treasure Hunt */}
          <ArLearning />

          {/* Letter / Number Handwriting Canvas Tracing */}
          <HandwritingChecker />
        </div>
      </div>
    </AppShell>
  );
}
