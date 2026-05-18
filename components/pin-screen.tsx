"use client";

import { useState, useEffect, useCallback } from "react";
import { Delete, Dumbbell } from "lucide-react";

interface Props {
  onAuthenticated: () => void;
}

export default function PinScreen({ onAuthenticated }: Props) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = useCallback(async (value: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: value }),
      });
      if (res.ok) {
        onAuthenticated();
      } else {
        setPin("");
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setPin("");
    } finally {
      setLoading(false);
    }
  }, [loading, onAuthenticated]);

  const press = useCallback((digit: string) => {
    setPin((prev) => {
      if (prev.length >= 6) return prev;
      const next = prev + digit;
      if (next.length === 6) {
        // auto-submit when full
        setTimeout(() => submit(next), 0);
      }
      return next;
    });
  }, [submit]);

  const del = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") press(e.key);
      if (e.key === "Backspace") del();
      if (e.key === "Enter" && pin.length >= 4) submit(pin);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [press, del, pin, submit]);

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

  return (
    <div className="min-h-screen bg-gym-bg flex flex-col items-center justify-center px-8">
      {/* Logo */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-14 h-14 rounded-2xl bg-gym-accent/15 flex items-center justify-center mb-4">
          <Dumbbell size={26} className="text-gym-accent" />
        </div>
        <h1 className="font-display font-bold text-xl text-gym-text">Gym Tracker</h1>
        <p className="text-sm text-gym-muted mt-1">Enter your PIN</p>
      </div>

      {/* PIN dots */}
      <div
        className={`flex gap-4 mb-10 transition-transform ${
          shake ? "animate-shake" : ""
        }`}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
              i < pin.length
                ? "bg-gym-accent scale-110"
                : "bg-gym-border"
            }`}
          />
        ))}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
        {digits.map((d, i) => {
          if (d === "") return <div key={i} />;
          if (d === "del") {
            return (
              <button
                key={i}
                onClick={del}
                disabled={loading}
                className="h-16 rounded-2xl bg-gym-surface border border-gym-border flex items-center justify-center text-gym-muted hover:text-gym-text hover:border-gym-accent/30 transition-all active:scale-95 disabled:opacity-40"
              >
                <Delete size={20} />
              </button>
            );
          }
          return (
            <button
              key={i}
              onClick={() => press(d)}
              disabled={loading}
              className="h-16 rounded-2xl bg-gym-surface border border-gym-border font-display font-bold text-xl text-gym-text hover:border-gym-accent/40 hover:bg-gym-accent/5 transition-all active:scale-95 disabled:opacity-40"
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
