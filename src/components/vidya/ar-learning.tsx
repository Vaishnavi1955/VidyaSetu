import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, Sparkles, Volume2, ShieldCheck, Trophy, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiveStats } from "@/lib/live-data";
import { speakText } from "@/lib/voice-engine";
import { useLang } from "@/lib/lang-context";

interface ARObject {
  id: string;
  name: string;
  emoji: string;
  spelling: string;
  color: string;
  shape: string;
  count: number;
  facts: Record<string, string>;
  names: Record<string, string>;
}

const AR_OBJECTS: ARObject[] = [
  {
    id: "apple",
    name: "Apple",
    emoji: "🍎",
    spelling: "A-P-P-L-E",
    color: "Red",
    shape: "Round",
    count: 1,
    names: { en: "Apple", hi: "सेब", mr: "सफरचंद", ta: "ஆப்பிள்" },
    facts: {
      en: "Apples float in water because 25% of their volume is air!",
      hi: "सेब पानी में तैरते हैं क्योंकि उनके आयतन का 25% हवा होती है!",
      mr: "सफरचंद पाण्यात तरंगतात कारण त्यांच्या आकाराचा २५% भाग हवा असतो!",
      ta: "ஆப்பிள்களில் 25% காற்று இருப்பதால் அவை நீரில் மிதக்கின்றன!"
    }
  },
  {
    id: "bottle",
    name: "Bottle",
    emoji: "🍼",
    spelling: "B-O-T-T-L-E",
    color: "Blue",
    shape: "Cylinder",
    count: 1,
    names: { en: "Bottle", hi: "बोतल", mr: "बाटली", ta: "பாட்டில்" },
    facts: {
      en: "Reusing water bottles helps save our oceans!",
      hi: "पानी की बोतलों का दोबारा उपयोग करने से हमारे महासागरों को बचाने में मदद मिलती है!",
      mr: "पाण्याच्या बाटल्यांचा पुन्हा वापर केल्याने आपले महासागर वाचण्यास मदत होते!",
      ta: "தண்ணீர் பாட்டில்களை மீண்டும் பயன்படுத்துவது கடல்களைக் காப்பாற்ற உதவுகிறது!"
    }
  },
  {
    id: "book",
    name: "Book",
    emoji: "📖",
    spelling: "B-O-O-K",
    color: "Green",
    shape: "Rectangle",
    count: 1,
    names: { en: "Book", hi: "किताब", mr: "पुस्तक", ta: "புத்தகம்" },
    facts: {
      en: "Reading books gives your brain a fun workout!",
      hi: "किताबें पढ़ने से आपके दिमाग की कसरत होती है!",
      mr: "पुस्तके वाचल्याने तुमच्या मेंदूचा व्यायाम होतो!",
      ta: "புத்தகங்களைப் படிப்பது உங்கள் மூளைக்குச் சிறந்த பயிற்சியாகும்!"
    }
  },
  {
    id: "toy",
    name: "Toy",
    emoji: "🧸",
    spelling: "T-O-Y",
    color: "Brown",
    shape: "Bear-like",
    count: 1,
    names: { en: "Toy Bear", hi: "खिलौना भालू", mr: "खेळणी अस्वल", ta: "பொம்மை கரடி" },
    facts: {
      en: "The first teddy bear was named after President Theodore Roosevelt!",
      hi: "पहले टेडी बियर का नाम राष्ट्रपति थियोडोर रूजवेल्ट के नाम पर रखा गया था!",
      mr: "पहिल्या टेडी बेअरचे नाव राष्ट्राध्यक्ष थिओडोर रुझव्हेल्ट यांच्या नावावर ठेवले गेले होते!",
      ta: "முதல் டெடி பியருக்கு ஜனாதிபதி தியோடர் ரூஸ்வெல்ட்டின் பெயர் சூட்டப்பட்டது!"
    }
  },
  {
    id: "chair",
    name: "Chair",
    emoji: "🪑",
    spelling: "C-H-A-I-R",
    color: "Yellow",
    shape: "Square",
    count: 1,
    names: { en: "Chair", hi: "कुर्सी", mr: "खुर्ची", ta: "நாற்காலி" },
    facts: {
      en: "Chairs have been used for over 5,000 years, since ancient Egypt!",
      hi: "कुर्सियों का उपयोग 5,000 से अधिक वर्षों से हो रहा है!",
      mr: "खुर्च्यांचा वापर ५,००० वर्षांहून अधिक काळापासून केला जात आहे!",
      ta: "நாற்காலிகள் 5,000 ஆண்டுகளுக்கும் மேலாகப் பயன்படுத்தப்பட்டு வருகின்றன!"
    }
  }
];

