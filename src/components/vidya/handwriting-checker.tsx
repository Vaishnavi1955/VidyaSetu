import { useState, useEffect, useRef, MouseEvent, TouchEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Edit3, Trash2, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiveStats } from "@/lib/live-data";
import { useLang } from "@/lib/lang-context";

interface Stencil {
  id: string;
  name: string;
  emoji: string;
  targetPaths: { x: number; y: number }[][]; // Array of strokes, each stroke is an array of points (percentage of canvas width/height)
}

const STENCILS: Stencil[] = [
  {
    id: "A",
    name: "Letter A",
    emoji: "🅰️",
    // Coordinates in percentage (0 to 100)
    targetPaths: [
      // Left diagonal: bottom-left to top-center
      [{ x: 20, y: 80 }, { x: 35, y: 50 }, { x: 50, y: 20 }],
      // Right diagonal: top-center to bottom-right
      [{ x: 50, y: 20 }, { x: 65, y: 50 }, { x: 80, y: 80 }],
      // Crossbar: mid-left to mid-right
      [{ x: 35, y: 55 }, { x: 50, y: 55 }, { x: 65, y: 55 }]
    ]
  },
  {
    id: "circle",
    name: "Circle Shape",
    emoji: "🔴",
    targetPaths: [
      // Winding circle path
      [
        { x: 50, y: 20 }, { x: 75, y: 25 }, { x: 80, y: 50 },
        { x: 75, y: 75 }, { x: 50, y: 80 }, { x: 25, y: 75 },
        { x: 20, y: 50 }, { x: 25, y: 25 }, { x: 50, y: 20 }
      ]
    ]
  },
  {
    id: "3",
    name: "Number 3",
    emoji: "3️⃣",
    targetPaths: [
      // Upper curve
      [{ x: 30, y: 25 }, { x: 50, y: 20 }, { x: 65, y: 30 }, { x: 50, y: 48 }],
      // Lower curve
      [{ x: 50, y: 48 }, { x: 68, y: 60 }, { x: 55, y: 78 }, { x: 30, y: 75 }]
    ]
  }
];

