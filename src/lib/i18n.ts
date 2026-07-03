// ─── VidyaSetu Multilingual Engine ───────────────────────────────────────────
// Supports: English, Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada

export type LangCode = "en" | "hi" | "mr" | "gu" | "ta" | "te" | "kn";

export interface Translations {
  // Nav
  myWorld: string;
  learn: string;
  rewards: string;
  profile: string;
  overview: string;
  progress: string;
  activities: string;
  aiAssistant: string;
  children: string;
  attendance: string;
  reports: string;
  districts: string;
  centres: string;

  // Common
  continuelearning: string;
  dailyChallenge: string;
  startLearning: string;
  getStarted: string;
  logIn: string;
  signUp: string;
  submit: string;
  close: string;
  playNow: string;
  tryActivity: string;
  export: string;
  download: string;
  generateReport: string;
  askAssistant: string;
  sendMessage: string;
  generateWeeklyPlan: string;
  generatePolicyBrief: string;
  viewAll: string;
  backToDashboard: string;
  nextLevel: string;
  wellDone: string;
  tryAgain: string;
  skip: string;
  hint: string;

  // Child Dashboard
  todayRecommendation: string;
  aiSays: string;
  todayProgress: string;
  learningWorlds: string;
  pickWorld: string;
  yourWeek: string;
  minutesLearned: string;
  leaderboard: string;
  friendsThisWeek: string;
  myBadges: string;
  stars: string;
  coins: string;
  streak: string;
  xp: string;
  locked: string;
  complete: string;
  agesRange: string;

  // Parent Dashboard
  learningJourney: string;
  today: string;
  thisWeek: string;
  accuracy: string;
  happiness: string;
  learningTime: string;
  last7Days: string;
  skillRadar: string;
  strengthsAreas: string;
  weeklyCoaching: string;
  recentAchievements: string;
  screenTime: string;
  homeActivities: string;
  minRead: string;
  bedtime: string;
  schoolReadiness: string;
  readinessScore: string;
  weeklyReport: string;

  // Worker Dashboard
  sunita: string;
  enrolled: string;
  activeToday: string;
  avgProgress: string;
  aboveDistrict: string;
  atRisk: string;
  needIntervention: string;
  childrenProgress: string;
  aiInsights: string;
  topPerformers: string;
  attendanceWeek: string;
  centreWide: string;

  // Supervisor Dashboard
  maharashtra: string;
  totalCentres: string;
  avgAttendance: string;
  learningScore: string;
  aboveNational: string;
  districtPerformance: string;
  avgScoreDistrict: string;
  learningTrend: string;
  weeklyMinutes: string;
  skillHeatmap: string;
  performanceDay: string;
  topDistricts: string;
  aiDistrictInsights: string;

  // Games
  memoryMatch: string;
  alphabetQuiz: string;
  numberCount: string;
  shapeSort: string;
  animalQuiz: string;
  tapToFlip: string;
  findPairs: string;
  whichLetter: string;
  howManyObjects: string;
  sortShapes: string;
  whichAnimal: string;
  pairsFound: string;
  attempts: string;
  timeSeconds: string;
  youWon: string;
  earnedStars: string;
  correctAnswer: string;
  wrongAnswer: string;
  levelUp: string;
  clickToStart: string;
  score: string;

  // AI Chat
  aiGreeting: string;
  askAnything: string;
  aiThinking: string;

  // Worlds
  alphabetForest: string;
  numberJungle: string;
  shapeIsland: string;
  animalSafari: string;
  storyCastle: string;
  colorGalaxy: string;
  memoryMountain: string;
  emotionGarden: string;

  // Risk labels
  lowRisk: string;
  mediumRisk: string;
  highRisk: string;

  // Misc
  syncedAgo: string;
  offlineBadge: string;
  poweredByGemini: string;
  madeForBharat: string;
}

const en: Translations = {
  myWorld: "My World", learn: "Learn", rewards: "Rewards", profile: "Profile",
  overview: "Overview", progress: "Progress", activities: "Activities", aiAssistant: "AI Assistant",
  children: "Children", attendance: "Attendance", reports: "Reports", districts: "Districts", centres: "Centres",
  continuelearning: "Continue Learning", dailyChallenge: "Daily Challenge", startLearning: "Start Learning",
  getStarted: "Get Started", logIn: "Log in", signUp: "Sign up", submit: "Submit", close: "Close",
  playNow: "Play Now", tryActivity: "Try Activity", export: "Export", download: "Download",
  generateReport: "Generate Report", askAssistant: "Ask Assistant", sendMessage: "Send",
  generateWeeklyPlan: "Generate Weekly Plan", generatePolicyBrief: "Generate Policy Brief",
  viewAll: "View All", backToDashboard: "Back to Dashboard", nextLevel: "Next Level",
  wellDone: "Well Done! 🎉", tryAgain: "Try Again", skip: "Skip", hint: "Hint",
  todayRecommendation: "AI Recommendation for Today", aiSays: "AI Says",
  todayProgress: "Today's Progress", learningWorlds: "Learning Worlds", pickWorld: "Pick a world and start your adventure",
  yourWeek: "Your Week", minutesLearned: "Minutes learned each day", leaderboard: "Leaderboard",
  friendsThisWeek: "Your friends this week", myBadges: "My Badges", stars: "Stars", coins: "Coins",
  streak: "Streak", xp: "XP", locked: "🔒 Locked", complete: "% complete", agesRange: "Ages 3–6",
  learningJourney: "Learning Journey", today: "Today", thisWeek: "This Week", accuracy: "Accuracy",
  happiness: "Happiness", learningTime: "Learning Time", last7Days: "Last 7 days",
  skillRadar: "Skill Radar", strengthsAreas: "Strengths & areas to improve",
  weeklyCoaching: "This week's coaching from Gemini", recentAchievements: "Recent Achievements",
  screenTime: "Screen time today", homeActivities: "Home Activities", minRead: "min read",
  bedtime: "Bedtime", schoolReadiness: "School Readiness", readinessScore: "Readiness Score",
  weeklyReport: "Weekly AI Report",
  sunita: "Sunita's Centre · Pune-14", enrolled: "Enrolled", activeToday: "active today",
  avgProgress: "Avg Progress", aboveDistrict: "Above district avg", atRisk: "At Risk",
  needIntervention: "Need intervention", childrenProgress: "Children Progress", aiInsights: "AI Insights",
  topPerformers: "Top Performers", attendanceWeek: "Attendance This Week", centreWide: "Centre-wide daily attendance",
  maharashtra: "Maharashtra · District Overview", totalCentres: "Total Centres", avgAttendance: "Avg Attendance",
  learningScore: "Learning Score", aboveNational: "Above national avg", districtPerformance: "District Performance",
  avgScoreDistrict: "Average learning score by district", learningTrend: "Learning Trend",
  weeklyMinutes: "Weekly learning minutes across the state", skillHeatmap: "Skill Heatmap",
  performanceDay: "Performance by skill × day", topDistricts: "Top Districts", aiDistrictInsights: "AI District Insights",
  memoryMatch: "Memory Match", alphabetQuiz: "Alphabet Quiz", numberCount: "Count & Click",
  shapeSort: "Shape Sort", animalQuiz: "Animal Safari Quiz",
  tapToFlip: "Tap cards to flip!", findPairs: "Find all matching pairs", whichLetter: "Which letter is this?",
  howManyObjects: "How many objects do you see?", sortShapes: "Sort the shapes!", whichAnimal: "Which animal is this?",
  pairsFound: "Pairs Found", attempts: "Attempts", timeSeconds: "seconds", youWon: "You Won!",
  earnedStars: "You earned", correctAnswer: "Correct! ⭐", wrongAnswer: "Try again! 💪",
  levelUp: "Level Up! 🚀", clickToStart: "Click to Start", score: "Score",
  aiGreeting: "Hi! I'm your VidyaSetu AI assistant. Ask me anything about your child's learning ✨",
  askAnything: "Ask anything...", aiThinking: "Thinking...",
  alphabetForest: "Alphabet Forest", numberJungle: "Number Jungle", shapeIsland: "Shape Island",
  animalSafari: "Animal Safari", storyCastle: "Story Castle", colorGalaxy: "Color Galaxy",
  memoryMountain: "Memory Mountain", emotionGarden: "Emotion Garden",
  lowRisk: "Low Risk", mediumRisk: "Medium Risk", highRisk: "High Risk",
  syncedAgo: "Synced 2 min ago", offlineBadge: "Offline Mode",
  poweredByGemini: "Powered by Gemini · Online", madeForBharat: "Made with ❤️ for Bharat",
};

