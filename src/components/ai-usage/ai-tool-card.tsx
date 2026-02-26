import Image from "next/image";
import styles from "./ai-usage-page.module.css";

type AiToolCardProps = {
  name: string;
  iconSrc: string;
  iconAlt: string;
  purpose: string;
  studentEdits: string;
};

export function AiToolCard({
  name,
  iconSrc,
  iconAlt,
  purpose,
  studentEdits,
}: AiToolCardProps) {
  return (
    <article className={styles.toolCard}>
      <header className={styles.toolHeader}>
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={46}
          height={46}
          className={styles.toolIcon}
          sizes="46px"
        />
        <h3>{name}</h3>
      </header>

      <div className={styles.toolBody}>
        <p className={styles.toolLabel}>Mục đích</p>
        <p className={styles.toolText}>{purpose}</p>

        <p className={styles.toolLabel}>Chỉnh sửa của sinh viên</p>
        <p className={styles.toolText}>{studentEdits}</p>
      </div>
    </article>
  );
}
