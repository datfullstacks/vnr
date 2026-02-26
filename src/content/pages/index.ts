import chinhTri from "@/content/pages/chinh-tri.json";
import kinhTe from "@/content/pages/kinh-te.json";
import tongQuan from "@/content/pages/tong-quan.json";
import tuTuongVanHoa from "@/content/pages/tu-tuong-van-hoa.json";
import xaHoi from "@/content/pages/xa-hoi.json";
import { TopicPageData } from "@/lib/content-types";

export const topicPages: Record<string, TopicPageData> = {
  "tong-quan": tongQuan as TopicPageData,
  "kinh-te": kinhTe as TopicPageData,
  "chinh-tri": chinhTri as TopicPageData,
  "tu-tuong-van-hoa": tuTuongVanHoa as TopicPageData,
  "xa-hoi": xaHoi as TopicPageData,
};