const hi: Translations = {
  myWorld: "मेरी दुनिया", learn: "सीखें", rewards: "पुरस्कार", profile: "प्रोफाइल",
  overview: "सारांश", progress: "प्रगति", activities: "गतिविधियाँ", aiAssistant: "AI सहायक",
  children: "बच्चे", attendance: "उपस्थिति", reports: "रिपोर्ट", districts: "जिले", centres: "केंद्र",
  continuelearning: "सीखना जारी रखें", dailyChallenge: "दैनिक चुनौती", startLearning: "सीखना शुरू करें",
  getStarted: "शुरू करें", logIn: "लॉग इन", signUp: "साइन अप", submit: "जमा करें", close: "बंद करें",
  playNow: "अभी खेलें", tryActivity: "गतिविधि आज़माएं", export: "निर्यात", download: "डाउनलोड",
  generateReport: "रिपोर्ट बनाएं", askAssistant: "सहायक से पूछें", sendMessage: "भेजें",
  generateWeeklyPlan: "साप्ताहिक योजना बनाएं", generatePolicyBrief: "नीति रिपोर्ट बनाएं",
  viewAll: "सब देखें", backToDashboard: "डैशबोर्ड पर वापस", nextLevel: "अगला स्तर",
  wellDone: "शाबाश! 🎉", tryAgain: "फिर कोशिश करें", skip: "छोड़ें", hint: "संकेत",
  todayRecommendation: "आज की AI अनुशंसा", aiSays: "AI कहती है",
  todayProgress: "आज की प्रगति", learningWorlds: "सीखने की दुनिया", pickWorld: "एक दुनिया चुनें और अपना साहसिक कार्य शुरू करें",
  yourWeek: "आपका सप्ताह", minutesLearned: "हर दिन सीखे गए मिनट", leaderboard: "लीडरबोर्ड",
  friendsThisWeek: "इस सप्ताह आपके मित्र", myBadges: "मेरे बैज", stars: "तारे", coins: "सिक्के",
  streak: "लकीर", xp: "XP", locked: "🔒 बंद", complete: "% पूर्ण", agesRange: "उम्र 3–6",
  learningJourney: "सीखने की यात्रा", today: "आज", thisWeek: "इस सप्ताह", accuracy: "सटीकता",
  happiness: "खुशी", learningTime: "सीखने का समय", last7Days: "पिछले 7 दिन",
  skillRadar: "कौशल रडार", strengthsAreas: "ताकत और सुधार के क्षेत्र",
  weeklyCoaching: "Gemini से इस सप्ताह की कोचिंग", recentAchievements: "हाल की उपलब्धियाँ",
  screenTime: "आज की स्क्रीन टाइम", homeActivities: "घर की गतिविधियाँ", minRead: "मिनट पढ़ें",
  bedtime: "सोने का समय", schoolReadiness: "स्कूल की तैयारी", readinessScore: "तैयारी स्कोर",
  weeklyReport: "साप्ताहिक AI रिपोर्ट",
  sunita: "सुनीता का केंद्र · पुणे-14", enrolled: "नामांकित", activeToday: "आज सक्रिय",
  avgProgress: "औसत प्रगति", aboveDistrict: "जिला औसत से अधिक", atRisk: "जोखिम में",
  needIntervention: "हस्तक्षेप की आवश्यकता", childrenProgress: "बच्चों की प्रगति", aiInsights: "AI अंतर्दृष्टि",
  topPerformers: "शीर्ष प्रदर्शनकर्ता", attendanceWeek: "इस सप्ताह की उपस्थिति", centreWide: "केंद्र-व्यापी दैनिक उपस्थिति",
  maharashtra: "महाराष्ट्र · जिला सारांश", totalCentres: "कुल केंद्र", avgAttendance: "औसत उपस्थिति",
  learningScore: "सीखने का स्कोर", aboveNational: "राष्ट्रीय औसत से अधिक", districtPerformance: "जिला प्रदर्शन",
  avgScoreDistrict: "जिले का औसत सीखने का स्कोर", learningTrend: "सीखने का रुझान",
  weeklyMinutes: "राज्य भर में साप्ताहिक सीखने के मिनट", skillHeatmap: "कौशल हीटमैप",
  performanceDay: "कौशल × दिन के अनुसार प्रदर्शन", topDistricts: "शीर्ष जिले", aiDistrictInsights: "AI जिला अंतर्दृष्टि",
  memoryMatch: "मेमोरी मैच", alphabetQuiz: "वर्णमाला क्विज़", numberCount: "गिनो और क्लिक करो",
  shapeSort: "आकार छाँटो", animalQuiz: "जानवर सफारी क्विज़",
  tapToFlip: "पलटने के लिए टैप करें!", findPairs: "सभी जोड़े खोजें", whichLetter: "यह कौन सा अक्षर है?",
  howManyObjects: "आप कितनी वस्तुएं देखते हैं?", sortShapes: "आकार छाँटो!", whichAnimal: "यह कौन सा जानवर है?",
  pairsFound: "जोड़े मिले", attempts: "प्रयास", timeSeconds: "सेकंड", youWon: "आप जीत गए!",
  earnedStars: "आपने कमाए", correctAnswer: "सही! ⭐", wrongAnswer: "फिर कोशिश करो! 💪",
  levelUp: "लेवल अप! 🚀", clickToStart: "शुरू करने के लिए क्लिक करें", score: "स्कोर",
  aiGreeting: "नमस्ते! मैं आपका VidyaSetu AI सहायक हूँ। बच्चे की सीखने के बारे में कुछ भी पूछें ✨",
  askAnything: "कुछ भी पूछें...", aiThinking: "सोच रहा हूँ...",
  alphabetForest: "वर्णमाला वन", numberJungle: "संख्या जंगल", shapeIsland: "आकार द्वीप",
  animalSafari: "जानवर सफारी", storyCastle: "कहानी महल", colorGalaxy: "रंग आकाशगंगा",
  memoryMountain: "स्मृति पर्वत", emotionGarden: "भावना उद्यान",
  lowRisk: "कम जोखिम", mediumRisk: "मध्यम जोखिम", highRisk: "उच्च जोखिम",
  syncedAgo: "2 मिनट पहले सिंक", offlineBadge: "ऑफलाइन मोड",
  poweredByGemini: "Gemini द्वारा संचालित · ऑनलाइन", madeForBharat: "भारत के लिए ❤️ से बनाया",
};

