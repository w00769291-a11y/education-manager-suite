import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admission/agents")({
  component: AgentsLayout,
});

function AgentsLayout() {
  return <Outlet />;
}
