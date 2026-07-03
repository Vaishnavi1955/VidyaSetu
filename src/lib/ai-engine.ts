// ─── VidyaSetu AI Engine ─────────────────────────────────────────────────────
// Mock Gemini-powered AI responses for all 10 AI feature domains.
// Responses are realistic, contextual, and rotate based on child profile data.

import type { LangCode } from "./i18n";

export interface ChildProfile {
  name: string;
  age: number;
  skills: { memory: number; attention: number; language: number; logic: number; math: number; reading: number };
  streakDays: number;
  lastWorld?: string;
  weeklyMinutes: number;
}

export interface AIResponse {
  text: string;
  confidence: number;
  action?: string;
}

// ── 1. Recommend Next Activity ────────────────────────────────────────────────
const RECOMMENDATIONS_EN = [
  (p: ChildProfile) => `Hello ${p.name} 👋 Yesterday you struggled with counting. Today let's play Number Jungle to improve. Reward: 15 stars ⭐`,
  (p: ChildProfile) => `Hello ${p.name} 👋 You are doing great in language! Let's explore the Alphabet Forest today to build your vocabulary.`,
  (p: ChildProfile) => `Hello ${p.name} 👋 Your memory is getting sharper! Let's tackle Puzzle Planet today to challenge yourself!`,
  (p: ChildProfile) => `Hello ${p.name} 👋 I noticed you loved the animal shapes. Let's visit Animal Safari and learn more about them today!`,
  (p: ChildProfile) => `Hello ${p.name} 👋 You spent ${p.weeklyMinutes} minutes learning this week! Let's relax and listen to a story in Story Castle.`,
];

// ── 2. Detect Weak Skills ─────────────────────────────────────────────────────
export function detectWeakSkills(skills: ChildProfile["skills"]): { skill: string; value: number; suggestion: string }[] {
  const threshold = 65;
  const suggestions: Record<string, string> = {
    memory: "Try 5-minute daily memory card games — flip 4 pairs each session before bedtime.",
    attention: "Short 6-minute focused sessions work better. Use a visual timer and reward focus streaks.",
    language: "Read one short picture book together each evening. Point at objects and name them.",
    logic: "Pattern puzzles and sorting activities build logic. Start with 2-color bead sorting.",
    math: "Count real objects (steps, spoons, buttons) daily. Make it part of every meal.",
    reading: "Daily alphabet tracing + rhyming songs. 10 minutes each morning before school.",
  };
  return Object.entries(skills)
    .filter(([, v]) => v < threshold)
    .map(([skill, value]) => ({ skill, value, suggestion: suggestions[skill] ?? "Practice daily with short engaging activities." }));
}

