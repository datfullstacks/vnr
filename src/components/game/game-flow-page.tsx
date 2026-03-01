"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useGame } from "@/components/game/game-provider";
import { GameStepScreen } from "@/components/game/game-step-screen";
import {
  gameFlow,
  getNextUnlockedStep,
  getResultBand,
  getStepById,
  isGameComplete,
  isStepUnlocked,
} from "@/lib/game-engine";

type GameFlowPageProps = {
  stepId: string;
};

export function GameFlowPage({ stepId }: GameFlowPageProps) {
  const router = useRouter();
  const { progress, hydrated, startGame, chooseForStep, resetGame } = useGame();

  const step = useMemo(() => getStepById(stepId), [stepId]);

  if (!hydrated) {
    return <section className="paper-panel">Đang tải tiến trình game...</section>;
  }

  if (stepId === "intro") {
    const continueStep = getNextUnlockedStep(progress);

    return (
      <article className="paper-panel game-panel">
        <header className="page-header">
          <p className="page-kicker">Trò chơi tương tác</p>
          <h1 className="page-title">{gameFlow.intro.title}</h1>
          <p className="page-lead">{gameFlow.overview}</p>
        </header>

        <section className="content-section">
          <ul className="game-list">
            {gameFlow.intro.summary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <div className="game-actions">
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              startGame();
              router.push(`/tro-choi/${gameFlow.intro.next}`);
            }}
          >
            Bắt đầu
          </button>

          {progress.started ? (
            <Link className="secondary-button" href={`/tro-choi/${continueStep}`}>
              Tiếp tục
            </Link>
          ) : null}
        </div>
      </article>
    );
  }

  if (stepId === "ket-qua") {
    if (!progress.started) {
      return (
        <article className="paper-panel game-panel">
          <h1 className="page-title">Bạn chưa bắt đầu game</h1>
          <p>Hãy quay về màn intro để bắt đầu hành trình.</p>
          <Link href="/tro-choi/intro" className="primary-button">
            Về intro
          </Link>
        </article>
      );
    }

    if (!isGameComplete(progress)) {
      return (
        <article className="paper-panel game-panel">
          <h1 className="page-title">Bạn chưa hoàn thành 4 phần</h1>
          <p>Cần hoàn thành đầy đủ các bước để mở kết quả tổng kết.</p>
          <Link href={`/tro-choi/${getNextUnlockedStep(progress)}`} className="primary-button">
            Tiếp tục chơi
          </Link>
        </article>
      );
    }

    const result = getResultBand(progress.score);

    return (
      <article className="paper-panel game-panel">
        <header className="page-header">
          <p className="page-kicker">Kết quả tổng kết</p>
          <h1 className="page-title">{result.title}</h1>
          <p className="page-lead">Tổng điểm: {progress.score}/8</p>
        </header>

        <section className="content-section">
          <p>{result.text}</p>
          <div className="decision-list">
            {gameFlow.steps.map((flowStep) => {
              const picked = progress.choices[flowStep.id];
              const choice = flowStep.choices.find((item) => item.id === picked?.choiceId);

              return (
                <article key={flowStep.id} className="decision-item">
                  <h3>{flowStep.title}</h3>
                  <p>{choice?.label ?? "Chưa lựa chọn"}</p>
                </article>
              );
            })}
          </div>
        </section>

        <div className="game-actions">
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              resetGame();
              router.push("/tro-choi/intro");
            }}
          >
            Chơi lại
          </button>
          <Link href="/tro-choi" className="secondary-button">
            Quay lại landing
          </Link>
        </div>
      </article>
    );
  }

  if (!step) {
    return (
      <article className="paper-panel game-panel">
        <h1 className="page-title">Không tìm thấy bước game</h1>
        <Link href="/tro-choi" className="primary-button">
          Về landing
        </Link>
      </article>
    );
  }

  if (!progress.started) {
    return (
      <article className="paper-panel game-panel">
        <h1 className="page-title">Bạn chưa bắt đầu game</h1>
        <p>Hệ thống sẽ mở bước này sau khi bạn nhấn Bắt đầu ở màn intro.</p>
        <Link href="/tro-choi/intro" className="primary-button">
          Đi đến intro
        </Link>
      </article>
    );
  }

  if (!isStepUnlocked(step.id, progress)) {
    return (
      <article className="paper-panel game-panel">
        <h1 className="page-title">Bước này chưa mở</h1>
        <p>Hãy đi lần lượt theo flow để giữ logic game.</p>
        <Link href={`/tro-choi/${getNextUnlockedStep(progress)}`} className="primary-button">
          Đi đến bước tiếp theo
        </Link>
      </article>
    );
  }

  const selectedChoiceId = progress.choices[step.id]?.choiceId;

  return (
    <GameStepScreen
      step={step}
      selectedChoiceId={selectedChoiceId}
      onChoose={(choice) => {
        chooseForStep(step.id, choice);
        router.push(`/tro-choi/${choice.next}`);
      }}
    />
  );
}
