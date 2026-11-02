import { createFileRoute } from "@tanstack/react-router";
import { CallCenterAgentsPage } from "@/components/sales/call-center/agents";
import { callCenterHead } from "@/components/sales/call-center/navigation";
export const Route = createFileRoute("/admission/call-center/agents")({
  head: () => callCenterHead("Manage Agents", "Manage the Sales Call Center agent directory for lead assignment."),
  component: CallCenterAgentsPage,
});