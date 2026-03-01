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
    question: "Khi gặp một thông tin nóng trên mạng, bạn thường làm gì đầu tiên?",
    answers: [
      { id: "a", label: "Kiểm chứng nguồn", score: 2 },
      { id: "b", label: "Hỏi người có chuyên môn", score: 1 },
      { id: "c", label: "Chia sẻ ngay", score: -1 },
    ],
  },
  {
    id: "q2",
    question: "Bạn chọn cách nào để đóng góp cho cộng đồng?",
    answers: [
      { id: "a", label: "Làm dự án có kế hoạch", score: 2 },
      { id: "b", label: "Tham gia theo đợt", score: 1 },
      { id: "c", label: "Chỉ tham gia khi bị ép", score: -1 },
    ],
  },
  {
    id: "q3",
    question: "Trong học tập, bạn ưu tiên điều gì?",
    answers: [
      { id: "a", label: "Kỹ năng dài hạn", score: 2 },
      { id: "b", label: "Cân bằng học và làm", score: 1 },
      { id: "c", label: "Kết quả ngắn hạn", score: -1 },
    ],
  },
];

function getQuizResult(score: number) {
  if (score >= 5) {
    return "Mức nhiệt huyết cao: Bạn có xu hướng lựa chọn bền vững và có trách nhiệm.";
  }

  if (score >= 2) {
    return "Mức nhiệt huyết khá: Bạn đang đi đúng hướng, cần tăng tính kiên trì.";
  }

  return "Mức nhiệt huyết thấp: Nên đặt lại ưu tiên học tập và đóng góp xã hội.";
}

export default function QuizPage() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const question = quizQuestions[index];
  const progressText = useMemo(
    () => `Câu ${Math.min(index + 1, quizQuestions.length)}/${quizQuestions.length}`,
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
        <p className="page-kicker">Game phụ</p>
        <h1 className="page-title">Bộ câu hỏi quiz</h1>
        <p className="page-lead">Chế độ nhanh để đánh giá mức độ nhiệt huyết theo cách lựa chọn của bạn.</p>
      </header>

      {done ? (
        <section className="content-section">
          <h2 className="section-title">Kết quả quiz</h2>
          <p>Tổng điểm: {score}</p>
          <p>{getQuizResult(score)}</p>
          <button type="button" className="primary-button" onClick={resetQuiz}>
            Làm lại quiz
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
                <p>Điểm: {answer.score > 0 ? `+${answer.score}` : answer.score}</p>
              </button>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
