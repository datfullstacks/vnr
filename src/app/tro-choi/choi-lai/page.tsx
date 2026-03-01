"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/components/game/game-provider";

export default function ChoiLaiPage() {
  const router = useRouter();
  const { resetGame } = useGame();

  useEffect(() => {
    resetGame();
    router.replace("/tro-choi/intro");
  }, [resetGame, router]);

  return <section className="paper-panel">Đang khởi tạo lại trò chơi...</section>;
}
