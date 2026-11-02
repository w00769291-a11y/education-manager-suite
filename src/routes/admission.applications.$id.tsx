import { createFileRoute } from "@tanstack/react-router";
import { ApplicationDetail } from "@/components/sales/admissions/workspace";

export const Route = createFileRoute("/admission/applications/$id")({
  head: () => ({
    meta: [
      { title: "Application Review — Edusphere" },
      { name: "description", content: "Inspect a Skill AI application, run Administrator and Accountant dual signoffs and track the tuition ledger." },
      { property: "og:title", content: "Application Review — Edusphere" },
      { property: "og:description", content: "Inspect a Skill AI application, run Administrator and Accountant dual signoffs and track the tuition ledger." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SalesApplicationDetailPage,
});

function SalesApplicationDetailPage() {
  const { id } = Route.useParams();
  return <ApplicationDetail id={id} />;
}
