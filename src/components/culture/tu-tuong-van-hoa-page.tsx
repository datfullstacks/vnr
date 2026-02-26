import Image from "next/image";
import styles from "./tu-tuong-van-hoa-page.module.css";

const pioneerCards = [
  "Tiếp thu và truyền bá tri thức khoa học",
  "Giữ gìn và phát huy bản sắc văn hóa dân tộc",
  "Định hướng giá trị xã hội tích cực",
  "Kết hợp văn hóa truyền thống với công nghệ hiện đại",
];

const actionItems = [
  {
    title: "Học tập chủ nghĩa Mác - Lênin và tư tưởng Hồ Chí Minh",
    image: "/images/tutuong-van-hoa/action-icon-1.png",
    href: "https://hungyen.dcs.vn/tang-cuong-boi-duong-van-hoa-chinh-tri-cho-sinh-vien-c214696.html",
  },
  {
    title: "Sáng tạo sản phẩm văn hóa như phim, game, thiết kế, truyền thông",
    image: "/images/tutuong-van-hoa/action-icon-3.png",
    href: "https://thanhnien.vn/sinh-vien-sang-tao-board-game-ve-van-hoa-viet-nam-mot-san-pham-du-lich-185241124153354328.htm",
  },
  {
    title: "Sử dụng công nghệ số để quảng bá lịch sử và văn hóa dân tộc",
    image: "/images/tutuong-van-hoa/action-icon-2.png",
    href: "https://svvn.tienphong.vn/sinh-vien-dung-cong-nghe-lam-cau-noi-dua-van-hoa-dan-toc-den-gan-hon-voi-nguoi-tre-post1802168.tpo",
  },
  {
    title: "Xây dựng lối sống lành mạnh, có trách nhiệm xã hội",
    image: "/images/tutuong-van-hoa/action-icon-4.png",
    href: "https://svvn.tienphong.vn/thanh-nien-viet-nam-bat-song-cong-nghe-dan-dau-thoi-dai-so-post1700966.tpo",
  },
];

