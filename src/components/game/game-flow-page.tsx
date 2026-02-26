"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useGame } from "@/components/game/game-provider";
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
    return <section className="paper-panel">Dang tai tien trinh game...</section>;
  }

  if (stepId === "intro") {
    const continueStep = getNextUnlockedStep(progress);

    return (
      <article className="paper-panel game-panel">
        <header className="page-header">
          <p className="page-kicker">Tro choi tuong tac</p>
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
            Bat dau
          </button>

          {progress.started ? (
            <Link className="secondary-button" href={`/tro-choi/${continueStep}`}>
              Tiep tuc
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
          <h1 className="page-title">Ban chua bat dau game</h1>
          <p>Hay quay ve man intro de bat dau hanh trinh.</p>
          <Link href="/tro-choi/intro" className="primary-button">
            Ve intro
          </Link>
        </article>
      );
    }

    if (!isGameComplete(progress)) {
      return (
        <article className="paper-panel game-panel">
          <h1 className="page-title">Ban chua hoan thanh 4 phan</h1>
          <p>Can hoan thanh day du cac buoc de mo ket qua tong ket.</p>
          <Link href={`/tro-choi/${getNextUnlockedStep(progress)}`} className="primary-button">
            Tiep tuc choi
          </Link>
        </article>
      );
    }

    const result = getResultBand(progress.score);

    return (
      <article className="paper-panel game-panel">
        <header className="page-header">
          <p className="page-kicker">Ket qua tong ket</p>
          <h1 className="page-title">{result.title}</h1>
          <p className="page-lead">Tong diem: {progress.score}/8</p>
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
                  <p>{choice?.label ?? "Chua lua chon"}</p>
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
            Choi lai
          </button>
          <Link href="/tro-choi" className="secondary-button">
            Quay lai landing
          </Link>
        </div>
      </article>
    );
  }

  if (!step) {
    return (
      <article className="paper-panel game-panel">
        <h1 className="page-title">Khong tim thay buoc game</h1>
        <Link href="/tro-choi" className="primary-button">
          Ve landing
        </Link>
      </article>
    );
  }

  if (!progress.started) {
    return (
      <article className="paper-panel game-panel">
        <h1 className="page-title">Ban chua bat dau game</h1>
        <p>He thong se mo buoc nay sau khi ban nhan Bat dau o man intro.</p>
        <Link href="/tro-choi/intro" className="primary-button">
          Di den intro
        </Link>
      </article>
    );
  }

  if (!isStepUnlocked(step.id, progress)) {
    return (
      <article className="paper-panel game-panel">
        <h1 className="page-title">Buoc nay chua mo</h1>
        <p>Hay di lan luot theo flow de giu logic game.</p>
        <Link href={`/tro-choi/${getNextUnlockedStep(progress)}`} className="primary-button">
          Di den buoc tiep theo
        </Link>
      </article>
    );
  }

  const selected = progress.choices[step.id];
  const selectedChoice = step.choices.find((choice) => choice.id === selected?.choiceId);

  return (
    <article className="paper-panel game-panel">
      <header className="page-header">
        <p className="page-kicker">Tro choi - lua chon theo chu de</p>
        <h1 className="page-title">{step.title}</h1>
        <p className="page-lead">{step.context}</p>
      </header>

      <section className="quote-banner">
        <blockquote>{step.quote}</blockquote>
      </section>

      <section className="choice-grid" aria-label="Danh sach lua chon">
        {step.choices.map((choice) => {
          const active = selected?.choiceId === choice.id;

          return (
            <button
              key={choice.id}
              type="button"
              className={active ? "choice-card choice-card-active" : "choice-card"}
              onClick={() => chooseForStep(step.id, choice)}
            >
              <h3>{choice.label}</h3>
              <p>{choice.description}</p>
              <p className="choice-score">Diem: +{choice.score}</p>
            </button>
          );
        })}
      </section>

      <div className="game-actions">
        {selectedChoice ? (
          <Link href={`/tro-choi/${selectedChoice.next}`} className="primary-button">
            Tiep tuc
          </Link>
        ) : (
          <p className="hint-text">Chon mot phuong an de tiep tuc.</p>
        )}
      </div>
    </article>
  );
}