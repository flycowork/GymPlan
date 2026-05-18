"use client";

import { useState, useEffect, useCallback } from "react";

// ── Weight Log ──
interface WeightEntry {
  exercise: string;
  week: number;
  value: string;
  programId?: string;
}

const WEIGHTS_KEY = "gym-tracker-weights";

export function useWeightLog() {
  const [weights, setWeights] = useState<WeightEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WEIGHTS_KEY);
      if (stored) setWeights(JSON.parse(stored));
    } catch {}
  }, []);

  const save = useCallback((entries: WeightEntry[]) => {
    setWeights(entries);
    localStorage.setItem(WEIGHTS_KEY, JSON.stringify(entries));
  }, []);

  const getWeight = useCallback(
    (programId: string, exercise: string, week: number) => {
      return (
        weights.find(
          (w) =>
            w.exercise === exercise &&
            w.week === week &&
            (w.programId ?? "phase-1") === programId
        )?.value || ""
      );
    },
    [weights]
  );

  const setWeight = useCallback(
    (programId: string, exercise: string, week: number, value: string) => {
      const filtered = weights.filter(
        (w) =>
          !(
            w.exercise === exercise &&
            w.week === week &&
            (w.programId ?? "phase-1") === programId
          )
      );
      const updated = value
        ? [...filtered, { exercise, week, value, programId }]
        : filtered;
      save(updated);
    },
    [weights, save]
  );

  return { getWeight, setWeight };
}

// ── Set Completion Tracking ──
interface CompletedSet {
  dayId: string;
  exerciseName: string;
  setIndex: number;
  week: number;
  programId?: string;
}

const SETS_KEY = "gym-tracker-sets";

export function useSetTracker() {
  const [completed, setCompleted] = useState<CompletedSet[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETS_KEY);
      if (stored) setCompleted(JSON.parse(stored));
    } catch {}
  }, []);

  const save = useCallback((entries: CompletedSet[]) => {
    setCompleted(entries);
    localStorage.setItem(SETS_KEY, JSON.stringify(entries));
  }, []);

  const isCompleted = useCallback(
    (
      programId: string,
      dayId: string,
      exerciseName: string,
      setIndex: number,
      week: number
    ) => {
      return completed.some(
        (c) =>
          (c.programId ?? "phase-1") === programId &&
          c.dayId === dayId &&
          c.exerciseName === exerciseName &&
          c.setIndex === setIndex &&
          c.week === week
      );
    },
    [completed]
  );

  const toggleSet = useCallback(
    (
      programId: string,
      dayId: string,
      exerciseName: string,
      setIndex: number,
      week: number
    ) => {
      const exists = completed.find(
        (c) =>
          (c.programId ?? "phase-1") === programId &&
          c.dayId === dayId &&
          c.exerciseName === exerciseName &&
          c.setIndex === setIndex &&
          c.week === week
      );
      if (exists) {
        save(
          completed.filter(
            (c) =>
              !(
                (c.programId ?? "phase-1") === programId &&
                c.dayId === dayId &&
                c.exerciseName === exerciseName &&
                c.setIndex === setIndex &&
                c.week === week
              )
          )
        );
      } else {
        save([...completed, { programId, dayId, exerciseName, setIndex, week }]);
      }
    },
    [completed, save]
  );

  const getCompletedCount = useCallback(
    (programId: string, dayId: string, week: number) => {
      return completed.filter(
        (c) =>
          (c.programId ?? "phase-1") === programId &&
          c.dayId === dayId &&
          c.week === week
      ).length;
    },
    [completed]
  );

  const getTotalSets = useCallback(
    (dayId: string, blocks: { exercises: { sets: string }[] }[]) => {
      let total = 0;
      for (const block of blocks) {
        for (const ex of block.exercises) {
          const sets = parseInt(ex.sets);
          total += isNaN(sets) ? 1 : sets;
        }
      }
      return total;
    },
    []
  );

  const resetDay = useCallback(
    (programId: string, dayId: string, week: number) => {
      save(
        completed.filter(
          (c) =>
            !(
              (c.programId ?? "phase-1") === programId &&
              c.dayId === dayId &&
              c.week === week
            )
        )
      );
    },
    [completed, save]
  );

  return { isCompleted, toggleSet, getCompletedCount, getTotalSets, resetDay };
}

// ── Current Week ──
const WEEK_KEY = "gym-tracker-week";

export function useCurrentWeek() {
  const [week, setWeekState] = useState(1);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WEEK_KEY);
      if (stored) setWeekState(parseInt(stored));
    } catch {}
  }, []);

  const setWeek = useCallback((w: number) => {
    setWeekState(w);
    localStorage.setItem(WEEK_KEY, String(w));
  }, []);

  return { week, setWeek };
}

// ── Current Program ──
const PROGRAM_KEY = "gym-tracker-program";

export function useCurrentProgram() {
  const [programId, setProgramIdState] = useState("phase-1");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROGRAM_KEY);
      if (stored) setProgramIdState(stored);
    } catch {}
  }, []);

  const setProgramId = useCallback((id: string) => {
    setProgramIdState(id);
    localStorage.setItem(PROGRAM_KEY, id);
  }, []);

  return { programId, setProgramId };
}

// ── Rest Timer (local-only, no sync needed) ──
export function useRestTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [targetSeconds, setTargetSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setIsRunning(false);
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const start = useCallback((secs: number) => {
    setTargetSeconds(secs);
    setSeconds(secs);
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    setSeconds(0);
  }, []);

  return { seconds, isRunning, targetSeconds, start, stop };
}