const mr: Translations = {
  myWorld: "माझे जग", learn: "शिका", rewards: "पुरस्कार", profile: "प्रोफाइल",
  overview: "सारांश", progress: "प्रगती", activities: "उपक्रम", aiAssistant: "AI सहाय्यक",
  children: "मुले", attendance: "उपस्थिती", reports: "अहवाल", districts: "जिल्हे", centres: "केंद्रे",
  continuelearning: "शिकणे सुरू ठेवा", dailyChallenge: "दैनिक आव्हान", startLearning: "शिकायला सुरुवात करा",
  getStarted: "सुरू करा", logIn: "लॉग इन", signUp: "साइन अप", submit: "सबमिट करा", close: "बंद करा",
  playNow: "आता खेळा", tryActivity: "उपक्रम करून पहा", export: "निर्यात", download: "डाउनलोड",
  generateReport: "अहवाल तयार करा", askAssistant: "सहाय्यकाला विचारा", sendMessage: "पाठवा",
  generateWeeklyPlan: "साप्ताहिक योजना तयार करा", generatePolicyBrief: "धोरण अहवाल तयार करा",
  viewAll: "सर्व पहा", backToDashboard: "डॅशबोर्डवर परत", nextLevel: "पुढील स्तर",
  wellDone: "शाबास! 🎉", tryAgain: "पुन्हा प्रयत्न करा", skip: "वगळा", hint: "संकेत",
  todayRecommendation: "आजची AI शिफारस", aiSays: "AI म्हणते",
  todayProgress: "आजची प्रगती", learningWorlds: "शिकण्याचे जग", pickWorld: "एक जग निवडा आणि साहस सुरू करा",
  yourWeek: "तुमचा आठवडा", minutesLearned: "दररोज शिकलेले मिनिटे", leaderboard: "लीडरबोर्ड",
  friendsThisWeek: "या आठवड्यातील मित्र", myBadges: "माझे बॅज", stars: "तारे", coins: "नाणी",
  streak: "धावा", xp: "XP", locked: "🔒 बंद", complete: "% पूर्ण", agesRange: "वय 3–6",
  learningJourney: "शिकण्याचा प्रवास", today: "आज", thisWeek: "या आठवड्यात", accuracy: "अचूकता",
  happiness: "आनंद", learningTime: "शिकण्याची वेळ", last7Days: "मागील 7 दिवस",
  skillRadar: "कौशल्य रडार", strengthsAreas: "ताकद आणि सुधारणेचे क्षेत्र",
  weeklyCoaching: "Gemini कडून या आठवड्याची मार्गदर्शन", recentAchievements: "अलीकडील यश",
  screenTime: "आजचा स्क्रीन वेळ", homeActivities: "घरगुती उपक्रम", minRead: "मिनिट वाचा",
  bedtime: "झोपण्याची वेळ", schoolReadiness: "शाळेची तयारी", readinessScore: "तयारी गुण",
  weeklyReport: "साप्ताहिक AI अहवाल",
  sunita: "सुनीताचे केंद्र · पुणे-14", enrolled: "नोंदणी केलेले", activeToday: "आज सक्रिय",
  avgProgress: "सरासरी प्रगती", aboveDistrict: "जिल्हा सरासरीपेक्षा जास्त", atRisk: "धोक्यात",
  needIntervention: "हस्तक्षेप आवश्यक", childrenProgress: "मुलांची प्रगती", aiInsights: "AI अंतर्दृष्टी",
  topPerformers: "शीर्ष कामगिरी करणारे", attendanceWeek: "या आठवड्यातील उपस्थिती", centreWide: "केंद्र-व्यापी दैनिक उपस्थिती",
  maharashtra: "महाराष्ट्र · जिल्हा आढावा", totalCentres: "एकूण केंद्रे", avgAttendance: "सरासरी उपस्थिती",
  learningScore: "शिकण्याचा गुण", aboveNational: "राष्ट्रीय सरासरीपेक्षा जास्त", districtPerformance: "जिल्हा कामगिरी",
  avgScoreDistrict: "जिल्ह्याचा सरासरी शिकण्याचा गुण", learningTrend: "शिकण्याचा कल",
  weeklyMinutes: "राज्यभर साप्ताहिक शिकण्याचे मिनिटे", skillHeatmap: "कौशल्य हीटमॅप",
  performanceDay: "कौशल्य × दिवसानुसार कामगिरी", topDistricts: "शीर्ष जिल्हे", aiDistrictInsights: "AI जिल्हा अंतर्दृष्टी",
  memoryMatch: "मेमरी मॅच", alphabetQuiz: "अक्षर प्रश्नमंजुषा", numberCount: "मोजा आणि क्लिक करा",
  shapeSort: "आकार वर्गीकरण", animalQuiz: "प्राणी सफारी प्रश्नमंजुषा",
  tapToFlip: "पलटण्यासाठी टॅप करा!", findPairs: "सर्व जोड्या शोधा", whichLetter: "हे कोणते अक्षर आहे?",
  howManyObjects: "तुम्ही किती वस्तू पाहता?", sortShapes: "आकार वर्गीकरण करा!", whichAnimal: "हा कोणता प्राणी आहे?",
  pairsFound: "जोड्या सापडल्या", attempts: "प्रयत्न", timeSeconds: "सेकंद", youWon: "तुम्ही जिंकलात!",
  earnedStars: "तुम्ही कमावले", correctAnswer: "बरोबर! ⭐", wrongAnswer: "पुन्हा प्रयत्न करा! 💪",
  levelUp: "लेव्हल अप! 🚀", clickToStart: "सुरू करण्यासाठी क्लिक करा", score: "गुण",
  aiGreeting: "नमस्कार! मी तुमचा VidyaSetu AI सहाय्यक आहे. मुलाच्या शिकण्याबद्दल काहीही विचारा ✨",
  askAnything: "काहीही विचारा...", aiThinking: "विचार करत आहे...",
  alphabetForest: "अक्षर वन", numberJungle: "संख्या जंगल", shapeIsland: "आकार बेट",
  animalSafari: "प्राणी सफारी", storyCastle: "कथा महाल", colorGalaxy: "रंग आकाशगंगा",
  memoryMountain: "स्मृती पर्वत", emotionGarden: "भावना उद्यान",
  lowRisk: "कमी धोका", mediumRisk: "मध्यम धोका", highRisk: "उच्च धोका",
  syncedAgo: "2 मिनिटांपूर्वी सिंक", offlineBadge: "ऑफलाइन मोड",
  poweredByGemini: "Gemini द्वारे चालित · ऑनलाइन", madeForBharat: "भारतासाठी ❤️ ने बनवले",
};

