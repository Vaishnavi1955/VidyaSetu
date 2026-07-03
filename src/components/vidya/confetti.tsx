import { useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
}

// CSS-only lightweight confetti - spawns 40 pieces on activation
export function Confetti({ active }: ConfettiProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const container = ref.current;
    container.innerHTML = "";

    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96E6A1", "#DDA0DD", "#F7DC6F", "#FF8C69"];
    const shapes = ["●", "■", "▲", "★", "♦"];

    for (let i = 0; i < 48; i++) {
      const el = document.createElement("span");
      el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      el.style.cssText = `
        position:absolute;
        left:${Math.random() * 100}%;
        top:-20px;
        color:${colors[Math.floor(Math.random() * colors.length)]};
        font-size:${10 + Math.random() * 14}px;
        animation: confetti-fall ${1.5 + Math.random() * 2}s ease-out ${Math.random() * 0.8}s forwards;
        opacity:1;
        pointer-events:none;
      `;
      container.appendChild(el);
    }
  }, [active]);

  if (!active) return null;

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg) scale(0.5); opacity: 0; }
        }
      `}</style>
      <div ref={ref} className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" />
    </>
  );
}
