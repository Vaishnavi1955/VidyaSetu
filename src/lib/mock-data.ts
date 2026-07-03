export type Role = "child" | "parent" | "worker" | "supervisor";

export const ROLES: { id: Role; label: string; emoji: string; desc: string; grad: string }[] = [
  { id: "child", label: "Child", emoji: "🧒", desc: "Play, learn and earn stars", grad: "bg-grad-yellow" },
  { id: "parent", label: "Parent", emoji: "👨‍👩‍👧", desc: "Track your child's journey", grad: "bg-grad-green" },
  { id: "worker", label: "Anganwadi Worker", emoji: "👩‍🏫", desc: "Manage your centre", grad: "bg-grad-blue" },
  { id: "supervisor", label: "Supervisor", emoji: "🧑‍💼", desc: "District-wide insights", grad: "bg-grad-purple" },
];

export const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
];

export const WORLDS = [
  { id: "alphabet", name: "Alphabet Forest", emoji: "🌳", color: "bg-grad-green", progress: 72, locked: false },
  { id: "number", name: "Number Jungle", emoji: "🔢", color: "bg-grad-blue", progress: 55, locked: false },
  { id: "animal", name: "Animal Safari", emoji: "🦁", color: "bg-grad-pink", progress: 88, locked: false },
  { id: "color", name: "Colour Galaxy", emoji: "🎨", color: "bg-grad-pink", progress: 20, locked: false },
  { id: "story", name: "Story Castle", emoji: "🏰", color: "bg-grad-purple", progress: 30, locked: false },
  { id: "shape", name: "Shape Island", emoji: "🌈", color: "bg-grad-yellow", progress: 40, locked: false },
  { id: "emotion", name: "Emotion Garden", emoji: "😊", color: "bg-grad-green", progress: 0, locked: false },
  { id: "puzzle", name: "Puzzle Planet", emoji: "🧩", color: "bg-grad-blue", progress: 10, locked: false },
];

export const BADGES = [
  { id: "b1", name: "First Lesson", emoji: "🌟", earned: true },
  { id: "b2", name: "7-Day Streak", emoji: "🔥", earned: true },
  { id: "b3", name: "100 Stars", emoji: "✨", earned: true },
  { id: "b4", name: "Alphabet Hero", emoji: "🅰️", earned: true },
  { id: "b5", name: "Math Champion", emoji: "🧮", earned: false },
  { id: "b6", name: "Story Explorer", emoji: "📖", earned: true },
  { id: "b7", name: "Animal Expert", emoji: "🐘", earned: false },
  { id: "b8", name: "Memory Master", emoji: "🧩", earned: false },
];

export const WEEKLY_PROGRESS = [
  { day: "Mon", minutes: 22, stars: 12 },
  { day: "Tue", minutes: 35, stars: 18 },
  { day: "Wed", minutes: 18, stars: 8 },
  { day: "Thu", minutes: 42, stars: 22 },
  { day: "Fri", minutes: 30, stars: 15 },
  { day: "Sat", minutes: 55, stars: 28 },
  { day: "Sun", minutes: 40, stars: 20 },
];

export const SKILL_RADAR = [
  { skill: "Memory", value: 78 },
  { skill: "Attention", value: 65 },
  { skill: "Language", value: 82 },
  { skill: "Logic", value: 58 },
  { skill: "Math", value: 70 },
  { skill: "Reading", value: 74 },
];

export const LEADERBOARD = [
  { name: "Aarav", xp: 2340, avatar: "🦊" },
  { name: "Diya", xp: 2180, avatar: "🐼" },
  { name: "Kabir", xp: 1990, avatar: "🦁" },
  { name: "You", xp: 1875, avatar: "🐯", you: true },
  { name: "Meera", xp: 1620, avatar: "🐰" },
];

export const CHILDREN = [
  { id: "c1", name: "Aarav Sharma", age: 5, avatar: "🦊", progress: 82, attendance: 96, risk: "low" },
  { id: "c2", name: "Diya Patel", age: 4, avatar: "🐼", progress: 74, attendance: 88, risk: "low" },
  { id: "c3", name: "Kabir Singh", age: 6, avatar: "🦁", progress: 65, attendance: 72, risk: "medium" },
  { id: "c4", name: "Meera Iyer", age: 3, avatar: "🐰", progress: 45, attendance: 60, risk: "high" },
  { id: "c5", name: "Vihaan Rao", age: 5, avatar: "🐵", progress: 90, attendance: 98, risk: "low" },
  { id: "c6", name: "Anaya Das", age: 4, avatar: "🦄", progress: 55, attendance: 78, risk: "medium" },
  { id: "c7", name: "Ishaan Bose", age: 6, avatar: "🐯", progress: 88, attendance: 94, risk: "low" },
  { id: "c8", name: "Riya Nair", age: 3, avatar: "🐨", progress: 38, attendance: 55, risk: "high" },
];

export const DISTRICT_PERF = [
  { name: "Pune", score: 82, centres: 124 },
  { name: "Mumbai", score: 78, centres: 210 },
  { name: "Nagpur", score: 71, centres: 88 },
  { name: "Nashik", score: 76, centres: 96 },
  { name: "Aurangabad", score: 68, centres: 74 },
  { name: "Kolhapur", score: 74, centres: 60 },
];

export const AI_SUGGESTIONS = [
  "Aarav is excelling in language. Introduce simple sentence-building today.",
  "Meera's attention span dipped 12%. Try short 5-minute picture games.",
  "3 children haven't logged in for 4 days — send a friendly reminder.",
  "Number Jungle completion is 15% below district average — schedule a group activity.",
];

export const STORIES = [
  { title: "The Brave Little Elephant", cover: "🐘", minutes: 4 },
  { title: "Rani and the Rainbow", cover: "🌈", minutes: 5 },
  { title: "The Talking Mango Tree", cover: "🥭", minutes: 6 },
];
