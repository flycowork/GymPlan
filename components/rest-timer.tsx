"use client";

import { useRestTimer } from "@/lib/hooks";
import { Timer, X } from "lucide-react";

function parseRest(rest: string): number | null {
  if (rest === "—" || rest === "-") return null;
  const match = rest.match(/(\d+)\s*(sec|min|s|m)/i);
  if (!match) return null;
  const val = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  if (unit === "min" || unit === "m") return val * 60;
  return val;
}

export default function RestTimer() {
  const { seconds, isRunning, targetSeconds, start, stop } = useRestTimer();

  const presets = [45, 60, 90, 120];
  const progress = targetSeconds > 0 ? ((targetSeconds - seconds) / targetSeconds) * 100 : 0;

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isRunning || seconds === 0) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
        {isRunning ? (
          <div className="bg-gym-surface border-t border-gym-border">
            {/* Progress bar */}
            <div className="h-1 bg-gym-border">
              <div
                className="h-full bg-gym-accent transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Timer size={18} className="text-gym-accent animate-pulse" />
                <span className="text-2xl font-mono font-bold text-gym-text tabular-nums">
                  {formatTime(seconds)}
                </span>
              </div>
              <button
                onClick={stop}
                className="p-2 rounded-lg bg-gym-border text-gym-muted hover:text-gym-text transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gym-surface/80 backdrop-blur-sm border-t border-gym-border px-4 py-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Timer size={14} className="text-gym-muted shrink-0" />
              <span className="text-xs text-gym-muted shrink-0">Rest:</span>
              {presets.map((s) => (
                <button
                  key={s}
                  onClick={() => start(s)}
                  className="shrink-0 px-3 py-1.5 rounded-md text-xs font-mono font-medium
                    bg-gym-border text-gym-muted hover:text-gym-text hover:bg-gym-accent/20
                    transition-colors"
                >
                  {s >= 60 ? `${s / 60}m` : `${s}s`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export { parseRest };
