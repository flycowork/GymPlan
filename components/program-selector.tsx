"use client";

import { programs, Program } from "@/lib/program-data";
import { useCurrentProgram } from "@/lib/hooks";
import { Dumbbell, ChevronRight, Lock } from "lucide-react";

interface Props {
  onSelectProgram: (programId: string) => void;
}

export default function ProgramSelector({ onSelectProgram }: Props) {
  const { programId, setProgramId } = useCurrentProgram();

  const handleSelect = (p: Program) => {
    if (p.status === "coming-soon") return;
    setProgramId(p.id);
    onSelectProgram(p.id);
  };

  const isCompleted = (p: Program) => p.status === "completed";

  return (
    <div className="min-h-screen bg-gym-bg">
      <div className="px-5 pt-12 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gym-accent/15 flex items-center justify-center">
            <Dumbbell size={20} className="text-gym-accent" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-gym-text">GymPlan</h1>
            <p className="text-xs text-gym-muted">Isaac's Training</p>
          </div>
        </div>
      </div>

      <div className="px-5 mb-3">
        <h2 className="text-[10px] uppercase tracking-widest text-gym-muted font-bold">
          Training Phases
        </h2>
      </div>

      <div className="px-5 space-y-3 pb-10">
        {programs.map((p) => {
          const isComingSoon = p.status === "coming-soon";
          const isActive = p.id === programId;
          const done = isCompleted(p);

          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p)}
              disabled={isComingSoon}
              className={`w-full text-left rounded-2xl border p-4 transition-all ${
                isComingSoon
                  ? "bg-gym-surface/40 border-gym-border opacity-50 cursor-default"
                  : isActive
                  ? "bg-gym-accent/5 border-gym-accent/30 active:scale-[0.98]"
                  : "bg-gym-surface border-gym-border hover:border-gym-accent/30 active:scale-[0.98]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-bold text-base text-gym-text">{p.name}</h3>
                    {isComingSoon && (
                      <span className="text-[9px] uppercase tracking-wider bg-gym-border text-gym-muted px-2 py-0.5 rounded-full font-bold">
                        Coming Soon
                      </span>
                    )}
                    {done && (
                      <span className="text-[9px] uppercase tracking-wider bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full font-bold">
                        Completed
                      </span>
                    )}
                    {isActive && !isComingSoon && !done && (
                      <span className="text-[9px] uppercase tracking-wider bg-gym-accent/20 text-gym-accent px-2 py-0.5 rounded-full font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gym-muted">{p.description}</p>
                  {!isComingSoon && (
                    <p className="text-[10px] text-gym-muted mt-1.5">
                      {p.weeks} weeks · {p.days.length} training days
                    </p>
                  )}
                </div>
                {isComingSoon ? (
                  <Lock size={16} className="text-gym-muted shrink-0" />
                ) : (
                  <ChevronRight size={16} className="text-gym-muted shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
