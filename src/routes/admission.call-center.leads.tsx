import { createFileRoute } from "@tanstack/react-router";
import { AssignPage } from "@/components/sales/call-center/leads";
import { callCenterHead } from "@/components/sales/call-center/navigation";
export const Route = createFileRoute("/admission/call-center/leads")({
  head: () => callCenterHead("Assign Leads", "Manage call-center leads, assign agents and export call outcomes."),
  component: AssignPage,
});