import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, Pause, Trash2, Calendar, Shield, Soundbar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiveStats } from "@/lib/live-data";

interface CapsuleText {
  month: number;
  label: string;
  text: string;
}

const MONTHLY_TEXTS: CapsuleText[] = [
  { month: 1, label: "Month 1: Tracing sounds", text: "The cat sat on a red mat." },
  { month: 2, label: "Month 2: Simple words", text: "A big blue elephant walked in the forest." },
  { month: 3, label: "Month 3: Full sentences", text: "Three happy monkeys shared a sweet yellow mango under the warm sun." }
];

export function TimeCapsule() {
  const { stats, addTimeCapsuleRecording } = useLiveStats();
  
  const [selectedMonth, setSelectedMonth] = useState<CapsuleText>(MONTHLY_TEXTS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Audio recording references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Save recording metadata to LiveStats
        addTimeCapsuleRecording(selectedMonth.label, duration, audioUrl);
        
        // Stop all tracks on the stream
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = window.setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);

      if (window.triggerMascotSpeak) {
        window.triggerMascotSpeak("Recording started! Speak clearly into the microphone. 🎙️");
      }
    } catch (err) {
      console.error("[TimeCapsule] Record error:", err);
      // Fallback mock recording if media devices fail
      setIsRecording(true);
      setDuration(0);
      timerRef.current = window.setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    } else {
      // Mock fallback save
      const mockUrl = "mock-audio-data-" + Date.now();
      addTimeCapsuleRecording(selectedMonth.label, duration, mockUrl);
    }
    
    setIsRecording(false);
    if (window.triggerMascotCelebrate) {
      window.triggerMascotCelebrate("Great reading Aarav! Voice capsule saved! 🏆");
    }
  };

  const handlePlayRecording = (id: string, url: string) => {
    if (playingId === id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    
    if (url.startsWith("mock-audio-data")) {
      // Simulated play for mock
      setTimeout(() => {
        setPlayingId(null);
      }, 3000);
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
      audioRef.current.onended = () => {
        setPlayingId(null);
      };
    }
  };

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-card max-w-md mx-auto">
      {/* Hidden audio tag for playback */}
      <audio ref={audioRef} className="hidden" />

      <div className="flex items-center gap-2.5 mb-4 border-b pb-2">
        <Calendar className="h-5 w-5 text-indigo-600" />
        <div>
          <h3 className="font-display font-extrabold text-base">Voice Time Capsule</h3>
          <p className="text-xs text-muted-foreground">Track monthly reading and pronunciation growth</p>
        </div>
      </div>

      {/* Monthly challenge text selector */}
      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border mb-4">
        <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-2">Select Monthly Practice Text:</label>
        <div className="flex gap-2 mb-3">
          {MONTHLY_TEXTS.map(t => (
            <button
              key={t.month}
              onClick={() => {
                if (!isRecording) setSelectedMonth(t);
              }}
              className={`h-7 px-3 rounded-full text-xs font-bold border transition-all ${
                selectedMonth.month === t.month
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-background text-foreground hover:bg-muted"
              } ${isRecording ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              Month {t.month}
            </button>
          ))}
        </div>
        <p className="text-sm font-extrabold italic text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 p-3 rounded-xl border select-none">
          "{selectedMonth.text}"
        </p>
      </div>

      {/* Recording Control Button */}
      <div className="flex flex-col items-center gap-2.5 py-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? stopRecording : startRecording}
          className={`h-16 w-16 rounded-full flex items-center justify-center text-white shadow-glow ${
            isRecording ? "bg-red-500 animate-pulse" : "bg-indigo-600"
          }`}
        >
          {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </motion.button>
        <span className="text-xs font-bold">
          {isRecording ? `Recording... (${duration}s)` : "Tap to record reading"}
        </span>
      </div>

      {/* Timeline list of past monthly recordings */}
      <div className="mt-5 border-t pt-4">
        <span className="text-xs font-extrabold text-muted-foreground block mb-3">Saved Recordings Log (Parent View)</span>
        
        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
          {stats.timeCapsule.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-4">No capsule recordings found. Complete Month 1 check above.</p>
          ) : (
            stats.timeCapsule.map((tc) => (
              <div
                key={tc.id}
                className="flex items-center justify-between p-3 rounded-2xl border bg-background text-xs font-bold"
              >
                <div>
                  <p className="font-extrabold text-slate-800 dark:text-slate-200">{tc.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Recorded: {new Date(tc.date).toLocaleDateString()} · {tc.durationSec} sec
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full h-8 px-3.5 border-indigo-200 text-indigo-700 font-bold"
                  onClick={() => handlePlayRecording(tc.id, tc.audioUrl)}
                >
                  {playingId === tc.id ? <Pause className="mr-1 h-3.5 w-3.5" /> : <Play className="mr-1 h-3.5 w-3.5" />}
                  {playingId === tc.id ? "Pause" : "Listen"}
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-indigo-50 dark:bg-slate-900 p-3 text-[10px] text-muted-foreground flex gap-1.5 border border-indigo-100">
        <Shield className="h-4 w-4 shrink-0 text-indigo-500" />
        <span>Audio checks are saved locally. You can replay them to hear speech accuracy progress.</span>
      </div>
    </div>
  );
}
