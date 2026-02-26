import type { Metadata } from "next";
import { TuTuongVanHoaScreen } from "@/components/culture/tu-tuong-van-hoa-page";

export const metadata: Metadata = {
  title: "Tu tuong - van hoa",
  description: "Tren linh vuc tu tuong - van hoa: vai tro tien phong cua sinh vien.",
};

export default function TuTuongVanHoaPage() {
  return <TuTuongVanHoaScreen />;
}