// ── 3. Generate Personalized Story ───────────────────────────────────────────
const STORIES_BY_LANG: Record<LangCode, { title: string; paragraphs: string[] }[]> = {
  en: [
    {
      title: "The Clever Little Monkey",
      paragraphs: [
        "Deep in the lush Number Jungle, there lived a tiny monkey named Chotu. Every morning, Chotu would count the mangoes on his tree — one, two, three, four, five! 🐒",
        "One day, a big elephant came and mixed up all the fruits. 'Oh no!' cried Chotu. 'I can't count them now!' But Chotu remembered a trick — sort by colour first, then count!",
        "Red mangoes: 1, 2, 3. Yellow bananas: 1, 2, 3, 4. Green guavas: 1, 2! Chotu clapped his hands. 'I did it!' The elephant smiled and gave Chotu a shiny gold star ⭐.",
        "That night, Chotu taught all his forest friends to count. Because sharing what you learn makes the stars shine even brighter! 🌟",
      ],
    },
    {
      title: "Rani and the Rainbow Letters",
      paragraphs: [
        "Little Rani loved the Alphabet Forest more than anywhere else. Every letter lived in a colourful house — A in a red house, B in a blue house, all the way to Z! 🌈",
        "One stormy night, the wind blew all the letters out of their houses. When Rani arrived the next morning, she found them scattered everywhere!",
        "'Don't worry,' said Rani. She picked up each letter, sang its sound — 'A says Aaa, B says Buh' — and placed it back home. The letters giggled with happiness.",
        "By the time Rani finished, the whole forest was glowing. A rainbow arched across the sky — one colour for every letter Rani had saved! 🎉",
      ],
    },
  ],
  hi: [
    {
      title: "चतुर छोटू बंदर",
      paragraphs: [
        "संख्या जंगल में छोटू नाम का एक प्यारा बंदर रहता था। हर सुबह वह पेड़ पर आम गिनता — एक, दो, तीन, चार, पांच! 🐒",
        "एक दिन एक बड़ा हाथी आया और सभी फल मिला दिए। 'अरे नहीं!' छोटू चिल्लाया। लेकिन उसे एक तरकीब याद आई — पहले रंग से छाँटो, फिर गिनो!",
        "लाल आम: 1, 2, 3। पीले केले: 1, 2, 3, 4। हरे अमरूद: 1, 2! छोटू ने ताली बजाई। हाथी ने मुस्कुराकर एक सुनहरा सितारा दिया ⭐।",
        "उस रात छोटू ने अपने सभी जंगल के दोस्तों को गिनना सिखाया। क्योंकि जो सीखते हैं वो बांटते हैं! 🌟",
      ],
    },
  ],
  mr: [
    {
      title: "हुशार छोटू माकड",
      paragraphs: [
        "संख्या जंगलात छोटू नावाचा एक गोड माकड राहत होता। दर सकाळी तो झाडावरचे आंबे मोजायचा — एक, दोन, तीन, चार, पाच! 🐒",
        "एके दिवशी एक मोठा हत्ती आला आणि त्याने सर्व फळे मिसळून टाकली। 'अरे नाही!' छोटू ओरडला। पण त्याला एक युक्ती आठवली — आधी रंगाने वेगळे करा, मग मोजा!",
        "लाल आंबे: १, २, ३। पिवळी केळी: १, २, ३, ४। हिरव्या पेरू: १, २! छोटूने टाळ्या वाजवल्या। हत्तीने हसून एक सोनेरी तारा दिला ⭐।",
        "त्या रात्री छोटूने आपल्या जंगलातील सर्व मित्रांना मोजणी शिकवली। कारण शिकलेले सांगणे हेच खरे शहाणपण! 🌟",
      ],
    },
  ],
  gu: [
    {
      title: "હોંશિયાર છોટુ વાંદરો",
      paragraphs: [
        "સંખ્યા જંગલમાં છોટુ નામનો નાનો વાંદરો રહેતો હતો. દરરોજ સવારે તે ઝાડ પર કેરી ગણતો — એક, બે, ત્રણ, ચાર, પાંચ! 🐒",
        "એક દિવસ એક મોટો હાથી આવ્યો અને બધાં ફળ ભેળવી દીધાં. 'અરે ના!' છોટુ બૂમ પાડ્યો. પણ તેને એક ઉપાય યાદ આવ્યો — પહેલાં રંગ પ્રમાણે અલગ કરો, પછી ગણો!",
        "લાલ કેરી: ૧, ૨, ૩। પીળા કેળા: ૧, ૨, ૩, ૪। લીલી જામફળ: ૧, ૨! છોટુએ તાળી પાડી. હાથીએ હસીને એક સોનેરી સ્ટાર આપ્યો ⭐।",
        "તે રાત્રે છોટુએ તેના જંગલના બધા મિત્રોને ગણતરી શીખવી. કારણ કે શીખેલું વહેંચવું એ જ સાચી ભેટ! 🌟",
      ],
    },
  ],
  ta: [
    {
      title: "புத்திசாலி சிட்டு குரங்கு",
      paragraphs: [
        "எண் காட்டில் சிட்டு என்ற குட்டி குரங்கு வாழ்ந்தது. தினமும் காலையில் அது மரத்தில் மாம்பழங்களை எண்ணும் — ஒன்று, இரண்டு, மூன்று, நான்கு, ஐந்து! 🐒",
        "ஒரு நாள் ஒரு பெரிய யானை வந்து எல்லா பழங்களையும் கலைத்துவிட்டது. 'அட நோ!' என்று சிட்டு கத்தியது. ஆனால் அதற்கு ஒரு தந்திரம் நினைவு வந்தது — முதலில் நிறத்தால் பிரி, பிறகு எண்ணு!",
        "சிவப்பு மாம்பழங்கள்: 1, 2, 3. மஞ்சள் வாழைப்பழங்கள்: 1, 2, 3, 4. பச்சை கொய்யா: 1, 2! சிட்டு கை தட்டியது. யானை புன்னகைத்து ஒரு தங்க நட்சத்திரம் கொடுத்தது ⭐.",
        "அன்று இரவு சிட்டு காட்டில் உள்ள தன் நண்பர்களுக்கு எண்ணும் முறையை சொல்லிக் கொடுத்தது. கற்றதை பகிர்வதே உண்மையான கொடை! 🌟",
      ],
    },
  ],
  te: [
    {
      title: "తెలివైన చిన్ని కోతి",
      paragraphs: [
        "సంఖ్య అడవిలో చిట్టి అనే చిన్ని కోతి నివసించేది. ప్రతిరోజు ఉదయం అది చెట్టుపై మామిడిపండ్లను లెక్కించేది — ఒకటి, రెండు, మూడు, నాలుగు, ఐదు! 🐒",
        "ఒక రోజు ఒక పెద్ద ఏనుగు వచ్చి అన్ని పళ్ళను కలిపేసింది. 'అయ్యో!' అని చిట్టి అరిచింది. కానీ దానికి ఒక ఉపాయం గుర్తొచ్చింది — ముందు రంగు వారీగా విడదీయి, తర్వాత లెక్కించు!",
        "ఎర్రని మామిడిపండ్లు: 1, 2, 3. పసుపు అరటిపళ్ళు: 1, 2, 3, 4. పచ్చని జామపండ్లు: 1, 2! చిట్టి చప్పట్లు కొట్టింది. ఏనుగు నవ్వి ఒక బంగారు నక్షత్రం ఇచ్చింది ⭐.",
        "ఆ రాత్రి చిట్టి తన అడవి స్నేహితులందరికీ లెక్కించడం నేర్పింది. నేర్చుకున్నది పంచుకోవడమే నిజమైన బహుమతి! 🌟",
      ],
    },
  ],
  kn: [
    {
      title: "ಚಾಣಾಕ್ಷ ಚಿಟ್ಟಿ ಕೋತಿ",
      paragraphs: [
        "ಸಂಖ್ಯೆ ಕಾಡಿನಲ್ಲಿ ಚಿಟ್ಟಿ ಎಂಬ ಚಿಕ್ಕ ಕೋತಿ ವಾಸಿಸುತ್ತಿತ್ತು. ಪ್ರತಿ ಬೆಳಿಗ್ಗೆ ಅದು ಮರದ ಮಾವಿನ ಹಣ್ಣುಗಳನ್ನು ಎಣಿಸುತ್ತಿತ್ತು — ಒಂದು, ಎರಡು, ಮೂರು, ನಾಲ್ಕು, ಐದು! 🐒",
        "ಒಂದು ದಿನ ದೊಡ್ಡ ಆನೆಯೊಂದು ಬಂದು ಎಲ್ಲಾ ಹಣ್ಣುಗಳನ್ನು ಮಿಶ್ರ ಮಾಡಿಬಿಟ್ಟಿತು. 'ಅಯ್ಯೋ!' ಎಂದು ಚಿಟ್ಟಿ ಕಿರಿಚಿತು. ಆದರೆ ಅದಕ್ಕೆ ಒಂದು ಉಪಾಯ ನೆನಪಾಯಿತು — ಮೊದಲು ಬಣ್ಣದ ಪ್ರಕಾರ ಬೇರ್ಪಡಿಸು, ನಂತರ ಎಣಿಸು!",
        "ಕೆಂಪು ಮಾವಿನಹಣ್ಣುಗಳು: 1, 2, 3. ಹಳದಿ ಬಾಳೆಹಣ್ಣುಗಳು: 1, 2, 3, 4. ಹಸಿರು ಸೀಬೆ: 1, 2! ಚಿಟ್ಟಿ ಚಪ್ಪಾಳೆ ತಟ್ಟಿತು. ಆನೆ ನಕ್ಕು ಒಂದು ಚಿನ್ನದ ನಕ್ಷತ್ರ ಕೊಟ್ಟಿತು ⭐.",
        "ಆ ರಾತ್ರಿ ಚಿಟ್ಟಿ ತನ್ನ ಕಾಡಿನ ಎಲ್ಲ ಗೆಳೆಯರಿಗೆ ಎಣಿಕೆ ಕಲಿಸಿತು. ಕಲಿತದ್ದನ್ನು ಹಂಚುವುದೇ ನಿಜವಾದ ಕೊಡುಗೆ! 🌟",
      ],
    },
  ],
};

