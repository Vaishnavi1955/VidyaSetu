import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, Bot, CornerDownLeft, Sparkles, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceAssistant } from "@/hooks/use-voice-assistant";
import { speakText } from "@/lib/voice-engine";
import { useLang } from "@/lib/lang-context";
import { SectionTitle } from "@/components/vidya/ui-bits";
import type { LangCode } from "@/lib/i18n";

interface Character {
  id: string;
  name: string;
  emoji: string;
  color: string;
  initialGreeting: string;
  fallbackReplies: string[];
  patterns: { keywords: RegExp; reply: string }[];
}

const LOCALIZED_CHARACTERS: Record<LangCode, Character[]> = {
  en: [
    {
      id: "astronaut",
      name: "Astronaut Alex",
      emoji: "👨‍🚀",
      color: "bg-blue-600",
      initialGreeting: "Greetings, Space Cadet Aarav! I am floating in my rocket ship looking at Earth. Do you know what planet we live on?",
      fallbackReplies: [
        "That is amazing! Up here, there is zero gravity so my food floats around! Do you like stars?",
        "Cool! The Moon is our closest neighbor. Should we fly our rocket there next?",
        "Space is so big and beautiful. Let's sing a space song: Twinkle Twinkle Little Star!"
      ],
      patterns: [
        { keywords: /earth/i, reply: "Yes! Earth is our blue planet. It's beautiful from up here! 🌍" },
        { keywords: /star|stars|moon/i, reply: "Stars are hot glowing balls of fire! The moon glows in the dark. 🌟" },
        { keywords: /rocket|ship|fly/i, reply: "Zoom! My rocket flies at super speed to reach space! 🚀" }
      ]
    },
    {
      id: "lion",
      name: "Sheru the Lion",
      emoji: "🦁",
      color: "bg-amber-500",
      initialGreeting: "Roar! Hello Aarav, I am Sheru, king of the grassy plains! I love running in the wild. What is your favorite animal?",
      fallbackReplies: [
        "Roar-some! Animals are so cool. I love taking long naps under big trees. What do you like to eat?",
        "That is neat! My paws are very big and help me run super fast. Do you want to try roaring with me? Roar!",
        "Jungle life is full of adventures! My friends are monkeys and birds. Who is your best friend?"
      ],
      patterns: [
        { keywords: /eat|food|meat|fruit/i, reply: "I love meat, but monkeys love bananas 🍌 and elephants love leaves! 🌿" },
        { keywords: /roar|sound/i, reply: "Roar! That was a loud roar, Aarav! You are a brave lion cub! 🦁" },
        { keywords: /cat|dog|pet/i, reply: "Cats are my little cousins! They go meow, and dogs go woof! 🐶" }
      ]
    },
    {
      id: "doctor",
      name: "Dr. Divya",
      emoji: "👩‍⚕️",
      color: "bg-emerald-600",
      initialGreeting: "Hello Aarav! I am Dr. Divya. I help children stay strong and healthy! Did you eat any healthy fruits today?",
      fallbackReplies: [
        "Excellent! Fruits give us magic vitamins to play all day long. Remember to sleep 9 hours!",
        "Wonderful! Washing our hands with soap keeps tiny bugs away. Wash, wash, wash!",
        "Staying active makes our muscles happy. Let's do 3 jumps together! Hop, hop, hop!"
      ],
      patterns: [
        { keywords: /yes|apple|banana|mango/i, reply: "Yum! Fruits are superfoods that make you grow strong! 🍎" },
        { keywords: /no|pizza|candy/i, reply: "Candies are okay sometimes, but crunchy carrots and apples make your teeth strong! 🥕" },
        { keywords: /soap|wash|hand/i, reply: "Yes! Washing hands for 20 seconds makes germs go bye-bye! 🧼" }
      ]
    }
  ],
  hi: [
    {
      id: "astronaut",
      name: "अंतरिक्ष यात्री अमित",
      emoji: "👨‍🚀",
      color: "bg-blue-600",
      initialGreeting: "नमस्ते बाल वैज्ञानिक आरव! मैं अपने रॉकेट में तैर रहा हूँ और यहाँ से पृथ्वी को देख रहा हूँ। क्या तुम जानते हो हम किस ग्रह पर रहते हैं?",
      fallbackReplies: [
        "अरे वाह! यहाँ अंतरिक्ष में गुरुत्वाकर्षण नहीं है, इसलिए मेरा खाना हवा में तैरता रहता है! क्या तुम्हें तारे पसंद हैं?",
        "शानदार! चंद्रमा हमारा सबसे पास का पड़ोसी है। क्या हम अपने रॉकेट को अगली बार वहाँ उड़ाएँ?",
        "अंतरिक्ष बहुत बड़ा और सुंदर है। चलो एक गाना गाते हैं: चंदा मामा दूर के!"
      ],
      patterns: [
        { keywords: /पृथ्वी|धरती/i, reply: "हाँ! पृथ्वी हमारा नीला ग्रह है। यहाँ से यह बेहद खूबसूरत दिखती है! 🌍" },
        { keywords: /तारा|तारे|चाँद|चन्द्रमा/i, reply: "तारे आग के चमकते हुए गोले हैं! और चंद्रमा रात में चमकता है। 🌟" },
        { keywords: /रॉकेट|जहाज/i, reply: "ज़ूम! मेरा रॉकेट अंतरिक्ष में जाने के लिए सुपर स्पीड से उड़ता है! 🚀" }
      ]
    },
    {
      id: "lion",
      name: "शेरू शेर",
      emoji: "🦁",
      color: "bg-amber-500",
      initialGreeting: "दहाड़! नमस्ते आरव, मैं शेरू हूँ, जंगलों का राजा! मुझे खुले मैदानों में दौड़ना पसंद है। तुम्हारा पसंदीदा जानवर कौन सा है?",
      fallbackReplies: [
        "बहुत बढ़िया! मुझे बड़े पेड़ों के नीचे ठंडी हवा में सोना बहुत पसंद है। तुम्हें खाने में क्या पसंद है?",
        "मज़ेदार! मेरे पंजे बहुत बड़े हैं जो मुझे तेज़ी से दौड़ने में मदद करते हैं। क्या तुम मेरे साथ दहाड़ना चाहोगे? दहाड़ो!",
        "जंगल का जीवन रोमांचक है! बंदर और पक्षी मेरे दोस्त हैं। तुम्हारा सबसे अच्छा दोस्त कौन है?"
      ],
      patterns: [
        { keywords: /खा|भोजन|फल/i, reply: "मुझे मांस पसंद है, पर बंदरों को केला 🍌 और हाथियों को पत्तियां अच्छी लगती हैं! 🌿" },
        { keywords: /दहाड़|आवाज/i, reply: "दहाड़! यह बहुत ज़ोरदार दहाड़ थी, आरव! तुम बहुत बहादुर शेर के बच्चे हो! 🦁" },
        { keywords: /बिल्ली|कुत्ता/i, reply: "बिल्लियां मेरी छोटी बहनें हैं! वे म्याऊं करती हैं, और कुत्ते भौं-भौं! 🐶" }
      ]
    },
    {
      id: "doctor",
      name: "डॉ. दिव्या",
      emoji: "👩‍⚕️",
      color: "bg-emerald-600",
      initialGreeting: "नमस्ते आरव! मैं डॉ. दिव्या हूँ। मैं बच्चों को तंदुरुस्त और सेहतमंद रहने में मदद करती हूँ। क्या तुमने आज कोई फल खाया?",
      fallbackReplies: [
        "बहुत बढ़िया! फल हमें विटामिन देते हैं ताकि हम सारा दिन खेल सकें। रोज़ 9 घंटे सोना याद रखो!",
        "शानदार! साबुन से हाथ धोने पर कीटाणु दूर भागते हैं। हाथ धोना कभी मत भूलो!",
        "सक्रिय रहने से हमारी मांसपेशियां खुश रहती हैं। चलो मिलकर 3 बार कूदें! कूदें!"
      ],
      patterns: [
        { keywords: /हाँ|हा|आम|केला/i, reply: "स्वादिष्ट! फल खाने से तुम बहुत शक्तिशाली बन जाओगे! 🍎" },
        { keywords: /नहीं|पिज्जा|टॉफी/i, reply: "टॉफी कभी-कभी ठीक है, पर ताजी गाजर और सेब खाने से तुम्हारे दांत मजबूत होंगे! 🥕" },
        { keywords: /साबुन|हाथ|धोना/i, reply: "हाँ! 20 सेकंड तक हाथ धोने से कीटाणु गायब हो जाते हैं! 🧼" }
      ]
    }
  ],
  mr: [
    {
      id: "astronaut",
      name: "अंतराळवीर अमित",
      emoji: "👨‍🚀",
      color: "bg-blue-600",
      initialGreeting: "नमस्कार बाल शास्त्रज्ञ आरव! मी अंतराळात तरंगत आहे आणि इथून पृथ्वी पाहत आहे। आपण कोणत्या ग्रहावर राहतो माहिती आहे का?",
      fallbackReplies: [
        "व्वा! इथे अंतराळात गुरुत्वाकर्षण नाही, त्यामुळे माझे जेवण हवेत तरंगते! तुला तारे आवडतात का?",
        "छान! चंद्र आपला शेजारी आहे। आपण तिथे रॉकेटने जाऊया का?",
        "चला गाणे गाऊया: चांदोबा चांदोबा भागलास का!"
      ],
      patterns: [
        { keywords: /पृथ्वी|धरती/i, reply: "हो! पृथ्वी आपला निळा ग्रह आहे। इथून ती खूप सुंदर दिसते! 🌍" },
        { keywords: /तारा|तारे|चंद्र/i, reply: "तारे चमकणारे गोळे आहेत, आणि चंद्र रात्री प्रकाश देतो! 🌟" },
        { keywords: /रॉकेट|विमान/i, reply: "झूम! माझे रॉकेट अंतराळात जाण्यासाठी वेगाने उडते! 🚀" }
      ]
    },
    {
      id: "lion",
      name: "शेरू सिंह",
      emoji: "🦁",
      color: "bg-amber-500",
      initialGreeting: "डरकाळी! नमस्कार आरव, मी शेरू आहे, जंगलाचा राजा! तुला कोणता प्राणी सर्वात जास्त आवडतो?",
      fallbackReplies: [
        "मस्त! मला झाडाच्या सावलीत झोपायला खूप आवडते। तुला खायला काय आवडते?",
        "छान! माझे पंजे खूप मोठे आहेत। माझ्यासोबत डरकाळी फोडणार का? फोड डरकाळी!"
      ],
      patterns: [
        { keywords: /खा|जेवण|फळ/i, reply: "मला मांस आवडते, पण माकडांना केळी 🍌 आणि हत्तींना पाने आवडतात! 🌿" },
        { keywords: /डरकाळी|आवाज/i, reply: "डरकाळी! खूप मोठा आवाज होता आरव! तू खूप शूर आहेस! 🦁" }
      ]
    },
    {
      id: "doctor",
      name: "डॉ. दिव्या",
      emoji: "👩‍⚕️",
      color: "bg-emerald-600",
      initialGreeting: "नमस्कार आरव! मी डॉ. दिव्या। मी मुलांना निरोगी राहण्यास मदत करते। आज तू फळे खाल्ली का?",
      fallbackReplies: [
        "उत्कृष्ट! फळे आपल्याला शक्ती देतात। रोज ९ तास झोप घ्या!",
        "छान! साबणाने हात धुतल्याने जंतू पळून जातात। स्वच्छ राहा!",
        "व्यायाम केल्याने आपले शरीर मजबूत होते। चला ३ वेळा उड्या मारूया!"
      ],
      patterns: [
        { keywords: /हो|आंबा|केळी/i, reply: "खूप छान! फळे खाल्ल्याने तू वेगाने वाढशील! 🍎" },
        { keywords: /नाही|पिझ्झा|चॉकलेट/i, reply: "चॉकलेट कधीतरी ठीक आहे, पण सफरचंद खाल्ल्याने दात मजबूत होतील! 🥕" }
      ]
    }
  ],
  ta: [
    {
      id: "astronaut",
      name: "விண்வெளி வீரர் அன்பு",
      emoji: "👨‍🚀",
      color: "bg-blue-600",
      initialGreeting: "வணக்கம் இளம் விண்வெளி வீரர் ஆரவ்! என் ராக்கெட்டில் மிதந்தபடி பூமியைப் பார்க்கிறேன். நாம் எந்தக் கோளில் வாழ்கிறோம் என்று தெரியுமா?",
      fallbackReplies: [
        "அற்புதமானது! இங்கே ஈர்ப்பு விசை இல்லாததால் என் உணவு மிதக்கிறது! உனக்கு நட்சத்திரங்கள் பிடிக்குமா?",
        "மிகவும் நன்று! நிலா நமது பக்கத்து வீட்டுக்காரர். அடுத்ததாக அங்கே பறக்கலாமா?",
        "விண்வெளி மிகவும் அழகு. வா பாடுவோம்: நிலா நிலா ஓடி வா!"
      ],
      patterns: [
        { keywords: /பூமி/i, reply: "ஆம்! பூமி நமது நீல கிரகம். இங்கிருந்து பார்க்க மிகவும் அழகு! 🌍" },
        { keywords: /நட்சத்திரம்|நிலா/i, reply: "நட்சத்திரங்கள் ஒளிரும் நெருப்பு பந்துகள்! நிலா இரவில் ஒளிரும். 🌟" }
      ]
    },
    {
      id: "lion",
      name: "சிங்கார சிங்கம்",
      emoji: "🦁",
      color: "bg-amber-500",
      initialGreeting: "கர்ஜனை! வணக்கம் ஆரவ், நான் சிங்கார சிங்கம், காட்டு ராஜா! உனக்கு பிடித்த விலங்கு எது?",
      fallbackReplies: [
        "அருமை! எனக்கு மர நிழலில் தூங்குவது பிடிக்கும். உனக்கு சாப்பிட என்ன பிடிக்கும்?",
        "அசத்தல்! என்னோடு சேர்ந்து நீயும் கர்ஜிக்க விரும்புகிறாயா? கர்ஜிப்போம்!"
      ],
      patterns: [
        { keywords: /சாப்பாடு|பழம்/i, reply: "எனக்கு கறி பிடிக்கும், ஆனால் குரங்குக்கு வாழைப்பழம் 🍌 பிடிக்கும்! 🌿" }
      ]
    },
    {
      id: "doctor",
      name: "டாக்டர் திவ்யா",
      emoji: "👩‍⚕️",
      color: "bg-emerald-600",
      initialGreeting: "வணக்கம் ஆரவ்! நான் டாக்டர் திவ்யா. குழந்தைகள் ஆரோக்கியமாக இருக்க நான் உதவுகிறேன். இன்று பழங்கள் சாப்பிட்டாயா?",
      fallbackReplies: [
        "நன்று! பழங்கள் உடலுக்கு வைட்டமின்களை தரும். தினமும் 9 மணி நேரம் தூங்கு!",
        "மிகவும் நன்று! சோப்பு போட்டு கை கழுவுவது கிருமிகளை போக்கும்!"
      ],
      patterns: [
        { keywords: /ஆம்|ஆப்பிள்/i, reply: "அருமை! பழங்கள் சாப்பிடுவது உன்னை வலிமையாக்கும்! 🍎" }
      ]
    }
  ],
  gu: [
    {
      id: "astronaut",
      name: "અંતરિક્ષ યાત્રી અમિત",
      emoji: "👨‍🚀",
      color: "bg-blue-600",
      initialGreeting: "નમસ્તે સ્પેસ કેડેટ આરવ! હું મારા રોકેટમાં ઉડીને પૃથ્વી જોઈ રહ્યો છું. શું તું જાણે છે આપણે કયા ગ્રહ પર રહીએ છીએ?",
      fallbackReplies: [
        "અરે વાહ! અહીં ગુરુત્વાકર્ષણ નથી, એટલે મારું ખાવાનું હવામાં તરે છે! શું તને તારા ગમે છે?",
        "સરસ! ચંદ્ર આપણો સૌથી નજીકનો પડોશી છે. શું આપણે રોકેટ ત્યાં લઈ જઈએ?"
      ],
      patterns: [
        { keywords: /પૃથ્વી/i, reply: "હા! પૃથ્વી આપણો સુંદર ગ્રહ છે. અહીંથી તે ખૂબ જ અદ્ભુત લાગે છે! 🌍" }
      ]
    },
    {
      id: "lion",
      name: "શેરૂ સિંહ",
      emoji: "🦁",
      color: "bg-amber-500",
      initialGreeting: "ગર્જના! નમસ્તે આરવ, હું શેરૂ છું, જંગલનો રાજા! તને કયું પ્રાણી સૌથી વધુ ગમે છે?",
      fallbackReplies: [
        "ખૂબ સરસ! મને વૃક્ષોની છાયામાં સૂવું ગમે છે. તને ખાવામાં શું ગમે છે?",
        "વાહ! શું તું મારી સાથે ગર્જના કરીશ? કર ગર્જના!"
      ],
      patterns: [
        { keywords: /જમવાનું|ફળ/i, reply: "મને માંસ ગમે છે, પણ વાંદરાને કેળાં 🍌 ગમે છે!" }
      ]
    },
    {
      id: "doctor",
      name: "ડો. દિવ્યા",
      emoji: "👩‍⚕️",
      color: "bg-emerald-600",
      initialGreeting: "નમસ્તે આરવ! હું ડો. દિવ્યા છું. હું બાળકોને સ્વસ્થ રહેવામાં મદદ કરું છું. આજે તેં કોઈ ફળ ખાધું?",
      fallbackReplies: [
        "શાબાશ! ફળો આપણને શક્તિ આપે છે. રોજ ૯ કલાક ઊંઘવું જરૂરી છે!",
        "ખૂબ સરસ! સાબુથી હાથ ધોવાથી કીટાણુ દૂર ભાગે છે."
      ],
      patterns: [
        { keywords: /હા|કેળા/i, reply: "સરસ! ફળો ખાવાથી તું ખૂબ જ શક્તિશાળી બનીશ! 🍎" }
      ]
    }
  ],
  te: [
    {
      id: "astronaut",
      name: "అంతరిక్ష యాత్రికుడు అమర్",
      emoji: "👨‍🚀",
      color: "bg-blue-600",
      initialGreeting: "నమస్తే స్పేస్ క్యాడెట్ ఆరవ్! నేను నా రాకెట్ నుండి భూమిని చూస్తున్నాను. మనం ఏ గ్రహం మీద నివసిస్తున్నామో తెలుసా?",
      fallbackReplies: [
        "అద్భుతం! ఇక్కడ గురుత్వాకర్షణ లేదు, నా ఆహారం గాల్లో తేలుతుంది! నీకు నక్షత్రాలు ఇష్టమా?"
      ],
      patterns: [
        { keywords: /భూమి/i, reply: "అవును! భూమి మన నీలి గ్రహం. ఇక్కడి నుండి చాలా అందంగా కనిపిస్తుంది! 🌍" }
      ]
    },
    {
      id: "lion",
      name: "షేరు సింహం",
      emoji: "🦁",
      color: "bg-amber-500",
      initialGreeting: "గర్జన! నమస్తే ఆరవ్, నేను షేరును, అడవికి రాజును! నీకు ఇష్టమైన జంతువు ఏది?",
      fallbackReplies: [
        "భలే ఉంది! నాకు చెట్ల కింద పడుకోవడం ఇష్టం. నీకు ఏం తినడం ఇష్టం?"
      ],
      patterns: [
        { keywords: /తిండి|పండ్లు/i, reply: "నాకు మాంసం ఇష్టం, కానీ కోతులకు అరటిపండ్లు 🍌 ఇష్టం!" }
      ]
    },
    {
      id: "doctor",
      name: "డా. దివ్య",
      emoji: "👩‍⚕️",
      color: "bg-emerald-600",
      initialGreeting: "నమస్తే ఆరవ్! నేను డాక్టర్ దివ్యను. పిల్లలు ఆరోగ్యంగా ఉండటానికి నేను సహాయం చేస్తాను. ఈరోజు పండ్లు తిన్నావా?",
      fallbackReplies: [
        "చాలా మంచిది! పండ్లు విటమిన్లు ఇస్తాయి. రోజుకు 9 గంటలు నిద్రపో!"
      ],
      patterns: [
        { keywords: /అవును|పండు/i, reply: "మంచిది! పండ్లు తినడం నిన్ను బలంగా చేస్తుంది! 🍎" }
      ]
    }
  ],
  kn: [
    {
      id: "astronaut",
      name: "ಗಗನಯಾತ್ರಿ ಅನಿಲ್",
      emoji: "👨‍🚀",
      color: "bg-blue-600",
      initialGreeting: "ನಮಸ್ತೆ ಬಾಲ ವಿಜ್ಞಾನಿ ಆರವ್! ನಾನು ನನ್ನ ರಾಕೆಟ್‌ನಿಂದ ಭೂಮಿಯನ್ನು ನೋಡುತ್ತಿದ್ದೇನೆ. ನಾವು ಯಾವ ಗ್ರಹದಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೇವೆ ಗೊತ್ತಾ?",
      fallbackReplies: [
        "ಅದ್ಭುತ! ಇಲ್ಲಿ ಗುರುತ್ವಾಕರ್ಷಣೆ ಇಲ್ಲದ ಕಾರಣ ನನ್ನ ಆಹಾರ ಗಾಳಿಯಲ್ಲಿ ತೇಲುತ್ತದೆ! ನಿನಗೆ ನಕ್ಷತ್ರಗಳು ಇಷ್ಟವೇ?"
      ],
      patterns: [
        { keywords: /ಭೂಮಿ/i, reply: "ಹೌದು! ಭೂಮಿ ನಮ್ಮ ನೀಲಿ ಗ್ರಹ. ಇಲ್ಲಿಂದ ನೋಡಲು ತುಂಬಾ ಸುಂದರವಾಗಿದೆ! 🌍" }
      ]
    },
    {
      id: "lion",
      name: "ಶೇರು ಸಿಂಹ",
      emoji: "🦁",
      color: "bg-amber-500",
      initialGreeting: "ಗರ್ಜನೆ! ನಮಸ್ತೆ ಆರವ್, ನಾನು ಶೇರು, ಕಾಡಿನ ರಾಜ! ನಿನಗೆ ಯಾವ ಪ್ರಾಣಿ ಅತಿ ಹೆಚ್ಚು ಇಷ್ಟ?",
      fallbackReplies: [
        "ಭಲೇ! ನನಗೆ ಮರದ ನೆರಳಿನಲ್ಲಿ ಮಲಗಲು ಇಷ್ಟ. ನಿನಗೆ ತಿನ್ನಲು ಏನು ಇಷ್ಟ?"
      ],
      patterns: [
        { keywords: /ಊಟ|ಹಣ್ಣು/i, reply: "ನನಗೆ ಮಾಂಸ ಇಷ್ಟ, ಆದರೆ ಕೋತಿಗಳಿಗೆ ಬಾಳೆಹಣ್ಣು 🍌 ಇಷ್ಟ!" }
      ]
    },
    {
      id: "doctor",
      name: "ಡಾ. ದಿವ್ಯಾ",
      emoji: "👩‍⚕️",
      color: "bg-emerald-600",
      initialGreeting: "ನಮಸ್ತೆ ಆರವ್! ನಾನು ಡಾ. ದಿವ್ಯಾ. ಮಕ್ಕಳು ಆರೋಗ್ಯವಾಗಿರಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ಇಂದು ಹಣ್ಣು ತಿಂದಿದ್ದೀಯಾ?",
      fallbackReplies: [
        "ಉತ್ತಮ! ಹಣ್ಣುಗಳು ಶಕ್ತಿಯನ್ನು ನೀಡುತ್ತವೆ. ದಿನಕ್ಕೆ ೯ ಗಂಟೆ ನಿದ್ರಿಸು!"
      ],
      patterns: [
        { keywords: /ಹೌದು|ಹಣ್ಣು/i, reply: "ಸರಿ! ಹಣ್ಣುಗಳನ್ನು ತಿನ್ನುವುದು ನಿನ್ನನ್ನು ಬಲಶಾಲಿಯಾಗಿಸುತ್ತದೆ! 🍎" }
      ]
    }
  ]
};

