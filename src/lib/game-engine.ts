import flow from "@/content/game/flow.json";
import { GameFlow, GameProgress } from "@/lib/game-types";

export const gameFlow = flow as GameFlow;

export const gameStepIds = gameFlow.steps.map((step) => step.id);

export const initialGameProgress: GameProgress = {
  started: false,
  score: 0,
  choices: {},
};

export function getStepById(stepId: string) {
  return gameFlow.steps.find((step) => step.id === stepId);
}

export function getNextUnlockedStep(progress: GameProgress) {
  if (!progress.started) {
    return gameStepIds[0];
  }

  if (isGameComplete(progress)) {
    return "ket-qua";
  }

  const answered = Object.keys(progress.choices).length;
  return gameStepIds[Math.min(answered, gameStepIds.length - 1)] ?? gameStepIds[0];
}

export function isStepUnlocked(stepId: string, progress: GameProgress) {
  const targetIndex = gameStepIds.indexOf(stepId);
  if (targetIndex === -1) {
    return false;
  }

  const answeredCount = Object.keys(progress.choices).length;
  return progress.started && targetIndex <= answeredCount;
}

export function getResultBand(score: number) {
  return (
    gameFlow.resultBands.find((band) => score >= band.min && score <= band.max) ??
    gameFlow.resultBands[gameFlow.resultBands.length - 1]
  );
}

export function isGameComplete(progress: GameProgress) {
  return gameStepIds.every((stepId) => Boolean(progress.choices[stepId]));
}
