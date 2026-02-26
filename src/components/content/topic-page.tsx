import Image from "next/image";
import { ContentCarousel } from "@/components/content/content-carousel";
import { TopicPageData, TopicSection } from "@/lib/content-types";

type TopicPageProps = {
  data: TopicPageData;
};

function renderSection(section: TopicSection, index: number) {
  if (section.type === "paragraphs") {
    return (
      <section key={index} className="content-section">
        <h2 className="section-title">{section.heading}</h2>
        <div className="paragraph-stack">
          {section.items.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "quote") {
    return (
      <section key={index} className="quote-banner" aria-label="Trich dan">
        <blockquote>{section.quote}</blockquote>
        <p>{section.author}</p>
      </section>
    );
  }

  if (section.type === "roleCards") {
    return (
      <section key={index} className="content-section">
        <h2 className="section-title">{section.heading}</h2>
        <div className="role-grid">
          {section.items.map((item) => (
            <article key={item.title} className="role-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "evidence") {
    return (
      <section key={index} className="content-section evidence-block">
        <h2 className="section-title">{section.heading}</h2>
        <span className="evidence-tag">{section.label}</span>
        <p>{section.text}</p>

        <div className="evidence-grid">
          {section.images.map((image, imageIndex) => (
            <figure key={`${image.caption}-${imageIndex}`} className="evidence-card">
              {image.src ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={1200}
                  height={750}
                  className="evidence-media"
                  unoptimized
                />
              ) : (
                <div className="image-placeholder" role="img" aria-label={image.alt}>
                  <span>{image.alt}</span>
                </div>
              )}
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  }

  return (
    <ContentCarousel
      key={index}
      heading={section.heading}
      items={section.items}
    />
  );
}

export function TopicPage({ data }: TopicPageProps) {
  return (
    <article className="paper-panel">
      <header className="page-header">
        <p className="page-kicker">Chuyen de</p>
        <h1 className="page-title">{data.title}</h1>
        <p className="page-lead">{data.lead}</p>
      </header>

      {data.sections.map((section, index) => renderSection(section, index))}
    </article>
  );
}
