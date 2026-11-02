import { createFileRoute } from "@tanstack/react-router";
import { UploadPage } from "@/components/sales/call-center/upload";
import { callCenterHead } from "@/components/sales/call-center/navigation";
export const Route = createFileRoute("/admission/call-center/upload")({
  head: () => callCenterHead("Upload Leads", "Import Excel and CSV student leads into the Sales Call Center."),
  component: UploadPage,
});