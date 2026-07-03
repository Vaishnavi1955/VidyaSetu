// ─── VidyaSetu Live Data Simulation ──────────────────────────────────────────
// Simulates real-time data updates to make the demo feel like a live production app

import { useState, useEffect, useRef } from "react";

export interface LiveStats {
  xp: number;
  stars: number;
  coins: number;
  streakDays: number;
  todayMinutes: number;
  todayProgress: number;
  attendanceCount: number;
  speakingAccuracy: number;
  pronunciationScore: number;
  listeningScore: number;
  voiceActivityHistory: { id: string; date: string; phrase: string; accuracy: number; passed: boolean }[];
  readingRecordings: { id: string; title: string; date: string; fluency: number; durationSec: number }[];
  speakingThreshold: number;
  recentSpeakStreak: number;
  recentSpeakFails: number;
  
  // New features persistence
  collectibles: string[];
  stories: { id: string; title: string; animal: string; color: string; food: string; superhero: string; text: string; date: string }[];
  classroomChallenges: { id: string; title: string; progress: number; total: number; target: string; active: boolean; type: string }[];
  timeCapsule: { id: string; date: string; title: string; durationSec: number; audioUrl: string }[];
  selectedCollectibleTheme: string;
  accessibility: { dyslexiaFont: boolean; largeUi: boolean; highContrast: boolean; speechRate: number };
}

const INITIAL: LiveStats = {
  xp: 1875,
  stars: 248,
  coins: 1240,
  streakDays: 7,
  todayMinutes: 42,
  todayProgress: 72,
  attendanceCount: 7,
  speakingAccuracy: 88,
  pronunciationScore: 84,
  listeningScore: 92,
  voiceActivityHistory: [
    { id: "h1", date: "2026-07-02T16:30:00Z", phrase: "Apple", accuracy: 95, passed: true },
    { id: "h2", date: "2026-07-02T16:32:00Z", phrase: "Ball", accuracy: 90, passed: true },
    { id: "h3", date: "2026-07-02T16:35:00Z", phrase: "Cat", accuracy: 60, passed: false },
    { id: "h4", date: "2026-07-01T15:20:00Z", phrase: "Elephant", accuracy: 88, passed: true },
  ],
  readingRecordings: [
    { id: "r1", title: "The Clever Little Monkey", date: "2026-07-02T16:40:00Z", fluency: 85, durationSec: 120 },
    { id: "r2", title: "Rani and the Rainbow Letters", date: "2026-06-30T14:15:00Z", fluency: 78, durationSec: 145 },
  ],
  speakingThreshold: 70,
  recentSpeakStreak: 0,
  recentSpeakFails: 0,

  // Default values for new features
  collectibles: ["hat-explorer"],
  stories: [],
  classroomChallenges: [
    { id: "cc1", title: "Classroom 500 Stars Goal", progress: 340, total: 500, target: "Collect stars as a team!", active: true, type: "stars" },
    { id: "cc2", title: "Read 10 Stories Together", progress: 6, total: 10, target: "Explore the magic castle!", active: true, type: "stories" }
  ],
  timeCapsule: [
    { id: "tc_initial", date: "2026-06-03T10:00:00Z", title: "Month 1: Tracing 'A'", durationSec: 8, audioUrl: "mock-audio-data-1" }
  ],
  selectedCollectibleTheme: "default",
  accessibility: {
    dyslexiaFont: false,
    largeUi: false,
    highContrast: false,
    speechRate: 1.0
  }
};

// Load persisted scores from localStorage
function loadStats(): LiveStats {
  try {
    const stored = localStorage.getItem("vs_live_stats");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with default initial keys to prevent crash with missing new keys
      return { 
        ...INITIAL, 
        ...parsed, 
        accessibility: { ...INITIAL.accessibility, ...parsed.accessibility } 
      };
    }
  } catch {}
  return INITIAL;
}

function saveStats(s: LiveStats) {
  try { localStorage.setItem("vs_live_stats", JSON.stringify(s)); } catch {}
}

