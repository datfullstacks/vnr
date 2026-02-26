import type { Metadata } from "next";
import { ChinhTriScreen } from "@/components/politics/chinh-tri-page";

export const metadata: Metadata = {
  title: "Chính trị",
  description: "Trên lĩnh vực chính trị: vai trò tiên phong của sinh viên trong xây dựng CNXH.",
};

export default function ChinhTriPage() {
  return <ChinhTriScreen />;
}
