import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Download, Home, MapPin, Sparkles, TrendingUp, Users } from "lucide-react";
import { AppShell } from "@/components/vidya/app-shell";
import { SectionTitle, StatCard } from "@/components/vidya/ui-bits";
import { DISTRICT_PERF, WEEKLY_PROGRESS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLang } from "@/lib/lang-context";
import { useRotatingAISuggestions } from "@/lib/live-data";

export const Route = createFileRoute("/supervisor")({ component: SupervisorDashboard });

const HEATMAP_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HEATMAP_ROWS = ["Language", "Math", "Memory", "Attention", "Logic"];

const heatColor = (v: number) => {
  if (v > 80) return "bg-emerald-500";
  if (v > 65) return "bg-emerald-300";
  if (v > 50) return "bg-amber-300";
  if (v > 35) return "bg-orange-300";
  return "bg-red-300";
};

const COLORS = ["var(--brand-blue)", "var(--brand-green)", "var(--brand-yellow)", "var(--brand-purple)", "var(--brand-pink)", "var(--brand-orange)"];

function SupervisorDashboard() {
  const { t } = useLang();
  const aiSuggestions = useRotatingAISuggestions(12000);

  const NAV = [
    { to: "#overview", label: t("overview"), icon: <Home className="h-4 w-4" /> },
    { to: "#districts", label: t("districts"), icon: <MapPin className="h-4 w-4" /> },
    { to: "#centres", label: t("centres"), icon: <Building2 className="h-4 w-4" /> },
    { to: "#reports", label: t("reports"), icon: <TrendingUp className="h-4 w-4" /> },
  ];

  return (
    <AppShell role="supervisor" title={t("maharashtra")} nav={NAV}>
      <div id="overview" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Building2 className="h-5 w-5" />} label={t("totalCentres")} value="3,412" hint="+42 this month" gradient="bg-grad-blue" />
        <StatCard icon={<Users className="h-5 w-5" />} label={t("children")} value="1,24,880" hint="Across 6 districts" gradient="bg-grad-green" delay={0.05} />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label={t("avgAttendance")} value="84%" hint="+2.1% WoW" gradient="bg-grad-yellow" delay={0.1} />
        <StatCard icon={<Sparkles className="h-5 w-5" />} label={t("learningScore")} value="75.4" hint={t("aboveNational")} gradient="bg-grad-purple" delay={0.15} />
      </div>

      <div id="districts" className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border bg-card p-5 shadow-card lg:col-span-2">
          <SectionTitle
            title={t("districtPerformance")}
            sub={t("avgScoreDistrict")}
            action={
              <Button variant="outline" size="sm" className="rounded-full">
                <Download className="mr-1 h-4 w-4" /> {t("export")}
              </Button>
            }
          />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISTRICT_PERF}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Bar dataKey="score" radius={[10, 10, 0, 0]}>
                  {DISTRICT_PERF.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-grad-purple p-5 text-white shadow-glow">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
            <Sparkles className="h-3 w-3" /> {t("aiDistrictInsights")}
          </div>
          <div className="space-y-2">
            {aiSuggestions.map((s, i) => (
              <div key={i} className="rounded-2xl bg-white/15 p-3 text-sm backdrop-blur">
                {s}
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full rounded-full bg-white text-primary hover:bg-white/90">
            {t("generatePolicyBrief")}
          </Button>
        </div>
      </div>

      <div id="reports" className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border bg-card p-5 shadow-card">
          <SectionTitle title={t("learningTrend")} sub={t("weeklyMinutes")} />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_PROGRESS}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Legend />
                <Line type="monotone" dataKey="minutes" stroke="var(--brand-blue)" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="stars" stroke="var(--brand-orange)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-card">
          <SectionTitle title={t("skillHeatmap")} sub={t("performanceDay")} />
          <div className="overflow-x-auto">
            <div className="min-w-[400px]">
              <div className="grid grid-cols-[100px_repeat(6,1fr)] gap-2 text-xs">
                <div />
                {HEATMAP_DAYS.map((d) => (
                  <div key={d} className="text-center font-bold text-muted-foreground">{d}</div>
                ))}
                {HEATMAP_ROWS.map((row) => (
                  <Fragment key={row}>
                    <div className="flex items-center text-xs font-bold text-muted-foreground">{row}</div>
                    {HEATMAP_DAYS.map((d) => {
                      const v = 30 + Math.round(Math.random() * 60);
                      return (
                        <div
                          key={row + d}
                          className={`grid aspect-square place-items-center rounded-xl text-xs font-bold text-white ${heatColor(v)}`}
                        >
                          {v}
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="centres" className="mt-6 rounded-3xl border bg-card p-5 shadow-card">
        <SectionTitle title={t("topDistricts")} sub="Ranked by centres & average score" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="py-2">#</th>
                <th className="py-2">District</th>
                <th className="py-2">Centres</th>
                <th className="py-2">Avg Score</th>
                <th className="py-2">Trend</th>
              </tr>
            </thead>
            <tbody>
              {[...DISTRICT_PERF].sort((a, b) => b.score - a.score).map((d, i) => (
                <tr key={d.name} className="border-t">
                  <td className="py-3 font-bold">{i + 1}</td>
                  <td className="py-3 font-bold">{d.name}</td>
                  <td className="py-3">{d.centres}</td>
                  <td className="py-3">{d.score}</td>
                  <td className="py-3 text-emerald-600">▲ {(Math.random() * 5).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
