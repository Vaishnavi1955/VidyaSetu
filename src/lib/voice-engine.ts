import type { LangCode } from "./i18n";

// Map our local language codes to Speech Synthesis/Recognition locales
export const LOCALE_MAP: Record<LangCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
};

// Simple Edit Distance algorithm to evaluate pronunciation accuracy
export function getEditDistance(s1: string, s2: string): number {
  s1 = s1.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
  s2 = s2.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
  
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // deletion
          dp[i][j - 1] + 1,      // insertion
          dp[i - 1][j - 1] + 1   // substitution
        );
      }
    }
  }
  return dp[m][n];
}

// Convert all regional script digits (Devanagari, Gujarati, Tamil, Telugu, Kannada) into standard English digits
function convertScriptDigitsToEnglish(s: string): string {
  const digitMap: Record<string, string> = {
    // Devanagari (Hindi/Marathi)
    "०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
    // Gujarati
    "૦": "0", "૧": "1", "૨": "2", "૩": "3", "૪": "4", "૫": "5", "૬": "6", "૭": "7", "૮": "8", "૯": "9",
    // Tamil
    "௦": "0", "௧": "1", "௨": "2", "௩": "3", "௪": "4", "௫": "5", "௬": "6", "௭": "7", "௮": "8", "௯": "9",
    // Telugu
    "౦": "0", "౧": "1", "౨": "2", "౩": "3", "౪": "4", "౫": "5", "౬": "6", "౭": "7", "౮": "8", "౯": "9",
    // Kannada
    "೦": "0", "೧": "1", "೨": "2", "೩": "3", "೪": "4", "೫": "5", "೬": "6", "೭": "7", "೮": "8", "೯": "9"
  };
  return s.split("").map(char => digitMap[char] || char).join("");
}

const MULTILINGUAL_NUMBERS: Record<string, string> = {
  // English words and phonetic slips
  "zero": "0", "ziro": "0",
  "one": "1", "wan": "1", "won": "1", "on": "1",
  "two": "2", "too": "2", "to": "2", "tu": "2", "do": "2",
  "three": "3", "tree": "3", "tri": "3", "teree": "3",
  "four": "4", "for": "4", "fore": "4", "fo": "4",
  "five": "5", "fiv": "5", "faiv": "5", "faive": "5",
  "six": "6", "siks": "6", "sixe": "6",
  "seven": "7", "sevn": "7", "sevan": "7",
  "eight": "8", "eit": "8", "ate": "8", "ayt": "8",
  "nine": "9", "nyn": "9", "nine.": "9", "nayn": "9",
  "ten": "10", "tan": "10", "ten.": "10",

  // Hindi & Marathi words
  "शून्य": "0", "सुन्य": "0",
  "एक": "1", "इके": "1",
  "दो": "2", "दोन": "2",
  "तीन": "3",
  "चार": "4",
  "पांच": "5", "पाँच": "5", "पाच": "5",
  "छह": "6", "छः": "6", "छ": "6", "सहा": "6",
  "सात": "7",
  "आठ": "8",
  "नौ": "9", "नऊ": "9",
  "दस": "10", "दहा": "10",

  // Gujarati words
  "શૂન્ય": "0", "એક": "1", "બે": "2", "ત્રણ": "3", "ચાર": "4", "પાંચ": "5", "છ": "6", "સાત": "7", "આઠ": "8", "નવ": "9", "દસ": "10",

  // Tamil words
  "பூஜ்யம்": "0", "ஒன்று": "1", "இரண்டு": "2", "மூன்று": "3", "நான்கு": "4", "ஐந்து": "5", "ஆறு": "6", "ஏழு": "7", "எட்டு": "8", "ஒன்பது": "9", "பத்து": "10",
  "ஒன்னு": "1", "ரெண்டு": "2", "மூணு": "3", "நாலு": "4", "அஞ்சு": "5", "எட்டு.": "8", "ஒம்போது": "9",

  // Telugu words
  "సున్నా": "0", "ఒకటి": "1", "రెండు": "2", "మూడు": "3", "నాలుగు": "4", "ఐదు": "5", "ఆరు": "6", "ஏடு": "7", "ఎనిమిది": "8", "తొమ్మిది": "9", "పది": "10",

  // Kannada words
  "ಶೂನ್ಯ": "0", "ಒಂದು": "1", "ಎರಡು": "2", "ಮೂರು": "3", "ನಾಲ್ಕು": "4", "ಐದು": "5", "ಆರು": "6", "ಏಳು": "7", "ಎಂಟು": "8", "ಒಂಬತ್ತು": "9", "ಹತ್ತು": "10",

  // Phonetic Devanagari representations of English numbers
  "जीरो": "0", "झिरो": "0",
  "वन": "1",
  "टू": "2", "टु": "2",
  "थ्री": "3", "त्रि": "3",
  "फोर": "4", "फ़ोर": "4",
  "फाइव": "5", "फ़ाइव": "5", "फाएव": "5",
  "सिक्स": "6", "सिक्ष": "6", "सीक्स": "6",
  "सेवन": "7", "सेव्हन": "7",
  "एट": "8", "ऐट": "8",
  "नाइन": "9", "नाईन": "9",
  "टेन": "10", "टें": "10"
};

