import { Separator } from "@/components/ui/separator";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-semibold">Syllabus → Calendar</h1>
        <p className="text-sm text-muted-foreground">Upload a syllabus, parse tasks, and export to your calendar.</p>
      </header>
      <Separator />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      <footer className="mx-auto max-w-5xl px-4 py-10 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Syllabus → Calendar
      </footer>
    </div>
  );
}