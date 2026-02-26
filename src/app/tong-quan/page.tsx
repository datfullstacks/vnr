import { Metadata } from "next";
import { TongQuanOverview } from "@/components/overview/tong-quan-overview";
import { tongQuanOverviewData } from "@/content/overview/tong-quan";

export const metadata: Metadata = {
  title: "Tong quan",
  description: tongQuanOverviewData.subtitle,
};

export default function TongQuanPage() {
  return <TongQuanOverview />;
}
