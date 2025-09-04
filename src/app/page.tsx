// src/app/page.tsx
"use client";

import React from "react";
import PageShell from "@/components/PageShell";
import UploadZone from "@/components/UploadZone";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { humanSize } from "@/lib/utils/files";
import { Copy, Download } from "lucide-react";

type FileMeta = { name: string; size: number; type: string };

export default function HomePage() {
  const [rawText, setRawText] = React.useState<string>("");
  const [fileMeta, setFileMeta] = React.useState<FileMeta | null>(null);
  const [error, setError] = React.useState<string>("");

  function handleExtracted(text: string, meta: FileMeta) {
    setRawText(text);
    setFileMeta(meta);
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

  return (
    <PageShell>
      <div className="space-y-6">
        <UploadZone
          onExtracted={handleExtracted}
          onError={(msg) => setError(msg)}
        />

        {error && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Upload error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {rawText && (
          <Card>
            <CardHeader className="flex flex-col gap-1">
              <CardTitle>Extracted text preview</CardTitle>
              <CardDescription>
                {fileMeta?.name} · {fileMeta && humanSize(fileMeta.size)} · {fileMeta?.type}
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-3 pt-4">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyText}>
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
                <Button size="sm" variant="outline" onClick={downloadTxt}>
                  <Download className="h-4 w-4 mr-2" /> Download .txt
                </Button>
              </div>
              <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap rounded-md border p-3 text-sm leading-6">
                {rawText}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </PageShell>
  );
}