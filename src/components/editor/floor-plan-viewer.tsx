"use client";

import { useState, useRef } from "react";
import { ZoomIn, ZoomOut, Download, RotateCcw } from "lucide-react";

interface Props {
  svgData: string;
  planId: string;
}

export function FloorPlanViewer({ svgData, planId }: Props) {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleDownload() {
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `planta-${planId}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-border bg-surface/80">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
          className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors"
          title="Aumentar zoom"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.3))}
          className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors"
          title="Reduzir zoom"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors"
          title="Resetar zoom"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <span className="text-xs text-zinc-400 ml-1">{Math.round(zoom * 100)}%</span>
        <div className="flex-1" />
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Baixar SVG
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="overflow-auto bg-surface-alt p-4"
        style={{ maxHeight: "500px" }}
      >
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: "top left", display: "inline-block" }}
          dangerouslySetInnerHTML={{ __html: svgData }}
        />
      </div>
    </div>
  );
}
