"use client";

import { Exercise } from "@/lib/program-data";
import { useSetTracker } from "@/lib/hooks";
import { Check } from "lucide-react";

interface Props {
  exercise: Exercise;
  programId: string;
  dayId: string;
  week: number;
  blockType: "strength" | "conditioning" | "warmup" | "full";
}

export default function ExerciseCard({ exercise, programId, dayId, week, blockType }: Props) {
  const { isCompleted, toggleSet } = useSetTracker();
  const numSets = parseInt(exercise.sets);
  const hasSets = !isNaN(numSets) && numSets > 0;

  const allDone =
    hasSets &&
    Array.from({ length: numSets }, (_, i) =>
      isCompleted(programId, dayId, exercise.name, i, week)
    ).every(Boolean);

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        allDone
          ? "bg-gym-accent/5 border-gym-accent/20"
          : "bg-gym-surface border-gym-border"
      }`}
    >
      <div className="px-4 py-3">
        {/* Exercise name + reps */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4
              className={`font-display font-semibold text-sm leading-tight ${
                allDone ? "text-gym-accent" : "text-gym-text"
              }`}
            >
              {exercise.name}
            </h4>
            <p className="text-xs text-gym-muted mt-0.5">{exercise.notes}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-mono text-sm font-bold text-gym-text">
              {exercise.reps}
            </div>
            {exercise.rest !== "—" && exercise.rest !== "-" && (
              <div className="text-[10px] text-gym-muted mt-0.5">
                rest {exercise.rest}
              </div>
            )}
          </div>
        </div>

        {/* Set checkboxes */}
        {hasSets && blockType !== "warmup" && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] text-gym-muted uppercase tracking-wider">
              Sets
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: numSets }, (_, i) => {
                const done = isCompleted(programId, dayId, exercise.name, i, week);
                return (
                  <button
                    key={i}
                    onClick={() => toggleSet(programId, dayId, exercise.name, i, week)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all duration-150 active:scale-90 ${
                      done
                        ? "bg-gym-accent text-white shadow-lg shadow-gym-accent/25"
                        : "bg-gym-border text-gym-muted hover:text-gym-text"
                    }`}
                  >
                    {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Conditioning: single complete toggle */}
        {!hasSets && blockType !== "warmup" && (
          <div className="mt-2">
            <button
              onClick={() => toggleSet(programId, dayId, exercise.name, 0, week)}
              className={`px-3 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold transition-all active:scale-95 ${
                isCompleted(programId, dayId, exercise.name, 0, week)
                  ? "bg-gym-accent/15 text-gym-accent"
                  : "bg-gym-border text-gym-muted hover:text-gym-text"
              }`}
            >
              {isCompleted(programId, dayId, exercise.name, 0, week) ? "✓ Done" : "Mark done"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
