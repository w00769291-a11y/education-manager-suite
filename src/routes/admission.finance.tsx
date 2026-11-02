import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsList } from "@/components/sales/admissions/workspace";

export const Route = createFileRoute("/admission/finance")({
  head: () => ({
    meta: [
      { title: "Finance Desk — Edusphere" },
      { name: "description", content: "Track the Skill AI tuition ledger, instalment payments and approve admissions or mandate corrections." },
      { property: "og:title", content: "Finance Desk — Edusphere" },
      { property: "og:description", content: "Track the Skill AI tuition ledger, instalment payments and approve admissions or mandate corrections." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SalesFinancePage,
});

function SalesFinancePage() {
  return <ApplicationsList finance />;
}
