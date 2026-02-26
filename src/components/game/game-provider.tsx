"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  GameChoice,
  GameProgress,
} from "@/lib/game-types";
import { initialGameProgress } from "@/lib/game-engine";

const STORAGE_KEY = "xt-game-progress";

type GameContextValue = {
  progress: GameProgress;
  hydrated: boolean;
  startGame: () => void;
  resetGame: () => void;
  chooseForStep: (stepId: string, choice: GameChoice) => void;
};

const GameContext = createContext<GameContextValue | null>(null);

type GameProviderProps = {
  children: React.ReactNode;
};

export function GameProvider({ children }: GameProviderProps) {
  const [progress, setProgress] = useState<GameProgress>(initialGameProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GameProgress;
        setProgress(parsed);
      }
    } catch {
      setProgress(initialGameProgress);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [hydrated, progress]);

  const startGame = useCallback(() => {
    setProgress({ ...initialGameProgress, started: true });
  }, []);

  const resetGame = useCallback(() => {
    setProgress(initialGameProgress);
  }, []);

  const chooseForStep = useCallback((stepId: string, choice: GameChoice) => {
    setProgress((prev) => {
      const existing = prev.choices[stepId];
      const nextScore = prev.score - (existing?.score ?? 0) + choice.score;

      return {
        ...prev,
        started: true,
        score: nextScore,
        choices: {
          ...prev.choices,
          [stepId]: {
            choiceId: choice.id,
            score: choice.score,
          },
        },
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      progress,
      hydrated,
      startGame,
      resetGame,
      chooseForStep,
    }),
    [progress, hydrated, startGame, resetGame, chooseForStep],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }

  return context;
}