export function TuTuongVanHoaScreen() {
  return (
    <article className={`paper-panel ${styles.page}`}>
      <header className={styles.heroSection}>
        <h1 className={styles.pageTitle}>TRÊN LĨNH VỰC TƯ TƯỞNG - VĂN HÓA</h1>

        <div className={styles.quotePanel}>
          <p className={styles.quoteText}>
            “ Trong thời kỳ quá độ tồn tại nhiều hệ tư tưởng khác nhau, vì vậy cần{" "}
            <strong>xây dựng nền văn hóa xã hội chủ nghĩa</strong> dựa trên hệ tư tưởng của giai cấp công nhân, đồng
            thời tiếp thu tinh hoa văn hóa nhân loại và giữ gìn bản sắc dân tộc. ”
          </p>
          <p className={styles.quoteSource}>(Theo giáo trình Chủ nghĩa xã hội khoa học (2021), tr.109)</p>
        </div>

        <div className={styles.hoPanel}>
          <p className={styles.hoQuote}>“Văn hóa soi đường cho quốc dân đi.”</p>
          <p className={styles.hoAuthor}>_Chủ tịch Hồ Chí Minh_</p>
          <a
            href="https://www.qdnd.vn/tu-lieu-ho-so/ngay-nay-nam-xua/ngay-24-11-1946-bac-ho-noi-gi-ve-van-hoa-tai-hoi-nghi-van-hoa-toan-quoc-lan-thu-nhat-677875"
            target="_blank"
            rel="noreferrer"
            className={styles.hoLink}
          >
            (Hội nghị Văn hóa toàn quốc, 1946)
          </a>
        </div>
      </header>

      <section className={styles.pioneerSection} aria-label="Vai trò tiên phong của sinh viên">
        <h2 className={styles.sectionTitle}>VAI TRÒ TIÊN PHONG CỦA SINH VIÊN</h2>
        <p className={styles.sectionLead}>
          Sinh viên là lực lượng có trình độ học vấn cao, khả năng sáng tạo và tiếp cận công nghệ, có thể:
        </p>

        <div className={styles.pioneerGrid}>
          {pioneerCards.map((item) => (
            <article key={item} className={styles.pioneerCard}>
              <h3>{item}</h3>
            </article>
          ))}
        </div>

        <p className={styles.arrowCallout}>
          <strong>→</strong> Sinh viên trở thành cầu nối giữa truyền thống và hiện đại trong quá trình xây dựng nền
          văn hóa mới.
        </p>
      </section>

      <section className={styles.actionSection} aria-label="Hành động cụ thể của sinh viên">
        <h2 className={styles.sectionTitle}>HÀNH ĐỘNG CỤ THỂ CỦA SINH VIÊN TRONG LĨNH VỰC TƯ TƯỞNG - VĂN HÓA</h2>

        <div className={styles.actionGrid}>
          {actionItems.map((item) => (
            <div key={item.title} className={styles.actionItem}>
              <article className={styles.actionCard}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={426}
                  height={426}
                  className={styles.actionIcon}
                  sizes="80px"
                />
                <h3>{item.title}</h3>
              </article>
              <a href={item.href} target="_blank" rel="noreferrer" className={styles.sourceLink}>
                Nguồn minh họa thực tế
              </a>
            </div>
          ))}
        </div>

        <p className={styles.arrowCallout}>
          <strong>→</strong> Những hoạt động này góp phần xây dựng nền văn hóa xã hội chủ nghĩa, đậm đà bản sắc dân
          tộc.
        </p>
      </section>

      <section className={styles.evidenceSection} aria-label="Minh chứng thực tiễn">
        <h2 className={styles.sectionTitle}>MINH CHỨNG THỰC TIỄN</h2>

        <div className={styles.highlightBox}>
          <p>
            <strong>LỊCH SỬ:</strong> Trong giai đoạn <span className={styles.emphasis}>1954-1975, đặc biệt tại miền Bắc</span>, Nhà
            nước triển khai các <span className={styles.emphasis}>chiến dịch xóa mù chữ và cải cách giáo dục</span>,
            huy động đông đảo <span className={styles.emphasis}>thanh niên và sinh viên</span> tham gia giảng dạy tại
            nông thôn và vùng khó khăn. Hàng nghìn <span className={styles.emphasis}>thanh niên trí thức</span> đã tình
            nguyện truyền bá tri thức, góp phần{" "}
            <span className={styles.emphasis}>nâng cao dân trí và xây dựng nền tảng văn hóa xã hội chủ nghĩa</span>.
            Những thành quả này trở thành cơ sở quan trọng để tiếp tục{" "}
            <span className={styles.emphasis}>xây dựng nền văn hóa mới</span> và phát triển giáo dục trên phạm vi cả
            nước sau khi <span className={styles.emphasis}>thống nhất năm 1975</span>.{" "}
            <a
              href="https://plo.vn/80-nam-giao-duc-viet-nam-nhung-dau-an-noi-bat-post868506.html"
              target="_blank"
              rel="noreferrer"
              className={styles.inlineLink}
            >
              (Nguồn: Link tham khảo)
            </a>
          </p>
        </div>

        <figure className={styles.mainFigure}>
          <Image
            src="/images/tutuong-van-hoa/history-main.png"
            alt="Hàng nghìn thanh niên Hà Nội xung phong về các vùng nông thôn để dạy chữ"
            width={850}
            height={569}
            className={styles.mainImage}
            sizes="(max-width: 900px) 100vw, 80vw"
          />
          <figcaption>Hàng nghìn thanh niên Hà Nội xung phong về các vùng nông thôn để dạy chữ. Ảnh minh họa: TTXVN</figcaption>
        </figure>

        <div className={styles.highlightBox}>
          <p>
            <strong>HIỆN ĐẠI:</strong> Sinh viên và người trẻ trong các ngành công nghệ, thiết kế và truyền thông đã
            sáng tạo các sản phẩm số nhằm lan tỏa lịch sử và văn hóa dân tộc. Tiêu biểu là{" "}
            <span className={styles.emphasis}>game lịch sử “7554” tái hiện Chiến thắng Điện Biên Phủ</span>{" "}
            <a
              href="https://vietnamnet.vn/tai-ve-mien-phi-7554-game-ban-sung-mo-phong-tran-chien-dien-bien-phu-524654.html"
              target="_blank"
              rel="noreferrer"
              className={styles.inlineLink}
            >
              (Nguồn: Link tham khảo)
            </a>
            , cùng <span className={styles.emphasis}>các mô hình 3D di tích, bảo tàng</span>{" "}
            <a
              href="https://bvhttdl.gov.vn/di-san-thoi-so-hoa-20230509151219905.htm"
              target="_blank"
              rel="noreferrer"
              className={styles.inlineLink}
            >
              (Nguồn: Link tham khảo)
            </a>{" "}
            và <span className={styles.emphasis}>phim hoạt hình lịch sử</span>, góp phần quảng bá văn hóa Việt Nam và
            giáo dục truyền thống yêu nước trong thời đại số.
          </p>
        </div>

        <div className={styles.modernGrid}>
          <figure className={styles.modernFigure}>
            <Image
              src="/images/tutuong-van-hoa/modern-left.png"
              alt="Game 7554 tái hiện chiến thắng Điện Biên Phủ"
              width={600}
              height={400}
              className={styles.modernImage}
              sizes="(max-width: 760px) 48vw, 43vw"
            />
            <figcaption>Game 7554 tái hiện chiến thắng Điện Biên Phủ</figcaption>
          </figure>
          <figure className={styles.modernFigure}>
            <Image
              src="/images/tutuong-van-hoa/modern-right.png"
              alt="Không gian trưng bày triển lãm tranh sơn mài số hóa 3D"
              width={2000}
              height={1131}
              className={styles.modernImage}
              sizes="(max-width: 760px) 48vw, 43vw"
            />
            <figcaption>Không gian trưng bày triển lãm tranh sơn mài được số hóa 3D tại Bảo tàng Mỹ thuật Việt Nam.</figcaption>
          </figure>
        </div>

        <p className={styles.meaningText}>
          <strong>Ý NGHĨA:</strong> Những hoạt động này cho thấy sinh viên và thế hệ trẻ giữ vai trò quan trọng trong
          việc xây dựng và lan tỏa nền văn hóa xã hội chủ nghĩa, thông qua học tập, sáng tạo và ứng dụng công nghệ để
          bảo tồn, quảng bá lịch sử và bản sắc dân tộc, qua đó củng cố nền tảng tư tưởng và góp phần vào sự phát triển
          bền vững của đất nước.
        </p>
      </section>
    </article>
  );
}
