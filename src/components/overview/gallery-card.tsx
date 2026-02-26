import Link from "next/link";
import styles from "./tong-quan-overview.module.css";

type GalleryCardProps = {
  label: string;
  source: string;
  note?: string;
};

export function GalleryCard({ label, source, note }: GalleryCardProps) {
  return (
    <figure className={styles.galleryCard}>
      <div className={styles.galleryVisual} role="img" aria-label={label}>
        <span>{label}</span>
      </div>
      <figcaption>
        <p>{label}</p>
        <p className={styles.sourceText}>Nguồn: {source}</p>
        {note ? (
          <Link href={note} className={styles.linkInline} target="_blank" rel="noreferrer">
            Mở nguồn gốc
          </Link>
        ) : null}
      </figcaption>
    </figure>
  );
}