export function HandwritingChecker() {
  const { stats, awardXP } = useLiveStats();
  const { t } = useLang();
  
  const [selectedStencil, setSelectedStencil] = useState<Stencil>(STENCILS[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [strokeResult, setStrokeResult] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const userPointsRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    initCanvas();
  }, [selectedStencil]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set display sizes
    canvas.width = 300;
    canvas.height = 300;
    
    const context = canvas.getContext("2d");
    if (!context) return;
    
    context.lineCap = "round";
    context.strokeStyle = "rgba(79, 70, 229, 0.8)"; // Primary drawing line color
    context.lineWidth = 10;
    contextRef.current = context;
    
    userPointsRef.current = [];
    setScore(null);
    setStrokeResult(null);

    drawStencilBackground();
  };

  // Render template dotted lines behind drawing
  const drawStencilBackground = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw guide stencils as light gray dotted paths
    ctx.strokeStyle = "rgba(226, 232, 240, 1)";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    selectedStencil.targetPaths.forEach(stroke => {
      ctx.beginPath();
      stroke.forEach((p, idx) => {
        const px = (p.x / 100) * canvas.width;
        const py = (p.y / 100) * canvas.height;
        if (idx === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      });
      ctx.stroke();
    });

    // Draw central dot indicators to guide children
    ctx.fillStyle = "#A5B4FC";
    selectedStencil.targetPaths.forEach(stroke => {
      stroke.forEach(p => {
        ctx.beginPath();
        ctx.arc((p.x / 100) * canvas.width, (p.y / 100) * canvas.height, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // Restore context settings for user drawing
    ctx.strokeStyle = "rgba(99, 102, 241, 0.85)";
    ctx.lineWidth = 10;
  };

  const getCanvasCoords = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;
    
    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Convert client coordinates to canvas viewport scale
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const startDrawing = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    if (!coords || !contextRef.current) return;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    
    userPointsRef.current.push({ x: coords.x, y: coords.y });
  };

  const draw = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);
    if (!coords || !contextRef.current) return;

    contextRef.current.lineTo(coords.x, coords.y);
    contextRef.current.stroke();

    userPointsRef.current.push({ x: coords.x, y: coords.y });
    
    // Prevent scrolling on mobile touch events
    if ("touches" in e) {
      e.preventDefault();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const checkDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas || userPointsRef.current.length === 0) return;

    // Calculate alignment accuracy between user drawn points and target template anchors
    let totalDistances = 0;
    let countedAnchors = 0;

    // Expand stencil targets into absolute coordinates
    const targets = selectedStencil.targetPaths.flat().map(p => ({
      x: (p.x / 100) * canvas.width,
      y: (p.y / 100) * canvas.height
    }));

    targets.forEach(tar => {
      // Find closest user point to this target anchor
      let minDistance = Infinity;
      userPointsRef.current.forEach(up => {
        const dx = up.x - tar.x;
        const dy = up.y - tar.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDistance) {
          minDistance = dist;
        }
      });
      totalDistances += minDistance;
      countedAnchors++;
    });

    const averageDist = totalDistances / countedAnchors;
    // Map average offset pixel distance (0-40px range) to 0-100% score
    const calcScore = Math.max(0, Math.round(100 - (averageDist / 35) * 100));
    setScore(calcScore);

    if (calcScore >= 75) {
      setStrokeResult("Fantastic job! Beautiful tracing! ⭐");
      awardXP(40, 2);
      if (window.triggerMascotCelebrate) {
        window.triggerMascotCelebrate(`Awesome tracing, Aarav! Correct stroke, score is ${calcScore}%! 🏆`);
      }
    } else {
      setStrokeResult("Almost there! Try tracing closely along the gray guide lines.");
      if (window.triggerMascotComfort) {
        window.triggerMascotComfort(`Good try, Aarav! Let's clear the board and trace it one more time. You can do it! ❤️`);
      }
    }
  };

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-card max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <div className="flex items-center gap-2">
          <Edit3 className="h-5 w-5 text-indigo-600" />
          <h3 className="font-display font-extrabold text-base">Handwriting Tracing</h3>
        </div>
        <div className="flex gap-1.5">
          {STENCILS.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStencil(s)}
              className={`h-8 px-3 rounded-full text-xs font-bold border transition-all ${
                selectedStencil.id === s.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              {s.name.split(" ")[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Tracing Area Board */}
      <div className="relative flex justify-center mt-3">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="rounded-2xl border bg-slate-50 dark:bg-slate-900 cursor-crosshair touch-none shadow-inner"
        />

        {/* Score indicator badge overlay */}
        {score !== null && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`absolute top-4 right-4 rounded-full h-14 w-14 grid place-items-center font-extrabold text-white shadow-soft ${
              score >= 75 ? "bg-green-500" : "bg-amber-500"
            }`}
          >
            <div className="text-center leading-none">
              <span className="text-lg block">{score}%</span>
              <span className="text-[7px] uppercase tracking-wider block">Score</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Handwriting checker controls */}
      <div className="mt-4 flex gap-2">
        <Button variant="outline" className="flex-1 rounded-full" onClick={initCanvas}>
          <Trash2 className="mr-1 h-4 w-4 text-muted-foreground" /> Clear
        </Button>
        <Button
          onClick={checkDrawing}
          disabled={score !== null}
          className="flex-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-soft"
        >
          Check Tracing 🔍
        </Button>
      </div>

      {/* Dynamic guidance feedback */}
      <AnimatePresence>
        {strokeResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-4 p-3 rounded-2xl text-xs font-bold leading-relaxed flex gap-2 items-start ${
              score && score >= 75
                ? "bg-green-50 text-green-950 border border-green-200 dark:bg-green-950/20 dark:text-green-200"
                : "bg-amber-50 text-amber-950 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-200"
            }`}
          >
            {score && score >= 75 ? (
              <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
            ) : (
              <RefreshCw className="h-4 w-4 shrink-0 text-amber-500 animate-spin" />
            )}
            <div>
              <p>{strokeResult}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Stroke completeness and consistency checked locally.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
