"use client";

import { GameProvider } from "@/components/game/game-provider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <GameProvider>{children}</GameProvider>;
}