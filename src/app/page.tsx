// src/app/page.tsx
"use client";

import React, { useState } from "react";
import PageShell from "@/components/PageShell";
import UploadZone from "@/components/UploadZone";
import ParsedTable from "@/components/ParsedTable";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Download, CalendarDays } from "lucide-react";
import { humanSize } from "@/lib/utils/files";
import type { ParseResult, SyllabusItem } from "@/types/syllabus";

type FileMeta = { name: string; size: number; type: string };

export default function HomePage() {
  const [rawText, setRawText] = useState<string>("");
  const [fileMeta, setFileMeta] = useState<FileMeta | null>(null);
  const [error, setError] = useState<string>("");

  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const [parsing, setParsing] = useState(false);

  // extractor diagnostics from /api/extract
  const [extractDebug, setExtractDebug] = useState<any>(null);

  function handleExtracted(text: string, meta: FileMeta) {
    setRawText(text);
    setFileMeta(meta);
    setParsed(null);
    setError("");
  }

  function copyText() {
    if (!rawText) return;
    navigator.clipboard.writeText(rawText).catch(() => {});
  }

  function downloadTxt() {
    const blob = new Blob([rawText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (fileMeta?.name ?? "syllabus") + ".extracted.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function runParse() {
    if (!rawText) return;
    setParsing(true);
    setError("");
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? `Parse failed (${res.status})`);
      }
      const j = (await res.json()) as ParseResult;
      setParsed(j);
    } catch (e) {
      setParsed(null);
      const msg = e instanceof Error ? e.message : "Parse failed";
      setError(msg);
    } finally {
      setParsing(false);
    }
  }

  async function exportICS(items: SyllabusItem[]) {
    try {
      const res = await fetch("/api/ics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "ICS export failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "syllabus.ics";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "ICS export failed";
      setError(msg);
    }
  }

  return (
    <PageShell>
      <div className="space-y-6">
        <UploadZone
          onExtracted={handleExtracted}
          onError={(msg) => setError(msg)}
          onDebug={(dbg) => setExtractDebug(dbg)}
        />

        {error && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {extractDebug && (
          <Card>
            <CardHeader>
              <CardTitle>Extractor diagnostics</CardTitle>
              <CardDescription>
                Header OK: {String(extractDebug.pdfHeaderOk)} · Approx pages:{" "}
                {extractDebug.approxPages ?? "—"} · Chars/page:{" "}
                {extractDebug.charsPerPage ?? "—"}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {rawText && (
          <Card>
            <CardHeader className="flex flex-col gap-1">
              <CardTitle>Extracted text preview</CardTitle>
              <CardDescription>
                {fileMeta?.name} · {fileMeta && humanSize(fileMeta.size)} ·{" "}
                {fileMeta?.type}
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-3 pt-4">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={copyText}>
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
                <Button size="sm" variant="outline" onClick={downloadTxt}>
                  <Download className="h-4 w-4 mr-2" /> Download .txt
                </Button>
                <Button size="sm" onClick={runParse} disabled={parsing}>
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {parsing ? "Parsing…" : "Parse to items"}
                </Button>
              </div>
              <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap rounded-md border p-3 text-sm leading-6">
                {rawText}
              </pre>
            </CardContent>
          </Card>
        )}

        {parsed && (
          <ParsedTable
            initial={parsed.items}
            warnings={parsed.warnings}
            stats={parsed.stats}
            onExport={exportICS}
          />
        )}
      </div>
    </PageShell>
  );
}