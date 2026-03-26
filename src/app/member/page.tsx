import { SiteShell } from '@/components/site-shell'

const members = [
  { code: 'SE170150', name: 'Hoàng Tiến Đạt' },
  { code: 'SE150834', name: 'Nguyễn Quốc Khánh' },
  { code: 'DE180230', name: 'Ngô Huy Long' },
  { code: 'SE180328', name: 'Nguyễn Thị Thùy Ngân' },
]

export default function MemberPage() {
  return (
    <SiteShell>
      <div className="page-stack">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Member</p>
            <h1>Thành viên thực hiện dự án</h1>
            <p>
              Route này tập trung danh sách thành viên tham gia thực hiện dự án bản đồ cách mạng Việt Nam.
            </p>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Danh sách</p>
              <h2>Nhóm phát triển</h2>
              <p className="section-copy">
                Mỗi thẻ hiển thị mã sinh viên hoặc mã thành viên đi kèm họ tên tương ứng.
              </p>
            </div>
          </div>

          <div className="record-grid">
            {members.map((member) => (
              <article className="record-card" key={member.code}>
                <span className="record-kind">Member</span>
                <h3>{member.name}</h3>
                <p>{member.code}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  )
}
