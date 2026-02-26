import Image from "next/image";
import styles from "./kinh-te-page.module.css";

export function KinhTeScreen() {
  return (
    <article className={`paper-panel ${styles.kinhTePage}`}>
      <header className={styles.headingBlock}>
        <h1 className={styles.heading}>
          Trên Lĩnh Vực Kinh Tế: Xây Dựng Cơ Sở Vật Chất - Kỹ Thuật Cho Xã Hội Mới
        </h1>
      </header>

      <section className={styles.theoryBlock} aria-label="Cơ sở lý luận kinh tế">
        <p>
          Thời kỳ quá độ tồn tại nền kinh tế nhiều thành phần, với nhiệm vụ cốt lõi là xây dựng cơ sở vật chất - kỹ thuật
          cho CNXH, phù hợp với quan điểm của Hồ Chí Minh:{" "}
          <em>
            &quot;Muốn xây dựng chủ nghĩa xã hội, trước hết cần có những con người xã hội chủ nghĩa&quot;
          </em>{" "}
          (trích từ bài nói chuyện tại Hội nghị bồi dưỡng cán bộ lãnh đạo các cấp huyện, năm 1961). Sinh viên, với lợi thế
          nắm bắt nhanh chóng khoa học công nghệ, đóng vai trò tiên phong trong lực lượng sản xuất mới, chuyển hóa chất
          xám thành giá trị kinh tế thực tiễn.
        </p>
        <p>
          <strong>Vai trò tiên phong của sinh viên:</strong> Đổi mới lực lượng sản xuất. Là thế hệ nhạy bén với khoa học
          công nghệ, sinh viên có khả năng chuyển hóa tri thức và chất xám thành giá trị kinh tế thực tiễn.
        </p>
        <p>
          <strong>Hành động cụ thể:</strong> Làm chủ chuyên môn, mạnh dạn khởi nghiệp, đổi mới sáng tạo và trực tiếp tham
          gia lao động sản xuất, phục vụ công nghiệp hóa - hiện đại hóa. Điều này phản ánh tinh thần{" "}
          <em>&quot;Lao động là vinh quang, vẻ vang, vui thú và anh dũng&quot;</em> của Hồ Chí Minh (trích trong bài viết{" "}
          &quot;Đạo đức lao động&quot; đăng trên Báo Cứu quốc, số 2092, ngày 04 tháng 6 năm 1952), đồng thời củng cố nguyên
          tắc phân phối theo lao động - cốt lõi của CNXH.
        </p>
      </section>

      <section className={styles.evidenceBlock} aria-label="Minh chứng thực tiễn kinh tế">
        <h2 className={styles.evidenceTitle}>MINH CHỨNG THỰC TIỄN</h2>

        <div className={styles.highlightBox}>
          <p>
            <strong>LỊCH SỬ</strong> Tinh thần xung kích kiến thiết các hạ tầng trọng điểm qua các phong trào{" "}
            <em>&quot;Ba sẵn sàng&quot;</em> (1964, tại miền Bắc) và <em>&quot;Năm xung phong&quot;</em> (1965, tại miền Nam).
          </p>
        </div>

        <div className={styles.historyMedia}>
          <figure className={styles.mainHistoryImage}>
            <Image
              src="/images/kinhte/lich-su-1.png"
              alt="Phong trào Ba sẵn sàng"
              width={690}
              height={388}
              className={styles.mediaImage}
              sizes="(max-width: 980px) 100vw, 58vw"
            />
          </figure>
          <figure className={styles.sideHistoryImage}>
            <Image
              src="/images/kinhte/lich-su-2.png"
              alt="Thanh niên thời kỳ kháng chiến"
              width={494}
              height={388}
              className={styles.mediaImage}
              sizes="(max-width: 980px) 100vw, 40vw"
            />
          </figure>
        </div>

        <p className={styles.historyCaption}>
          Tiễn đưa thanh niên “Ba sẵn sàng” của khu Đống Đa (Hà Nội) lên đường nhập ngũ, tháng 8/1964, sau khi Mỹ mở rộng
          đánh phá bằng không quân ra miền Bắc. (Ảnh: Văn Lượng/TTXVN)
        </p>

        <div className={`${styles.highlightBox} ${styles.modernBox}`}>
          <p>
            <strong>HIỆN ĐẠI</strong> Việc ứng dụng công nghệ lõi và chuyển đổi số vào thực tiễn - tiêu biểu như việc sinh
            viên khối ngành thiết kế, công nghệ hợp tác phát triển các ứng dụng du lịch thông minh, nông nghiệp bền vững -
            giúp kích cầu kinh tế và tận dụng lợi thế <em>Cách mạng công nghiệp 4.0</em> để rút ngắn thời kỳ quá độ.
          </p>
        </div>

        <div className={styles.modernMedia}>
          <figure className={styles.modernMainImage}>
            <Image
              src="/images/kinhte/hien-dai-1.png"
              alt="Sinh viên ĐHBK Hà Nội nhận giải Nhất SV-STARTUP 2024"
              width={896}
              height={545}
              className={styles.mediaImage}
              sizes="(max-width: 980px) 100vw, 64vw"
            />
          </figure>
          <p className={styles.modernCaption}>
            4 sinh viên ĐHBK Hà Nội nhận giải Nhất tại Ngày hội Khởi nghiệp Quốc gia của học sinh, sinh viên lần thứ VI
            (SV-STARTUP 2024).
          </p>
        </div>

        <p className={styles.meaningText}>
          <strong>Ý nghĩa:</strong> Thông qua giáo dục chính trị, sinh viên biến nhận thức thành sức mạnh tập thể, thu hẹp
          khoảng cách giữa lao động trí óc và chân tay, góp phần kiến tạo nền kinh tế thị trường định hướng XHCN.
        </p>
      </section>
    </article>
  );
}
