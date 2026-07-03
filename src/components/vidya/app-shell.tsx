import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, LogOut, Menu, Search, Sparkles, WifiOff, Wifi } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { getSession, setSession } from "@/lib/session";
import { LANGS, type Role } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AiChatFab } from "./ai-chat-fab";
import { useLang } from "@/lib/lang-context";
import type { LangCode } from "@/lib/i18n";

// Accessibilities and Gamification panels
import { MascotCompanion } from "./mascot-companion";
import { AccessibilityPanel } from "./accessibility-panel";
import { RewardBoxModal } from "./reward-box-modal";

type NavItem = { to: string; label: string; icon: ReactNode };

export function AppShell({
  role,
  title,
  nav,
  children,
}: {
  role: Role;
  title: string;
  nav: NavItem[];
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [session, setLocal] = useState(() => getSession());
  const { lang, setLang, t } = useLang();
  
  // Offline State Tracking
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== "undefined" ? !navigator.onLine : false);

  useEffect(() => {
    setLocal(getSession());

    const goOnline = () => {
      setIsOffline(false);
      // Mock automatic sync alert
      if (window.triggerMascotSpeak) {
        window.triggerMascotSpeak("Yay! We are back online! Syncing your stars and awards now... 📶✨");
      }
    };
    const goOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const logout = () => {
    setSession(null);
    navigate({ to: "/" });
  };

  const SideNav = (
    <nav className="flex flex-col gap-1 p-3">
      <div className="mb-4 flex items-center gap-2 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-grad-blue text-white shadow-glow">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <div className="font-display text-lg font-extrabold leading-tight">VidyaSetu</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{role}</div>
        </div>
      </div>
      {nav.map((item) => {
        const isHash = item.to.startsWith("#");
        const active = !isHash && pathname === item.to;
        
        const className = `group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all ${
          active
            ? "bg-grad-blue text-white shadow-soft"
            : "text-foreground/70 hover:bg-muted hover:text-foreground"
        }`;
        
        const inner = (
          <>
            <span className={`grid h-8 w-8 place-items-center rounded-xl ${active ? "bg-white/20" : "bg-muted"}`}>
              {item.icon}
            </span>
            {item.label}
          </>
        );

        if (isHash) {
          return (
            <a 
              key={item.to} 
              href={item.to} 
              className={className}
              onClick={(e) => {
                e.preventDefault();
                const el = document.querySelector(item.to);
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 80; // account for header
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
            >
              {inner}
            </a>
          );
        }

        return (
          <Link key={item.to} to={item.to} className={className}>
            {inner}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="bg-red-600 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 select-none z-50 relative">
          <WifiOff className="h-4 w-4 animate-bounce" />
          <span>Offline Mode Active. Games and voice features work offline. Progress will sync when reconnected.</span>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-card lg:block">
          {SideNav}
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:flex sm:justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 p-0">
                    {SideNav}
                  </SheetContent>
                </Sheet>
                <h1 className="truncate font-display text-lg font-extrabold sm:text-xl">{title}</h1>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div className="hidden items-center gap-1 rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold text-secondary-foreground md:flex">
                  {isOffline ? <WifiOff className="h-3 w-3 text-red-500 animate-pulse" /> : <Wifi className="h-3 w-3 text-green-500" />}
                  {isOffline ? "Offline Mode" : t("syncedAgo")}
                </div>
                <div className="relative hidden md:block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    placeholder="Search..."
                    className="h-9 w-56 rounded-full border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <Select value={lang} onValueChange={(v) => setLang(v as LangCode)}>
                  <SelectTrigger className="h-9 w-[110px] rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGS.map((l) => (
                      <SelectItem key={l.code} value={l.code}>
                         {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-orange" />
                </Button>
                <Avatar className="h-9 w-9 ring-2 ring-primary/30">
                  <AvatarFallback className="bg-grad-purple text-white">
                    {session?.name?.[0]?.toUpperCase() ?? "V"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" onClick={logout} title="Log out">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          <motion.main
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6"
          >
            {children}
          </motion.main>
        </div>
      </div>

      {/* Global AI Floating Action Chatbot */}
      <AiChatFab />

      {/* Dynamic Companion elements */}
      {role === "child" && <MascotCompanion />}
      
      {/* Global accessibility utilities panel */}
      <AccessibilityPanel />
      
      {/* Global mystery chest container */}
      <RewardBoxModal />
    </div>
  );
}
