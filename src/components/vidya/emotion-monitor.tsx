import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, Brain, Shield, Sparkles, Coffee, Smile, Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type EmotionType = "happy" | "confused" | "tired" | "frustrated";

export function EmotionMonitor() {
  const [consent, setConsent] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>("happy");
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Stop camera stream when component unmounts
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Request consent status from localStorage on mount
  useEffect(() => {
    try {
      const savedConsent = localStorage.getItem("vs_emotion_consent");
      if (savedConsent === "true") {
        setConsent(true);
      }
    } catch {}
  }, []);

  const handleStartRequest = () => {
    if (consent === true) {
      startCamera();
    } else {
      setShowPermissionDialog(true);
    }
  };

  const grantConsent = () => {
    try {
      localStorage.setItem("vs_emotion_consent", "true");
    } catch {}
    setConsent(true);
    setShowPermissionDialog(false);
    startCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 160, height: 120, facingMode: "user" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
      startFacialAnalysis();
    } catch (error) {
      console.error("[EmotionMonitor] Failed to open camera stream:", error);
      alert("Could not access camera. Please check your camera permissions.");
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  };

  // Simulate real-time face tracking and canvas rendering
  const startFacialAnalysis = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let tick = 0;
    const draw = () => {
      if (!isActive || !canvasRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      tick += 0.05;
      
      // Draw simulated scanning face grid
      ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      // Outer face ellipse
      ctx.ellipse(80, 60, 45, 52, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Eyebrows / Eyes tracking dots
      ctx.fillStyle = "#10B981";
      // Left eye tracker
      ctx.beginPath();
      ctx.arc(65, 50 + Math.sin(tick) * 0.5, 3, 0, Math.PI * 2);
      ctx.fill();
      // Right eye tracker
      ctx.beginPath();
      ctx.arc(95, 50 + Math.sin(tick) * 0.5, 3, 0, Math.PI * 2);
      ctx.fill();

      // Mouth tracker line
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (currentEmotion === "happy") {
        ctx.arc(80, 68, 12, 0, Math.PI, false); // Smile
      } else if (currentEmotion === "frustrated") {
        ctx.arc(80, 80, 10, Math.PI, 0, false); // Flat/Frown
      } else if (currentEmotion === "tired") {
        ctx.ellipse(80, 75, 4, 6, 0, 0, Math.PI * 2); // Yawn
      } else {
        ctx.moveTo(70, 75);
        ctx.lineTo(90, 75); // Neutral / Confused line
      }
      ctx.stroke();

      // Text status overlay on scanning
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, canvas.width, 16);
      ctx.fillStyle = "#ffffff";
      ctx.font = "8px monospace";
      ctx.fillText(`Scanning: ${currentEmotion.toUpperCase()}`, 4, 11);

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  // Simulate changing emotions over time to demonstrate functionality
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const emotions: EmotionType[] = ["happy", "confused", "tired", "frustrated"];
      const nextEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setCurrentEmotion(nextEmotion);

      // Trigger companion reaction based on emotion
      if (window.triggerMascotSpeak) {
        if (nextEmotion === "frustrated") {
          window.triggerMascotSpeak("Hey Aarav, is this path tricky? Let's take a deep breath and try an easier shape puzzle! 🌟");
        } else if (nextEmotion === "tired") {
          window.triggerMascotSpeak("Yawn! 🥱 Looks like we've studied hard. How about a 5-second stretch break together, Aarav?");
        } else if (nextEmotion === "confused") {
          window.triggerMascotSpeak("Need a hint, buddy? Try looking for the animal that makes a 'roar' sound! 🦁");
        }
      }
    }, 18000); // Trigger every 18 seconds for demo purposes

    return () => clearInterval(interval);
  }, [isActive, currentEmotion]);

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-card mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base">Emotion-Aware Companion</h3>
            <p className="text-xs text-muted-foreground">Uses front camera to detect child frustration/fatigue</p>
          </div>
        </div>

        <Button
          onClick={isActive ? stopCamera : handleStartRequest}
          variant={isActive ? "destructive" : "default"}
          className="rounded-full shadow-soft"
        >
          {isActive ? (
            <>
              <CameraOff className="mr-1 h-4 w-4" /> Stop Scanner
            </>
          ) : (
            <>
              <Camera className="mr-1 h-4 w-4" /> Start Scanner
            </>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex gap-4 overflow-hidden"
          >
            {/* Live Camera View Box */}
            <div className="relative h-[120px] w-[160px] rounded-2xl overflow-hidden bg-slate-900 border">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
              />
              <canvas
                ref={canvasRef}
                width="160"
                height="120"
                className="absolute inset-0 h-full w-full pointer-events-none"
              />
            </div>

            {/* Status Information & Demo Manual Controls */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="text-sm font-bold flex items-center gap-1.5">
                  Current Status:{" "}
                  {currentEmotion === "happy" && <span className="text-green-600 font-extrabold">Happy 😊</span>}
                  {currentEmotion === "confused" && <span className="text-amber-500 font-extrabold">Confused 🤔</span>}
                  {currentEmotion === "tired" && <span className="text-indigo-600 font-extrabold">Tired 🥱</span>}
                  {currentEmotion === "frustrated" && <span className="text-red-500 font-extrabold">Frustrated 😠</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Vidy monitors child attention/mood locally in-browser. Images are never sent to external servers.
                </p>
              </div>

              {/* Demo manual emotion trigger buttons */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground w-full">Developer Simulation Toggles:</span>
                {(["happy", "confused", "tired", "frustrated"] as EmotionType[]).map(e => (
                  <button
                    key={e}
                    onClick={() => {
                      setCurrentEmotion(e);
                      if (window.triggerMascotSpeak) {
                        if (e === "frustrated") window.triggerMascotSpeak("Is this tough, Aarav? Let's try drawing simple shapes instead!");
                        if (e === "tired") window.triggerMascotSpeak("Time for a stretch break Aarav! Stand up and reach for the sky!");
                        if (e === "confused") window.triggerMascotSpeak("Here is a hint: look for matching colors!");
                        if (e === "happy") window.triggerMascotSpeak("Yay! Love that happy face, Aarav!");
                      }
                    }}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                      currentEmotion === e
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parent Consent Dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="max-w-md sm:rounded-3xl border-0 p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display font-extrabold text-lg">
              <Shield className="h-5 w-5 text-indigo-600" />
              Parental Consent Required
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-foreground leading-relaxed">
              VidyaSetu can utilize the device's front camera to observe if the child is showing signs of fatigue, confusion, or frustration. 
            </p>
            <div className="rounded-2xl bg-indigo-50 dark:bg-slate-900 p-4 space-y-2 text-xs text-indigo-950 dark:text-indigo-200">
              <div className="flex gap-2 items-start">
                <Sparkles className="h-4 w-4 shrink-0 text-indigo-600" />
                <span>**100% Local Processing**: Face tracking runs directly on the device. No snapshots are stored, uploaded, or analyzed outside the browser.</span>
              </div>
              <div className="flex gap-2 items-start">
                <Coffee className="h-4 w-4 shrink-0 text-indigo-600" />
                <span>**Smart Rest Breaks**: Suggests a fun stretching screen or simpler game when the child gets stuck.</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              By clicking "Agree", you enable camera accessibility for the AI companion. You can revoke this setting anytime.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="ghost" className="rounded-full" onClick={() => setShowPermissionDialog(false)}>
                Cancel
              </Button>
              <Button className="rounded-full bg-indigo-600 text-white shadow-glow" onClick={grantConsent}>
                Agree & Start Camera
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
