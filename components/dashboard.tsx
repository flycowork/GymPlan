"use client";

import { programs } from "@/lib/program-data";
import { useCurrentWeek, useSetTracker, useCurrentProgram } from "@/lib/hooks";
import { ChevronLeft, ChevronRight, Dumbbell } from "lucide-react";

interface Props {
  onSelectDay: (dayId: string) => void;
  onBack: () => void;
}

export default function Dashboard({ onSelectDay, onBack }: Props) {
  const { week, setWeek } = useCurrentWeek();
  const { programId } = useCurrentProgram();
  const { getCompletedCount, getTotalSets } = useSetTracker();

  const currentProgram = programs.find((p) => p.id === programId) ?? programs[0];
  const weekCount = currentProgram.weeks;

  return (
    <div className="min-h-screen bg-gym-bg">
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gym-muted hover:text-gym-text transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          <span className="text-xs">Phases</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gym-accent/15 flex items-center justify-center">
            <Dumbbell size={18} className="text-gym-accent" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-gym-text">
              {currentProgram.name}
            </h1>
            <p className="text-xs text-gym-muted">{currentProgram.description}</p>
          </div>
        </div>
      </div>

      {/* Week selector */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gym-surface border border-gym-border">
          {Array.from({ length: weekCount }, (_, i) => i + 1).map((w) => (
            <button
              key={w}
              onClick={() => setWeek(w)}
              className={`flex-1 py-2 rounded-lg text-xs font-display font-semibold transition-all ${
                w === week
                  ? "bg-gym-accent text-white shadow-lg shadow-gym-accent/20"
                  : "text-gym-muted hover:text-gym-text"
              }`}
            >
              Week {w}
              {w <= Math.floor(weekCount / 2) && (
                <span className="block text-[9px] opacity-60 font-normal mt-0.5">
                  Foundation
                </span>
              )}
              {w > Math.floor(weekCount / 2) && (
                <span className="block text-[9px] opacity-60 font-normal mt-0.5">
                  Build
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Core days */}
      <div className="px-5 mb-2">
        <h2 className="text-[10px] uppercase tracking-widest text-gym-muted font-bold mb-3">
          Core Training
        </h2>
      </div>

      <div className="px-5 space-y-3 mb-6">
        {currentProgram.days
          .filter((d) => d.type === "core")
          .map((day) => {
            const completed = getCompletedCount(programId, day.id, week);
            const total = getTotalSets(day.id, day.blocks);
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            const isDone = pct === 100;

            return (
              <button
                key={day.id}
                onClick={() => onSelectDay(day.id)}
                className={`w-full text-left rounded-2xl border p-4 transition-all active:scale-[0.98] ${
                  isDone
                    ? "bg-gym-accent/5 border-gym-accent/20"
                    : "bg-gym-surface border-gym-border hover:border-gym-accent/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{day.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-sm text-gym-text">
                        Day {day.day} — {day.title}
                      </h3>
                      <ChevronRight size={16} className="text-gym-muted shrink-0" />
                    </div>
                    <p className="text-[11px] text-gym-muted mt-0.5">{day.subtitle}</p>
                    {/* Progress */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1 rounded-full bg-gym-border">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isDone ? "bg-gym-accent" : "bg-gym-accent/60"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-gym-muted w-8 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
      </div>

      {/* Optional days */}
      <div className="px-5 mb-2">
        <h2 className="text-[10px] uppercase tracking-widest text-gym-muted font-bold mb-3">
          Optional
        </h2>
      </div>

      <div className="px-5 space-y-3 pb-8">
        {currentProgram.days
          .filter((d) => d.type === "optional")
          .map((day) => {
            const completed = getCompletedCount(programId, day.id, week);
            const total = getTotalSets(day.id, day.blocks);
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <button
                key={day.id}
                onClick={() => onSelectDay(day.id)}
                className="w-full text-left rounded-2xl border border-gym-border bg-gym-surface p-4
                  hover:border-gym-optional/30 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{day.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-sm text-gym-text">
                        Day {day.day} — {day.title}
                      </h3>
                      <ChevronRight size={16} className="text-gym-muted shrink-0" />
                    </div>
                    <p className="text-[11px] text-gym-muted mt-0.5">{day.subtitle}</p>
                    {pct > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1 rounded-full bg-gym-border">
                          <div
                            className="h-full rounded-full bg-gym-optional/60 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-gym-muted w-8 text-right">
                          {pct}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
      </div>

      {/* Key rules reminder */}
      <div className="px-5 pb-10">
        <div className="rounded-2xl border border-gym-border bg-gym-surface/50 p-4">
          <h3 className="text-[10px] uppercase tracking-widest text-gym-muted font-bold mb-2">
            Remember
          </h3>
          <ul className="space-y-1.5 text-xs text-gym-muted">
            <li>→ <span className="text-gym-text font-medium">Strength = straight sets.</span> All sets of A, then B.</li>
            <li>→ <span className="text-gym-text font-medium">Conditioning = circuit.</span> Back-to-back, rest between rounds.</li>
            <li>→ RPE 7 for strength. RPE 8 for conditioning.</li>
            <li>→ Track weights. Protein within the hour.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
