import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Gamepad2,
  Globe2,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

const FEATURES = [
  { icon: Brain, title: "AI Powered", desc: "Personalized paths that adapt to every child.", grad: "bg-grad-purple" },
  { icon: Gamepad2, title: "Gamified Learning", desc: "Stars, badges and worlds keep kids hooked.", grad: "bg-grad-yellow" },
  { icon: WifiOff, title: "Offline Ready", desc: "Learn anywhere — syncs when you're back online.", grad: "bg-grad-green" },
  { icon: Globe2, title: "Multilingual", desc: "7 Indian languages with native voice.", grad: "bg-grad-blue" },
  { icon: BookOpen, title: "Age Adaptive", desc: "Purpose-built for ages 3 to 6.", grad: "bg-grad-pink" },
  { icon: ShieldCheck, title: "Government Ready", desc: "Built for Anganwadis & ICDS reporting.", grad: "bg-grad-blue" },
];

const IMPACT = [
  { value: "1.2L+", label: "Children" },
  { value: "3,400", label: "Anganwadis" },
  { value: "18", label: "States" },
  { value: "94%", label: "Engagement" },
];

const TESTIMONIALS = [
  { name: "Sunita Devi", role: "Anganwadi Worker, Pune", quote: "The children ask for VidyaSetu every morning. Reports write themselves now." },
  { name: "Rahul Menon", role: "Parent, Bengaluru", quote: "Aarav learned all his letters in two weeks. The AI suggestions are spot on." },
  { name: "Dr. K. Rao", role: "ICDS Supervisor", quote: "District-wide visibility we never had. This is what Digital India feels like." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-grad-blue text-white shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-lg font-extrabold leading-none">VidyaSetu</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Learn · Play · Grow</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#impact" className="hover:text-foreground">Impact</a>
            <a href="#voices" className="hover:text-foreground">Voices</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth"><Button variant="ghost" className="rounded-full">Log in</Button></Link>
            <Link to="/auth"><Button className="rounded-full bg-grad-blue text-white shadow-soft">Get Started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -left-16 top-16 h-64 w-64 rounded-full bg-brand-yellow/50 blur-3xl" />
          <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-brand-purple/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-brand-green/40 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs font-bold text-primary shadow-soft backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Powered by Gemini AI · Made for Bharat
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              Every child learns differently.
              <br />
              <span className="bg-grad-purple bg-clip-text text-transparent">VidyaSetu learns with them.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              A joyful, gamified, AI-driven foundational learning platform for ages 3–6 — designed for Anganwadis,
              parents, and every curious mind.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth">
                <Button size="lg" className="rounded-full bg-grad-blue px-6 text-base font-bold text-white shadow-glow">
                  Start Learning <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full border-2 px-6 text-base font-bold">
                <PlayCircle className="mr-1 h-5 w-5" /> Watch Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["🦊", "🐼", "🦁", "🐨"].map((e) => (
                  <div key={e} className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-card text-lg shadow-soft">
                    {e}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <div>Loved by 1.2 lakh+ children</div>
              </div>
            </div>
          </motion.div>

          {/* Hero illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative aspect-square w-full max-w-md">
              <motion.div
                animate={{ rotate: [0, 6, 0, -6, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute inset-6 rounded-[40%] bg-grad-yellow shadow-glow"
              />
              <div className="glass absolute inset-10 grid grid-cols-2 gap-3 rounded-[32px] p-5">
                {[
                  { e: "🅰️", g: "bg-grad-blue" },
                  { e: "🔢", g: "bg-grad-green" },
                  { e: "🎨", g: "bg-grad-pink" },
                  { e: "🦁", g: "bg-grad-purple" },
                ].map((t, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }}
                    className={`grid place-items-center rounded-3xl ${t.g} text-5xl text-white shadow-soft`}
                  >
                    {t.e}
                  </motion.div>
                ))}
              </div>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -right-2 top-6 rounded-2xl bg-white p-3 shadow-glow"
              >
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-grad-green text-white">✓</span>
                  <div>
                    <div>+15 stars</div>
                    <div className="text-xs font-normal text-muted-foreground">Level up!</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-2 rounded-2xl bg-white p-3 shadow-glow"
              >
                <div className="text-xs font-bold text-muted-foreground">Today's streak</div>
                <div className="font-display text-2xl font-extrabold text-brand-orange">🔥 7 days</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">Why VidyaSetu</div>
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">Built for every learner. Ready for every centre.</h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group rounded-3xl border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <div className={`mb-4 inline-grid h-12 w-12 place-items-center rounded-2xl ${f.grad} text-white shadow-soft`}>
                <f.icon className="h-6 w-6" />
              </div>
              <div className="font-display text-lg font-extrabold">{f.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="relative overflow-hidden bg-grad-blue py-16 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {IMPACT.map((i, idx) => (
            <motion.div
              key={i.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-4xl font-extrabold md:text-5xl">{i.value}</div>
              <div className="mt-1 text-sm opacity-80">{i.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="voices" className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">Voices from the field</div>
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">Trusted by families and centres across India</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl border bg-card p-6 shadow-card"
            >
              <div className="mb-3 flex text-amber-500">
                {[0, 1, 2, 3, 4].map((s) => <Star key={s} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm">"{t.quote}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-grad-purple text-white">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-bold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partners */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 opacity-70">
          {["ICDS", "NITI Aayog", "Digital India", "NEP 2020", "MeitY", "UNICEF"].map((p) => (
            <div key={p} className="rounded-full border bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="overflow-hidden rounded-[36px] bg-grad-purple p-10 text-center text-white shadow-glow md:p-14">
          <h3 className="font-display text-3xl font-extrabold md:text-4xl">Ready to spark a lifetime of learning?</h3>
          <p className="mx-auto mt-3 max-w-xl opacity-90">
            Join thousands of families and Anganwadi centres already growing with VidyaSetu.
          </p>
          <Link to="/auth" className="mt-6 inline-block">
            <Button size="lg" className="rounded-full bg-white px-8 text-base font-bold text-primary hover:bg-white/90">
              Get Started Free <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-grad-blue text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-display font-extrabold">VidyaSetu</span>
            <span className="text-xs text-muted-foreground">© 2026</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
            <a href="#">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