export function VoiceRoleplay() {
  const { lang } = useLang();
  
  const characterPool = LOCALIZED_CHARACTERS[lang as LangCode] || LOCALIZED_CHARACTERS.en;

  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [history, setHistory] = useState<{ sender: "child" | "buddy"; text: string }[]>([]);
  const [isAiReplying, setIsAiReplying] = useState(false);

  const {
    transcript,
    isListening,
    startListening,
    stopListening
  } = useVoiceAssistant({
    expectedPhrase: "hello",
    lang,
    onSuccess: () => {},
    onFailure: () => {}
  });

  // Switch character pool instances automatically when language changes
  useEffect(() => {
    if (selectedChar) {
      const freshPool = LOCALIZED_CHARACTERS[lang as LangCode] || LOCALIZED_CHARACTERS.en;
      const matched = freshPool.find(c => c.id === selectedChar.id);
      if (matched) {
        setSelectedChar(matched);
      }
    }
  }, [lang]);

  useEffect(() => {
    if (!selectedChar) return;
    
    setHistory([{ sender: "buddy", text: selectedChar.initialGreeting }]);
    speakText(selectedChar.initialGreeting, lang);
  }, [selectedChar]);

  useEffect(() => {
    if (!selectedChar || !transcript.trim()) return;

    const lastMsg = history[history.length - 1];
    if (lastMsg && lastMsg.sender === "child") {
      setHistory(prev => prev.slice(0, -1).concat({ sender: "child", text: transcript }));
    } else {
      setHistory(prev => prev.concat({ sender: "child", text: transcript }));
    }
  }, [transcript]);

  const toggleMic = () => {
    if (isListening) {
      stopListening();
      
      const spokenText = transcript.trim();
      if (!spokenText || !selectedChar) return;

      setIsAiReplying(true);

      setTimeout(() => {
        let reply = "";
        const match = selectedChar.patterns.find(p => p.keywords.test(spokenText));
        if (match) {
          reply = match.reply;
        } else {
          reply = selectedChar.fallbackReplies[Math.floor(Math.random() * selectedChar.fallbackReplies.length)];
        }

        setHistory(prev => prev.concat({ sender: "buddy", text: reply }));
        speakText(reply, lang);
        setIsAiReplying(false);
      }, 1000);
    } else {
      startListening();
    }
  };

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-card max-w-md mx-auto w-full flex flex-col justify-between min-h-[360px]">
      <div>
        <SectionTitle
          title="Voice Roleplay Chat"
          sub="Talk to characters and practice pronunciation"
        />

        {!selectedChar ? (
          <div className="grid grid-cols-3 gap-3 py-6">
            {characterPool.map(char => (
              <button
                key={char.id}
                onClick={() => setSelectedChar(char)}
                className="flex flex-col items-center p-3 rounded-2xl border bg-background hover:scale-105 hover:shadow-soft transition-all"
              >
                <span className="text-4xl mb-2 select-none">{char.emoji}</span>
                <span className="text-xs font-bold text-center leading-tight">{char.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl select-none">{selectedChar.emoji}</span>
                <div>
                  <span className="font-extrabold text-sm block">{selectedChar.name}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Online Buddy</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-8 rounded-full text-xs font-bold"
                onClick={() => setSelectedChar(null)}
              >
                <RefreshCw className="mr-1 h-3.5 w-3.5" /> Switch Buddy
              </Button>
            </div>

            {/* Conversation chat scroll board */}
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 text-xs">
              {history.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "child" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`p-3 rounded-2xl max-w-[85%] font-medium leading-relaxed ${
                    msg.sender === "child"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiReplying && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-slate-100 animate-pulse text-[10px] font-bold text-muted-foreground">
                    Thinking... 🤖
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedChar && (
        <div className="mt-4 flex flex-col items-center gap-2 border-t pt-4">
          <Button
            size="lg"
            className={`rounded-full h-12 px-6 flex items-center gap-2 shadow-glow ${
              isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-indigo-600 hover:bg-indigo-500"
            }`}
            onClick={toggleMic}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            <span className="font-extrabold text-sm">
              {isListening ? "Tap when done speaking" : "Hold & Speak to buddy"}
            </span>
          </Button>
          <span className="text-[10px] text-muted-foreground font-bold italic">
            {isListening ? `Listening: "${transcript}"` : "Try replying to the buddy's greeting!"}
          </span>
        </div>
      )}
    </div>
  );
}
