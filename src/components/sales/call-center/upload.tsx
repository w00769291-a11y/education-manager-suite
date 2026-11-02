import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { bulkInsertLeads } from "./data";
import { Upload, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";


type ParsedLead = {
  name: string;
  phone?: string | null;
  email?: string | null;
  source?: string | null;
  notes?: string | null;
};

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function pick(row: Record<string, unknown>, keys: string[]): string | null {
  const nk = keys.map(norm);
  for (const k of nk) {
    for (const rk of Object.keys(row)) {
      if (norm(rk) === k) {
        const v = row[rk];
        if (v != null && String(v).trim() !== "") return String(v).trim();
      }
    }
  }
  return null;
}

// Merged header cells in the sample sheet produce "Unnamed: N" columns that
// still carry values (e.g. the course next to the college name).
function unnamedValues(row: Record<string, unknown>): string[] {
  return Object.keys(row)
    .filter((k) => /^unnamed/i.test(k.trim()))
    .map((k) => (row[k] == null ? "" : String(row[k]).trim()))
    .filter((v) => v !== "");
}

export function UploadPage() {
  const [rows, setRows] = useState<ParsedLead[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const insert = bulkInsertLeads;
  const qc = useQueryClient();
  const mut = useMutation({
    mutationFn: (leads: ParsedLead[]) => insert({ data: { leads } }),
    onSuccess: (res) => {
      toast.success(`Imported ${res.count} leads`);
      setRows([]);
      setFileName(null);
      if (inputRef.current) inputRef.current.value = "";
      qc.invalidateQueries({ queryKey: ["call-center"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function onFile(file: File) {
    setFileName(file.name);
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const sheetName = wb.SheetNames[0];
    const sheet = sheetName ? wb.Sheets[sheetName] : undefined;
    if (!sheet) { toast.error("No worksheet found."); return; }
    // Find the header row (files sometimes start with a title row)
    const grid = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });
    let headerRow = 0;
    for (let i = 0; i < Math.min(grid.length, 15); i++) {
      const cells = (grid[i] ?? []).map((c) => norm(String(c ?? "")));
      if (cells.some((c) => c.includes("name")) && cells.some((c) => c.includes("mobile") || c.includes("phone") || c.includes("email"))) {
        headerRow = i;
        break;
      }
    }
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
      range: headerRow,
    });
    const parsed: ParsedLead[] = [];
    for (const r of json) {
      const name = pick(r, ["student name", "students name", "name", "full name", "customer", "lead"]);
      if (!name) continue;

      const college = pick(r, ["collage name", "college name", "college", "institution", "source", "channel"]);
      const place = pick(r, ["place", "city", "location", "district"]);
      const prev = pick(r, ["privous coures", "previous course", "previous coures", "prev course", "qualification"]);
      const extras = unnamedValues(r);
      const course = pick(r, ["course", "degree", "stream"]) ?? extras[0] ?? null;
      const sl = pick(r, ["sl.no", "slno", "sl no", "s.no", "sno"]);
      const existingNotes = pick(r, ["notes", "comments", "remarks"]);

      const noteParts = [
        sl ? `SL No: ${sl}` : null,
        college ? `College: ${college}` : null,
        course ? `Course: ${course}` : null,
        place ? `Place: ${place}` : null,
        prev ? `Previous course: ${prev}` : null,
        existingNotes,
      ].filter(Boolean) as string[];

      parsed.push({
        name,
        phone: pick(r, ["mobile number", "mobile no", "mobile", "phone number", "phone", "contact number", "contact", "number"]),
        email: pick(r, ["email", "email id", "e-mail", "mail"]),
        source: college,
        notes: noteParts.length ? noteParts.join(" | ") : null,
      });
    }
    setRows(parsed);
    if (parsed.length === 0) toast.warning("No valid rows found. Need a 'student name' column.");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm  ">
        <p className="text-sm text-foreground ">
          Upload an Excel or CSV file in the standard format — columns:{" "}
          <span className="font-medium text-foreground ">
            SL.no, Collage name, Course, student name, place, mobile number, privous coures, email
          </span>
          .
        </p>
        <p className="mt-2 text-xs text-muted-foreground ">
          Student name and mobile number are used as the lead's name and phone; college becomes the source, and course /
          place / previous course are saved into the lead notes.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-8 shadow-sm  ">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-12 transition hover:border-primary hover:bg-primary/40   :border-primary :bg-primary/5">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary   text-primary-foreground shadow-md">
            <Upload className="h-6 w-6" />
          </div>
          <div className="font-semibold text-foreground ">Click to choose file</div>
          <div className="mt-1 text-xs text-muted-foreground ">.xlsx, .xls, .csv</div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </label>
      </div>

      {fileName && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm  ">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <FileSpreadsheet className="h-5 w-5 flex-shrink-0 text-primary " />
              <span className="truncate font-medium text-foreground ">{fileName}</span>
              <span className="text-sm text-muted-foreground ">— {rows.length} valid rows</span>
            </div>
            <Button
              onClick={() => mut.mutate(rows)}
              disabled={rows.length === 0 || mut.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary   px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition hover:shadow-lg disabled:opacity-60"
            >
              <CheckCircle2 className="h-4 w-4" />
              {mut.isPending ? "Importing…" : `Import ${rows.length}`}
            </Button>
          </div>
          {rows.length > 0 && (
            <div className="max-h-96 overflow-auto rounded-lg border border-border ">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted text-xs uppercase tracking-wider text-muted-foreground  ">
                  <tr>
                    <th className="p-3 text-left font-semibold">Student name</th>
                    <th className="p-3 text-left font-semibold">Mobile</th>
                    <th className="p-3 text-left font-semibold">Email</th>
                    <th className="p-3 text-left font-semibold">College</th>
                    <th className="p-3 text-left font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 100).map((r, i) => (
                    <tr key={i} className="border-t border-border ">
                      <td className="p-3 font-medium text-foreground ">{r.name}</td>
                      <td className="p-3 text-foreground ">{r.phone}</td>
                      <td className="p-3 text-foreground ">{r.email}</td>
                      <td className="p-3 text-foreground ">{r.source}</td>
                      <td className="max-w-xs truncate p-3 text-xs text-muted-foreground ">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 100 && (
                <div className="p-2 text-center text-xs text-muted-foreground">
                  Showing first 100 of {rows.length}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