// Pronunciation-aware mapping for English letters (A-Z) in English and Indian scripts
const ALPHABET_PRONUNCIATIONS: Record<string, string[]> = {
  a: ["a", "ay", "ae", "aah", "ए", "ए.", "ॲ", "अ", "आ"],
  b: ["b", "bee", "bi", "बी", "ब", "बी."],
  c: ["c", "see", "si", "सी", "स", "क", "सी."],
  d: ["d", "dee", "di", "डी", "ड", "डी."],
  e: ["e", "ee", "ई", "इ", "ई."],
  f: ["f", "ef", "एफ", "फ", "एफ."],
  g: ["g", "jee", "ji", "जी", "ज", "ग", "जी."],
  h: ["h", "aich", "hech", "एच", "ह", "एच."],
  i: ["i", "ai", "आय", "इ", "आय."],
  j: ["j", "je", "जे", "ज", "जे."],
  k: ["k", "ka", "kay", "के", "क", "के."],
  l: ["l", "el", "एल", "ल", "एल."],
  m: ["m", "em", "एम", "म", "एम."],
  n: ["n", "en", "एन", "न", "एन."],
  o: ["o", "oh", "ओ", "ओ."],
  p: ["p", "pee", "pi", "पी", "प", "पी."],
  q: ["q", "kyu", "क्यु", "क्यू", "क्यू."],
  r: ["r", "aar", "आर", "र", "आर."],
  s: ["s", "es", "एस", "स", "एस."],
  t: ["t", "tee", "ti", "टी", "ट", "त", "टी."],
  u: ["u", "yu", "यु", "यू", "यू."],
  v: ["v", "wee", "vi", "वी", "व", "वी."],
  w: ["w", "double yu", "डबल्यु", "डबल यू"],
  x: ["x", "ex", "एक्स", "क्ष", "एक्स."],
  y: ["y", "wai", "वाय", "य", "वाय."],
  z: ["z", "zed", "zee", "झेड", "झी", "झ", "झेड."]
};

