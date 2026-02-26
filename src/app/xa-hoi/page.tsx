import type { Metadata } from "next";
import { XaHoiScreen } from "@/components/social/xa-hoi-page";

export const metadata: Metadata = {
  title: "Xa hoi",
  description: "Tren linh vuc xa hoi: thiet lap cong bang va xoa bo tan du xa hoi cu.",
};

export default function XaHoiPage() {
  return <XaHoiScreen />;
}
