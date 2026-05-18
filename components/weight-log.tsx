"use client";

import { useWeightLog, useCurrentWeek } from "@/lib/hooks";

interface Props {
  exercises: string[];
  programId: string;
  dayId: string;
}

export default function WeightLog({ exercises, programId, dayId }: Props) {
  const { getWeight, setWeight } = useWeightLog();
  const { week } = useCurrentWeek();
  const weeks = [1, 2, 3, 4];

  return (
    <div className="mt-6">
      <h3 className="text-xs uppercase tracking-wider text-gym-muted font-semibold mb-3 px-1">
        Weight Log
      </h3>
      <div className="rounded-xl border border-gym-border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr,repeat(4,3.5rem)] bg-gym-border/50">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-gym-muted font-semibold">
            Exercise
          </div>
          {weeks.map((w) => (
            <div
              key={w}
              className={`px-2 py-2 text-center text-[10px] uppercase tracking-wider font-semibold ${
                w === week ? "text-gym-accent" : "text-gym-muted"
              }`}
            >
              Wk{w}
            </div>
          ))}
        </div>

        {/* Rows */}
        {exercises.map((ex, i) => (
          <div
            key={ex}
            className={`grid grid-cols-[1fr,repeat(4,3.5rem)] ${
              i % 2 === 0 ? "bg-gym-surface" : "bg-gym-bg"
            }`}
          >
            <div className="px-3 py-2 text-xs text-gym-text font-medium truncate self-center">
              {ex}
            </div>
            {weeks.map((w) => (
              <div key={w} className="px-1 py-1.5 flex items-center justify-center">
                <input
                  type="text"
                  inputMode="text"
                  value={getWeight(programId, `${dayId}-${ex}`, w)}
                  onChange={(e) => setWeight(programId, `${dayId}-${ex}`, w, e.target.value)}
                  placeholder="—"
                  className={`w-full h-7 text-center text-xs font-mono rounded-md border transition-colors
                    bg-transparent placeholder:text-gym-border
                    focus:outline-none focus:border-gym-accent focus:ring-1 focus:ring-gym-accent/30
                    ${
                      w === week
                        ? "border-gym-accent/30 text-gym-text"
                        : "border-gym-border text-gym-muted"
                    }`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