const gu: Translations = {
  myWorld: "મારી દુનિયા", learn: "શીખો", rewards: "ઇનામ", profile: "પ્રોફાઇલ",
  overview: "સારાંશ", progress: "પ્રગતિ", activities: "પ્રવૃત્તિઓ", aiAssistant: "AI સહાયક",
  children: "બાળકો", attendance: "હાજરી", reports: "અહેવાલ", districts: "જિલ્લા", centres: "કેન્દ્રો",
  continuelearning: "શીખવાનું ચાલુ રાખો", dailyChallenge: "દૈનિક પડકાર", startLearning: "શીખવાનું શરૂ કરો",
  getStarted: "શરૂ કરો", logIn: "લૉગ ઇન", signUp: "સાઇન અપ", submit: "સબમિટ", close: "બંધ",
  playNow: "હવે રમો", tryActivity: "પ્રવૃત્તિ અજમાવો", export: "નિકાસ", download: "ડાઉનલોડ",
  generateReport: "અહેવાલ બનાવો", askAssistant: "સહાયકને પૂછો", sendMessage: "મોકલો",
  generateWeeklyPlan: "સાપ્તાહિક યોજના બનાવો", generatePolicyBrief: "નીતિ અહેવાલ બનાવો",
  viewAll: "બધા જુઓ", backToDashboard: "ડૅશબોર્ડ પર પાછા", nextLevel: "આગળનું સ્તર",
  wellDone: "શાબાશ! 🎉", tryAgain: "ફરી પ્રયાસ કરો", skip: "છોડો", hint: "સૂચન",
  todayRecommendation: "આજની AI ભલામણ", aiSays: "AI કહે છે",
  todayProgress: "આજની પ્રગતિ", learningWorlds: "શૈક્ષણિક દુનિયા", pickWorld: "એક દુનિયા પસંદ કરો",
  yourWeek: "તમારો સપ્તાહ", minutesLearned: "દરરોજ શીખેલ મિનિટ", leaderboard: "લીડરબોર્ડ",
  friendsThisWeek: "આ સપ્તાહના મિત્રો", myBadges: "મારા બૅજ", stars: "તારા", coins: "સિક્કા",
  streak: "ધારો", xp: "XP", locked: "🔒 બંધ", complete: "% પૂર્ણ", agesRange: "ઉંમર 3–6",
  learningJourney: "શૈક્ષણિક સફર", today: "આજ", thisWeek: "આ સપ્તાહ", accuracy: "ચોકસાઈ",
  happiness: "ખુશી", learningTime: "શીખવાનો સમય", last7Days: "છેલ્લા 7 દિવસ",
  skillRadar: "કૌશલ્ય રડાર", strengthsAreas: "શક્તિ અને સુધારણા ક્ષેત્રો",
  weeklyCoaching: "Gemini તરફથી આ સપ્તાહની કોચિંગ", recentAchievements: "તાજેતરની સિદ્ધિઓ",
  screenTime: "આજની સ્ક્રીન ટાઇમ", homeActivities: "ઘરેલુ પ્રવૃત્તિઓ", minRead: "મિનિટ વાંચો",
  bedtime: "સૂવાનો સમય", schoolReadiness: "શાળા માટે તૈયારી", readinessScore: "તૈયારી સ્કોર",
  weeklyReport: "સાપ્તાહિક AI અહેવાલ",
  sunita: "સુનીતાનું કેન્દ્ર · પૂણે-14", enrolled: "નોંધાયેલ", activeToday: "આજ સક્રિય",
  avgProgress: "સરેરાશ પ્રગતિ", aboveDistrict: "જિલ્લા સરેરાશથી વધુ", atRisk: "જોખમમાં",
  needIntervention: "હસ્તક્ષેપ જરૂરી", childrenProgress: "બાળકોની પ્રગતિ", aiInsights: "AI આંતરદૃષ્ટિ",
  topPerformers: "ટોચના પ્રદર્શનકારો", attendanceWeek: "આ સપ્તાહની હાજરી", centreWide: "કેન્દ્ર-વ્યાપી દૈનિક હાજરી",
  maharashtra: "મહારાષ્ટ્ર · જિલ્લા સારાંશ", totalCentres: "કુલ કેન્દ્રો", avgAttendance: "સરેરાશ હાજરી",
  learningScore: "શૈક્ષણિક સ્કોર", aboveNational: "રાષ્ટ્રીય સરેરાશથી વધુ", districtPerformance: "જિલ્લા કામગીરી",
  avgScoreDistrict: "જિલ્લાનો સરેરાશ શૈક્ષણિક સ્કોર", learningTrend: "શૈક્ષણિક વલણ",
  weeklyMinutes: "રાજ્યભરમાં સાપ્તાહિક શૈક્ષણિક મિનિટ", skillHeatmap: "કૌશલ્ય હીટમૅપ",
  performanceDay: "કૌશલ્ય × દિવસ પ્રમાણે કામગીરી", topDistricts: "ટોચના જિલ્લા", aiDistrictInsights: "AI જિલ્લા આંતરદૃષ્ટિ",
  memoryMatch: "મેમરી મૅચ", alphabetQuiz: "અક્ષર ક્વિઝ", numberCount: "ગણો અને ક્લિક કરો",
  shapeSort: "આકાર ગોઠવો", animalQuiz: "પ્રાણી સફારી ક્વિઝ",
  tapToFlip: "ફ્લિપ કરવા ટૅપ કરો!", findPairs: "બધી જોડ શોધો", whichLetter: "આ કયો અક્ષર છે?",
  howManyObjects: "તમે કેટલી વસ્તુઓ જુઓ છો?", sortShapes: "આકારો ગોઠવો!", whichAnimal: "આ કયું પ્રાણી છે?",
  pairsFound: "જોડ મળી", attempts: "પ્રયાસ", timeSeconds: "સેકન્ડ", youWon: "તમે જીત્યા!",
  earnedStars: "તમે કમાયા", correctAnswer: "સાચું! ⭐", wrongAnswer: "ફરી પ્રયાસ કરો! 💪",
  levelUp: "લેવલ અપ! 🚀", clickToStart: "શરૂ કરવા ક્લિક કરો", score: "સ્કોર",
  aiGreeting: "નમસ્તે! હું તમારો VidyaSetu AI સહાયક છું ✨",
  askAnything: "કંઈ પણ પૂછો...", aiThinking: "વિચારી રહ્યો છું...",
  alphabetForest: "અક્ષર વન", numberJungle: "સંખ્યા જંગલ", shapeIsland: "આકાર ટાપુ",
  animalSafari: "પ્રાણી સફારી", storyCastle: "વાર્તા મહેલ", colorGalaxy: "રંગ આકાશગંગા",
  memoryMountain: "સ્મૃતિ પર્વત", emotionGarden: "ભાવ ઉદ્યાન",
  lowRisk: "ઓછું જોખમ", mediumRisk: "મધ્યમ જોખમ", highRisk: "ઉચ્ચ જોખમ",
  syncedAgo: "2 મિ. પહેલા સિંક", offlineBadge: "ઑફલાઇન મોડ",
  poweredByGemini: "Gemini દ્વારા સંચાલિત · ઑનલાઇન", madeForBharat: "ભારત માટે ❤️ સાથે બનાવ્યું",
};

