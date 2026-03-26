import { SiteShell } from '@/components/site-shell'

const aiTools = [
  {
    description:
      'Được dùng để hỗ trợ sửa code, kiểm tra dữ liệu atlas, rà soát filter, tạo script audit và biên tập một phần nội dung mô tả trong quá trình phát triển.',
    label: 'Phát triển',
    title: 'Codex / GPT lớp trợ lý kỹ thuật',
  },
  {
    description:
      'Có thể được dùng để hỗ trợ viết prompt, tóm tắt tài liệu, gợi ý cấu trúc nội dung và viết lại các đoạn mô tả lịch sử theo nhiều mức độ chi tiết khác nhau.',
    label: 'Biên tập',
    title: 'ChatGPT',
  },
  {
    description:
      'Có thể được dùng như một nguồn tham khảo bổ sung để đối chiếu cách diễn giải, gợi ý câu hỏi rà soát và tạo thêm biến thể nội dung phục vụ bước biên tập nội bộ.',
    label: 'Tham khảo',
    title: 'Grok',
  },
  {
    description:
      'Được dùng ở workflow prompt để tóm tắt nguồn, chuẩn hóa hồ sơ sự kiện, gợi ý copy trình bày và rà soát rủi ro biên tập trước khi biên tập viên kiểm chứng lại.',
    label: 'Biên tập',
    title: 'Workflow prompt cho mô hình ngôn ngữ',
  },
  {
    description:
      'Có thể dùng ở bước số hóa tư liệu để trích xuất chữ từ ảnh scan, tài liệu lưu trữ hoặc phụ bản cũ trước khi biên tập viên làm sạch và đối chiếu lại.',
    label: 'Tư liệu',
    title: 'OCR hỗ trợ bóc tách văn bản',
  },
  {
    description:
      'Có thể dùng để chuẩn hóa nhãn chủ đề, phân loại sơ bộ sự kiện, chiến dịch, địa danh hoặc gợi ý metadata ban đầu cho từng hồ sơ lịch sử.',
    label: 'Dữ liệu',
    title: 'AI hỗ trợ gắn thẻ và phân loại',
  },
  {
    description:
      'Có thể dùng để rà soát nhanh lỗi diễn đạt, câu khẳng định quá mức, chỗ thiếu nguồn hoặc các điểm chưa nhất quán về mốc năm giữa các bản ghi.',
    label: 'Kiểm tra',
    title: 'AI hỗ trợ audit biên tập',
  },
  {
    description:
      'Có thể dùng khi cần viết lại tóm tắt ngắn, caption ảnh, intro cho lát cắt bản đồ hoặc chuyển cùng một nội dung sang các mức độ chi tiết khác nhau.',
    label: 'Trình bày',
    title: 'AI hỗ trợ viết lại và rút gọn nội dung',
  },
  {
    description:
      'Hiện chưa thấy SDK AI nào được tích hợp trực tiếp vào frontend hoặc backend public của dự án. Người xem không đang tương tác với một tính năng AI runtime trên site.',
    label: 'Runtime',
    title: 'AI tích hợp trực tiếp trên site: chưa có',
  },
]

const promptExamples = [
  {
    prompt:
      'Từ các nguồn dưới đây, hãy tóm tắt giai đoạn 1919-1930 thành 3 phần: bối cảnh, lực lượng xã hội mới, và điều kiện trực tiếp dẫn tới việc thành lập Đảng. Chỉ dùng thông tin có trong nguồn, không thêm suy đoán, và đánh dấu chỗ nào cần kiểm chứng thêm.',
    purpose: 'Dùng để dựng phần mở đầu cho giai đoạn tiền đề hình thành Đảng.',
    title: 'Tóm tắt giai đoạn hình thành',
  },
  {
    prompt:
      'Hãy chuyển các ghi chú lịch sử sau thành một hồ sơ sự kiện cho atlas với các trường: title, summary, startDate, displayYear, region, relatedPlaces, keyTopics. Nếu dữ kiện nào chưa đủ chắc chắn thì ghi rõ cần bổ sung nguồn thay vì tự điền.',
    purpose: 'Dùng để chuẩn hóa dữ liệu trước khi nhập vào hệ thống bản đồ và timeline.',
    title: 'Chuẩn hóa hồ sơ sự kiện',
  },
  {
    prompt:
      'Viết một đoạn giới thiệu ngắn cho lát cắt năm 1954 trên atlas. Đoạn viết phải nêu được bối cảnh lịch sử, gợi ý người xem nên chú ý những sự kiện hoặc chiến dịch nào trên bản đồ, và giữ văn phong trung tính, không phóng đại.',
    purpose: 'Dùng để hỗ trợ viết copy trình bày cho các lát cắt theo năm trên trang chủ hoặc atlas.',
    title: 'Viết copy cho lát cắt bản đồ',
  },
  {
    prompt:
      'Đọc đoạn nội dung lịch sử sau và chỉ ra các câu có nguy cơ khẳng định quá mức, mơ hồ về nguồn hoặc sai mốc thời gian. Trả về theo dạng danh sách gồm: câu gốc, vấn đề, gợi ý sửa và loại nguồn nên kiểm tra lại.',
    purpose: 'Dùng để rà soát biên tập trước khi xuất bản nội dung công khai.',
    title: 'Rà soát rủi ro biên tập',
  },
]

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
              <p className="eyebrow">Công cụ AI</p>
              <h2>Các công cụ AI đang được sử dụng</h2>
              <p className="section-copy">
                Phần này tách rõ công cụ AI dùng trong quá trình phát triển và biên tập với tình trạng AI
                thực sự được tích hợp vào sản phẩm công khai.
              </p>
            </div>
          </div>

          <div className="record-grid">
            {aiTools.map((tool) => (
              <article className="record-card" key={tool.title}>
                <span className="record-kind">{tool.label}</span>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Mẫu prompt</p>
              <h2>Một số prompt minh chứng cho cách AI được sử dụng</h2>
              <p className="section-copy">
                Đây là các mẫu prompt theo đúng workflow của dự án, dùng để minh họa cách AI hỗ trợ ở lớp
                tổng hợp, chuẩn hóa và rà soát nội dung lịch sử.
              </p>
            </div>
          </div>

          <div className="record-grid">
            {promptExamples.map((item) => (
              <article className="record-card prompt-card" key={item.title}>
                <span className="record-kind">Prompt mẫu</span>
                <h3>{item.title}</h3>
                <p>{item.purpose}</p>
                <pre>{item.prompt}</pre>
              </article>
            ))}
          </div>

          <p className="section-copy prompt-note">
            Các prompt này chỉ là công cụ hỗ trợ biên tập. Nội dung tạo ra từ AI vẫn cần được kiểm tra lại
            theo nguồn trước khi đưa lên site.
          </p>
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
