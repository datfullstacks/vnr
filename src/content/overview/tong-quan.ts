export type QuoteCardData = {
  person: string;
  statement: string;
  source: string;
  iconPath?: string;
};

export type EvidenceLink = {
  label: string;
  href: string;
};

export type EvidenceBlockData = {
  title: string;
  body: string[];
  links: EvidenceLink[];
};

export type GalleryItemData = {
  label: string;
  source: string;
  imagePath?: string;
  note?: string;
};

export type TongQuanOverviewData = {
  heading: string;
  subtitle: string;
  heroGallery: GalleryItemData[];
  theoryTitle: string;
  theoryBody: string;
  theoryTail: string;
  quoteSectionTitle: string;
  quoteCards: QuoteCardData[];
  evidenceSectionTitle: string;
  historicalEvidence: EvidenceBlockData;
  modernEvidence: EvidenceBlockData;
  historicalGallery: GalleryItemData[];
  modernGallery: GalleryItemData[];
};

export const tongQuanOverviewData: TongQuanOverviewData = {
  heading: "VAI TRÒ CỦA SINH VIÊN TRONG VIỆC XÂY DỰNG CHỦ NGHĨA XÃ HỘI",
  subtitle: "Tổng quan: Vai trò của sinh viên trong thời kỳ quá độ",
  heroGallery: [
    {
      label: "Bác Hồ với học sinh, sinh viên (Ảnh: Tư liệu)",
      source: "Tư liệu",
      imagePath: "/images/tongquan/21a6a28bae468a316e69b6b9cc98e02c1aaceeee.jpg",
      note: "https://hou.edu.vn/thong-bao/chu-tich-ho-chi-minh-voi-nha-truong-va-sinh-vien/",
    },
    {
      label: "Bác Hồ nói chuyện với cán bộ và sinh viên Bách khoa tại nhà ở sinh viên sáng mùng Một Tết Mậu Tuất (1958).",
      source: "Báo Nghệ An",
      imagePath: "/images/tongquan/171e210ee070b40ec7283fd4037caad13df1e20e.jpg",
      note: "https://baonghean.vn/bac-ho-voi-sinh-vien-viet-nam-10126582.html",
    },
  ],
  theoryTitle: "CƠ SỞ LÝ LUẬN",
  theoryBody:
    "Thời kỳ quá độ lên CNXH là một tất yếu khách quan. Dựa trên chủ nghĩa Mác - Lênin và tư tưởng Hồ Chí Minh, sinh viên (tầng lớp trí thức trẻ) được xác định là lực lượng bản lề nòng cốt, có sứ mệnh kế thừa sự nghiệp cách mạng và kiến tạo xã hội mới.",
  theoryTail:
    "Vai trò này không dừng ở nhận thức lý luận mà phải chuyển hóa thành hành động thực tiễn (học tập, lao động, tình nguyện) xuyên suốt các giai đoạn lịch sử và hiện đại.",
  quoteSectionTitle: "TƯ TƯỞNG CHỈ ĐẠO",
  quoteCards: [
    {
      person: "HỒ CHÍ MINH NHẤN MẠNH",
      statement:
        "Thanh niên là người chủ tương lai của nước nhà... Nước nhà thịnh hay suy, yếu hay mạnh một phần lớn là do các thanh niên.",
      source:
        "(trích từ Thư gửi các bạn thanh niên, tháng 8/1947, in trong Hồ Chí Minh Toàn tập, NXB Chính trị Quốc gia Sự thật)",
      iconPath: "/images/tongquan/1.svg",
    },
    {
      person: "V.I. LÊNIN NHẤN MẠNH",
      statement:
        "Về lý luận, không thể nào đánh bại được chủ nghĩa cơ hội... Phải có một thế hệ thanh niên mới, được giáo dục theo tinh thần cách mạng.",
      source:
        "(trích từ bài phát biểu Nhiệm vụ của Đoàn Thanh niên tại Đại hội lần thứ III Đoàn Thanh niên Cộng sản Nga, tháng 10/1920)",
      iconPath: "/images/tongquan/2.svg",
    },
  ],
  evidenceSectionTitle: "MINH CHỨNG THỰC TIỄN",
  historicalEvidence: {
    title: "LỊCH SỬ",
    body: [
      "Thanh niên sinh viên đóng góp vào chiến dịch Điện Biên Phủ.",
      "Tinh thần xếp bút nghiên lên đường ra trận qua phong trào chống Mỹ (1970-1972).",
      "Sinh viên trở thành lực lượng nòng cốt lan tỏa tư tưởng cách mạng, góp phần làm nên chiến thắng cho nước nhà.",
    ],
    links: [
      {
        label: "(Nguồn: Báo Nhân Dân)",
        href: "https://special.nhandan.vn/vai_tro_cua_thanh_nien_xung_phong_trong_chien_dich_dien_bien_phu/index.html",
      },
      {
        label: "(Nguồn: VietNamPlus)",
        href: "https://mega.vietnamplus.vn/xep-but-nghien-len-duong-ra-tran-nhung-thanh-nien-tiep-lua-chi-vien-mien-nam-6771.html",
      },
      {
        label: "(Xem thêm các mốc son lịch sử tại: Đoàn Thanh niên Cộng sản Hồ Chí Minh)",
        href: "https://doanthanhnien.vn/tin-tuc/xay-dung-doan/nhung-moc-son-lich-su-cua-doan",
      },
    ],
  },
  modernEvidence: {
    title: "HIỆN ĐẠI",
    body: [
      "Ở thời hiện đại có các chương trình tình nguyện quốc gia tiêu biểu như Tình nguyện mùa Đông, Xuân tình nguyện, Tháng ba biên giới, Tiếp sức mùa thi...",
    ],
    links: [],
  },
  historicalGallery: [
    {
      label: "Sinh viên Đại học Kinh tế Kế hoạch (nay là Đại học Kinh tế Quốc dân) trước giờ lên đường nhập ngũ tháng 9/1971.",
      source: "Tư liệu lịch sử",
      imagePath: "/images/tongquan/2c4d62277118760f72a91f4c27ca767d713b5d9c.jpg",
    },
    {
      label: "Lễ xuất phát của đoàn thanh niên xung phong Hà Nội lên đường chống Mỹ, cứu nước, tổ chức ở Nhà hát Lớn Hà Nội, ngày 11/7/1969. (Ảnh: Tư liệu/TTXVN)",
      source: "Tư liệu/TTXVN",
      imagePath: "/images/tongquan/fec8dd5db8e2fd750fa3cef8841582d2f709bbbe.jpg",
    },
  ],
  modernGallery: [
    {
      label: "Chương trình tình nguyện hè",
      source: "Hoạt động hiện đại",
      imagePath: "/images/tongquan/4aaa7547f52bfd5ae6d23a7d7406a04818001c5b.jpg",
    },
    {
      label: "Tháng ba biên giới",
      source: "Phong trào thanh niên",
      imagePath: "/images/tongquan/5f5ec2228e9bfd25732985c97b8fb5a8c26a0818.jpg",
    },
    {
      label: "Tiếp sức mùa thi",
      source: "Hoạt động cộng đồng",
      imagePath: "/images/tongquan/74ced12a3a614db21c9fb6053e87019818ba8e09.jpg",
    },
  ],
};
