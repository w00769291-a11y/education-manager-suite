import { createFileRoute } from "@tanstack/react-router";
import { AgentLeadsPage } from "@/components/sales/call-center/my-leads";
import { callCenterHead } from "@/components/sales/call-center/navigation";
export const Route = createFileRoute("/admission/call-center/my-leads")({
  head: () => callCenterHead("Agent Leads", "View agent leads, call students and record the latest call outcomes."),
  component: AgentLeadsPage,
});