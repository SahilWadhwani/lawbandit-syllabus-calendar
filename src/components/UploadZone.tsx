// src/components/UploadZone.tsx
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2, Upload, FileText } from "lucide-react";
import { ACCEPTED_MIME, MAX_BYTES, humanSize } from "@/lib/utils/files";
import clsx from "clsx";

type FileMeta = { name: string; size: number; type: string };
type Props = {
  onExtracted: (text: string, meta: FileMeta) => void;
  onError?: (msg: string) => void;
};

export default function UploadZone({ onExtracted, onError }: Props) {
  const [isDragging, setDragging] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function validate(file: File): string | null {
    if (!ACCEPTED_MIME.includes(file.type as any)) {
      return "Unsupported file type. Please upload PDF, DOCX, or TXT.";
    }
    if (file.size > MAX_BYTES) {
      return `File is too large (${humanSize(file.size)}). Max ${humanSize(MAX_BYTES)}.`;
    }
    return null;
  }

  async function handleFile(file: File) {
    const err = validate(file);
    if (err) {
      onError?.(err);
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? `Extract failed (${res.status})`);
      }
      const { text } = (await res.json()) as { text: string };
      onExtracted(text, { name: file.name, size: file.size, type: file.type });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload/extract failed";
      onError?.(msg);
    } finally {
      setLoading(false);
      inputRef.current?.value && (inputRef.current.value = "");
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  return (
    <Card
      className={clsx(
        "border-dashed transition-colors",
        isDragging ? "border-primary/70 bg-primary/5" : "border-muted-foreground/30"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>PDF, DOCX, or TXT · up to {humanSize(MAX_BYTES)}</span>
          </div>

          <div className="rounded-md border p-8 w-full max-w-xl">
            <div className="flex flex-col items-center gap-2">
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Extracting text…
                </div>
              ) : (
                <>
                  <Upload className="h-6 w-6 opacity-70" />
                  <p className="text-sm">
                    Drag & drop your syllabus here, or choose a file.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Input
                      ref={inputRef}
                      type="file"
                      accept={ACCEPTED_MIME.join(",")}
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFile(f);
                      }}
                    />
                    <Button
                      variant="default"
                      onClick={() => inputRef.current?.click()}
                      disabled={isLoading}
                    >
                      Choose file
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator className="my-2" />
          <p className="text-xs text-muted-foreground">
            We process files locally on the server and return extracted text only.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}