const ta: Translations = {
  myWorld: "என் உலகம்", learn: "கற்கவும்", rewards: "பரிசுகள்", profile: "சுயவிவரம்",
  overview: "கண்ணோட்டம்", progress: "முன்னேற்றம்", activities: "செயல்பாடுகள்", aiAssistant: "AI உதவியாளர்",
  children: "குழந்தைகள்", attendance: "வருகை", reports: "அறிக்கைகள்", districts: "மாவட்டங்கள்", centres: "மையங்கள்",
  continuelearning: "கற்றலை தொடரவும்", dailyChallenge: "தினசரி சவால்", startLearning: "கற்றலை தொடங்கவும்",
  getStarted: "தொடங்கவும்", logIn: "உள்நுழைவு", signUp: "பதிவு", submit: "சமர்ப்பி", close: "மூடு",
  playNow: "இப்போது விளையாடு", tryActivity: "செயல்பாடு முயற்சி", export: "ஏற்றுமதி", download: "பதிவிறக்கம்",
  generateReport: "அறிக்கை உருவாக்கு", askAssistant: "உதவியாளரிடம் கேளுங்கள்", sendMessage: "அனுப்பு",
  generateWeeklyPlan: "வார திட்டம் உருவாக்கு", generatePolicyBrief: "கொள்கை அறிக்கை உருவாக்கு",
  viewAll: "அனைத்தும் காண்", backToDashboard: "டாஷ்போர்டுக்கு திரும்பு", nextLevel: "அடுத்த நிலை",
  wellDone: "சாபாஷ்! 🎉", tryAgain: "மீண்டும் முயற்சி", skip: "தவிர்", hint: "குறிப்பு",
  todayRecommendation: "இன்றைய AI பரிந்துரை", aiSays: "AI சொல்கிறது",
  todayProgress: "இன்றைய முன்னேற்றம்", learningWorlds: "கற்றல் உலகங்கள்", pickWorld: "ஒரு உலகத்தை தேர்ந்தெடுங்கள்",
  yourWeek: "உங்கள் வாரம்", minutesLearned: "ஒவ்வொரு நாளும் கற்ற நிமிடங்கள்", leaderboard: "தரவரிசை",
  friendsThisWeek: "இந்த வார நண்பர்கள்", myBadges: "என் பதக்கங்கள்", stars: "நட்சத்திரங்கள்", coins: "நாணயங்கள்",
  streak: "தொடர்", xp: "XP", locked: "🔒 பூட்டப்பட்டது", complete: "% முடிந்தது", agesRange: "வயது 3–6",
  learningJourney: "கற்றல் பயணம்", today: "இன்று", thisWeek: "இந்த வாரம்", accuracy: "துல்லியம்",
  happiness: "மகிழ்ச்சி", learningTime: "கற்றல் நேரம்", last7Days: "கடந்த 7 நாட்கள்",
  skillRadar: "திறன் ரேடார்", strengthsAreas: "பலம் மற்றும் மேம்பாடு பகுதிகள்",
  weeklyCoaching: "Gemini இலிருந்து இந்த வார வழிகாட்டல்", recentAchievements: "சமீபத்திய சாதனைகள்",
  screenTime: "இன்றைய திரை நேரம்", homeActivities: "வீட்டு செயல்பாடுகள்", minRead: "நிமிட வாசிப்பு",
  bedtime: "தூங்கும் நேரம்", schoolReadiness: "பள்ளிக்கு தயார்நிலை", readinessScore: "தயார்நிலை மதிப்பெண்",
  weeklyReport: "வார AI அறிக்கை",
  sunita: "சுனிதாவின் மையம் · புனே-14", enrolled: "சேர்க்கை", activeToday: "இன்று செயலில்",
  avgProgress: "சராசரி முன்னேற்றம்", aboveDistrict: "மாவட்ட சராசரிக்கு மேல்", atRisk: "ஆபத்தில்",
  needIntervention: "தலையீடு தேவை", childrenProgress: "குழந்தைகளின் முன்னேற்றம்", aiInsights: "AI நுண்ணறிவு",
  topPerformers: "சிறந்த செயல்திறன்", attendanceWeek: "இந்த வார வருகை", centreWide: "மையம்-அளவிலான தினசரி வருகை",
  maharashtra: "மகாராஷ்டிரா · மாவட்ட கண்ணோட்டம்", totalCentres: "மொத்த மையங்கள்", avgAttendance: "சராசரி வருகை",
  learningScore: "கற்றல் மதிப்பெண்", aboveNational: "தேசிய சராசரிக்கு மேல்", districtPerformance: "மாவட்ட செயல்திறன்",
  avgScoreDistrict: "மாவட்டத்தின் சராசரி கற்றல் மதிப்பெண்", learningTrend: "கற்றல் போக்கு",
  weeklyMinutes: "மாநிலம் முழுவதும் வார கற்றல் நிமிடங்கள்", skillHeatmap: "திறன் வெப்பவரைபடம்",
  performanceDay: "திறன் × நாள் வாரியான செயல்திறன்", topDistricts: "சிறந்த மாவட்டங்கள்", aiDistrictInsights: "AI மாவட்ட நுண்ணறிவு",
  memoryMatch: "நினைவக பொருத்தம்", alphabetQuiz: "எழுத்து வினாடி வினா", numberCount: "எண்ணி கிளிக் செய்",
  shapeSort: "வடிவ வரிசைப்படுத்தல்", animalQuiz: "விலங்கு சஃபாரி வினாடி வினா",
  tapToFlip: "திருப்ப தட்டவும்!", findPairs: "அனைத்து ஜோடிகளையும் கண்டுபிடிக்கவும்", whichLetter: "இது எந்த எழுத்து?",
  howManyObjects: "நீங்கள் எத்தனை பொருட்களை காண்கிறீர்கள்?", sortShapes: "வடிவங்களை வரிசைப்படுத்துங்கள்!", whichAnimal: "இது எந்த விலங்கு?",
  pairsFound: "ஜோடிகள் கிடைத்தன", attempts: "முயற்சிகள்", timeSeconds: "வினாடிகள்", youWon: "நீங்கள் வென்றீர்கள்!",
  earnedStars: "நீங்கள் சம்பாதித்தீர்கள்", correctAnswer: "சரி! ⭐", wrongAnswer: "மீண்டும் முயற்சி! 💪",
  levelUp: "நிலை உயர்வு! 🚀", clickToStart: "தொடங்க கிளிக் செய்யவும்", score: "மதிப்பெண்",
  aiGreeting: "வணக்கம்! நான் உங்கள் VidyaSetu AI உதவியாளர் ✨",
  askAnything: "எதையும் கேளுங்கள்...", aiThinking: "யோசிக்கிறேன்...",
  alphabetForest: "எழுத்து காடு", numberJungle: "எண் காடு", shapeIsland: "வடிவ தீவு",
  animalSafari: "விலங்கு சஃபாரி", storyCastle: "கதை அரண்மனை", colorGalaxy: "வண்ண விண்மீன் திரள்",
  memoryMountain: "நினைவக மலை", emotionGarden: "உணர்வு தோட்டம்",
  lowRisk: "குறைந்த ஆபத்து", mediumRisk: "நடுத்தர ஆபத்து", highRisk: "அதிக ஆபத்து",
  syncedAgo: "2 நிமிடங்களுக்கு முன் ஒத்திசைக்கப்பட்டது", offlineBadge: "ஆஃப்லைன் பயன்முறை",
  poweredByGemini: "Gemini ஆல் இயக்கப்படுகிறது · ஆன்லைன்", madeForBharat: "பாரதத்திற்காக ❤️ உடன் உருவாக்கப்பட்டது",
};

