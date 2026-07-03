import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Download, FileText, Home, Sparkles, TrendingUp, Users, Award, Trophy, Plus, Check } from "lucide-react";
import { AppShell } from "@/components/vidya/app-shell";
import { SectionTitle, StatCard } from "@/components/vidya/ui-bits";
import { CHILDREN, WEEKLY_PROGRESS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLang } from "@/lib/lang-context";
import { useLiveAttendance, useRotatingAISuggestions, useLiveStats } from "@/lib/live-data";

export const Route = createFileRoute("/worker")({ component: WorkerDashboard });

function WorkerDashboard() {
  const { t } = useLang();
  const { stats, addClassroomChallenge } = useLiveStats();
  const liveAttendance = useLiveAttendance(7, CHILDREN.length);
  const aiSuggestions = useRotatingAISuggestions(15000);

  // New challenge creation form states
  const [newTitle, setNewTitle] = useState("");
  const [newTotal, setNewTotal] = useState(10);
  const [newTarget, setNewTarget] = useState("");
  const [newType, setNewType] = useState("stars");
  const [showAddForm, setShowAddForm] = useState(false);

  const NAV = [
    { to: "#overview", label: t("overview"), icon: <Home className="h-4 w-4" /> },
    { to: "#children", label: t("children"), icon: <Users className="h-4 w-4" /> },
    { to: "#challenges", label: "Class Challenges", icon: <Award className="h-4 w-4" /> },
    { to: "#voice-reports", label: "Voice Reports", icon: <FileText className="h-4 w-4" /> },
    { to: "#attendance", label: t("attendance"), icon: <CalendarCheck className="h-4 w-4" /> },
  ];

  const riskColor = (r: string) =>
    r === "high" ? "bg-red-100 text-red-700" : r === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";

  const handleLaunchChallenge = () => {
    if (!newTitle.trim() || !newTarget.trim()) return;
    addClassroomChallenge(newTitle, newTotal, newTarget, newType);
    setNewTitle("");
    setNewTarget("");
    setShowAddForm(false);
  };

  return (
    <AppShell role="worker" title={t("sunita")} nav={NAV}>
      <div id="overview" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Users className="h-5 w-5" />} label={t("enrolled")} value={CHILDREN.length.toString()} hint={`${liveAttendance} ${t("activeToday")}`} gradient="bg-grad-blue" />
        <StatCard icon={<CalendarCheck className="h-5 w-5" />} label={t("attendance")} value={`${Math.round((liveAttendance/CHILDREN.length)*100)}%`} hint="+4% vs last week" gradient="bg-grad-green" delay={0.05} />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label={t("avgProgress")} value="67%" hint={t("aboveDistrict")} gradient="bg-grad-yellow" delay={0.1} />
        <StatCard icon={<Sparkles className="h-5 w-5" />} label={t("atRisk")} value="2" hint={t("needIntervention")} gradient="bg-grad-pink" delay={0.15} />
      </div>

      <div id="children" className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border bg-card p-5 shadow-card lg:col-span-2">
          <SectionTitle
            title={t("childrenProgress")}
            sub="Track each child's learning journey"
            action={
              <Button variant="outline" size="sm" className="rounded-full">
                <Download className="mr-1 h-4 w-4" /> {t("export")}
              </Button>
            }
          />
          <div className="space-y-2">
            {CHILDREN.map((c) => (
              <div key={c.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border p-3 hover:bg-muted/40">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-grad-blue text-2xl text-white shadow-soft">
                  {c.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="truncate text-sm font-bold">{c.name}</div>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                      Age {c.age}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${riskColor(c.risk)}`}>
                      {t((c.risk + "Risk") as any) || `${c.risk} risk`}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{t("attendance")} {c.attendance}%</span>
                    <span>·</span>
                    <span>{t("progress")} {c.progress}%</span>
                  </div>
                  <Progress value={c.progress} className="mt-2 h-1.5" />
                </div>
                <Button variant="ghost" size="sm" className="rounded-full">{t("viewAll")}</Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-grad-purple p-5 text-white shadow-glow">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
              <Sparkles className="h-3 w-3" /> {t("aiInsights")}
            </div>
            <div className="space-y-2">
              {aiSuggestions.map((s, i) => (
                <div key={i} className="rounded-2xl bg-white/15 p-3 text-sm backdrop-blur">
                  {s}
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full rounded-full bg-white text-primary hover:bg-white/90">
              {t("generateWeeklyPlan")}
            </Button>
          </div>

          <div className="rounded-3xl border bg-card p-5 shadow-card">
            <SectionTitle title={t("topPerformers")} />
            <div className="space-y-2">
              {[...CHILDREN].sort((a, b) => b.progress - a.progress).slice(0, 3).map((c, i) => (
                <div key={c.id} className="flex items-center gap-3 rounded-2xl bg-muted/50 p-2">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-grad-yellow text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="text-xl">{c.avatar}</div>
                  <div className="min-w-0 flex-1 truncate text-sm font-bold">{c.name}</div>
                  <div className="text-xs font-bold text-brand-orange">{c.progress}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Classroom Challenges Section */}
      <div id="challenges" className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border bg-card p-5 shadow-card lg:col-span-2">
          <SectionTitle
            title="Classroom Challenges & Milestones"
            sub="Launch class goals to incentivize cooperative learning"
            action={
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="mr-1 h-4 w-4" /> Create Challenge
              </Button>
            }
          />

          {showAddForm && (
            <div className="mb-4 p-4 rounded-2xl border bg-slate-50 dark:bg-slate-900 space-y-3">
              <h4 className="text-xs font-extrabold uppercase text-muted-foreground">Draft New Class Challenge</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="col-span-2 space-y-1">
                  <span className="font-bold">Challenge Title</span>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. 100 stars target"
                    className="w-full h-8 px-3 rounded-lg border bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <span className="font-bold">Challenge Goal Amount</span>
                  <input
                    type="number"
                    value={newTotal}
                    onChange={(e) => setNewTotal(parseInt(e.target.value) || 1)}
                    className="w-full h-8 px-3 rounded-lg border bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <span className="font-bold">Challenge Type</span>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border bg-background"
                  >
                    <option value="stars">Stars ⭐</option>
                    <option value="stories">Stories 📖</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <span className="font-bold">Challenge Instruction Target</span>
                  <input
                    type="text"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder="e.g. Read 5 stories as a class!"
                    className="w-full h-8 px-3 rounded-lg border bg-background"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button size="sm" className="rounded-full bg-indigo-600 text-white font-bold" onClick={handleLaunchChallenge}>
                  Launch Challenge
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {stats.classroomChallenges.map(c => {
              const pct = Math.round((c.progress / c.total) * 100);
              return (
                <div key={c.id} className="p-4 rounded-2xl border bg-background space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{c.title}</h4>
                      <p className="text-xs text-muted-foreground">{c.target}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pct >= 100 ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700"
                    }`}>
                      {pct >= 100 ? "Completed! 🎉" : `${c.progress}/${c.total} (${pct}%)`}
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-card flex flex-col justify-between">
          <div>
            <SectionTitle title="Cooperative Incentives" sub="Class rewards configuration" />
            <div className="space-y-3 mt-3 text-xs leading-relaxed">
              <div className="bg-indigo-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-indigo-100">
                <Trophy className="h-5 w-5 text-yellow-500 mb-1" />
                <span className="font-extrabold block">Star Rewards Pool</span>
                Completing class challenges awards group certificates and star pins to all children automatically, encouraging cooperative participation rather than ranking shame.
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-2xl bg-amber-50 dark:bg-slate-900 border border-amber-200 text-xs text-amber-900 dark:text-amber-200 flex gap-2">
            <Check className="h-4 w-4 shrink-0 text-amber-500" />
            <span>Classroom challenges are synced live to child dashboards.</span>
          </div>
        </div>
      </div>

      <div id="voice-reports" className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border bg-card p-5 shadow-card lg:col-span-2">
          <SectionTitle title="Speaking & Pronunciation Reports" sub="Anganwadi speech fluency and participation logs" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b text-muted-foreground uppercase tracking-wider font-bold">
                  <th className="py-2.5">Child</th>
                  <th className="py-2.5">Voice Participation</th>
                  <th className="py-2.5">Pronunciation Score</th>
                  <th className="py-2.5">Reading Fluency</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Aarav Sharma", participation: "94%", pronunciation: "88%", fluency: "85%", status: "Excellent", statusColor: "text-emerald-600 bg-emerald-50" },
                  { name: "Diya Patel", participation: "88%", pronunciation: "82%", fluency: "78%", status: "Good", statusColor: "text-emerald-600 bg-emerald-50" },
                  { name: "Kabir Singh", participation: "68%", pronunciation: "70%", fluency: "64%", status: "Needs Practice", statusColor: "text-amber-600 bg-amber-50" },
                  { name: "Meera Iyer", participation: "45%", pronunciation: "60%", fluency: "52%", status: "Intervention", statusColor: "text-red-600 bg-red-50" },
                  { name: "Vihaan Rao", participation: "98%", pronunciation: "92%", fluency: "90%", status: "Excellent", statusColor: "text-emerald-600 bg-emerald-50" },
                  { name: "Anaya Das", participation: "72%", pronunciation: "76%", fluency: "70%", status: "Developing", statusColor: "text-blue-600 bg-blue-50" }
                ].map((row, i) => (
                  <tr key={i} className="border-b hover:bg-muted/30">
                    <td className="py-3 font-bold text-foreground">{row.name}</td>
                    <td className="py-3 text-muted-foreground">{row.participation}</td>
                    <td className="py-3 text-muted-foreground">{row.pronunciation}</td>
                    <td className="py-3 text-muted-foreground">{row.fluency}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-card flex flex-col justify-between">
          <div>
            <SectionTitle title="Pronunciation Analytics" sub="Common phoneme struggles identified by AI" />
            <div className="space-y-3 mt-3 text-xs leading-relaxed">
              <div className="bg-red-50 text-red-800 p-3 rounded-2xl border border-red-200">
                <span className="font-extrabold block mb-1">⚠️ High Priority</span>
                4 children struggle with the Marathi/Hindi phoneme retroflex "ड" (Da) or "ण" (Na). Recommended: Queue 'Phonics Beads' activity.
              </div>
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl border border-emerald-200">
                <span className="font-extrabold block mb-1">🎉 Major Improvement</span>
                Class average reading fluency increased from 72% to 78% since the introduction of voice storytelling mode!
              </div>
            </div>
          </div>
          <div className="mt-5 p-3 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 text-xs text-brand-purple">
            🤖 <strong>AI Suggestion:</strong> Try a class-wide 10-minute group recitation of the 'Chotu Monkey' story.
          </div>
        </div>
      </div>

      <div id="attendance" className="mt-6 rounded-3xl border bg-card p-5 shadow-card">
        <SectionTitle title={t("attendanceWeek")} sub={t("centreWide")} />
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEKLY_PROGRESS.map((d) => ({ day: d.day, present: Math.round(6 + Math.random() * 4) }))}>
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
              <Bar dataKey="present" fill="var(--brand-green)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}
