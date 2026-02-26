import { AiUsageData } from "@/lib/content-types";

type AiUsageBoardProps = {
  data: AiUsageData;
};

export function AiUsageBoard({ data }: AiUsageBoardProps) {
  return (
    <article className="paper-panel">
      <header className="page-header">
        <p className="page-kicker">Minh bach quy trinh</p>
        <h1 className="page-title">{data.title}</h1>
        <p className="page-lead">{data.description}</p>
      </header>

      <section className="content-section">
        <h2 className="section-title">Cong cu da su dung</h2>
        <div className="tool-grid">
          {data.tools.map((tool) => (
            <article key={tool.name} className="tool-card">
              <h3>{tool.name}</h3>
              <p className="tool-role">{tool.role}</p>
              <p>{tool.usage}</p>
              <p className="tool-verification">Kiem chung: {tool.verification}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">Timeline kiem chung</h2>
        <ol className="timeline-list">
          {data.timeline.map((item) => (
            <li key={item.step}>
              <p className="timeline-step">{item.step}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}