export function useLiveStats() {
  const [stats, setStats] = useState<LiveStats>(loadStats);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Tick XP every 8 seconds (+1 to +3)
    intervalRef.current = window.setInterval(() => {
      setStats(prev => {
        const next: LiveStats = {
          ...prev,
          xp: prev.xp + Math.floor(Math.random() * 3) + 1,
          stars: prev.stars + (Math.random() < 0.25 ? 1 : 0),
          coins: prev.coins + (Math.random() < 0.2 ? 2 : 0),
          todayMinutes: Math.min(60, prev.todayMinutes + (Math.random() < 0.15 ? 1 : 0)),
          todayProgress: Math.min(100, prev.todayProgress + (Math.random() < 0.1 ? 1 : 0)),
        };
        saveStats(next);
        return next;
      });
    }, 8000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Award XP immediately (called from games)
  const awardXP = (amount: number, bonusStars = 0) => {
    setStats(prev => {
      // Also advance classroom challenges that track stars or stories
      let nextChallenges = [...prev.classroomChallenges];
      if (bonusStars > 0) {
        nextChallenges = nextChallenges.map(c => 
          c.type === "stars" ? { ...c, progress: Math.min(c.total, c.progress + bonusStars) } : c
        );
      }

      const next: LiveStats = {
        ...prev,
        xp: prev.xp + amount,
        stars: prev.stars + bonusStars,
        coins: prev.coins + Math.floor(amount / 5),
        classroomChallenges: nextChallenges,
      };
      saveStats(next);
      return next;
    });
  };

  const addMinutes = (m: number) => {
    setStats(prev => {
      const next = { ...prev, todayMinutes: Math.min(60, prev.todayMinutes + m) };
      saveStats(next);
      return next;
    });
  };

  const logVoiceActivity = (phrase: string, accuracy: number, passed: boolean) => {
    setStats(prev => {
      const newHistory = [
        { id: `h_${Date.now()}`, date: new Date().toISOString(), phrase, accuracy, passed },
        ...prev.voiceActivityHistory
      ].slice(0, 20);
      
      const totalPassed = newHistory.filter(h => h.passed).length;
      const avgAccuracy = Math.round(newHistory.reduce((sum, h) => sum + h.accuracy, 0) / newHistory.length);
      
      // Calculate child-specific speaking style adaptation
      let nextStreak = passed ? (prev.recentSpeakStreak || 0) + 1 : 0;
      let nextFails = !passed ? (prev.recentSpeakFails || 0) + 1 : 0;
      let nextThreshold = prev.speakingThreshold || 70;
      
      if (nextStreak >= 3) {
        nextThreshold = Math.min(80, nextThreshold + 3);
        nextStreak = 0;
      } else if (nextFails >= 2) {
        nextThreshold = Math.max(50, nextThreshold - 5);
        nextFails = 0;
      }

      const next: LiveStats = {
        ...prev,
        voiceActivityHistory: newHistory,
        speakingAccuracy: avgAccuracy,
        pronunciationScore: Math.round((totalPassed / newHistory.length) * 100),
        speakingThreshold: nextThreshold,
        recentSpeakStreak: nextStreak,
        recentSpeakFails: nextFails
      };
      saveStats(next);
      return next;
    });
  };

  const logReadingSession = (title: string, fluency: number, durationSec: number) => {
    setStats(prev => {
      const newRecordings = [
        { id: `r_${Date.now()}`, title, date: new Date().toISOString(), fluency, durationSec },
        ...prev.readingRecordings
      ].slice(0, 10);
      
      const next: LiveStats = {
        ...prev,
        readingRecordings: newRecordings,
        listeningScore: Math.min(100, prev.listeningScore + 2),
      };
      saveStats(next);
      return next;
    });
  };

  // Helper: add earned collectible accessory
  const addCollectible = (id: string) => {
    setStats(prev => {
      if (prev.collectibles.includes(id)) return prev;
      const next = { ...prev, collectibles: [...prev.collectibles, id] };
      saveStats(next);
      return next;
    });
  };

  // Helper: select current digital room background theme
  const selectTheme = (theme: string) => {
    setStats(prev => {
      const next = { ...prev, selectedCollectibleTheme: theme };
      saveStats(next);
      return next;
    });
  };

  // Helper: add custom generated story
  const addCustomStory = (title: string, animal: string, color: string, food: string, superhero: string, text: string) => {
    setStats(prev => {
      // Advance classroom challenges tracking stories read
      const nextChallenges = prev.classroomChallenges.map(c => 
        c.type === "stories" ? { ...c, progress: Math.min(c.total, c.progress + 1) } : c
      );

      const next = {
        ...prev,
        stories: [
          ...prev.stories,
          { id: `s_${Date.now()}`, title, animal, color, food, superhero, text, date: new Date().toISOString() }
        ],
        classroomChallenges: nextChallenges
      };
      saveStats(next);
      return next;
    });
  };

  // Helper: add classroom challenge (from Teacher view)
  const addClassroomChallenge = (title: string, total: number, target: string, type: string) => {
    setStats(prev => {
      const next = {
        ...prev,
        classroomChallenges: [
          ...prev.classroomChallenges,
          { id: `cc_${Date.now()}`, title, progress: 0, total, target, active: true, type }
        ]
      };
      saveStats(next);
      return next;
    });
  };

  // Helper: add recording to voice time capsule
  const addTimeCapsuleRecording = (title: string, durationSec: number, audioUrl: string) => {
    setStats(prev => {
      const next = {
        ...prev,
        timeCapsule: [
          ...prev.timeCapsule,
          { id: `tc_${Date.now()}`, date: new Date().toISOString(), title, durationSec, audioUrl }
        ]
      };
      saveStats(next);
      return next;
    });
  };

  // Helper: update accessibility settings
  const updateAccessibility = (updates: Partial<LiveStats['accessibility']>) => {
    setStats(prev => {
      const next = {
        ...prev,
        accessibility: { ...prev.accessibility, ...updates }
      };
      saveStats(next);
      return next;
    });
  };

  return { 
    stats, 
    awardXP, 
    addMinutes, 
    logVoiceActivity, 
    logReadingSession,
    addCollectible,
    selectTheme,
    addCustomStory,
    addClassroomChallenge,
    addTimeCapsuleRecording,
    updateAccessibility
  };
}

// ── Rotating AI suggestion hook ───────────────────────────────────────────────
const AI_SUGGESTIONS_POOL = [
  "Aarav is excelling in language (82%). Introduce simple sentence-building today.",
  "Meera's attention span dipped 12% this session. Try short 5-minute picture games.",
  "3 children haven't logged in for 4 days — send a friendly reminder.",
  "Number Jungle completion is 15% below district average — schedule a group activity.",
  "Vihaan Rao earned 3 new badges this week — celebrate with the class! 🏆",
  "Diya Patel improved math by 18% — the counting beads activity is working!",
  "Average session length increased to 28 min — engagement is at an all-time high! 📈",
  "Kabir Singh responds well to animal-themed activities — use more animal flashcards.",
  "Memory Mountain completion rate: 65% across all children — try group memory games.",
  "Anaya Das showed improvement in reading readiness — continue alphabet tracing daily.",
];

export function useRotatingAISuggestions(intervalMs = 30000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % AI_SUGGESTIONS_POOL.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return AI_SUGGESTIONS_POOL.slice(index, index + 4).concat(
    AI_SUGGESTIONS_POOL.slice(0, Math.max(0, 4 - (AI_SUGGESTIONS_POOL.length - index)))
  );
}

// ── Live attendance counter ────────────────────────────────────────────────────
export function useLiveAttendance(initial = 7, max = 8) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => Math.min(max, c + (Math.random() < 0.08 ? 1 : 0)));
    }, 15000);
    return () => clearInterval(id);
  }, [max]);

  return count;
}

// ── Formatted number ──────────────────────────────────────────────────────────
export function fmtNum(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}