// Cross-lingual synonym and transliteration mappings for game words
const WORD_TRANSLITERATIONS: Record<string, string[]> = {
  // Alphabet quiz words
  "apple": ["एप्पल", "ऐपल", "एपल", "सफरचंद", "सेब"],
  "ball": ["बॉल", "बाल", "चेंडू", "गेंदा"],
  "cat": ["कैट", "कॅट", "केट", "मांजर", "बिल्ली"],
  "dog": ["डॉग", "डाग", "डोग", "कुत्ता", "कुत्रा"],
  "elephant": ["एलीफेंट", "एलिफेंट", "हाथी", "हत्ती", "હાથી", "யானை", "ஆனை", "ஏనుగు", "ಆನೆ"],
  "fish": ["फिश", "फीश", "मछली", "मासा"],
  "grapes": ["ग्रेप्स", "ग्रैप्स", "अंगूर", "द्राक्षे"],
  "hat": ["हैट", "हॅट", "हेट", "टोपी"],
  "ice cream": ["आइसक्रीम", "आइस क्रीम", "आईसक्रीम", "आईस क्रीम"],
  "jug": ["जग"],
  "kite": ["काइट", "काईट", "पतंग"],
  "lion": ["लायन", "लाएन", "शेर", "सिंह", "સિંહ", "சிங்கம்", "சிங்கம்", "సింహం", "ಸಿಂಹ"],
  "mango": ["मैंगो", "मॅंगो", "मेन्गो", "आम", "आंबा"],
  "nest": ["नेस्ट", "नेष्ट", "घोंसला", "घरटे"],
  "orange": ["ऑरेंज", "ऑरेन्ज", "ओरेंज", "संतरा", "संत्रे"],
  "parrot": ["पैरेट", "पैरट", "पॅरट", "पोपट", "तोता", "கிளி", "चिలుక", "ಗಿಳಿ"],
  "queen": ["क्वीन", "क्वीन.", "रानी", "राणी"],
  "rainbow": ["रेनबो", "इंद्रधनुष", "इंद्रधनुष्य"],
  "sun": ["सन", "सूरज", "सूर्य"],
  "tiger": ["टाइगर", "टायगर", "बाघ", "वाघ", "વાઘ", "புலி", "புலி", "ಹುಲಿ"],
  "umbrella": ["अंब्रेला", "छतरी", "छत्री"],
  "van": ["वैन", "व्ॅन", "वेन"],
  "watermelon": ["वाटरमेलन", "तरबूज", "कलिंगड"],
  "xylophone": ["जायलोफोन", "झायलोफोन"],
  "yo-yo": ["योयो", "यो-यो"],
  "zebra": ["जेब्रा", "झीब्रा"],

  // Animal Safari words
  "monkey": ["मंकी", "बंदर", "माकड", "વાંદરો", "குரங்கு", "கோதி", "కోతి", "ಕೋತಿ"],
  "fox": ["फॉक्स", "लोमड़ी", "कोल्हा", "શિયાળ", "நரி", "நக்க", "నక్క", "ನರಿ"],
  "frog": ["फ्रॉग", "मेंढक", "बेडूक", "દેડકો", "தவளை", "கப்பா", "కప్ప", "ಕಪ್ಪೆ"],
  "butterfly": ["बटरफ्लाई", "तितली", "फुलपाखरू", "પતંગિયું", "பட்டாம்பூச்சி", "சீதாகோகசிலுகா", "சீతాకోकచిలుక", "ಚಿಟ್ಟೆ"],
  "dolphin": ["डॉल्फिन", "डॉल्फ़िन", "ડોલ્ફિન", "டால்பின்", "డాల్ఫిన్", "ಡಾಲ್ಫಿన్"],
  "unicorn": ["यूनिकॉर्न", "गेंडा", "एकशिंगी", "યુનિકોર્ન", "யூனிகோர்ன்", "ಯೂనికార్న్", "ಯೂನಿಕಾರ್ನ್"],
  "koala": ["कोआला", "કોઆલા", "கோલા", "కోయాలా", "కోలా"],
  "penguin": ["पेंगुइन", "पेंग्विन", "પેન્ગ્વિન", "பென்குயின்", "பென்க்வின்", "పెಂಗ್విన్", "ಪೆಂಗ್ವಿನ್"],

  // Colours
  "red": ["रेड", "लाल"],
  "blue": ["ब्लू", "नीला", "निळा"],
  "green": ["ग्रीन", "हरा", "हिरवा"],
  "yellow": ["येलो", "पीला", "पिवळा"],
  "purple": ["पर्पल", "जांभळा", "बैंगनी"],
  "pink": ["पिंक", "गुलाबी"],

  // Shapes
  "circle": ["सर्कल", "वृत्त", "वर्तुळ", "गोल", "વર્તુળ", "வட்டம்", "விருத்தம்", "వృత్తం", "ವೃತ್ತ"],
  "triangle": ["ट्रायंगल", "त्रिकोण", "ત્રિકોણ", "முக்கோணம்", "த்ரிபுஜம்", "த்ரிபூજம்", "త్రిభుజం", "ತ್ರಿಕೋಣ"],
  "square": ["स्क्वायर", "वर्ग", "चौरस", "ચોરસ", "சதுரம்", "చతురస్రం", "ಚೌಕ"],
  "rectangle": ["रेक्टेंगल", "आयत", "લંબચોરસ", "செவ்வகம்", "దీರ್ಘచతురస్రం", "ಆಯત"],
  "star": ["स्टार", "तारा", "તારો", "நக்ஷத்திரம்", "నక్షత్రం", "ನಕ್ಷತ್ರ"],
  "diamond": ["डायमंड", "हीरा", "हिरा", "હીરો", "வைரம்", "வజிரம்", "வజ్రं", "ವಜ್ರ"],
  "hexagon": ["हेक्सागन", "षट्भुज", "षटकोन", "ષટ્કોણ", "அறுகோணம்", "ஷడ్భుజి", "ಷಡ್ಭುಜ"],
  "crescent": ["क्रिसेंट", "अर्धचंद्र", "चंद्रकोर", "અર્ધચંદ્ર", "பிறை", "சந்திரவண்கா", "చంద్రవంక", "ಚಂದ್ರಕಲೆ"],

  // Emotions
  "happy": ["हैप्पी", "खुश", "आनंदी"],
  "sad": ["सैड", "दुखी", "दुःखी"],
  "angry": ["एंग्री", "गुस्सा", "रागीट"],
  "surprised": ["सरप्राइज्ड", "आश्चर्यचकित"],
  "scared": ["स्केयर्ड", "डरा हुआ", "घाबरलेला"],
  "silly": ["सिली", "मूर्ख"],

  // Stories
  "forest": ["फॉरेस्ट", "जंगल", "वन"],
  "wind": ["विंड", "हवा", "वारा"],
  "sing": ["सिंग", "गाना", "गाणे"],
  "mangoes": ["मैंगोज", "आम", "आंबे"],
  "gold star": ["गोल्ड स्टार", "सितारा", "तारा"],
  "friends": ["फ्रेंड्स", "दोस्तों", "मित्रांना", "मित्र"]
};