const te: Translations = {
  myWorld: "నా ప్రపంచం", learn: "నేర్చుకోండి", rewards: "బహుమతులు", profile: "ప్రొఫైల్",
  overview: "సారాంశం", progress: "పురోగతి", activities: "కార్యకలాపాలు", aiAssistant: "AI సహాయకుడు",
  children: "పిల్లలు", attendance: "హాజరు", reports: "నివేదికలు", districts: "జిల్లాలు", centres: "కేంద్రాలు",
  continuelearning: "నేర్చుకోవడం కొనసాగించండి", dailyChallenge: "రోజువారీ సవాల్", startLearning: "నేర్చుకోవడం ప్రారంభించండి",
  getStarted: "ప్రారంభించండి", logIn: "లాగిన్", signUp: "సైన్ అప్", submit: "సమర్పించండి", close: "మూసివేయి",
  playNow: "ఇప్పుడు ఆడండి", tryActivity: "కార్యకలాపం ప్రయత్నించండి", export: "ఎగుమతి", download: "డౌన్లోడ్",
  generateReport: "నివేదిక రూపొందించండి", askAssistant: "సహాయకుడిని అడగండి", sendMessage: "పంపండి",
  generateWeeklyPlan: "వారపు ప్రణాళిక రూపొందించండి", generatePolicyBrief: "విధాన నివేదిక రూపొందించండి",
  viewAll: "అన్నీ చూడండి", backToDashboard: "డాష్‌బోర్డ్‌కు తిరిగి", nextLevel: "తదుపరి స్థాయి",
  wellDone: "అద్భుతం! 🎉", tryAgain: "మళ్ళీ ప్రయత్నించండి", skip: "దాటవేయి", hint: "సూచన",
  todayRecommendation: "నేటి AI సిఫారసు", aiSays: "AI చెప్తోంది",
  todayProgress: "నేటి పురోగతి", learningWorlds: "నేర్చుకునే ప్రపంచాలు", pickWorld: "ఒక ప్రపంచాన్ని ఎంచుకోండి",
  yourWeek: "మీ వారం", minutesLearned: "ప్రతిరోజు నేర్చుకున్న నిమిషాలు", leaderboard: "లీడర్‌బోర్డ్",
  friendsThisWeek: "ఈ వారం మీ స్నేహితులు", myBadges: "నా బ్యాడ్జ్‌లు", stars: "నక్షత్రాలు", coins: "నాణేలు",
  streak: "వరుస", xp: "XP", locked: "🔒 లాక్", complete: "% పూర్తి", agesRange: "వయసు 3–6",
  learningJourney: "నేర్చుకునే ప్రయాణం", today: "నేడు", thisWeek: "ఈ వారం", accuracy: "ఖచ్చితత్వం",
  happiness: "సంతోషం", learningTime: "నేర్చుకునే సమయం", last7Days: "చివరి 7 రోజులు",
  skillRadar: "నైపుణ్య రాడార్", strengthsAreas: "బలాలు మరియు మెరుగుదల అవసరమయ్యే రంగాలు",
  weeklyCoaching: "Gemini నుండి ఈ వారం మార్గదర్శకత్వం", recentAchievements: "ఇటీవలి సాధనలు",
  screenTime: "నేటి స్క్రీన్ సమయం", homeActivities: "ఇంటి కార్యకలాపాలు", minRead: "నిమిష చదువు",
  bedtime: "నిద్రపోయే సమయం", schoolReadiness: "పాఠశాల సంసిద్ధత", readinessScore: "సంసిద్ధత స్కోరు",
  weeklyReport: "వారపు AI నివేదిక",
  sunita: "సునీత కేంద్రం · పూణే-14", enrolled: "నమోదైన", activeToday: "నేడు చురుకుగా",
  avgProgress: "సగటు పురోగతి", aboveDistrict: "జిల్లా సగటు కంటే ఎక్కువ", atRisk: "ప్రమాదంలో",
  needIntervention: "జోక్యం అవసరం", childrenProgress: "పిల్లల పురోగతి", aiInsights: "AI అంతర్దృష్టులు",
  topPerformers: "అగ్ర ప్రదర్శకులు", attendanceWeek: "ఈ వారం హాజరు", centreWide: "కేంద్రం-వ్యాప్త రోజువారీ హాజరు",
  maharashtra: "మహారాష్ట్ర · జిల్లా అవలోకనం", totalCentres: "మొత్తం కేంద్రాలు", avgAttendance: "సగటు హాజరు",
  learningScore: "నేర్చుకునే స్కోరు", aboveNational: "జాతీయ సగటు కంటే ఎక్కువ", districtPerformance: "జిల్లా పనితీరు",
  avgScoreDistrict: "జిల్లా సగటు నేర్చుకునే స్కోరు", learningTrend: "నేర్చుకునే ధోరణి",
  weeklyMinutes: "రాష్ట్రవ్యాప్తంగా వారపు నేర్చుకునే నిమిషాలు", skillHeatmap: "నైపుణ్య హీట్‌మ్యాప్",
  performanceDay: "నైపుణ్యం × రోజు వారీ పనితీరు", topDistricts: "అగ్ర జిల్లాలు", aiDistrictInsights: "AI జిల్లా అంతర్దృష్టులు",
  memoryMatch: "మెమరీ మ్యాచ్", alphabetQuiz: "అక్షర క్విజ్", numberCount: "లెక్కించి క్లిక్ చేయి",
  shapeSort: "ఆకారాల వర్గీకరణ", animalQuiz: "జంతు సఫారీ క్విజ్",
  tapToFlip: "తిప్పడానికి టాప్ చేయండి!", findPairs: "అన్ని జతలు కనుగొనండి", whichLetter: "ఇది ఏ అక్షరం?",
  howManyObjects: "మీరు ఎన్ని వస్తువులు చూస్తున్నారు?", sortShapes: "ఆకారాలను వర్గీకరించండి!", whichAnimal: "ఇది ఏ జంతువు?",
  pairsFound: "జతలు కనుగొన్నారు", attempts: "ప్రయత్నాలు", timeSeconds: "సెకన్లు", youWon: "మీరు గెలిచారు!",
  earnedStars: "మీరు సంపాదించారు", correctAnswer: "సరైనది! ⭐", wrongAnswer: "మళ్ళీ ప్రయత్నించండి! 💪",
  levelUp: "స్థాయి పెరిగింది! 🚀", clickToStart: "ప్రారంభించడానికి క్లిక్ చేయండి", score: "స్కోరు",
  aiGreeting: "నమస్కారం! నేను మీ VidyaSetu AI సహాయకుడిని ✨",
  askAnything: "ఏమైనా అడగండి...", aiThinking: "ఆలోచిస్తున్నాను...",
  alphabetForest: "అక్షర అడవి", numberJungle: "సంఖ్య అడవి", shapeIsland: "ఆకారపు ద్వీపం",
  animalSafari: "జంతు సఫారీ", storyCastle: "కథల కోట", colorGalaxy: "రంగుల నక్షత్రపు సమూహం",
  memoryMountain: "జ్ఞాపకపు పర్వతం", emotionGarden: "భావోద్వేగపు తోట",
  lowRisk: "తక్కువ ప్రమాదం", mediumRisk: "మధ్యస్థ ప్రమాదం", highRisk: "అధిక ప్రమాదం",
  syncedAgo: "2 నిమిషాల క్రితం సమకాలీకరించబడింది", offlineBadge: "ఆఫ్‌లైన్ మోడ్",
  poweredByGemini: "Gemini ద్వారా నడపబడుతోంది · ఆన్‌లైన్", madeForBharat: "భారత్ కోసం ❤️ తో తయారుచేయబడింది",
};

