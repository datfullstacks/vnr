import styles from "./ai-usage-page.module.css";

type StepPosition = "top" | "bottom";

type TimelineStep = {
  id: number;
  title: string;
  description: string;
  position: StepPosition;
};

const steps: TimelineStep[] = [
  {
    id: 1,
    title: "Đánh dấu nội dung AI",
    description:
      "Mọi nội dung do công cụ trí tuệ nhân tạo đề xuất (nhận định, trích dẫn, số liệu) được đánh dấu.",
    position: "top",
  },
  {
    id: 2,
    title: "Đối chiếu nguồn chính thống",
    description:
      "Đối chiếu với Giáo trình Tư tưởng Hồ Chí Minh, nghị quyết và các văn bản chính thức.",
    position: "bottom",
  },
  {
    id: 3,
    title: "Kết luận kiểm chứng",
    description: "Phân loại nội dung: Hợp lệ / Chưa đủ căn cứ / Sai.",
    position: "top",
  },
  {
    id: 4,
    title: "Chỉnh sửa và chịu trách nhiệm",
    description:
      "Chỉ giữ lại nội dung đã xác minh, nhóm chịu trách nhiệm về bản cuối cùng.",
    position: "bottom",
  },
];

export function VerificationTimeline() {
  return (
    <div className={styles.timelineScroll}>
      <div className={styles.timeline}>
        {steps.map((step) => {
          const odd = step.id % 2 === 1;
          const itemClass =
            step.position === "top"
              ? styles.timelineItemTop
              : styles.timelineItemBottom;
          const colorClass = odd ? styles.stepDark : styles.stepBrand;

          return (
            <article key={step.id} className={`${styles.timelineItem} ${itemClass}`}>
              <span className={`${styles.trackDot} ${colorClass}`} aria-hidden="true" />
              <span className={`${styles.stepConnector} ${colorClass}`} aria-hidden="true" />
              <span className={`${styles.stepCircle} ${colorClass}`} aria-hidden="true">
                {step.id}
              </span>
              <div className={styles.stepContent}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
