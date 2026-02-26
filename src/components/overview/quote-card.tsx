import styles from "./tong-quan-overview.module.css";

type QuoteCardProps = {
  person: string;
  statement: string;
  source: string;
};

export function QuoteCard({ person, statement, source }: QuoteCardProps) {
  return (
    <article className={styles.quoteCard}>
      <div className={styles.avatarMock} aria-hidden>
        <span>{person}</span>
      </div>
      <div>
        <h3>{person}</h3>
        <blockquote>{statement}</blockquote>
        <p>{source}</p>
      </div>
    </article>
  );
}