const kn: Translations = {
  myWorld: "ನನ್ನ ಪ್ರಪಂಚ", learn: "ಕಲಿಯಿರಿ", rewards: "ಪ್ರಶಸ್ತಿಗಳು", profile: "ಪ್ರೊಫೈಲ್",
  overview: "ಸಾರಾಂಶ", progress: "ಪ್ರಗತಿ", activities: "ಚಟುವಟಿಕೆಗಳು", aiAssistant: "AI ಸಹಾಯಕ",
  children: "ಮಕ್ಕಳು", attendance: "ಹಾಜರಾತಿ", reports: "ವರದಿಗಳು", districts: "ಜಿಲ್ಲೆಗಳು", centres: "ಕೇಂದ್ರಗಳು",
  continuelearning: "ಕಲಿಕೆ ಮುಂದುವರಿಸಿ", dailyChallenge: "ದೈನಂದಿನ ಸವಾಲು", startLearning: "ಕಲಿಕೆ ಪ್ರಾರಂಭಿಸಿ",
  getStarted: "ಪ್ರಾರಂಭಿಸಿ", logIn: "ಲಾಗಿನ್", signUp: "ಸೈನ್ ಅಪ್", submit: "ಸಲ್ಲಿಸಿ", close: "ಮುಚ್ಚಿ",
  playNow: "ಈಗ ಆಡಿ", tryActivity: "ಚಟುವಟಿಕೆ ಪ್ರಯತ್ನಿಸಿ", export: "ರಫ್ತು", download: "ಡೌನ್‌ಲೋಡ್",
  generateReport: "ವರದಿ ರಚಿಸಿ", askAssistant: "ಸಹಾಯಕರನ್ನು ಕೇಳಿ", sendMessage: "ಕಳುಹಿಸಿ",
  generateWeeklyPlan: "ಸಾಪ್ತಾಹಿಕ ಯೋಜನೆ ರಚಿಸಿ", generatePolicyBrief: "ನೀತಿ ವರದಿ ರಚಿಸಿ",
  viewAll: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ", backToDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ", nextLevel: "ಮುಂದಿನ ಹಂತ",
  wellDone: "ಭಲೇ! 🎉", tryAgain: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", skip: "ಬಿಟ್ಟುಬಿಡಿ", hint: "ಸೂಚನೆ",
  todayRecommendation: "ಇಂದಿನ AI ಶಿಫಾರಸು", aiSays: "AI ಹೇಳುತ್ತದೆ",
  todayProgress: "ಇಂದಿನ ಪ್ರಗತಿ", learningWorlds: "ಕಲಿಕೆ ಪ್ರಪಂಚಗಳು", pickWorld: "ಒಂದು ಪ್ರಪಂಚ ಆಯ್ಕೆ ಮಾಡಿ",
  yourWeek: "ನಿಮ್ಮ ವಾರ", minutesLearned: "ಪ್ರತಿ ದಿನ ಕಲಿತ ನಿಮಿಷಗಳು", leaderboard: "ಲೀಡರ್‌ಬೋರ್ಡ್",
  friendsThisWeek: "ಈ ವಾರದ ಸ್ನೇಹಿತರು", myBadges: "ನನ್ನ ಬ್ಯಾಡ್ಜ್‌ಗಳು", stars: "ನಕ್ಷತ್ರಗಳು", coins: "ನಾಣ್ಯಗಳು",
  streak: "ಸರಣಿ", xp: "XP", locked: "🔒 ಲಾಕ್", complete: "% ಪೂರ್ಣ", agesRange: "ವಯಸ್ಸು 3–6",
  learningJourney: "ಕಲಿಕೆ ಪ್ರಯಾಣ", today: "ಇಂದು", thisWeek: "ಈ ವಾರ", accuracy: "ನಿಖರತೆ",
  happiness: "ಸಂತೋಷ", learningTime: "ಕಲಿಕೆ ಸಮಯ", last7Days: "ಕಳೆದ 7 ದಿನಗಳು",
  skillRadar: "ಕೌಶಲ್ಯ ರೇಡಾರ್", strengthsAreas: "ಬಲ ಮತ್ತು ಸುಧಾರಣೆ ಕ್ಷೇತ್ರಗಳು",
  weeklyCoaching: "Gemini ನಿಂದ ಈ ವಾರದ ತರಬೇತಿ", recentAchievements: "ಇತ್ತೀಚಿನ ಸಾಧನೆಗಳು",
  screenTime: "ಇಂದಿನ ಸ್ಕ್ರೀನ್ ಸಮಯ", homeActivities: "ಮನೆ ಚಟುವಟಿಕೆಗಳು", minRead: "ನಿಮಿಷ ಓದು",
  bedtime: "ಮಲಗುವ ಸಮಯ", schoolReadiness: "ಶಾಲೆಗೆ ಸಿದ್ಧತೆ", readinessScore: "ಸಿದ್ಧತೆ ಸ್ಕೋರ್",
  weeklyReport: "ಸಾಪ್ತಾಹಿಕ AI ವರದಿ",
  sunita: "ಸುನೀತಾ ಕೇಂದ್ರ · ಪುಣೆ-14", enrolled: "ನೋಂದಾಯಿತ", activeToday: "ಇಂದು ಸಕ್ರಿಯ",
  avgProgress: "ಸರಾಸರಿ ಪ್ರಗತಿ", aboveDistrict: "ಜಿಲ್ಲಾ ಸರಾಸರಿಗಿಂತ ಹೆಚ್ಚು", atRisk: "ಅಪಾಯದಲ್ಲಿ",
  needIntervention: "ಮಧ್ಯಪ್ರವೇಶ ಅಗತ್ಯ", childrenProgress: "ಮಕ್ಕಳ ಪ್ರಗತಿ", aiInsights: "AI ಒಳನೋಟಗಳು",
  topPerformers: "ಅಗ್ರ ಪ್ರದರ್ಶಕರು", attendanceWeek: "ಈ ವಾರದ ಹಾಜರಾತಿ", centreWide: "ಕೇಂದ್ರ-ವ್ಯಾಪ್ತಿ ದೈನಂದಿನ ಹಾಜರಾತಿ",
  maharashtra: "ಮಹಾರಾಷ್ಟ್ರ · ಜಿಲ್ಲಾ ಅವಲೋಕನ", totalCentres: "ಒಟ್ಟು ಕೇಂದ್ರಗಳು", avgAttendance: "ಸರಾಸರಿ ಹಾಜರಾತಿ",
  learningScore: "ಕಲಿಕೆ ಸ್ಕೋರ್", aboveNational: "ರಾಷ್ಟ್ರೀಯ ಸರಾಸರಿಗಿಂತ ಹೆಚ್ಚು", districtPerformance: "ಜಿಲ್ಲಾ ಕಾರ್ಯಕ್ಷಮತೆ",
  avgScoreDistrict: "ಜಿಲ್ಲಾ ಸರಾಸರಿ ಕಲಿಕೆ ಸ್ಕೋರ್", learningTrend: "ಕಲಿಕೆ ಪ್ರವೃತ್ತಿ",
  weeklyMinutes: "ರಾಜ್ಯಾದ್ಯಂತ ಸಾಪ್ತಾಹಿಕ ಕಲಿಕೆ ನಿಮಿಷಗಳು", skillHeatmap: "ಕೌಶಲ್ಯ ಹೀಟ್‌ಮ್ಯಾಪ್",
  performanceDay: "ಕೌಶಲ್ಯ × ದಿನ ವಾರಿ ಕಾರ್ಯಕ್ಷಮತೆ", topDistricts: "ಅಗ್ರ ಜಿಲ್ಲೆಗಳು", aiDistrictInsights: "AI ಜಿಲ್ಲಾ ಒಳನೋಟಗಳು",
  memoryMatch: "ಮೆಮೊರಿ ಮ್ಯಾಚ್", alphabetQuiz: "ಅಕ್ಷರ ಪ್ರಶ್ನೋತ್ತರ", numberCount: "ಎಣಿಸಿ ಕ್ಲಿಕ್ ಮಾಡಿ",
  shapeSort: "ಆಕಾರ ವರ್ಗೀಕರಣ", animalQuiz: "ಪ್ರಾಣಿ ಸಫಾರಿ ಪ್ರಶ್ನೋತ್ತರ",
  tapToFlip: "ತಿರುಗಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ!", findPairs: "ಎಲ್ಲ ಜೋಡಿಗಳನ್ನು ಹುಡುಕಿ", whichLetter: "ಇದು ಯಾವ ಅಕ್ಷರ?",
  howManyObjects: "ನೀವು ಎಷ್ಟು ವಸ್ತುಗಳನ್ನು ನೋಡುತ್ತೀರಿ?", sortShapes: "ಆಕಾರಗಳನ್ನು ವರ್ಗೀಕರಿಸಿ!", whichAnimal: "ಇದು ಯಾವ ಪ್ರಾಣಿ?",
  pairsFound: "ಜೋಡಿಗಳು ಸಿಕ್ಕಿವೆ", attempts: "ಪ್ರಯತ್ನಗಳು", timeSeconds: "ಸೆಕೆಂಡ್‌ಗಳು", youWon: "ನೀವು ಗೆದ್ದಿರಿ!",
  earnedStars: "ನೀವು ಗಳಿಸಿದ್ದೀರಿ", correctAnswer: "ಸರಿ! ⭐", wrongAnswer: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ! 💪",
  levelUp: "ಲೆವೆಲ್ ಅಪ್! 🚀", clickToStart: "ಪ್ರಾರಂಭಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ", score: "ಸ್ಕೋರ್",
  aiGreeting: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ VidyaSetu AI ಸಹಾಯಕ ✨",
  askAnything: "ಏನಾದರೂ ಕೇಳಿ...", aiThinking: "ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...",
  alphabetForest: "ಅಕ್ಷರ ಅರಣ್ಯ", numberJungle: "ಸಂಖ್ಯೆ ಕಾಡು", shapeIsland: "ಆಕಾರ ದ್ವೀಪ",
  animalSafari: "ಪ್ರಾಣಿ ಸಫಾರಿ", storyCastle: "ಕಥೆ ಕೋಟೆ", colorGalaxy: "ಬಣ್ಣ ನಕ್ಷತ್ರಪುಂಜ",
  memoryMountain: "ಸ್ಮೃತಿ ಪರ್ವತ", emotionGarden: "ಭಾವನೆ ತೋಟ",
  lowRisk: "ಕಡಿಮೆ ಅಪಾಯ", mediumRisk: "ಮಧ್ಯಮ ಅಪಾಯ", highRisk: "ಹೆಚ್ಚಿನ ಅಪಾಯ",
  syncedAgo: "2 ನಿಮಿಷಗಳ ಹಿಂದೆ ಸಿಂಕ್", offlineBadge: "ಆಫ್‌ಲೈನ್ ಮೋಡ್",
  poweredByGemini: "Gemini ಮೂಲಕ ನಡೆಸಲ್ಪಡುತ್ತಿದೆ · ಆನ್‌ಲೈನ್", madeForBharat: "ಭಾರತಕ್ಕಾಗಿ ❤️ ನೊಂದಿಗೆ ತಯಾರಿಸಲಾಗಿದೆ",
};

export const TRANSLATIONS: Record<LangCode, Translations> = { en, hi, mr, gu, ta, te, kn };

export function t(lang: LangCode, key: keyof Translations): string {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key];
}
