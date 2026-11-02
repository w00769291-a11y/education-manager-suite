import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "@/components/sales/call-center/reports";
import { callCenterHead } from "@/components/sales/call-center/navigation";
export const Route = createFileRoute("/admission/call-center/reports")({
  head: () => callCenterHead("Reports", "Filter call-center outcomes and export lead reports and per-agent summaries."),
  component: ReportsPage,
});