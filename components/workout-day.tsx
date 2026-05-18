"use client";

import { WorkoutDay, warmup } from "@/lib/program-data";
import { useCurrentWeek, useSetTracker } from "@/lib/hooks";
import ExerciseCard from "./exercise-card";
import WeightLog from "./weight-log";
import { ChevronLeft, RotateCcw } from "lucide-react";

interface Props {
  day: WorkoutDay;
  programId: string;
  onBack: () => void;
}

const typeColors = {
  strength: { bg: "bg-gym-strength/10", text: "text-gym-strength", border: "border-gym-strength/20" },
  conditioning: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  warmup: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
  full: { bg: "bg-gym-optional/10", text: "text-gym-optional", border: "border-gym-optional/20" },
};

export default function WorkoutDayView({ day, programId, onBack }: Props) {
  const { week } = useCurrentWeek();
  const { getCompletedCount, getTotalSets, resetDay } = useSetTracker();

  const completedSets = getCompletedCount(programId, day.id, week);
  const totalSets = getTotalSets(day.id, day.blocks);
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <div className="min-h-screen bg-gym-bg pb-24">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-gym-bg/90 backdrop-blur-md border-b border-gym-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gym-muted hover:text-gym-text transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm">Back</span>
          </button>
          <div className="text-center">
            <div className="text-xs text-gym-muted">Week {week}</div>
            <div className="text-sm font-display font-bold text-gym-text">
              Day {day.day}
            </div>
          </div>
          <button
            onClick={() => resetDay(programId, day.id, week)}
            className="p-2 text-gym-muted hover:text-gym-text transition-colors"
            title="Reset today"
          >
            <RotateCcw size={16} />
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-gym-border">
          <div
            className="h-full bg-gym-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Day header */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{day.emoji}</span>
          <div>
            <h1 className="font-display font-bold text-xl text-gym-text leading-tight">
              {day.title}
            </h1>
            <p className="text-xs text-gym-muted mt-0.5">{day.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div className="text-xs text-gym-muted">
            {completedSets}/{totalSets} sets
          </div>
          <div className="flex-1 h-1 rounded-full bg-gym-border">
            <div
              className="h-full rounded-full bg-gym-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs font-mono text-gym-accent">{Math.round(progress)}%</div>
        </div>
      </div>

      {/* Warm-up (collapsible) */}
      <details className="mx-4 mb-4 group">
        <summary className="flex items-center justify-between cursor-pointer list-none">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${typeColors.warmup.bg} ${typeColors.warmup.border} border w-full`}
          >
            <span className={`text-xs font-bold uppercase tracking-wider ${typeColors.warmup.text}`}>
              {warmup.label}
            </span>
            <span className="text-[10px] text-gym-muted ml-auto">
              {warmup.description} · tap to expand
            </span>
          </div>
        </summary>
        <div className="mt-2 space-y-2">
          {warmup.exercises.map((ex) => (
            <ExerciseCard
              key={ex.name}
              exercise={ex}
              programId={programId}
              dayId={day.id}
              week={week}
              blockType="warmup"
            />
          ))}
        </div>
      </details>

      {/* Workout blocks */}
      {day.blocks.map((block, bi) => {
        const colors = typeColors[block.type];
        return (
          <div key={bi} className="mx-4 mb-5">
            {/* Block header */}
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colors.bg} ${colors.border} border mb-3`}
            >
              <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                {block.label}
              </span>
              {block.description && (
                <span className="text-[10px] text-gym-muted ml-auto">
                  {block.description}
                </span>
              )}
            </div>

            {/* Exercises */}
            <div className="space-y-2">
              {block.exercises.map((ex) => (
                <ExerciseCard
                  key={ex.name}
                  exercise={ex}
                  programId={programId}
                  dayId={day.id}
                  week={week}
                  blockType={block.type}
                />
              ))}
            </div>

            {/* Footer note */}
            {block.footer && (
              <p className="text-[11px] text-gym-muted mt-2 px-1 italic">
                {block.footer}
              </p>
            )}
          </div>
        );
      })}

      {/* Weight log */}
      {day.logExercises && (
        <div className="mx-4">
          <WeightLog exercises={day.logExercises} programId={programId} dayId={day.id} />
        </div>
      )}
    </div>
  );
}
