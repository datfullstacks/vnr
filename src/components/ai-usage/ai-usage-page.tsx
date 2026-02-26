import { AiToolCard } from "@/components/ai-usage/ai-tool-card";
import { VerificationTimeline } from "@/components/ai-usage/verification-timeline";
import styles from "./ai-usage-page.module.css";

const tools = [
  {
    name: "GEMINI",
    iconSrc: "/images/ai-usage/gemini.png",
    iconAlt: "Gemini",
    purpose:
      "Sử dụng để trích dẫn và đối chiếu nội dung lý thuyết từ tập sách Tư tưởng Hồ Chí Minh nhằm làm nền tảng lập luận và kiểm chứng thông tin.",
    studentEdits:
      "Đối chiếu lại với bản giáo trình gốc, ghi rõ chương-trang; nội dung không xác minh được sẽ bị loại bỏ hoặc viết lại theo nguồn chuẩn.",
  },
  {
    name: "CHATGPT",
    iconSrc: "/images/ai-usage/chatgpt.png",
    iconAlt: "ChatGPT",
    purpose:
      "Soạn nội dung cho phần thuyết trình (dàn ý, lời dẫn, ghi chú cho người thuyết trình).",
    studentEdits:
      "Rút gọn văn phong, chỉnh sửa các phần thuật ngữ chưa rõ nghĩa; bổ sung trích dẫn chính xác, ghi rõ nguồn và số trang trích dẫn từ văn bản chính thống.",
  },
  {
    name: "GROK",
    iconSrc: "/images/ai-usage/grok.png",
    iconAlt: "Grok",
    purpose: "Kiểm tra lại ngôn ngữ bài viết, tính học thuật và luận điệu.",
    studentEdits:
      "Đọc lại kết quả từ AI và kiểm tra lại bài viết lần nữa trước khi để lên website.",
  },
];

export function AiUsageScreen() {
  return (
    <article className={styles.page}>
      <section className={styles.goalBox}>
        <h1 className={styles.goalTitle}>MỤC TIÊU SỬ DỤNG TRÍ TUỆ NHÂN TẠO</h1>
        <p className={styles.goalText}>
          Nhóm sử dụng trí tuệ nhân tạo với vai trò hỗ trợ trong quá trình thực hiện bài tập.
          Trí tuệ nhân tạo không được sử dụng để thay thế hoàn toàn việc nghiên cứu, phân tích
          và viết nội dung học thuật.
        </p>
      </section>

      <section aria-label="Công cụ AI" className={styles.toolsSection}>
        <div className={styles.toolsGrid}>
          {tools.map((tool) => (
            <AiToolCard
              key={tool.name}
              name={tool.name}
              iconSrc={tool.iconSrc}
              iconAlt={tool.iconAlt}
              purpose={tool.purpose}
              studentEdits={tool.studentEdits}
            />
          ))}
        </div>
      </section>

      <section className={styles.statementWrap}>
        <p className={styles.statement}>
          Trí tuệ nhân tạo chỉ đóng vai trò hỗ trợ việc nghiên cứu, sự phân tích và sự chịu trách
          nhiệm học thuật của nhóm.
        </p>
      </section>

      <section aria-label="Quy trình kiểm chứng thông tin" className={styles.timelineSection}>
        <h2 className={styles.timelineTitle}>QUY TRÌNH KIỂM CHỨNG THÔNG TIN</h2>
        <VerificationTimeline />
      </section>
    </article>
  );
}