const TREASURE_HUNTS = [
  { id: "h1", prompt: "Find something RED!", targetProperty: "color", targetValue: "Red", clue: "Look for an apple 🍎 or a red shirt!" },
  { id: "h2", prompt: "Find something ROUND!", targetProperty: "shape", targetValue: "Round", clue: "Look for an apple 🍎 or a round ball ⚽!" },
  { id: "h3", prompt: "Find something starting with letter B!", targetProperty: "id", targetValue: "bottle", clue: "Look for a bottle 🍼 or a book 📖!" }
];

export function ArLearning() {
  const { stats, awardXP, addCollectible } = useLiveStats();
  const { lang, t } = useLang();
  
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedObj, setSelectedObj] = useState<ARObject | null>(null);
  
  // Treasure Hunt state
  const [activeHuntIndex, setActiveHuntIndex] = useState(0);
  const [huntStatus, setHuntStatus] = useState<"idle" | "searching" | "found">("idle");
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef<number | null>(null);

  const activeHunt = TREASURE_HUNTS[activeHuntIndex];

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
      startScanningAnimation();
    } catch (e) {
      console.error("[AR] Camera load error:", e);
      alert("Please allow camera access to run the AR simulator.");
    }
  };

  const stopCamera = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setSelectedObj(null);
  };

  // Draw overlay scanner animation
  const startScanningAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let scanLineY = 0;
    let direction = 1;

    const frame = () => {
      if (!canvasRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render scanning target crosshair
      ctx.strokeStyle = "rgba(79, 70, 229, 0.5)";
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      // Moving green scan line
      scanLineY += 2.5 * direction;
      if (scanLineY >= canvas.height - 60 || scanLineY <= 10) {
        direction *= -1;
      }
      ctx.strokeStyle = "rgba(16, 185, 129, 0.7)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(50, 50 + scanLineY);
      ctx.lineTo(canvas.width - 50, 50 + scanLineY);
      ctx.stroke();

      // If an object is active, draw a simulated bounding box
      if (selectedObj) {
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 4;
        ctx.strokeRect(100, 80, 150, 150);
        
        ctx.fillStyle = "#F59E0B";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText(`AI Detected: ${selectedObj.name} (100% confidence)`, 102, 72);
      }

      animRef.current = requestAnimationFrame(frame);
    };
    frame();
  };

  const handleSelectObject = (obj: ARObject) => {
    setSelectedObj(obj);
    if (window.triggerMascotSpeak) {
      const translation = obj.names[lang] || obj.name;
      window.triggerMascotSpeak(`That's a ${translation}! It's spelled ${obj.spelling}. 🍎`);
    }
  };

  const playVoice = (text: string) => {
    speakText(text, lang);
  };

  // Simulate finding the item in the treasure hunt
  const simulateFindItem = () => {
    if (!selectedObj) return;

    let matches = false;
    if (activeHunt.targetProperty === "color" && selectedObj.color === activeHunt.targetValue) {
      matches = true;
    } else if (activeHunt.targetProperty === "shape" && selectedObj.shape === activeHunt.targetValue) {
      matches = true;
    } else if (activeHunt.targetProperty === "id" && selectedObj.id === activeHunt.targetValue) {
      matches = true;
    }

    if (matches) {
      setHuntStatus("found");
      awardXP(60, 3); // Award XP and stars
      addCollectible("badge-treasure"); // Earn custom badge

      if (window.triggerMascotCelebrate) {
        window.triggerMascotCelebrate(`Awesome! You found a ${selectedObj.name}! 🏆 Reward: 60 XP & 3 stars!`);
      }
    } else {
      if (window.triggerMascotComfort) {
        window.triggerMascotComfort(`Almost! A ${selectedObj.name} is ${selectedObj.color}, but we need something ${activeHunt.targetValue}. Let's keep looking!`);
      }
    }
  };

  const nextHunt = () => {
    setActiveHuntIndex((prev) => (prev + 1) % TREASURE_HUNTS.length);
    setHuntStatus("idle");
    setSelectedObj(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Camera Panel */}
      <div className="lg:col-span-2 rounded-3xl border bg-card p-4 shadow-card flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-extrabold text-lg flex items-center gap-1.5">
              <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse" />
              Magic AR Scanner
            </h3>
            <p className="text-xs text-muted-foreground">Select an object to point your camera and scan</p>
          </div>
          <Button
            onClick={cameraActive ? stopCamera : startCamera}
            variant={cameraActive ? "destructive" : "default"}
            className="rounded-full shadow-soft"
          >
            {cameraActive ? <CameraOff className="mr-1 h-4 w-4" /> : <Camera className="mr-1 h-4 w-4" />}
            {cameraActive ? "Stop Camera" : "Open Camera"}
          </Button>
        </div>

        {/* Video stream viewport */}
        <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl border bg-slate-900 overflow-hidden flex items-center justify-center">
          {cameraActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
              />
              <canvas
                ref={canvasRef}
                width="400"
                height="300"
                className="absolute inset-0 h-full w-full pointer-events-none"
              />
            </>
          ) : (
            <div className="flex flex-col items-center text-muted-foreground p-6 text-center">
              <Camera className="h-12 w-12 text-slate-700 mb-2 animate-bounce" />
              <p className="font-bold text-sm">Click "Open Camera" to play AR Mode</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">Requires webcam permission to run objects classifier overlay</p>
            </div>
          )}
        </div>

        {/* List of objects to choose from to simulate scanning */}
        {cameraActive && (
          <div className="w-full mt-4">
            <span className="text-xs font-bold text-muted-foreground block mb-2">Simulate scanning target:</span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {AR_OBJECTS.map(obj => (
                <button
                  key={obj.id}
                  onClick={() => handleSelectObject(obj)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-2xl border text-sm font-bold shrink-0 transition-all ${
                    selectedObj?.id === obj.id
                      ? "bg-amber-100 text-amber-900 border-amber-500 scale-105"
                      : "bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="text-lg">{obj.emoji}</span>
                  {obj.names[lang] || obj.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info & Treasure Hunt panel */}
      <div className="space-y-4">
        {/* Hunt panel */}
        <div className="rounded-3xl border bg-card p-5 shadow-card bg-grad-purple text-white">
          <h4 className="font-display font-extrabold text-base flex items-center gap-1.5">
            <Trophy className="h-5 w-5 text-yellow-300" />
            Treasure Hunt Activity
          </h4>
          
          <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">Active Quest</span>
            <p className="text-lg font-extrabold mt-1">{activeHunt.prompt}</p>
            <p className="text-xs mt-1 text-purple-200">Clue: {activeHunt.clue}</p>

            {cameraActive && selectedObj && huntStatus === "idle" && (
              <Button
                onClick={simulateFindItem}
                className="w-full rounded-full bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-bold mt-4 shadow-soft"
              >
                Scan Selected Item 🔍
              </Button>
            )}

            {huntStatus === "found" && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="mt-4 flex flex-col items-center text-center p-3 rounded-2xl bg-green-500 text-white"
              >
                <CheckCircle className="h-8 w-8 mb-1" />
                <p className="font-extrabold text-sm">Correct Item Found! 🍎</p>
                <p className="text-xs opacity-90">+60 XP & Stars Claimed</p>
                <Button
                  onClick={nextHunt}
                  size="sm"
                  className="rounded-full bg-white text-green-700 hover:bg-slate-100 font-bold mt-3"
                >
                  Next Hunt <RefreshCw className="ml-1 h-3.5 w-3.5" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Object Card Info details */}
        <AnimatePresence>
          {selectedObj && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="rounded-3xl border bg-card p-5 shadow-card space-y-3"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedObj.emoji}</span>
                  <div>
                    <h4 className="font-display font-extrabold text-base">{selectedObj.names[lang] || selectedObj.name}</h4>
                    <span className="text-xs text-muted-foreground">Classified Item details</span>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full h-8 w-8"
                  onClick={() => playVoice(selectedObj.names[lang] || selectedObj.name)}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl">
                  <span className="text-muted-foreground block">Spelling</span>
                  <span className="font-extrabold text-indigo-600 tracking-wider">{selectedObj.spelling}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl">
                  <span className="text-muted-foreground block">Colour / Shape</span>
                  <span className="font-extrabold">{selectedObj.color} · {selectedObj.shape}</span>
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-slate-900 p-3 rounded-2xl border border-indigo-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 block uppercase">Fun Learning Fact:</span>
                <p className="text-xs font-semibold leading-relaxed mt-1 text-slate-800 dark:text-slate-200">
                  {selectedObj.facts[lang] || selectedObj.facts.en}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
