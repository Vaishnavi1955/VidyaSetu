import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Type, ZoomIn, Volume2, HelpCircle, Check, X, Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiveStats } from "@/lib/live-data";
import { useLang } from "@/lib/lang-context";

export function AccessibilityPanel() {
  const { stats, updateAccessibility } = useLiveStats();
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  // Apply root stylesheet options dynamically
  useEffect(() => {
    const acc = stats.accessibility || { dyslexiaFont: false, largeUi: false, highContrast: false };
    const doc = document.documentElement;

    // Toggle dyslexia font class
    if (acc.dyslexiaFont) {
      doc.classList.add("dyslexia-font");
    } else {
      doc.classList.remove("dyslexia-font");
    }

    // Toggle large UI buttons class
    if (acc.largeUi) {
      doc.classList.add("large-ui");
    } else {
      doc.classList.remove("large-ui");
    }

    // Toggle high contrast class
    if (acc.highContrast) {
      doc.classList.add("high-contrast");
    } else {
      doc.classList.remove("high-contrast");
    }

    // Inject accessibility CSS rules if they don't exist
    let styleEl = document.getElementById("vs-accessibility-styles");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "vs-accessibility-styles";
      styleEl.innerHTML = `
        /* Dyslexia friendly font override */
        .dyslexia-font, .dyslexia-font * {
          font-family: 'Comic Sans MS', cursive, sans-serif !important;
          letter-spacing: 0.12em !important;
          word-spacing: 0.18em !important;
        }
        
        /* Large button styles for motor-impaired tracing/clicking */
        .large-ui button, 
        .large-ui a:not(.logo-link),
        .large-ui [role="button"] {
          font-size: 1.15rem !important;
          padding: 0.75rem 1.5rem !important;
          min-height: 48px !important;
          min-width: 48px !important;
          border-width: 2.5px !important;
          border-radius: 9999px !important;
          transition: transform 0.2s ease !important;
        }
        
        /* High contrast colors */
        .high-contrast {
          filter: contrast(1.4) saturate(1.2) !important;
        }
        .high-contrast .bg-card {
          background-color: #ffffff !important;
          border-color: #000000 !important;
          border-width: 2px !important;
        }
        .high-contrast text, 
        .high-contrast p, 
        .high-contrast h1, 
        .high-contrast h2, 
        .high-contrast h3,
        .high-contrast span {
          color: #000000 !important;
          font-weight: 700 !important;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, [stats.accessibility]);

  return (
    <>
      {/* Floating Accessibility Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-5 left-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-indigo-600 text-white shadow-glow"
        aria-label="Accessibility Settings"
        title="Accessibility Settings"
      >
        <Accessibility className="h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 left-5 z-40 flex w-[90vw] max-w-sm flex-col overflow-hidden rounded-3xl border bg-card p-5 shadow-glow"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Accessibility className="h-5 w-5 text-indigo-600" />
                <h3 className="font-display font-extrabold text-lg">Accessibility Hub</h3>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full h-8 w-8" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Dyslexia Font Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-100 text-purple-600">
                    <Type className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Friendly Font</div>
                    <div className="text-xs text-muted-foreground">Dyslexia-friendly reading</div>
                  </div>
                </div>
                <Button
                  variant={stats.accessibility?.dyslexiaFont ? "default" : "outline"}
                  className="rounded-full h-8 px-4"
                  onClick={() => updateAccessibility({ dyslexiaFont: !stats.accessibility?.dyslexiaFont })}
                >
                  {stats.accessibility?.dyslexiaFont ? <Check className="mr-1 h-3.5 w-3.5" /> : null}
                  {stats.accessibility?.dyslexiaFont ? "On" : "Off"}
                </Button>
              </div>

              {/* Large Buttons Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100 text-blue-600">
                    <ZoomIn className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Large Buttons</div>
                    <div className="text-xs text-muted-foreground">Bigger touch target areas</div>
                  </div>
                </div>
                <Button
                  variant={stats.accessibility?.largeUi ? "default" : "outline"}
                  className="rounded-full h-8 px-4"
                  onClick={() => updateAccessibility({ largeUi: !stats.accessibility?.largeUi })}
                >
                  {stats.accessibility?.largeUi ? <Check className="mr-1 h-3.5 w-3.5" /> : null}
                  {stats.accessibility?.largeUi ? "On" : "Off"}
                </Button>
              </div>

              {/* High Contrast Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-600">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">High Contrast</div>
                    <div className="text-xs text-muted-foreground">Improves visibility</div>
                  </div>
                </div>
                <Button
                  variant={stats.accessibility?.highContrast ? "default" : "outline"}
                  className="rounded-full h-8 px-4"
                  onClick={() => updateAccessibility({ highContrast: !stats.accessibility?.highContrast })}
                >
                  {stats.accessibility?.highContrast ? <Check className="mr-1 h-3.5 w-3.5" /> : null}
                  {stats.accessibility?.highContrast ? "On" : "Off"}
                </Button>
              </div>

              {/* Voice Speed Slider */}
              <div className="space-y-1.5 pt-2 border-t">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-green-100 text-green-600">
                    <Volume2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Voice Speech Speed</div>
                    <div className="text-xs text-muted-foreground">Adjust TTS talk speed: {stats.accessibility?.speechRate || 1.0}x</div>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.1"
                  value={stats.accessibility?.speechRate || 1.0}
                  onChange={(e) => updateAccessibility({ speechRate: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-900 p-3 text-xs text-muted-foreground flex gap-2">
              <HelpCircle className="h-4 w-4 shrink-0 text-indigo-500" />
              <span>Accessibility settings apply immediately and persist across pages automatically.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
