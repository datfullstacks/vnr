import { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameFlowPage } from "@/components/game/game-flow-page";
import { gameStepIds } from "@/lib/game-engine";

const validStepSet = new Set(["intro", "ket-qua", ...gameStepIds]);

type GameStepRouteProps = {
  params: Promise<{
    step: string;
  }>;
};

export function generateStaticParams() {
  return [...validStepSet].map((step) => ({ step }));
}

export async function generateMetadata({
  params,
}: GameStepRouteProps): Promise<Metadata> {
  const { step } = await params;

  return {
    title: `Trò chơi - ${step}`,
  };
}

export default async function GameStepRoutePage({ params }: GameStepRouteProps) {
  const { step } = await params;

  if (!validStepSet.has(step)) {
    notFound();
  }

  return <GameFlowPage stepId={step} />;
}
