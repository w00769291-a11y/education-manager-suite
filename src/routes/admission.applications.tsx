import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsList } from "@/components/sales/admissions/workspace";

export const Route = createFileRoute("/admission/applications")({
  head: () => ({
    meta: [
      { title: "Skill AI Applications — Edusphere" },
      { name: "description", content: "Review submitted Skill AI student applications, verify documents and manage admission status." },
      { property: "og:title", content: "Skill AI Applications — Edusphere" },
      { property: "og:description", content: "Review submitted Skill AI student applications, verify documents and manage admission status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SalesApplicationsPage,
});

function SalesApplicationsPage() {
  return <ApplicationsList />;
}
