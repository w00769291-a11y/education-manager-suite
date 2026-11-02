import { createFileRoute } from "@tanstack/react-router";
import { FormBuilder } from "@/components/sales/admissions/workspace";

export const Route = createFileRoute("/admission/form-builder")({
  head: () => ({
    meta: [
      { title: "Visual Form Builder — Edusphere" },
      { name: "description", content: "Configure Skill AI form sections, custom fields and the course fee matrix." },
      { property: "og:title", content: "Visual Form Builder — Edusphere" },
      { property: "og:description", content: "Configure Skill AI form sections, custom fields and the course fee matrix." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SalesFormBuilderPage,
});

function SalesFormBuilderPage() {
  return <FormBuilder />;
}
