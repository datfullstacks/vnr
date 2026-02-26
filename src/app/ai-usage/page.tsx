import { Metadata } from "next";
import { AiUsageScreen } from "@/components/ai-usage/ai-usage-page";

export const metadata: Metadata = {
  title: "AI Usage",
  description:
    "Mục tiêu sử dụng AI, vai trò của từng công cụ và quy trình kiểm chứng thông tin của nhóm.",
};

export default function AiUsagePage() {
  return <AiUsageScreen />;
}
