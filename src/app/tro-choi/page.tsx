import { Metadata } from "next";
import Link from "next/link";
import { gameFlow } from "@/lib/game-engine";

export const metadata: Metadata = {
  title: "Trò chơi",
  description: gameFlow.overview,
};

export default function TroChoiLandingPage() {
  return (
    <article className="paper-panel game-panel">
      <header className="page-header">
        <p className="page-kicker">Module tương tác</p>
        <h1 className="page-title">{gameFlow.title}</h1>
        <p className="page-lead">{gameFlow.overview}</p>
      </header>

      <section className="content-section">
        <h2 className="section-title">Tổng thể cốt truyện</h2>
        <ul className="game-list">
          {gameFlow.intro.summary.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="content-section">
        <h2 className="section-title">4 phần gameplay</h2>
        <ol className="timeline-list compact">
          {gameFlow.steps.map((step, index) => (
            <li key={step.id}>
              <p className="timeline-step">Phần {index + 1}</p>
              <h3>{step.title}</h3>
              <p>{step.context}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="game-actions">
        <Link href="/tro-choi/intro" className="primary-button">
          Bắt đầu
        </Link>
        <Link href="/tro-choi/quiz" className="secondary-button">
          Bộ câu hỏi quiz
        </Link>
      </div>
    </article>
  );
}
