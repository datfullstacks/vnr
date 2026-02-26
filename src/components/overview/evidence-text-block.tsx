import Link from "next/link";
import styles from "./tong-quan-overview.module.css";

type EvidenceTextBlockProps = {
  title: string;
  body: string[];
  links: {
    label: string;
    href: string;
  }[];
};

export function EvidenceTextBlock({ title, body, links }: EvidenceTextBlockProps) {
  return (
    <section className={styles.evidenceTextBlock}>
      <h3>{title}</h3>
      <div className={styles.paragraphStack}>
        {body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className={styles.linkGroup}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className={styles.linkInline}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}