import Image from "next/image";
import Link from "next/link";
import { tongQuanOverviewData } from "@/content/overview/tong-quan";
import styles from "./tong-quan-overview.module.css";

type ImageBlockProps = {
  caption: string;
  imagePath?: string;
  href?: string;
  small?: boolean;
};

function ImageBlock({ caption, imagePath, href, small }: ImageBlockProps) {
  return (
    <figure className={styles.figure}>
      {imagePath ? (
        <Image
          src={imagePath}
          alt={caption}
          width={1200}
          height={800}
          className={small ? styles.imageRealSmall : styles.imageReal}
          sizes={small ? "(max-width: 760px) 100vw, 33vw" : "(max-width: 760px) 100vw, 50vw"}
        />
      ) : (
        <div className={small ? styles.imageMockSmall : styles.imageMock} aria-hidden>
          <span>HÌNH ẢNH</span>
        </div>
      )}

      {href ? (
        <figcaption className={styles.caption}>
          <Link href={href} target="_blank" rel="noreferrer" className={styles.captionLink}>
            {caption}
          </Link>
        </figcaption>
      ) : (
        <figcaption className={styles.caption}>{caption}</figcaption>
      )}
    </figure>
  );
}

function QuoteBlock({
  person,
  statement,
  source,
  iconPath,
}: {
  person: string;
  statement: string;
  source: string;
  iconPath?: string;
}) {
  return (
    <article className={styles.quoteCard}>
      <div className={styles.avatar}>
        {iconPath ? (
          <Image
            src={iconPath}
            alt={`Chan dung ${person}`}
            width={213}
            height={213}
            className={styles.avatarImage}
          />
        ) : (
          <span aria-hidden>ẢNH</span>
        )}
      </div>
      <div className={styles.quoteContent}>
        <p className={styles.quotePerson}>{person}</p>
        <p className={styles.quoteText}>“{statement}”</p>
        <p className={styles.quoteSource}>{source}</p>
      </div>
    </article>
  );
}

export function TongQuanOverview() {
  const data = tongQuanOverviewData;
  const [modernMain, ...modernSub] = data.modernGallery;

  return (
    <article className={`paper-panel ${styles.overviewPage}`}>
      <section className={styles.heroSection}>
        <div className={styles.heroImages} aria-label="Ảnh tư liệu mở đầu">
          {data.heroGallery.map((item) => (
            <ImageBlock key={item.label} caption={item.label} imagePath={item.imagePath} href={item.note} />
          ))}
        </div>

        <header className={styles.heroTitleWrap}>
          <Image
            src="/images/common/tongquantext.png"
            alt={data.subtitle}
            width={404}
            height={234}
            className={styles.heroTitleImage}
            priority
          />
        </header>
      </section>

      <section className={styles.theoryLine}>
        <p>
          <strong>{data.theoryTitle}:</strong> {data.theoryBody}
        </p>
      </section>

      <section className={styles.centerSection}>
        <h2>{data.quoteSectionTitle}</h2>
        <div className={styles.quoteGrid}>
          {data.quoteCards.map((item) => (
            <QuoteBlock
              key={item.person}
              person={item.person}
              statement={item.statement}
              source={item.source}
              iconPath={item.iconPath}
            />
          ))}
        </div>
      </section>

      <p className={styles.transitionText}>{data.theoryTail}</p>

      <section className={styles.evidenceSection}>
        <h2>{data.evidenceSectionTitle}</h2>

        <div className={styles.yellowBox}>
          <p>
            <strong>{data.historicalEvidence.title}</strong> {data.historicalEvidence.body.join(" ")}{" "}
            {data.historicalEvidence.links.map((link) => (
              <Link key={link.href} href={link.href} target="_blank" rel="noreferrer" className={styles.inlineLink}>
                {link.label}
              </Link>
            ))}
          </p>
        </div>

        <div className={styles.historyGrid}>
          {data.historicalGallery.map((item) => (
            <ImageBlock key={item.label} caption={item.label} imagePath={item.imagePath} />
          ))}
        </div>

        <div className={styles.yellowBox}>
          <p>
            <strong>{data.modernEvidence.title}</strong> {data.modernEvidence.body.join(" ")}
          </p>
        </div>

        <div className={styles.modernGrid}>
          <ImageBlock caption={modernMain.label} imagePath={modernMain.imagePath} />
          <div className={styles.modernSide}>
            {modernSub.map((item) => (
              <ImageBlock key={item.label} caption={item.label} imagePath={item.imagePath} small />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}


