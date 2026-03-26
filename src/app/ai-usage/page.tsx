import { SiteShell } from '@/components/site-shell'

export default function AIUsagePage() {
  return (
    <SiteShell>
      <div className="page-stack">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">AI Usage</p>
            <h1>AI được dùng như thế nào trong dự án này</h1>
            <p>
              Trang này tách riêng phần giải thích về vai trò của AI trong hệ thống, để header giữ gọn và
              người xem vẫn có một nơi rõ ràng để kiểm tra cách dữ liệu được tổng hợp, cấu trúc hóa và trình bày.
            </p>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Phạm vi sử dụng</p>
              <h2>AI hỗ trợ ở lớp biên tập và trình bày</h2>
              <p className="section-copy">
                AI được dùng để hỗ trợ tổng hợp, chuẩn hóa cấu trúc và tổ chức cách đọc nội dung lịch sử
                trên timeline, atlas và các hồ sơ chi tiết.
              </p>
            </div>
          </div>

          <div className="fact-grid">
            <article className="fact-card">
              <span className="record-kind">Tổng hợp</span>
              <strong>Hỗ trợ gom và sắp xếp dữ liệu</strong>
            </article>
            <article className="fact-card">
              <span className="record-kind">Cấu trúc hóa</span>
              <strong>Chuẩn hóa giai đoạn, lãnh đạo, sự kiện và địa danh</strong>
            </article>
            <article className="fact-card">
              <span className="record-kind">Trình bày</span>
              <strong>Hỗ trợ diễn giải nội dung theo các luồng đọc trên site</strong>
            </article>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Nguyên tắc</p>
              <h2>AI không thay thế bước đối chiếu nguồn</h2>
              <p className="section-copy">
                Các mốc, lớp bản đồ, hồ sơ và nội dung công khai vẫn cần được đối chiếu với nguồn chính
                thức trước khi xem là dữ liệu xuất bản cuối cùng.
              </p>
            </div>
          </div>

          <div className="record-grid">
            <article className="record-card">
              <span className="record-kind">Nguồn</span>
              <h3>Ưu tiên nguồn chính thức và nguồn tham khảo rõ xuất xứ</h3>
              <p>Mọi bản ghi xuất hiện trên site nên có điểm tựa là nguồn có thể kiểm tra lại.</p>
            </article>
            <article className="record-card">
              <span className="record-kind">Biên tập</span>
              <h3>Biên tập viên vẫn là lớp kiểm soát cuối</h3>
              <p>AI chỉ nên hỗ trợ tăng tốc khâu chuẩn bị, không tự quyết định nội dung lịch sử một mình.</p>
            </article>
            <article className="record-card">
              <span className="record-kind">Công khai</span>
              <h3>Người xem cần biết rõ vai trò của AI</h3>
              <p>Việc tách riêng route này giúp sản phẩm minh bạch hơn thay vì nhét ghi chú vào header.</p>
            </article>
          </div>
        </section>
      </div>
    </SiteShell>
  )
}
