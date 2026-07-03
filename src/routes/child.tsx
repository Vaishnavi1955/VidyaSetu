import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Coins, Flame, Home as HomeIcon, Play, Sparkles, Star, Trophy, User, Wand2 } from "lucide-react";
import { AppShell } from "@/components/vidya/app-shell";
import { ProgressRing, SectionTitle, StatCard } from "@/components/vidya/ui-bits";
import { BADGES, LEADERBOARD, WEEKLY_PROGRESS, WORLDS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLang } from "@/lib/lang-context";
import { useLiveStats } from "@/lib/live-data";
import { recommendNextActivity } from "@/lib/ai-engine";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

// Games
import { MemoryMatch } from "@/components/vidya/games/memory-match";
import { AlphabetQuiz } from "@/components/vidya/games/alphabet-quiz";
import { NumberCount } from "@/components/vidya/games/number-count";
import { AnimalQuiz } from "@/components/vidya/games/animal-quiz";
import { ShapeSort } from "@/components/vidya/games/shape-sort";
import { ColorGalaxy } from "@/components/vidya/games/color-galaxy";
import { StoryCastle } from "@/components/vidya/games/story-castle";
import { EmotionGarden } from "@/components/vidya/games/emotion-garden";

// Playgrounds & Accessibility Modules
import { AdventureMap } from "@/components/vidya/adventure-map";
import { TimeCapsule } from "@/components/vidya/time-capsule";
import { AchievementWall } from "@/components/vidya/achievement-wall";
import { EmotionMonitor } from "@/components/vidya/emotion-monitor";

export const Route = createFileRoute("/child")({ component: ChildDashboard });

function getGameForWorld(worldId: string) {
  switch (worldId) {
    case "alphabet": return AlphabetQuiz;
    case "number": return NumberCount;
    case "animal": return AnimalQuiz;
    case "color": return ColorGalaxy;
    case "story": return StoryCastle;
    case "shape": return ShapeSort;
    case "emotion": return EmotionGarden;
    case "puzzle": return MemoryMatch;
    default: return MemoryMatch;
  }
}

