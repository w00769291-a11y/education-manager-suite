import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/AppShell";

export const Route = createFileRoute("/academic")({
  head: () => ({
    meta: [
      { title: "Academic — Manager Edu" },
      { name: "description", content: "Manager Edu academic module for schools." },
      { property: "og:title", content: "Academic — Manager Edu" },
      { property: "og:description", content: "Manager Edu academic module for schools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AcademicPage,
});

function AcademicPage() {
  return <ModulePage title="Academic" stats={[["Classes", "64"], ["Subjects", "38"], ["Attendance", "94%"], ["Avg Score", "78%"]] as [string, string, string?][]} panels={[{"title": "Today's Timetable", "rows": [["Gr 8A — Mathematics", "9:00 AM"], ["Gr 9B — Physics", "10:00 AM"], ["Gr 6C — English", "11:15 AM"]]}, {"title": "Exams", "rows": [["Mid-term", "Nov 12"], ["Unit Test 3", "Dec 2"]]}] as { title: string; rows: [string, string][] }[]} />;
}
