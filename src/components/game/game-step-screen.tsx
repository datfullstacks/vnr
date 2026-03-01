"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GameChoice, GameStep } from "@/lib/game-types";
import styles from "./game-step-screen.module.css";

type GameStepScreenProps = {
  step: GameStep;
  selectedChoiceId?: string;
  onChoose: (choice: GameChoice) => void;
};

function toCardLabel(label: string) {
  return label.toUpperCase();
}

function formatScore(score: number) {
  return score > 0 ? `+${score}` : `${score}`;
}

export function GameStepScreen({
  step,
  selectedChoiceId,
  onChoose,
}: GameStepScreenProps) {
  const [localSelection, setLocalSelection] = useState<{
    stepId: string;
    choiceId?: string;
  }>({
    stepId: step.id,
    choiceId: selectedChoiceId,
  });

  const previewChoiceId =
    localSelection.stepId === step.id && localSelection.choiceId !== undefined
      ? localSelection.choiceId
      : selectedChoiceId;

  const previewChoice = useMemo(
    () => step.choices.find((choice) => choice.id === previewChoiceId),
    [step.choices, previewChoiceId],
  );

  return (
    <article className={styles.page}>
      <section className={styles.mainPanel}>
        <header className={styles.titleBar}>
          <h1>{step.title.toUpperCase()}</h1>
        </header>

        <div className={styles.contextBlock}>
          <h2>Bối cảnh</h2>
          {step.scenario ? <p className={styles.contextLead}>{step.scenario}</p> : null}
          <p className={styles.teacherLabel}>Giảng viên:</p>
          <p className={styles.teacherQuote}>&ldquo;{step.context}&rdquo;</p>
          <p className={styles.chooseLabel}>Bạn chọn:</p>
        </div>

        <section className={styles.choiceGrid} aria-label="Danh sách lựa chọn">
          {step.choices.map((choice) => {
            const active = previewChoiceId === choice.id;

            return (
              <button
                key={choice.id}
                type="button"
                onClick={() =>
                  setLocalSelection({
                    stepId: step.id,
                    choiceId: choice.id,
                  })
                }
                className={active ? `${styles.choiceCard} ${styles.choiceCardActive}` : styles.choiceCard}
              >
                <div className={styles.choiceTop}>
                  <span className={styles.choiceLabel}>{toCardLabel(choice.label)}</span>
                </div>
              </button>
            );
          })}
        </section>

        {previewChoice ? (
          <section className={styles.resultReveal} aria-live="polite">
            <div className={styles.choiceBottom}>
              <p className={styles.choiceDescription}>{previewChoice.description}</p>

              <div className={styles.choiceFooter}>
                <span className={styles.choiceScore}>{formatScore(previewChoice.score)} điểm</span>
                <button
                  type="button"
                  className={styles.choiceArrow}
                  onClick={() => onChoose(previewChoice)}
                  aria-label={`Xác nhận lựa chọn ${previewChoice.label}`}
                >
                  →
                </button>
              </div>
            </div>
          </section>
        ) : (
          <p className={styles.choiceHint}>Chọn một phương án để xem kết quả.</p>
        )}
      </section>

      <div className={styles.backWrap}>
        <Link href="/tro-choi/intro" className={styles.backButton}>
          Quay về
        </Link>
      </div>
    </article>
  );
}
