import Image from "next/image";
import styles from "./xa-hoi-page.module.css";

export function XaHoiScreen() {
  return (
    <article className={`paper-panel ${styles.page}`}>
      <header className={styles.heroSection}>
        <h1 className={styles.pageTitle}>TRÊN LĨNH VỰC XÃ HỘI: THIẾT LẬP CÔNG BẰNG VÀ XÓA BỎ TÀN DƯ XÃ HỘI CŨ</h1>

        <p className={styles.bodyText}>
          <strong>NHIỆM VỤ TRỌNG TÂM:</strong> Đấu tranh xóa bỏ các tệ nạn, bất công và sự khác biệt tồn tại trong thời
          kỳ quá độ (giữa lao động trí óc - chân tay, nông thôn - thành thị).
        </p>
        <p className={styles.bodyText}>
          <strong>VAI TRÒ VÀ HÀNH ĐỘNG:</strong> Sinh viên phục vụ cộng đồng để xây dựng xã hội công bằng. Các bạn sử
          dụng chuyên môn để tham gia các dự án xã hội, góp phần giảm bất bình đẳng và đề cao sự phân phối lao động
          công bằng.
        </p>
      </header>

      <section className={styles.evidenceSection} aria-label="Minh chứng thực tiễn">
        <h2 className={styles.evidenceTitle}>MINH CHỨNG THỰC TIỄN</h2>

        <div className={styles.highlightBox}>
          <p>
            <strong>Chiến dịch &quot;Mùa hè xanh&quot;</strong> đưa các sinh viên về vùng sâu vùng xa tham gia y tế cộng
            đồng, tiêm chủng và giáo dục sức khỏe....
          </p>
        </div>

        <div className={styles.galleryGrid}>
          <figure className={styles.figure}>
            <Image
              src="/images/xa-hoi/mua-he-xanh-1.png"
              alt="Sinh viên tình nguyện tham gia làm đường"
              width={960}
              height={590}
              className={styles.image}
              sizes="(max-width: 760px) 96vw, 48vw"
            />
          </figure>
          <figure className={styles.figure}>
            <Image
              src="/images/xa-hoi/mua-he-xanh-2.png"
              alt="Đội sinh viên tình nguyện mùa hè xanh"
              width={1024}
              height={734}
              className={styles.image}
              sizes="(max-width: 760px) 96vw, 48vw"
            />
          </figure>
          <figure className={styles.figure}>
            <Image
              src="/images/xa-hoi/mua-he-xanh-3.png"
              alt="Sinh viên tham gia dọn kênh rạch"
              width={500}
              height={375}
              className={styles.image}
              sizes="(max-width: 760px) 96vw, 48vw"
            />
          </figure>
          <figure className={styles.figure}>
            <Image
              src="/images/xa-hoi/mua-he-xanh-4.png"
              alt="Sinh viên tham gia lao động cộng đồng ở vùng núi"
              width={287}
              height={175}
              className={styles.image}
              sizes="(max-width: 760px) 96vw, 48vw"
            />
          </figure>
        </div>

        <p className={styles.bodyText}>
          <strong>Ý NGHĨA:</strong> Thông qua lao động xã hội, sinh viên vừa tạo giá trị vật chất vừa củng cố khối đại
          đoàn kết, góp phần xóa bỏ tàn dư xã hội cũ, kiến tạo xã hội dân chủ, công bằng theo đúng nguyên tắc CNXH.
        </p>
      </section>

      <section className={styles.conclusionSection} aria-label="Kết luận">
        <h2 className={styles.conclusionTitle}>KẾT LUẬN</h2>

        <ul className={styles.conclusionList}>
          <li>
            <strong>KHẲNG ĐỊNH VAI TRÒ:</strong> Mặc dù khái niệm &quot;sinh viên&quot; không xuất hiện trực tiếp trong
            các văn bản lý luận kinh điển, lực lượng này vẫn đóng vai trò then chốt trong thời kỳ quá độ, từ việc kế
            thừa sự nghiệp đến các hành động thực tiễn trên mọi lĩnh vực.
          </li>
          <li>
            <strong>TƯ TƯỞNG CHỈ ĐẠO:</strong> Để phát huy tối đa vai trò này, cần tăng cường giáo dục chính trị và tạo
            môi trường cho sinh viên tham gia xã hội. Sinh viên cần khắc ghi lời dạy của Hồ Chí Minh:{" "}
            <em>
              &quot;Thanh niên phải có chí khí cao cường, phải có lý tưởng cách mạng&quot; và &quot;Học để phụng sự Tổ
              quốc, phụng sự nhân dân, làm cho dân giàu, nước mạnh&quot;
            </em>{" "}
            (trích từ bài nói chuyện tại lớp hướng dẫn giáo viên cấp 2, 3 toàn miền Bắc, ngày 18/12/1954).
          </li>
        </ul>

        <p className={styles.bodyText}>
          <strong>THÔNG ĐIỆP CỐT LÕI:</strong> Việc xây dựng CNXH không phải là những khẩu hiệu xa vời mà được hiện
          thực hóa qua từng dự án, nhận thức và hành động cụ thể của sinh viên. Lực lượng trí thức trẻ chính là nhân
          tố quyết định để hành động vì một Việt Nam xã hội chủ nghĩa hùng cường.
        </p>
      </section>
    </article>
  );
}