export function translateToDigit(s: string): string | null {
  const clean = s.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
  const englishDigits = convertScriptDigitsToEnglish(clean);
  
  if (/^\d+$/.test(englishDigits)) {
    return parseInt(englishDigits, 10).toString();
  }
  
  if (MULTILINGUAL_NUMBERS[englishDigits]) {
    return MULTILINGUAL_NUMBERS[englishDigits];
  }
  
  const words = englishDigits.split(/\s+/);
  for (const word of words) {
    if (MULTILINGUAL_NUMBERS[word]) {
      return MULTILINGUAL_NUMBERS[word];
    }
  }
  
  return null;
}

export function getEquivalentTerms(word: string): Set<string> {
  const clean = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
  const terms = new Set<string>([clean]);
  
  // 1. Check if word is a key in our transliteration/synonym dictionary
  if (WORD_TRANSLITERATIONS[clean]) {
    WORD_TRANSLITERATIONS[clean].forEach(t => terms.add(t.toLowerCase().trim()));
  }
  
  // 2. Find any key in the dictionary that maps to this word
  for (const [key, list] of Object.entries(WORD_TRANSLITERATIONS)) {
    if (list.map(x => x.toLowerCase().trim()).includes(clean)) {
      terms.add(key.toLowerCase().trim());
      list.forEach(t => terms.add(t.toLowerCase().trim()));
    }
  }
  
  // 3. Check alphabet pronunciation mappings
  if (clean.length === 1 && ALPHABET_PRONUNCIATIONS[clean]) {
    ALPHABET_PRONUNCIATIONS[clean].forEach(t => terms.add(t.toLowerCase().trim()));
  } else {
    // If spelling matches one of the values, add all of them
    for (const [letter, list] of Object.entries(ALPHABET_PRONUNCIATIONS)) {
      if (list.map(x => x.toLowerCase().trim()).includes(clean)) {
        terms.add(letter);
        list.forEach(t => terms.add(t.toLowerCase().trim()));
      }
    }
  }
  
  return terms;
}

export function phoneticNormalize(s: string): string {
  let clean = s.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
    .trim();
  
  const mapped = translateToDigit(clean);
  if (mapped !== null) {
    return mapped;
  }
  
  // Indian English & regional accent phonetic simplifications
  clean = clean
    .replace(/ph/g, "f")
    .replace(/sh/g, "s")
    .replace(/ee/g, "i")
    .replace(/oo/g, "u")
    .replace(/ay/g, "a")
    .replace(/ck/g, "c")
    .replace(/kh/g, "k")
    .replace(/gh/g, "g")
    .replace(/th/g, "t")
    .replace(/bh/g, "b")
    .replace(/dh/g, "d")
    .replace(/jh/g, "j")
    .replace(/ch/g, "c")
    .replace(/da/g, "d")
    .replace(/na/g, "n");
    
  return clean;
}

