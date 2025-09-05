// src/components/ParsedTable.tsx
"use client";

import React from "react";
import type { SyllabusItem, ParseStats } from "@/types/syllabus";
import { isoToDateInput, dateInputToISO } from "@/lib/utils/dates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CalendarPlus, Filter, Trash } from "lucide-react";
import clsx from "clsx";

type Props = {
  initial: SyllabusItem[];
  warnings: string[];
  stats: ParseStats;
  onExport: (items: SyllabusItem[]) => void;
};

const TYPES = ["Reading", "Assignment", "Exam", "Lecture", "Other"] as const;

export default function ParsedTable({ initial, warnings, stats, onExport }: Props) {
  const [rows, setRows] = React.useState<SyllabusItem[]>(
    () => initial.map((r) => ({ ...r, notes: r.notes ?? "" }))
  );
  const [hideUndated, setHideUndated] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [filter, setFilter] = React.useState<string>("");

  React.useEffect(() => {
    setRows(initial.map((r) => ({ ...r, notes: r.notes ?? "" })));
    setSelected(new Set());
  }, [initial]);

  const filtered = rows.filter((r) => {
    if (hideUndated && !r.dueAt) return false;
    if (filter.trim()) {
      const q = filter.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        (r.notes ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  function toggleAll(checked: boolean) {
    if (checked) {
      setSelected(new Set(filtered.map((r) => r.id)));
    } else {
      setSelected(new Set());
    }
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function update<K extends keyof SyllabusItem>(id: string, key: K, val: SyllabusItem[K]) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: val } : r)));
  }

  function remove(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function exportSelected() {
    const payload = rows.filter((r) => selected.has(r.id) && r.dueAt);
    onExport(payload);
  }

  function exportAll() {
    const payload = rows.filter((r) => r.dueAt);
    onExport(payload);
  }

  const allOnPageSelected =
    filtered.length > 0 && filtered.every((r) => selected.has(r.id));
  const anySelected = selected.size > 0;

  const withDates = rows.filter((r) => r.dueAt).length;

  return (
    <Card>
      <CardHeader className="gap-1">
        <CardTitle>Review & edit</CardTitle>
        <CardDescription>
          {rows.length} items parsed · {withDates} dated ·{" "}
          {stats.totalLines} input lines
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {warnings.length > 0 && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 flex gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="space-y-1">
              {warnings.map((w, i) => (
                <div key={i}>{w}</div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2">
            <Checkbox
              id="hide-undated"
              checked={hideUndated}
              onCheckedChange={(v) => setHideUndated(!!v)}
            />
            <label htmlFor="hide-undated" className="text-sm flex items-center gap-1 cursor-pointer">
              <Filter className="h-4 w-4" /> Hide rows without dates
            </label>
          </div>

          <Input
            placeholder="Filter by text/type/notes…"
            className="h-8 w-[280px]"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant={anySelected ? "default" : "outline"}
              onClick={exportSelected}
              disabled={!anySelected}
              className="flex items-center gap-2"
            >
              <CalendarPlus className="h-4 w-4" />
              Export selected (.ics)
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={exportAll}
              disabled={rows.every((r) => !r.dueAt)}
              className="flex items-center gap-2"
            >
              <CalendarPlus className="h-4 w-4" />
              Export all dated
            </Button>
          </div>
        </div>

        <Separator />

        <div className="overflow-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="w-[44px] p-2">
                  <Checkbox
                    checked={filtered.length > 0 && allOnPageSelected}
                    onCheckedChange={(v) => toggleAll(!!v)}
                    aria-label="Select all visible"
                  />
                </th>
                <th className="min-w-[320px] p-2">Title</th>
                <th className="w-[160px] p-2">Type</th>
                <th className="w-[160px] p-2">Due date</th>
                <th className="min-w-[260px] p-2">Notes</th>
                <th className="w-[60px] p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">
                    No matching rows.
                  </td>
                </tr>
              ) : (
                filtered.map((it) => {
                  const invalidTitle = !it.title?.trim();
                  const invalidDate = it.dueAt === "" as any; // guard against empty string

                  return (
                    <tr key={it.id} className="align-top hover:bg-muted/30">
                      <td className="p-2">
                        <Checkbox
                          checked={selected.has(it.id)}
                          onCheckedChange={(v) => toggleOne(it.id, !!v)}
                          aria-label={`Select row ${it.id}`}
                        />
                      </td>

                      <td className="p-2">
                        <Input
                          value={it.title}
                          onChange={(e) => update(it.id, "title", e.target.value)}
                          className={clsx(invalidTitle && "border-destructive")}
                        />
                        <div className="mt-1 flex gap-1 flex-wrap">
                          <Badge variant="outline">{it.id}</Badge>
                          {it.dueAt ? (
                            <Badge variant="secondary">{it.dueAt}</Badge>
                          ) : (
                            <Badge variant="destructive">no date</Badge>
                          )}
                        </div>
                      </td>

                      <td className="p-2">
                        <Select
                          value={it.type}
                          onValueChange={(v) => update(it.id, "type", v as SyllabusItem["type"])}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TYPES.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>

                      <td className="p-2">
                        <Input
                          type="date"
                          value={isoToDateInput(it.dueAt)}
                          onChange={(e) =>
                            update(it.id, "dueAt", dateInputToISO(e.target.value))
                          }
                          className={clsx(invalidDate && "border-destructive")}
                        />
                      </td>

                      <td className="p-2">
                        <Input
                          placeholder="Optional notes…"
                          value={it.notes ?? ""}
                          onChange={(e) => update(it.id, "notes", e.target.value)}
                        />
                      </td>

                      <td className="p-2 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => remove(it.id)}
                          title="Remove row"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}