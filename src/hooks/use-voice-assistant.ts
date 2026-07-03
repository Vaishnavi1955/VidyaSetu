import { useState, useEffect, useRef, useCallback } from "react";
import { useLang } from "@/lib/lang-context";
import {
  speakText,
  startSpeechRecognition,
  evaluatePronunciation,
  isSttSupported,
  isTtsSupported
} from "@/lib/voice-engine";

export interface VoiceAssistantCallbacks {
  onNext?: () => void;
  onPrevious?: () => void;
  onRepeat?: () => void;
  onStart?: () => void;
  onPause?: () => void;
  onContinue?: () => void;
  onSpeakEnd?: () => void;
  onSpeechResult?: (transcript: string, accuracy: number, passed: boolean) => void;
}

export function useVoiceAssistant(callbacks?: VoiceAssistantCallbacks, threshold = 70) {
  const { lang } = useLang();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef<any>(null);
  const callbacksRef = useRef<VoiceAssistantCallbacks | undefined>(callbacks);

  const latestTranscriptRef = useRef("");
  const hasVerifiedRef = useRef(false);
  const expectedPhraseRef = useRef<string | undefined>(undefined);

  // Keep callbacks ref fresh to prevent closure stale state
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    speakText(text, lang, () => {
      onEnd?.();
      callbacksRef.current?.onSpeakEnd?.();
    });
  }, [lang]);

  const stopListening = useCallback(() => {
    console.log("[useVoiceAssistant] stopListening called manually");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  }, []);

  const handleCommand = useCallback((phrase: string): boolean => {
    const clean = phrase.toLowerCase().trim();
    
    // Check navigation commands
    if (clean === "next" || clean === "आगे" || clean === "पुढे" || clean === "അടുത്തത്") {
      callbacksRef.current?.onNext?.();
      return true;
    }
    if (clean === "previous" || clean === "पीछे" || clean === "मागे") {
      callbacksRef.current?.onPrevious?.();
      return true;
    }
    if (clean === "repeat" || clean === "दहराओ" || clean === "पुन्हा सांगा" || clean === "மறுபடியும்") {
      callbacksRef.current?.onRepeat?.();
      return true;
    }
    if (clean === "start" || clean === "शुरू" || clean === "सुरू") {
      callbacksRef.current?.onStart?.();
      return true;
    }
    if (clean === "pause" || clean === "रुको" || clean === "थांबा") {
      callbacksRef.current?.onPause?.();
      return true;
    }
    if (clean === "continue" || clean === "जारी रखो" || clean === "चालू ठेवा") {
      callbacksRef.current?.onContinue?.();
      return true;
    }
    return false;
  }, []);

  const verifyCurrentTranscript = useCallback((text: string) => {
    const expected = expectedPhraseRef.current;
    console.log(`[useVoiceAssistant] verifyCurrentTranscript: spoken="${text}", expected="${expected}"`);
    
    // Try handling it as a navigation command first
    const isCmd = handleCommand(text);
    if (!isCmd && expected) {
      const accuracy = evaluatePronunciation(text, expected);
      const passed = accuracy >= threshold;
      
      console.log(`[useVoiceAssistant] Verification: accuracy=${accuracy}%, threshold=${threshold}%, passed=${passed}`);
      callbacksRef.current?.onSpeechResult?.(text, accuracy, passed);
    } else if (!isCmd) {
      console.log(`[useVoiceAssistant] Verification (no expected phrase): accuracy=100%, passed=true`);
      callbacksRef.current?.onSpeechResult?.(text, 100, true);
    }
  }, [handleCommand, threshold]);

  const startListening = useCallback((expectedPhrase?: string) => {
    setError("");
    setTranscript("");
    latestTranscriptRef.current = "";
    hasVerifiedRef.current = false;
    expectedPhraseRef.current = expectedPhrase;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    setIsListening(true);
    console.log(`[useVoiceAssistant] Speech Started: startListening called with expectedPhrase="${expectedPhrase}"`);

    const recognition = startSpeechRecognition({
      lang,
      onResult: (text: string, isFinal: boolean) => {
        console.log(`[useVoiceAssistant] onResult callback: text="${text}", isFinal=${isFinal}`);
        setTranscript(text);
        latestTranscriptRef.current = text;
        
        if (isFinal && !hasVerifiedRef.current) {
          hasVerifiedRef.current = true;
          setIsListening(false);
          verifyCurrentTranscript(text);
        }
      },
      onError: (err: string) => {
        console.error(`[useVoiceAssistant] onError callback: "${err}"`);
        setError(err);
        setIsListening(false);
      },
      onEnd: () => {
        console.log("[useVoiceAssistant] onEnd callback triggered");
        setIsListening(false);
        
        // Fallback: if speech recognition ends and we haven't verified the transcript yet, verify the latest transcript if it exists
        if (!hasVerifiedRef.current && latestTranscriptRef.current.trim()) {
          console.log(`[useVoiceAssistant] Run fallback verification on end: "${latestTranscriptRef.current}"`);
          hasVerifiedRef.current = true;
          verifyCurrentTranscript(latestTranscriptRef.current);
        }
      }
    });

    recognitionRef.current = recognition;
  }, [lang, verifyCurrentTranscript]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    latestTranscriptRef.current = "";
  }, []);

  return {
    isListening,
    transcript,
    error,
    speak,
    startListening,
    stopListening,
    resetTranscript,
    isSttSupported: isSttSupported(),
    isTtsSupported: isTtsSupported()
  };
}
