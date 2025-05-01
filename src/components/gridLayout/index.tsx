"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function GridLayout({ children }: { children: React.ReactNode }) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
  
    const size = 30;
  
    const handleMouseMove = (e: MouseEvent) => {
      const rect = grid.getBoundingClientRect();
      const cols = Math.floor(rect.width / size);
      const rows = Math.floor(rect.height / size);
  
      const x = Math.floor((e.clientX - rect.left) / size);
      const y = Math.floor((e.clientY - rect.top) / size);
  
      const deltas = [
        [0, 0], [1, 0], [-1, 0],
        [0, 1], [1, 1], [-1, 1]
      ];
  
      deltas.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
          const index = ny * cols + nx;
          const cell = grid.children[index] as HTMLElement;
          if (cell) {
            cell.classList.add("highlight");
            cell.dataset.hoveredAt = String(Date.now());
          }
        }
      });
    };
  
    const fadeInterval = setInterval(() => {
      const now = Date.now();
      Array.from(grid.children).forEach((cell) => {
        if (!(cell instanceof HTMLElement)) return;
        const hoveredAt = parseInt(cell.dataset.hoveredAt || "0");
        if (hoveredAt && now - hoveredAt > 150) {
          cell.classList.remove("highlight");
          delete cell.dataset.hoveredAt;
        }
      });
    }, 50);
  
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(fadeInterval);
    };
  }, [pathname]);
  

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white overflow-hidden">
      <div
        ref={gridRef}
        className="fixed inset-0 z-0 grid pointer-events-none"
        style={{
          gridTemplateColumns: "repeat(auto-fill, 30px)",
          gridTemplateRows: "repeat(auto-fill, 30px)",
        }}
      >
        {Array.from({ length: 3000 }).map((_, i) => (
          <div
            key={i}
            className="grid-cell transition-all duration-300 opacity-0"
            style={{
              width: 30,
              height: 30,
              backgroundColor: "transparent",
            }}
          />
        ))}
      </div>
      <main className="relative z-10">{children}</main>
    </div>
  );
}
