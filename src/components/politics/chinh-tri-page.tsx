import Image from "next/image";
import styles from "./chinh-tri-page.module.css";

const roleItems = [
  "Bảo vệ nền tảng tư tưởng của Đảng",
  "Củng cố nhà nước pháp quyền xã hội chủ nghĩa",
  "Lan tỏa ý thức công dân và tinh thần thượng tôn pháp luật",
];

export function ChinhTriScreen() {
  return (
    <article className={`paper-panel ${styles.chinhTriPage}`}>
      <header className={styles.heroSection}>
        <h1 className={styles.pageTitle}>Trên Lĩnh Vực Chính Trị</h1>
        <div className={styles.quotePanel}>
          <p className={styles.quoteText}>
            <strong>“</strong> Trong thời kỳ quá độ từ chủ nghĩa tư bản lên chủ nghĩa xã hội, nhiệm vụ chính trị là{" "}
            <strong>thiết lập, củng cố và tăng cường quyền lực của giai cấp công nhân thông qua nhà nước</strong>, nhằm
            tổ chức xây dựng xã hội mới và bảo vệ chế độ xã hội chủ nghĩa. Quá trình này bao gồm việc thực hiện dân chủ với
            nhân dân, đồng thời đấu tranh chống các thế lực chống phá, với hình thức chủ yếu trong điều kiện hiện nay là{" "}
            <strong>đấu tranh hòa bình thông qua pháp luật, giáo dục và tổ chức xã hội.</strong> <strong>”</strong>
          </p>
          <p className={styles.quoteSource}>(Theo giáo trình Chủ nghĩa xã hội khoa học (2021), tr.108)</p>
        </div>
      </header>

      <section className={styles.pioneerSection} aria-label="Vai trò tiên phong của sinh viên">
        <h2 className={styles.sectionTitle}>VAI TRÒ TIÊN PHONG CỦA SINH VIÊN</h2>
        <p className={styles.pioneerLead}>
          Sinh viên là lực lượng trí thức trẻ, có khả năng tiếp thu tri thức chính trị và pháp luật nhanh chóng, từ đó góp
          phần:
        </p>
        <div className={styles.roleGrid}>
          {roleItems.map((role) => (
            <article key={role} className={styles.roleCard}>
              <span className={styles.roleIcon} aria-hidden="true" />
              <h3>{role}</h3>
            </article>
          ))}
        </div>
        <p className={styles.arrowCallout}>
          <strong>→</strong> Với lợi thế sử dụng công nghệ và mạng xã hội, sinh viên trở thành lực lượng quan trọng trên mặt
          trận chính trị - tư tưởng trong thời đại số.
        </p>
      </section>

      <section className={styles.actionSection} aria-label="Hành động cụ thể của sinh viên">
        <h2 className={styles.sectionTitle}>HÀNH ĐỘNG CỤ THỂ CỦA SINH VIÊN TRONG LĨNH VỰC CHÍNH TRỊ</h2>
        <div className={styles.actionPanel}>
          <button type="button" className={styles.actionArrow} aria-label="Slide trước">
            ‹
          </button>
          <div className={styles.actionContent}>
            <p className={styles.actionHeading}>
              Học tập lý luận chính trị và pháp luật, đặc biệt là Hiến pháp và các luật liên quan
            </p>
            <div className={styles.actionMediaGrid}>
              <figure className={styles.mediaFigure}>
                <Image
                  src="/images/chinhtri/action-left.png"
                  alt="Sinh viên ĐHQG-HCM theo dõi phiên tòa giả định tại ký túc xá"
                  width={1430}
                  height={804}
                  className={styles.mediaImage}
                  sizes="(max-width: 760px) 44vw, 40vw"
                />
                <figcaption>
                  Sinh viên ĐHQG-HCM được học pháp luật, theo dõi phiên toà giả định ngay tại ký túc xá.
                </figcaption>
                <a
                  className={styles.sourceLink}
                  href="https://vnuhcm.edu.vn/bai-viet/sinh-vien-dhqg-hcm-duoc-hoc-phap-luat-theo-doi-phien-toa-gia-dinh-ngay-tai-ky-tuc-xa"
                  target="_blank"
                  rel="noreferrer"
                >
                  Xem thêm chi tiết tại đây
                </a>
              </figure>
              <figure className={styles.mediaFigure}>
                <Image
                  src="/images/chinhtri/action-right.png"
                  alt="Hội thi Olympic các môn khoa học Mác-Lênin, tư tưởng Hồ Chí Minh"
                  width={870}
                  height={546}
                  className={styles.mediaImage}
                  sizes="(max-width: 760px) 44vw, 34vw"
                />
                <figcaption>Hội thi Olympic các môn khoa học Mác-Lênin, tư tưởng Hồ Chí Minh.</figcaption>
                <a
                  className={styles.sourceLink}
                  href="https://www.qdnd.vn/quoc-phong-an-ninh/tin-tuc/be-mac-hoi-thi-olympic-cac-mon-khoa-hoc-mac-lenin-tu-tuong-ho-chi-minh-cac-truong-cao-dang-trung-cap-trong-quan-doi-1015027"
                  target="_blank"
                  rel="noreferrer"
                >
                  Xem thêm chi tiết tại đây
                </a>
              </figure>
            </div>
            <div className={styles.dotRow} aria-hidden="true">
              <span className={`${styles.dot} ${styles.dotActive}`} />
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
          <button type="button" className={styles.actionArrow} aria-label="Slide sau">
            ›
          </button>
        </div>
        <p className={styles.arrowCallout}>
          <strong>→</strong> Những hành động này góp phần xây dựng xã hội ổn định, công bằng và đúng định hướng với hệ
          chính trị.
        </p>
      </section>

      <section className={styles.evidenceSection} aria-label="Minh chứng thực tiễn chính trị">
        <h2 className={styles.evidenceTitle}>MINH CHỨNG THỰC TIỄN</h2>

        <div className={styles.highlightBlock}>
          <p>
            <strong>LỊCH SỬ</strong> Phong trào của các học sinh, sinh viên diễn ra mạnh mẽ quyết liệt từ{" "}
            <em>phong trào sinh viên trong Cách mạng Tháng Tám 1945</em>{" "}
            <a
              href="https://lsvn.vn/tong-hoi-sinh-vien-dong-duong-voi-cach-mang-thang-8-nam-1945-1692379598-a134202.html#:~:text=Ngay%20sau%20bu%E1%BB%95i%20h%E1%BB%8Dp%2C%20b%E1%BB%91n,V%C4%83n%20h%E1%BB%8Dc%2C%20HN%2C%202000."
              target="_blank"
              rel="noreferrer"
              className={styles.inlineSource}
            >
              (Nguồn: Tạp chí điện tử Luật sư Việt Nam)
            </a>
            , dẫn đầu bởi Tổng hội sinh viên Đông Dương, đóng vai trò xung kích quan trọng; đến phong trào biểu tình đấu
            tranh xuyên suốt thời chống Mỹ - Ngụy{" "}
            <a
              href="https://hcmcpv.org.vn/tin-tuc/phong-trao-dau-tranh-yeu-nuoc-cua-hoc-sinh-sinh-vien-mien-nam-trong-thoi-ky-khang-chien-chong-my-cu-1491889344"
              target="_blank"
              rel="noreferrer"
              className={styles.inlineSource}
            >
              (Nguồn: Trang tin Điện tử Đảng bộ Thành phố Hồ Chí Minh)
            </a>
            .
          </p>
        </div>

        <div className={styles.historyLayout}>
          <figure className={styles.historyMainFigure}>
            <Image
              src="/images/chinhtri/history-left.png"
              alt="Bản nhạc Tiến quân ca và bài báo về cuộc họp do Tổng hội sinh viên tổ chức"
              width={815}
              height={1000}
              className={styles.mediaImage}
              sizes="(max-width: 760px) 56vw, 53vw"
            />
            <figcaption>
              Bản nhạc Tiến quân ca và bài báo về cuộc họp do Tổng hội sinh viên tổ chức tại Việt Nam học xá, Bình Minh,
              23/8/1945. Ảnh tư liệu.
            </figcaption>
          </figure>

          <div className={styles.historySideColumn}>
            <figure className={styles.mediaFigure}>
              <Image
                src="/images/chinhtri/history-right-top.png"
                alt="Một cuộc đụng độ giữa học sinh sinh viên Sài Gòn với cảnh sát"
                width={660}
                height={472}
                className={styles.mediaImage}
                sizes="(max-width: 760px) 36vw, 39vw"
              />
              <figcaption>Một cuộc đụng độ giữa HS, SV Sài Gòn với cảnh sát trong thời kỳ kháng chiến chống Mỹ cứu nước.</figcaption>
            </figure>
            <figure className={styles.mediaFigure}>
              <Image
                src="/images/chinhtri/history-right-bottom.png"
                alt="Cuộc đấu tranh của học sinh sinh viên trước bùng binh chợ Bến Thành"
                width={628}
                height={449}
                className={styles.mediaImage}
                sizes="(max-width: 760px) 36vw, 39vw"
              />
              <figcaption>Cuộc đấu tranh của HS, SV và quần chúng nhân dân chống Mỹ - Ngụy trước bùng binh chợ Bến Thành.</figcaption>
            </figure>
          </div>
        </div>

        <Image
          src="/images/chinhtri/down-arrow.svg"
          alt=""
          aria-hidden="true"
          width={27}
          height={56}
          className={styles.downArrow}
        />

        <div className={`${styles.highlightBlock} ${styles.modernBlock}`}>
          <p>
            <strong>HIỆN ĐẠI</strong> Trong thời kỳ hội nhập, nhiều phong trào sinh viên quy mô toàn quốc đã góp phần củng
            cố nền tảng chính trị và pháp luật, tiêu biểu như chiến dịch <em>“Mùa hè xanh”</em>{" "}
            <a
              href="https://doanthanhnien.vn/tin-tuc/mua-he-xanh/xuat-quan-chien-dich-sinh-vien-tinh-nguyen-%E2%80%9Cmua-he-xanh%E2%80%9D-2024-sang-mai-ngon-lua-%E2%80%9Cba-san-sang%E2%80%9D"
              target="_blank"
              rel="noreferrer"
              className={styles.inlineSource}
            >
              (Nguồn: Trung ương Đoàn TNCS Hồ Chí Minh)
            </a>
            , các cuộc thi Olympic các môn khoa học Mác - Lênin và tư tưởng Hồ Chí Minh, hay chương trình tuyên truyền pháp
            luật do Trung ương Đoàn và Hội Sinh viên Việt Nam tổ chức{" "}
            <a
              href="https://doanthanhnien.vn/tin-tuc/cong-tac-tuyen-truyen-giao-duc/binh-duong-da-dang-cac-hoat-dong-huong-ung-ngay-phap-luat-viet-nam"
              target="_blank"
              rel="noreferrer"
              className={styles.inlineSource}
            >
              (Nguồn: Trung ương Đoàn TNCS Hồ Chí Minh)
            </a>
            . Những hoạt động này thể hiện vai trò của sinh viên trong việc nâng cao nhận thức chính trị, góp phần giữ vững
            ổn định xã hội và bảo vệ nền tảng tư tưởng của đất nước.
          </p>
        </div>

        <div className={styles.modernLayout}>
          <figure className={styles.mediaFigure}>
            <Image
              src="/images/chinhtri/modern-left.png"
              alt="Chiến dịch xanh Mùa hè xanh"
              width={1280}
              height={849}
              className={styles.mediaImage}
              sizes="(max-width: 760px) 46vw, 46vw"
            />
            <figcaption>Chiến dịch xanh “Mùa hè xanh”.</figcaption>
          </figure>
          <figure className={styles.mediaFigure}>
            <Image
              src="/images/chinhtri/modern-right.png"
              alt="Chương trình hưởng ứng Ngày pháp luật Việt Nam"
              width={800}
              height={509}
              className={styles.mediaImage}
              sizes="(max-width: 760px) 46vw, 46vw"
            />
            <figcaption>
              Chương trình hưởng ứng “Ngày pháp luật Nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam 9/11” năm 2020.
            </figcaption>
          </figure>
        </div>

        <Image
          src="/images/chinhtri/down-arrow.svg"
          alt=""
          aria-hidden="true"
          width={27}
          height={56}
          className={styles.downArrow}
        />

        <p className={styles.meaningText}>
          <strong>Ý NGHĨA:</strong> Những hoạt động này thể hiện sinh viên là lực lượng chính trị - xã hội quan trọng, góp
          phần bảo vệ nền tảng tư tưởng của Đảng, củng cố nhà nước pháp quyền xã hội chủ nghĩa và tạo nền tảng ổn định cho
          quá trình xây dựng CNXH.
        </p>
      </section>
    </article>
  );
}