export function generateStory(lang: LangCode): { title: string; paragraphs: string[] } {
  const pool = STORIES_BY_LANG[lang] ?? STORIES_BY_LANG.en;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── 4. Adapt Difficulty ────────────────────────────────────────────────────────
export function adaptDifficulty(correctStreak: number, wrongStreak: number): { level: "easy" | "medium" | "hard"; reason: string } {
  if (correctStreak >= 3) return { level: "hard", reason: `Gemini AI: ${correctStreak} correct answers in a row! Increasing difficulty to keep engagement high and stimulate deeper thinking.` };
  if (wrongStreak >= 2) return { level: "easy", reason: `Gemini AI: Let's take a step back. ${wrongStreak} missed answers detected. Switching to easier content to rebuild confidence and try again.` };
  return { level: "medium", reason: "Gemini AI: Balanced performance detected. Maintaining current difficulty level for optimal flow state." };
}

// ── 5. Analyze Memory ─────────────────────────────────────────────────────────
export function analyzeMemory(pairsFound: number, attempts: number, timeSec: number): { score: number; insight: string } {
  const efficiency = pairsFound / Math.max(attempts, 1);
  const score = Math.round(efficiency * 100);
  let insight = "";
  if (score >= 80) insight = "Excellent working memory! Your child held multiple card positions in mind simultaneously — this predicts strong reading comprehension.";
  else if (score >= 60) insight = "Good memory performance. Slight improvement in sequential recall would help. Try daily 'what did we see today' bedtime conversations.";
  else insight = "Memory is developing. Short daily games with 4 pairs (instead of 8) will gradually build working memory without frustration.";
  return { score, insight };
}

// ── 6. Analyze Attention ──────────────────────────────────────────────────────
export function analyzeAttention(completionRatePercent: number, avgSessionMinutes: number): { score: number; insight: string } {
  const score = Math.min(100, Math.round((completionRatePercent * 0.6) + (Math.min(avgSessionMinutes, 15) / 15 * 40)));
  let insight = "";
  if (score >= 75) insight = `Strong attention span! Averaging ${avgSessionMinutes} min per session is excellent for this age group. Consider introducing 2-step instructions in games.`;
  else if (score >= 50) insight = `Moderate attention span. ${avgSessionMinutes}-minute sessions are good. Peak focus is usually between 5–7 PM — schedule learning then.`;
  else insight = `Attention needs support. Break sessions into 5-minute blocks with a 2-minute movement break between them. The 'Pomodoro for kids' method works well.`;
  return { score, insight };
}

// ── 7. Generate Weekly Report ─────────────────────────────────────────────────
export function generateWeeklyReport(profile: ChildProfile): string {
  const weakSkills = detectWeakSkills(profile.skills);
  const topSkill = Object.entries(profile.skills).sort((a, b) => b[1] - a[1])[0];
  return `📊 WEEKLY AI REPORT — ${profile.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌟 HIGHLIGHTS
• Total learning time: ${profile.weeklyMinutes} minutes this week
• Current streak: ${profile.streakDays} days 🔥
• Top skill: ${topSkill[0].charAt(0).toUpperCase() + topSkill[0].slice(1)} (${topSkill[1]}%)
• Worlds explored: Alphabet Forest, Number Jungle

⚠️ AREAS NEEDING ATTENTION
${weakSkills.length > 0 ? weakSkills.map(w => `• ${w.skill.charAt(0).toUpperCase() + w.skill.slice(1)}: ${w.value}% — ${w.suggestion}`).join("\n") : "• All skills above threshold! Keep it up! 🎉"}

🎯 THIS WEEK'S RECOMMENDATION
${RECOMMENDATIONS_EN[Math.floor(Math.random() * RECOMMENDATIONS_EN.length)](profile)}

📈 SCHOOL READINESS FORECAST
${predictSchoolReadiness(profile).message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by Gemini AI · VidyaSetu`;
}

// ── 8. Suggest Home Activities ────────────────────────────────────────────────
export function suggestHomeActivities(skills: ChildProfile["skills"], lang: LangCode): string[] {
  const activities: Record<string, string[]> = {
    en: [
      "🍎 Count objects in the kitchen during meal prep — spoons, cups, vegetables. Say each number aloud!",
      "📚 Read one picture book tonight. Point to each letter on the cover and make its sound together.",
      "🎨 Draw 3 different shapes on paper, cut them out, then sort them by size — big, medium, small.",
      "🐾 Play 'Animal Sound Quiz' — one person makes an animal sound, others guess the animal + say its name.",
      "🔢 Play hopscotch and count each jump! Land on numbers 1 to 10 in order.",
      "🌈 Colour scavenger hunt — find 5 red things, 3 blue things, and 2 green things around the house!",
      "🧩 Build a 6-piece puzzle together. Talk about the shapes fitting together — 'this corner matches!'",
      "🎵 Sing the alphabet song slowly, stopping at each letter. Can your child fill in the next letter?",
    ],
    hi: [
      "🍎 खाना बनाते समय चीजें गिनें — चम्मच, कप, सब्जियाँ। हर नंबर जोर से बोलें!",
      "📚 आज रात एक चित्र पुस्तक पढ़ें। कवर पर हर अक्षर की ओर इशारा करें और उसकी आवाज़ निकालें।",
      "🎨 कागज़ पर 3 आकार बनाएं, काटें, फिर आकार के अनुसार छाँटें — बड़ा, मध्यम, छोटा।",
      "🐾 'जानवर की आवाज़ की पहेली' खेलें — एक व्यक्ति आवाज़ निकाले, बाकी जानवर का नाम बताएं।",
      "🔢 हॉपस्कॉच खेलें और हर छलांग गिनें! 1 से 10 तक क्रम में।",
    ],
  };
  const pool = activities[lang] ?? activities.en;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// ── 9. Recommend Anganwadi Activities ─────────────────────────────────────────
export function recommendAnganwadiActivities(childrenCount: number, atRiskCount: number): string[] {
  return [
    `GROUP CIRCLE TIME (10 min): Have all ${childrenCount} children sit in a circle. Show a flash card — each child names the object and its colour. Builds vocabulary + attention in all age groups.`,
    `SAND TRAY LETTERS (15 min): Fill a tray with sand/rice flour. Call each child one by one to trace a letter with their finger. For ${atRiskCount} at-risk children, start with A, M, O (easiest shapes).`,
    `COUNTING BEANS ACTIVITY (8 min): Give each child 10 beans. Call out a number — children count and show that many beans. Encourages peer learning and fine motor skills simultaneously.`,
    `STORY TIME WITH ACTIONS (12 min): Read "The Brave Little Elephant" story aloud. Pause at verbs and ask children to act them out — jump, run, splash. Boosts comprehension + physical coordination.`,
    `COLOUR SORTING COMPETITION (10 min): Bring 20 mixed-colour blocks. Divide into 4 teams. First team to sort by colour wins a star sticker. Creates positive competition + focus.`,
  ];
}

// ── 10. Predict School Readiness ──────────────────────────────────────────────
export function predictSchoolReadiness(profile: ChildProfile): { score: number; level: string; message: string; risks: string[] } {
  const avgSkill = Object.values(profile.skills).reduce((a, b) => a + b, 0) / 6;
  const streakBonus = Math.min(profile.streakDays * 0.5, 10);
  const score = Math.min(100, Math.round(avgSkill + streakBonus));
  let level = "", message = "", risks: string[] = [];

  if (score >= 80) {
    level = "School Ready 🎓";
    message = `${profile.name} shows strong foundational skills across all domains. High probability of smooth transition to primary school. Continue enrichment activities.`;
  } else if (score >= 60) {
    level = "Progressing Well 📈";
    message = `${profile.name} is on track with a few areas to strengthen. Focus on ${detectWeakSkills(profile.skills).map(w => w.skill).join(", ")} over the next 4 weeks.`;
    risks = detectWeakSkills(profile.skills).map(w => `${w.skill}: ${w.suggestion}`);
  } else {
    level = "Needs Support ⚠️";
    message = `${profile.name} may benefit from additional support. Recommend daily structured 20-minute learning sessions and parent involvement activities.`;
    risks = detectWeakSkills(profile.skills).map(w => `${w.skill}: ${w.suggestion}`);
  }
  return { score, level, message, risks };
}

// ── Public Recommend function ──────────────────────────────────────────────────
export function recommendNextActivity(profile: ChildProfile): string {
  const fn = RECOMMENDATIONS_EN[Math.floor(profile.weeklyMinutes % RECOMMENDATIONS_EN.length)];
  return fn(profile);
}

// ── Expanded AI Chat answers ──────────────────────────────────────────────────
export const AI_CHAT_RESPONSES = [
  {
    patterns: /count|number|math|गिन|गणित|संख्या|ಎಣಿಸ|எண்|लेक्क|లెక్క/i,
    answer: (lang: LangCode) => lang === "hi"
      ? "चलो गिनती को मज़ेदार बनाते हैं! आज रात 5 ब्लॉक की मीनार बनाएं, फिर उसे गिराएं और दोबारा गिनें। मैं Number Jungle का 'Frog Jumps 1–10' लेवल भी अनलॉक करूंगा 🐸"
      : "Let's make counting fun! Try the 'Frog Jumps 1–10' activity in Number Jungle. Build a tower of 5 blocks tonight, knock it down and count each one. I'm also unlocking Bonus Level 3 for you! 🐸",
  },
  {
    patterns: /story|read|कहानी|पढ़|वाचा|கதை|కథ|ಕಥೆ/i,
    answer: (lang: LangCode) => lang === "mr"
      ? "एक गोड 4-मिनिटांची झोपण्याची वेळ कथा: 'शूर छोटा हत्ती ज्याला इंद्रधनुष्य सापडले'. मराठी, हिंदी किंवा इंग्रजीत ऐकायची आहे का? 🐘🌈"
      : "Here's a personalized 4-minute bedtime story: 'The Brave Little Elephant who Found the Rainbow' 🐘. I've generated it based on your child's Animal Safari progress. Shall I read it in Hindi, Marathi or English?",
  },
  {
    patterns: /weak|struggl|slow|कमजोर|अडचण|ضعيف|weak/i,
    answer: (_lang: LangCode) => "Based on the last 7 sessions, I noticed attention drops after 8 minutes and math confidence at 58%. Try 2 short 6-minute sessions per day — one in morning, one evening. Add one memory game before bedtime. I've prepared a custom 5-day plan for you! 📋",
  },
  {
    patterns: /alphabet|letter|अक्षर|वर्णमाला|ಅಕ್ಷರ|எழுத்து|అక్షర/i,
    answer: (_lang: LangCode) => "Great focus! Today's alphabet mission: the letter 'M' 🐒. I've queued: (1) Tracing exercise, (2) 'Find the M' animal hunt, (3) M-sound song. Complete all 3 for 15 stars ⭐!",
  },
  {
    patterns: /activit|practice|suggest|गतिविधि|उपक्रम|सुझाव|ಚಟುವಟಿಕೆ|செயல்/i,
    answer: (_lang: LangCode) => "Try these 3 activities today: 1) Colour-sort 5 objects in your kitchen 🎨, 2) Sing the ABC song slowly, stopping at each letter 🎵, 3) Draw the shape you see most today and count how many sides it has 🔺. I'll log all as home practice!",
  },
  {
    patterns: /attend|absen|हाजिर|उपस्थित|హాజరు|హాజరు/i,
    answer: (_lang: LangCode) => "I noticed 3 children haven't logged in for 4 days. I've flagged Meera Iyer and Riya Nair for a home visit. Sending a gentle reminder message to their parents now. Regular attendance is crucial — even 20 minutes/day matters. 📋",
  },
  {
    patterns: /report|week|साप्ताहिक|रिपोर्ट|अहवाल|வாரம்|నివేదిక/i,
    answer: (_lang: LangCode) => "Here's this week's AI summary: ✅ 6/8 children above 70% progress. ⚠️ 2 need support in math. 🔥 Vihaan Rao hit 98% attendance — star performer! 📈 Overall class improved 8% from last week. Want me to generate the full PDF report?",
  },
  {
    patterns: /school|ready|readiness|तैयार|शाळा|பள்ளி|పాఠశాల/i,
    answer: (_lang: LangCode) => "School Readiness Analysis: Aarav shows 84% readiness 🎓. Strong in language and memory. Math and logic need 4 more weeks of focused practice. Recommended: Daily 15-min counting games + pattern sorting activities. High probability of smooth primary school transition!",
  },
];

export function getAIChatResponse(message: string, lang: LangCode): string {
  const match = AI_CHAT_RESPONSES.find(r => r.patterns.test(message));
  if (match) return match.answer(lang);
  return lang === "hi"
    ? "मैं यहाँ मदद के लिए हूँ! गिनती, अक्षर, कहानियों, या आज आपके बच्चे को क्या सीखना चाहिए — इनके बारे में पूछें। 🌟"
    : "I'm here to help! Ask me about counting, alphabet, stories, activities, attendance, or your child's school readiness. Each answer is personalized using Gemini AI 🌟";
}
