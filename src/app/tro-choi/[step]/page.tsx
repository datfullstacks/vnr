import { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameFlowPage } from "@/components/game/game-flow-page";
import { gameStepIds } from "@/lib/game-engine";

const validStepSet = new Set(["intro", "ket-qua", ...gameStepIds]);

type GameStepRouteProps = {
  params: {
    step: string;
  };
};

export function generateStaticParams() {
  return [...validStepSet].map((step) => ({ step }));
}

export function generateMetadata({ params }: GameStepRouteProps): Metadata {
  return {
    title: `Tro choi - ${params.step}`,
  };
}

export default function GameStepRoutePage({ params }: GameStepRouteProps) {
  if (!validStepSet.has(params.step)) {
    notFound();
  }

  return <GameFlowPage stepId={params.step} />;
}