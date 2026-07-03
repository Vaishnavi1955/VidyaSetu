import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROLES, type Role } from "@/lib/mock-data";
import { roleHome, setSession } from "@/lib/session";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = (r?: Role) => {
    const selected = r ?? role;
    if (!selected) {
      toast.error("Please choose a role to continue");
      return;
    }
    setSession({ role: selected, name: name || email.split("@")[0] || "Learner" });
    toast.success(`Welcome to VidyaSetu, ${name || "Learner"}!`);
    navigate({ to: roleHome(selected) });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel */}
      <div className="relative hidden overflow-hidden bg-grad-purple p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-extrabold">VidyaSetu</span>
        </Link>
        <div>
          <h2 className="font-display text-4xl font-extrabold leading-tight">
            Learning that grows with every child.
          </h2>
          <p className="mt-4 max-w-md opacity-90">
            Join 1.2 lakh+ children, 3,400+ Anganwadis and thousands of parents already learning with VidyaSetu.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {["🦊", "🐼", "🦁", "🐨", "🐯", "🦄"].map((e, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                className="grid h-20 place-items-center rounded-3xl bg-white/15 text-4xl backdrop-blur"
              >
                {e}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="text-xs opacity-70">Made with ❤️ for Bharat</div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-6 flex items-center gap-2 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-grad-blue text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-extrabold">VidyaSetu</span>
          </Link>

          <div className="mb-6 inline-flex rounded-full border bg-card p-1 text-sm font-bold">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-full px-4 py-1.5 capitalize transition ${
                  mode === m ? "bg-grad-blue text-white shadow-soft" : "text-muted-foreground"
                }`}
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <h1 className="font-display text-3xl font-extrabold">
            {mode === "login" ? "Welcome back!" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Continue your learning journey." : "Start your child's foundational learning today."}
          </p>

          <div className="mt-6 space-y-3">
            {mode === "signup" && (
              <Input
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-2xl"
              />
            )}
            <Input
              type="email"
              placeholder="Email or phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-2xl"
            />
            <Input type="password" placeholder="Password" defaultValue="demo1234" className="h-11 rounded-2xl" />
          </div>

          <div className="mt-6">
            <div className="mb-3 text-sm font-bold text-muted-foreground">I am a...</div>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`group flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                    role === r.id
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-2xl text-white shadow-soft ${r.grad}`}>
                    {r.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{r.label}</div>
                    <div className="truncate text-xs text-muted-foreground">{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => submit()}
            className="mt-6 h-12 w-full rounded-2xl bg-grad-blue text-base font-bold text-white shadow-glow"
          >
            {mode === "login" ? "Log in" : "Create account"} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            Quick demo — pick a role and jump straight to the dashboard:
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => submit(r.id)}
                className="rounded-full border bg-card px-3 py-1 text-xs font-bold hover:border-primary"
              >
                {r.emoji} {r.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
