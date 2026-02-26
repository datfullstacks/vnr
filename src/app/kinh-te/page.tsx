import type { Metadata } from "next";
import { KinhTeScreen } from "@/components/economy/kinh-te-page";

export const metadata: Metadata = {
  title: "Kinh tế",
  description: "Trên lĩnh vực kinh tế: xây dựng cơ sở vật chất - kỹ thuật cho xã hội mới.",
};

export default function KinhTePage() {
  return <KinhTeScreen />;
}
