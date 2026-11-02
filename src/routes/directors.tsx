import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/AppShell";

export const Route = createFileRoute("/directors")({
  head: () => ({
    meta: [
      { title: "Directors — Manager Edu" },
      { name: "description", content: "Manager Edu directors module for schools." },
      { property: "og:title", content: "Directors — Manager Edu" },
      { property: "og:description", content: "Manager Edu directors module for schools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DirectorsPage,
});

function DirectorsPage() {
  return <ModulePage title="Directors" stats={[["Board members", "6"], ["Meetings this term", "8"], ["Resolutions passed", "14"], ["Branches", "3"]] as [string, string, string?][]} panels={[{"title": "Board Members", "rows": [["Dr. K. Ramesh — Chairman", "Active"], ["Lakshmi Menon — Vice Chair", "Active"], ["Suresh Pillai — Trustee", "Active"]]}, {"title": "Upcoming Meetings", "rows": [["Annual budget review", "Nov 12"], ["Expansion committee", "Nov 20"], ["Parent council briefing", "Dec 3"]]}] as { title: string; rows: [string, string][] }[]} />;
}
