import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsPage } from "@/components/sales/call-center/analytics";
import { callCenterHead } from "@/components/sales/call-center/navigation";
export const Route = createFileRoute("/admission/call-center/")({
  head: () => callCenterHead("Overview", "Call-center lead funnel, sources, trends and agent performance."),
  component: AnalyticsPage,
});