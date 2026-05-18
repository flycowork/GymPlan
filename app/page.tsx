"use client";

import { useState, useEffect } from "react";
import { programs } from "@/lib/program-data";
import { useCurrentProgram } from "@/lib/hooks";
import ProgramSelector from "@/components/program-selector";
import Dashboard from "@/components/dashboard";
import WorkoutDayView from "@/components/workout-day";
import RestTimer from "@/components/rest-timer";
import PinScreen from "@/components/pin-screen";

type View = "programs" | "dashboard" | "workout";

export default function Home() {
  const [view, setView] = useState<View>("programs");
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [authState, setAuthState] = useState<"checking" | "required" | "ok">("checking");
  const { programId, setProgramId } = useCurrentProgram();

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then(({ authenticated }) => {
        setAuthState(authenticated ? "ok" : "required");
      })
      .catch(() => setAuthState("ok"));
  }, []);

  const currentProgram = programs.find((p) => p.id === programId) ?? programs[0];
  const activeDay = activeDayId
    ? currentProgram.days.find((d) => d.id === activeDayId) || null
    : null;

  const handleSelectProgram = (id: string) => {
    setProgramId(id);
    setView("dashboard");
  };

  const handleSelectDay = (dayId: string) => {
    setActiveDayId(dayId);
    setView("workout");
  };

  const handleBackToDashboard = () => {
    setActiveDayId(null);
    setView("dashboard");
  };

  const handleBackToPrograms = () => {
    setView("programs");
  };

  if (authState === "checking") {
    return (
      <main className="max-w-lg mx-auto min-h-screen flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-gym-accent animate-pulse" />
      </main>
    );
  }

  if (authState === "required") {
    return (
      <main className="max-w-lg mx-auto min-h-screen">
        <PinScreen onAuthenticated={() => setAuthState("ok")} />
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto min-h-screen relative">
      {view === "programs" && (
        <ProgramSelector onSelectProgram={handleSelectProgram} />
      )}
      {view === "dashboard" && (
        <Dashboard onSelectDay={handleSelectDay} onBack={handleBackToPrograms} />
      )}
      {view === "workout" && activeDay && (
        <WorkoutDayView
          day={activeDay}
          programId={programId}
          onBack={handleBackToDashboard}
        />
      )}
      <RestTimer />
    </main>
  );
}
