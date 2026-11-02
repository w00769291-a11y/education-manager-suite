import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/AppShell";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Finance — Manager Edu" },
      { name: "description", content: "Manager Edu finance module for schools." },
      { property: "og:title", content: "Finance — Manager Edu" },
      { property: "og:description", content: "Manager Edu finance module for schools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FinancePage,
});

function FinancePage() {
  return <ModulePage title="Finance" stats={[["Revenue", "₹1.2Cr"], ["Outstanding", "₹8.6L"], ["Expenses", "₹72L"], ["Invoices", "1,204"]] as [string, string, string?][]} panels={[{"title": "Recent Payments", "rows": [["INV-2041 — Aarav S.", "₹24,000"], ["INV-2040 — Meera P.", "₹18,500"], ["INV-2039 — Rohan D.", "₹24,000"]]}, {"title": "Overdue", "rows": [["Grade 10 — 14 students", "₹3.1L"], ["Grade 7 — 9 students", "₹1.8L"]]}] as { title: string; rows: [string, string][] }[]} />;
}
