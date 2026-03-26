import { SiteShell } from '@/components/site-shell'

const members = [
  {
    code: 'SE170150',
    name: 'Hoàng Tiến Đạt',
    role: 'Điều phối và tích hợp tổng thể',
    scope:
      'Phụ trách định hướng sản phẩm, ghép các luồng trang chủ, atlas, member và điều phối phần tích hợp giữa frontend với backend.',
    tasks: ['Quản lý phạm vi', 'Tích hợp hệ thống', 'Rà soát tiến độ'],
  },
  {
    code: 'SE150834',
    name: 'Nguyễn Quốc Khánh',
    role: 'Backend và dữ liệu lịch sử',
    scope:
      'Phụ trách API công khai, mô hình dữ liệu, luồng quiz/game, leaderboard và các cấu hình nghiệp vụ phía server.',
    tasks: ['API và Payload', 'Dữ liệu lịch sử', 'Game backend'],
  },
  {
    code: 'DE180230',
    name: 'Ngô Huy Long',
    role: 'Frontend atlas và trải nghiệm bản đồ',
    scope:
      'Phụ trách giao diện người dùng, điều hướng atlas, filter, timeline, các route hiển thị và tính nhất quán trải nghiệm trên site.',
    tasks: ['UI frontend', 'Atlas và filter', 'Responsive'],
  },
  {
    code: 'SE180328',
    name: 'Nguyễn Thị Thùy Ngân',
    role: 'Nội dung, kiểm thử và hoàn thiện trình bày',
    scope:
      'Phụ trách biên tập nội dung hiển thị, rà soát tính đúng đắn, kiểm thử luồng sử dụng và hoàn thiện các phần mô tả trên sản phẩm.',
    tasks: ['Biên tập nội dung', 'Kiểm thử', 'Tài liệu và trình bày'],
  },
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
              Route này tập trung danh sách thành viên tham gia dự án và phần phân chia nhiệm vụ theo từng
              mảng công việc chính.
            </p>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Danh sách</p>
              <h2>Nhóm phát triển</h2>
              <p className="section-copy">
                Mỗi thẻ hiển thị mã thành viên, vai trò chính và phạm vi công việc tương ứng trong dự án.
              </p>
            </div>
          </div>

          <div className="record-grid">
            {members.map((member) => (
              <article className="record-card" key={member.code}>
                <span className="record-kind">Member</span>
                <h3>{member.name}</h3>
                <p>
                  <strong>{member.role}</strong>
                </p>
                <p>{member.scope}</p>
                <div className="record-meta">
                  <span>{member.code}</span>
                  {member.tasks.map((task) => (
                    <span key={`${member.code}:${task}`}>{task}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  )
}
