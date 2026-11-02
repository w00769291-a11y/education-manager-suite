import { createFileRoute } from "@tanstack/react-router";
import { NewApplication } from "@/components/sales/admissions/workspace";

export const Route = createFileRoute("/admission/application")({
  head: () => ({
    meta: [
      { title: "New Skill AI Application — Edusphere" },
      { name: "description", content: "Complete the Skill AI student admission dossier: personal, guardian, education, course preference and document sections." },
      { property: "og:title", content: "New Skill AI Application — Edusphere" },
      { property: "og:description", content: "Complete the Skill AI student admission dossier: personal, guardian, education, course preference and document sections." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SalesApplicationPage,
});

function SalesApplicationPage() {
  return <NewApplication />;
}
