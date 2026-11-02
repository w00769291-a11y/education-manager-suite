import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/AppShell";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Workspace — Manager Edu" },
      { name: "description", content: "Manager Edu workspace module for schools." },
      { property: "og:title", content: "Workspace — Manager Edu" },
      { property: "og:description", content: "Manager Edu workspace module for schools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WorkspacePage,
});

function WorkspacePage() {
  return <ModulePage title="Workspace" stats={[["Projects", "9"], ["Tasks Due", "23"], ["Documents", "418"], ["Members", "52"]] as [string, string, string?][]} panels={[{"title": "My Tasks", "rows": [["Finalize report cards", "Today"], ["Review budget draft", "Nov 3"], ["Plan sports week", "Nov 8"]]}, {"title": "Shared Folders", "rows": [["Curriculum 2026-27", "64 files"], ["Board Meetings", "22 files"]]}] as { title: string; rows: [string, string][] }[]} />;
}
