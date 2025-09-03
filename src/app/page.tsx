import PageShell from "@/components/PageShell";

export default function HomePage() {
  return (
    <PageShell>
      <div className="text-sm text-muted-foreground">
        Next step: add the Upload zone and wire /api/extract → /api/parse → /api/ics.
      </div>
    </PageShell>
  );
}