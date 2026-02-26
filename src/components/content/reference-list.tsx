import { ReferenceData } from "@/lib/content-types";

type ReferenceListProps = {
  data: ReferenceData;
};

export function ReferenceList({ data }: ReferenceListProps) {
  return (
    <article className="paper-panel">
      <header className="page-header">
        <p className="page-kicker">Nguon du lieu</p>
        <h1 className="page-title">{data.title}</h1>
        <p className="page-lead">{data.description}</p>
      </header>

      <div className="reference-groups">
        {data.groups.map((group) => (
          <section key={group.title} className="content-section">
            <h2 className="section-title">{group.title}</h2>
            <ul className="reference-list">
              {group.items.map((item) => (
                <li key={item.href}>
                  <a href={item.href} target="_blank" rel="noreferrer" className="external-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}