"use client";

import { useMemo, useState } from "react";

type QuizQuestion = {
  id: string;
  question: string;
  answers: {
    id: string;
    label: string;
    score: number;
  }[];
};

const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Khi gap mot thong tin nong tren mang, ban thuong lam gi dau tien?",
    answers: [
      { id: "a", label: "Kiem chung nguon", score: 2 },
      { id: "b", label: "Hoi nguoi co chuyen mon", score: 1 },
      { id: "c", label: "Chia se ngay", score: -1 },
    ],
  },
  {
    id: "q2",
    question: "Ban chon cach nao de dong gop cho cong dong?",
    answers: [
      { id: "a", label: "Lam du an co ke hoach", score: 2 },
      { id: "b", label: "Tham gia theo dot", score: 1 },
      { id: "c", label: "Chi tham gia khi bi ep", score: -1 },
    ],
  },
  {
    id: "q3",
    question: "Trong hoc tap, ban uu tien dieu gi?",
    answers: [
      { id: "a", label: "Ky nang dai han", score: 2 },
      { id: "b", label: "Can bang hoc va lam", score: 1 },
      { id: "c", label: "Ket qua ngan han", score: -1 },
    ],
  },
];

function getQuizResult(score: number) {
  if (score >= 5) {
    return "Muc nhiet huyet cao: Ban co xu huong lua chon ben vung va co trach nhiem.";
  }

  if (score >= 2) {
    return "Muc nhiet huyet kha: Ban dang di dung huong, can tang tinh kien tri.";
  }

  return "Muc nhiet huyet thap: Nen dat lai uu tien hoc tap va dong gop xa hoi.";
}

export default function QuizPage() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const question = quizQuestions[index];
  const progressText = useMemo(
    () => `Cau ${Math.min(index + 1, quizQuestions.length)}/${quizQuestions.length}`,
    [index],
  );

  const handleAnswer = (point: number) => {
    const nextScore = score + point;
    const isLast = index >= quizQuestions.length - 1;

    if (isLast) {
      setScore(nextScore);
      setDone(true);
      return;
    }

    setScore(nextScore);
    setIndex((prev) => prev + 1);
  };

  const resetQuiz = () => {
    setIndex(0);
    setScore(0);
    setDone(false);
  };

  return (
    <article className="paper-panel game-panel">
      <header className="page-header">
        <p className="page-kicker">Game phu</p>
        <h1 className="page-title">Bo cau hoi quiz</h1>
        <p className="page-lead">Che do nhanh de danh gia muc do nhiet huyet theo cach lua chon cua ban.</p>
      </header>

      {done ? (
        <section className="content-section">
          <h2 className="section-title">Ket qua quiz</h2>
          <p>Tong diem: {score}</p>
          <p>{getQuizResult(score)}</p>
          <button type="button" className="primary-button" onClick={resetQuiz}>
            Lam lai quiz
          </button>
        </section>
      ) : (
        <section className="content-section">
          <p className="quiz-progress">{progressText}</p>
          <h2 className="section-title">{question.question}</h2>
          <div className="choice-grid">
            {question.answers.map((answer) => (
              <button
                type="button"
                key={answer.id}
                className="choice-card"
                onClick={() => handleAnswer(answer.score)}
              >
                <h3>{answer.label}</h3>
                <p>Diem: {answer.score > 0 ? `+${answer.score}` : answer.score}</p>
              </button>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}