function ChildDashboard() {
  const { t, lang } = useLang();
  const { stats, awardXP } = useLiveStats();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<"map" | "room">("map");

  const NAV = [
    { to: "#top", label: t("myWorld"), icon: <HomeIcon className="h-4 w-4" /> },
    { to: "#learn", label: t("learn"), icon: <Play className="h-4 w-4" /> },
    { to: "#rewards", label: t("rewards"), icon: <Trophy className="h-4 w-4" /> },
    { to: "#badges", label: t("profile"), icon: <User className="h-4 w-4" /> },
  ];

  // Generate dynamic recommendation
  const aiRec = recommendNextActivity({
    name: "Aarav", age: 5, weeklyMinutes: stats.todayMinutes, streakDays: stats.streakDays,
    skills: { memory: 80, attention: 75, language: 85, logic: 65, math: 50, reading: 70 }
  });

  return (
    <AppShell role="child" title="Hey Aarav! 👋" nav={NAV}>
      {/* Hero card */}
      <div id="top" className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-grad-blue p-6 text-white shadow-glow lg:col-span-2"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                <Sparkles className="h-3 w-3" /> {t("todayRecommendation")}
              </div>
              <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl leading-tight">
                {aiRec}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button className="rounded-full bg-white text-primary hover:bg-white/90" onClick={() => {
                  setActiveGame("alphabet");
                  setActiveTab("map");
                }}>
                  <Play className="mr-1 h-4 w-4" /> {t("continuelearning")}
                </Button>
                
                {/* Link to Magic Playground Route */}
                <Link to="/playground">
                  <Button variant="outline" className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20">
                    <Wand2 className="mr-1 h-4 w-4" /> Try Magic Playground
                  </Button>
                </Link>
              </div>
            </div>
            <div className="shrink-0">
              <ProgressRing value={stats.todayProgress} label={t("today")} />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Star className="h-5 w-5" />} label={t("stars")} value={stats.stars.toString()} gradient="bg-grad-yellow" delay={0.05} />
          <StatCard icon={<Coins className="h-5 w-5" />} label={t("coins")} value={stats.coins.toString()} gradient="bg-grad-green" delay={0.1} />
          <StatCard icon={<Flame className="h-5 w-5" />} label={t("streak")} value={`${stats.streakDays} 🔥`} gradient="bg-grad-pink" delay={0.15} />
          <StatCard icon={<Award className="h-5 w-5" />} label={t("xp")} value={stats.xp.toLocaleString()} gradient="bg-grad-purple" delay={0.2} />
        </div>
      </div>

      {/* Tabs switches layout */}
      <div className="flex gap-2 border-b pb-4 mt-8 flex-wrap">
        <Button 
          variant={activeTab === "map" ? "default" : "ghost"}
          className="rounded-full font-bold"
          onClick={() => setActiveTab("map")}
        >
          🗺️ Adventure Map
        </Button>
        <Button 
          variant={activeTab === "room" ? "default" : "ghost"}
          className="rounded-full font-bold"
          onClick={() => setActiveTab("room")}
        >
          🧸 My Playroom & Shelf
        </Button>
        
        {/* Navigation Link to Playground directly in tab bar for accessibility */}
        <Link to="/playground">
          <Button variant="ghost" className="rounded-full font-bold text-indigo-600 dark:text-indigo-400">
            🪄 Magic Playgrounds →
          </Button>
        </Link>
      </div>

      {/* Conditional Active Panels */}
      <div className="mt-6">
        {activeTab === "map" && (
          <div className="space-y-8">
            {/* SVG Adventure Map */}
            <AdventureMap onSelectWorld={(wId) => setActiveGame(wId)} />

            {/* Learning worlds list */}
            <div id="learn">
              <SectionTitle title={t("learningWorlds")} sub={t("pickWorld")} />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {WORLDS.map((w, i) => {
                  return (
                    <motion.button
                      key={w.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -4 }}
                      disabled={w.locked}
                      onClick={() => setActiveGame(w.id)}
                      className={`group relative overflow-hidden rounded-3xl border bg-card p-5 text-left shadow-card transition-all disabled:opacity-60 ${
                        w.locked ? "" : "hover:shadow-glow"
                      }`}
                    >
                      <div className={`mb-3 grid h-16 w-16 place-items-center rounded-3xl text-4xl text-white shadow-soft ${w.color}`}>
                        {w.emoji}
                      </div>
                      <div className="font-display text-base font-extrabold">{t(w.id as any) || w.name}</div>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{w.locked ? t("locked") : `${w.progress}${t("complete")}`}</span>
                        <span>{t("agesRange")}</span>
                      </div>
                      <Progress value={w.progress} className="mt-2 h-2" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "room" && (
          <div className="space-y-6">
            <AchievementWall />
            <div className="grid gap-6 md:grid-cols-2">
              <TimeCapsule />
              <EmotionMonitor />
            </div>
          </div>
        )}
      </div>

      {/* Shared Game Player Modal Dialog */}
      <Dialog 
        open={activeGame !== null}
        onOpenChange={(open) => {
          if (!open) {
            setActiveGame(null);
            setGameCompleted(false);
          }
        }}
      >
        <DialogContent className="max-w-2xl sm:rounded-3xl border-0 p-6 overflow-hidden">
          <DialogTitle className="sr-only">Play Game</DialogTitle>
          {activeGame && (
            <>
              <div className="relative z-10 flex flex-col items-center">
                <h2 className="font-display text-2xl font-extrabold text-center mb-6">
                  {t(activeGame as any) || activeGame}
                </h2>
                <div className="w-full">
                  {(() => {
                    const GameComponent = getGameForWorld(activeGame);
                    return (
                      <GameComponent onComplete={(s, x) => {
                        awardXP(x, s);
                        setGameCompleted(true);
                        
                        // Spawn global Magic Reward Box
                        setTimeout(() => {
                          if (window.triggerRewardBox) {
                            window.triggerRewardBox();
                          }
                        }, 800);
                      }} />
                    );
                  })()}
                </div>
                {gameCompleted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex justify-center w-full"
                  >
                    <Button 
                      onClick={() => {
                        setActiveGame(null);
                        setGameCompleted(false);
                      }}
                      size="lg" 
                      className="rounded-full shadow-glow w-full max-w-xs font-bold text-lg"
                    >
                      Claim Rewards & Return
                    </Button>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Weekly activity + leaderboard */}
      <div id="rewards" className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border bg-card p-5 shadow-card lg:col-span-2">
          <SectionTitle title={t("yourWeek")} sub={t("minutesLearned")} />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_PROGRESS}>
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-blue)" />
                    <stop offset="100%" stopColor="var(--brand-purple)" />
                  </linearGradient>
                </defs>
                <Bar dataKey="minutes" fill="url(#barGrad)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-card">
          <SectionTitle title={t("leaderboard")} sub={t("friendsThisWeek")} />
          <div className="space-y-2">
            {LEADERBOARD.map((l, i) => (
              <div
                key={l.name}
                className={`flex items-center gap-3 rounded-2xl p-2 ${l.you ? "bg-grad-yellow/40 ring-2 ring-brand-orange" : ""}`}
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-sm font-bold">{i + 1}</div>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-card text-xl">{l.avatar}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.you ? stats.xp.toLocaleString() : l.xp.toLocaleString()} XP</div>
                </div>
                {i === 0 && <Trophy className="h-5 w-5 text-amber-500" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div id="badges" className="mt-8">
        <SectionTitle title={t("myBadges")} sub={`${BADGES.filter((b) => b.earned).length} of ${BADGES.length} earned`} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {BADGES.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className={`group rounded-3xl border bg-card p-4 text-center shadow-card transition ${
                b.earned ? "hover:-translate-y-1 hover:shadow-glow" : "opacity-50 grayscale"
              }`}
            >
              <div className="text-4xl">{b.emoji}</div>
              <div className="mt-1 text-xs font-bold">{b.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
