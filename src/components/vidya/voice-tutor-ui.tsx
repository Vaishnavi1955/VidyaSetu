import { useState, useEffect, useRef } from "react";
import { Mic, Volume2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceAssistant } from "@/hooks/use-voice-assistant";
import { useLiveStats } from "@/lib/live-data";

interface VoiceTutorUiProps {
  expectedAnswer: string;
  instructionText: string;
  onCorrect: () => void;
  onIncorrect: () => void;
  onCommand?: (command: string) => void;
  themeColor?: string; // e.g. "bg-grad-blue"
  voiceFeedbackPhrase?: string; // custom praise/fail phrase
}

export function VoiceTutorUi({
  expectedAnswer,
  instructionText,
  onCorrect,
  onIncorrect,
  onCommand,
  themeColor = "bg-grad-blue",
  voiceFeedbackPhrase
}: VoiceTutorUiProps) {
  const { stats, logVoiceActivity } = useLiveStats();
  const threshold = stats?.speakingThreshold || 70;
  const [tutorStatus, setTutorStatus] = useState<string>("");
  const isInitialPromptPlayed = useRef(false);

  const assistant = useVoiceAssistant({
    onStart: () => onCommand?.("start"),
    onNext: () => onCommand?.("next"),
    onPrevious: () => onCommand?.("previous"),
    onRepeat: () => {
      isInitialPromptPlayed.current = false;
      playInstruction();
    },
    onPause: () => onCommand?.("pause"),
    onContinue: () => onCommand?.("continue"),
    onSpeechResult: (spokenText, accuracy, passed) => {
      logVoiceActivity(expectedAnswer, accuracy, passed);
      
      if (passed) {
        if (accuracy >= 85) {
          setTutorStatus("Perfect Pronunciation! 🌟");
          assistant.speak(voiceFeedbackPhrase || "Amazing! Perfect pronunciation! Let's continue.", () => {
            onCorrect();
          });
        } else {
          setTutorStatus("Wonderful Job! ⭐");
          assistant.speak("Wonderful! You got it! Let's continue.", () => {
            onCorrect();
          });
        }
      } else {
        if (accuracy >= 50) {
          setTutorStatus(`Close! "${spokenText}" (${accuracy}% matching)`);
          assistant.speak(`Nice try! You are very close. Let's practice saying the word together: ${expectedAnswer}`, () => {
            onIncorrect();
          });
        } else {
          setTutorStatus(`Developing: "${spokenText}" (${accuracy}% matching)`);
          assistant.speak(`Good effort! Say the word after me: ${expectedAnswer}`, () => {
            onIncorrect();
          });
        }
      }
    }
  }, threshold);

  const playInstruction = () => {
    setTutorStatus("Speaking...");
    assistant.speak(instructionText, () => {
      setTutorStatus("");
    });
  };

  // Play instructions automatically on mount or expectedAnswer change
  useEffect(() => {
    isInitialPromptPlayed.current = false;
    const timeout = setTimeout(() => {
      if (!isInitialPromptPlayed.current) {
        playInstruction();
        isInitialPromptPlayed.current = true;
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [expectedAnswer, instructionText]);

  return (
    <div className="flex flex-col items-center gap-2 mt-4 p-4 rounded-3xl bg-muted/30 border border-dashed border-muted-foreground/20 w-full">
      <div className="flex items-center justify-between w-full mb-1">
        <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-brand-purple" />
          AI Voice Tutor
        </span>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 rounded-full" 
          onClick={playInstruction}
          title="Repeat instruction"
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-center gap-4">
        {/* Pulsing Mic Button */}
        <div className="relative">
          {assistant.isListening && (
            <span className="absolute -inset-2 rounded-full bg-brand-orange/20 animate-ping" />
          )}
          <Button
            size="lg"
            onClick={() => {
              if (assistant.isListening) {
                assistant.stopListening();
              } else {
                setTutorStatus("Listening...");
                assistant.startListening(expectedAnswer);
              }
            }}
            className={`h-14 w-14 rounded-full shadow-glow font-bold text-white transition-all ${
              assistant.isListening ? "bg-brand-orange animate-pulse" : themeColor
            }`}
          >
            <Mic className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Tutor Status & Transcript Display */}
      <div className="text-center min-h-[20px] mt-2">
        {assistant.isListening && (
          <p className="text-xs font-bold text-brand-orange animate-pulse">Say: "{expectedAnswer}"</p>
        )}
        {assistant.transcript && (
          <p className="text-xs font-semibold text-muted-foreground mt-0.5">Spoke: "{assistant.transcript}"</p>
        )}
        {tutorStatus && !assistant.isListening && (
          <p className="text-xs font-bold text-primary">{tutorStatus}</p>
        )}
      </div>
    </div>
  );
}