// Calculate speaking similarity percentage with fuzzy tolerance & numeric intent evaluation
export function evaluatePronunciation(spoken: string, expected: string): number {
  console.log(`[VoiceEngine] evaluatePronunciation: expected="${expected}", spoken="${spoken}"`);

  // Direct exact/normalized match check
  const normExpected = expected.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
  const normSpoken = spoken.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();

  if (normExpected === normSpoken) {
    console.log(`[VoiceEngine] Exact Match! Score: 100%`);
    return 100;
  }

  // 1. Numeric check
  const expectedDigit = translateToDigit(expected);
  const spokenDigit = translateToDigit(spoken);

  if (expectedDigit !== null && spokenDigit !== null) {
    console.log(`[VoiceEngine] Numeric check: expectedDigit="${expectedDigit}", spokenDigit="${spokenDigit}"`);
    if (expectedDigit === spokenDigit) {
      console.log(`[VoiceEngine] Numeric intent matches! Score: 100%`);
      return 100;
    } else {
      console.log(`[VoiceEngine] Numeric intent mismatch! Score: 0%`);
      return 0;
    }
  }

  // 2. Equivalent Terms (cross-script, transliterations, synonyms)
  const expectedEquivalents = getEquivalentTerms(expected);
  const spokenEquivalents = getEquivalentTerms(spoken);

  console.log(`[VoiceEngine] Expected equivalents:`, Array.from(expectedEquivalents));
  console.log(`[VoiceEngine] Spoken equivalents:`, Array.from(spokenEquivalents));

  // Quick exact match on equivalent sets
  for (const term of spokenEquivalents) {
    if (expectedEquivalents.has(term)) {
      console.log(`[VoiceEngine] Equivalent term matches! "${term}" Score: 100%`);
      return 100;
    }
  }

  // 3. Fuzzy matching on equivalents & phonetics
  let maxScore = 0;
  for (const expTerm of expectedEquivalents) {
    for (const spkTerm of spokenEquivalents) {
      if (spkTerm === expTerm || spkTerm.includes(expTerm) || expTerm.includes(spkTerm)) {
        maxScore = Math.max(maxScore, 95);
        continue;
      }

      // Check edit distance
      const dist = getEditDistance(spkTerm, expTerm);
      const maxLen = Math.max(spkTerm.length, expTerm.length);
      const score = Math.round(Math.max(0, 100 - (dist / maxLen) * 100));
      maxScore = Math.max(maxScore, score);
    }
  }

  // Phonetic normalization check as a fallback
  const pExpected = phoneticNormalize(expected);
  const pSpoken = phoneticNormalize(spoken);
  if (pExpected && pSpoken) {
    if (pExpected === pSpoken || pSpoken.includes(pExpected) || pExpected.includes(pSpoken)) {
      maxScore = Math.max(maxScore, 95);
    } else {
      const pDist = getEditDistance(pSpoken, pExpected);
      const pMaxLen = Math.max(pSpoken.length, pExpected.length);
      const pScore = Math.round(Math.max(0, 100 - (pDist / pMaxLen) * 100));
      maxScore = Math.max(maxScore, pScore);
    }
  }

  console.log(`[VoiceEngine] Final Pronunciation Similarity Score: ${maxScore}%`);
  return maxScore;
}

// Check voice capability support
export const isTtsSupported = () => typeof window !== "undefined" && "speechSynthesis" in window;
export const isSttSupported = () => 
  typeof window !== "undefined" && 
  ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

// Module-level variable to hold the active SpeechSynthesisUtterance to prevent garbage collection bugs in Chrome
let activeUtterance: SpeechSynthesisUtterance | null = null;

// Text-to-Speech implementation
export function speakText(text: string, lang: LangCode, onEnd?: () => void) {
  if (!isTtsSupported()) {
    onEnd?.();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  activeUtterance = new SpeechSynthesisUtterance(text);
  const targetLocale = LOCALE_MAP[lang] || "en-IN";
  activeUtterance.lang = targetLocale;

  // Attempt to select a voice matching the language/locale
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.startsWith(targetLocale) || v.lang.startsWith(lang));
  if (voice) {
    activeUtterance.voice = voice;
  }

  activeUtterance.onend = () => {
    activeUtterance = null;
    onEnd?.();
  };

  activeUtterance.onerror = (e) => {
    console.error("[VoiceEngine] Speech synthesis error:", e);
    activeUtterance = null;
    onEnd?.();
  };

  window.speechSynthesis.speak(activeUtterance);
}

// Speech-to-Text helper interface
export interface SpeechListenerOptions {
  lang: LangCode;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

// Speech-to-Text implementation
export function startSpeechRecognition(options: SpeechListenerOptions): any {
  if (!isSttSupported()) {
    options.onError("Speech recognition not supported in this browser");
    options.onEnd();
    return null;
  }

  const SpeechRecognitionAPI =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
  const recognition = new SpeechRecognitionAPI();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = LOCALE_MAP[options.lang] || "en-IN";

  console.log(`[VoiceEngine] SpeechRecognition configured locale: ${recognition.lang}`);

  recognition.onstart = () => {
    console.log("[VoiceEngine] Speech recognition started / microphone active");
  };

  recognition.onresult = (event: any) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    const transcript = finalTranscript || interimTranscript;
    const isFinal = !!finalTranscript;
    
    console.log(`[VoiceEngine] Transcript Received: "${transcript}", isFinal: ${isFinal}`);
    options.onResult(transcript, isFinal);
  };

  recognition.onerror = (event: any) => {
    console.error("[VoiceEngine] Speech recognition error:", event.error);
    options.onError(event.error);
  };

  recognition.onend = () => {
    console.log("[VoiceEngine] Speech recognition ended / microphone inactive");
    options.onEnd();
  };

  recognition.start();
  return recognition;
}
