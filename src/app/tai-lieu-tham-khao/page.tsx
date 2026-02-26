import type { Metadata } from "next";
import { TaiLieuThamKhaoScreen } from "@/components/references/tai-lieu-tham-khao-page";

export const metadata: Metadata = {
  title: "Tai lieu tham khao",
  description: "Danh sach cac nguon tai lieu duoc su dung trong du an.",
};

export default function TaiLieuThamKhaoPage() {
  return <TaiLieuThamKhaoScreen />;
}
