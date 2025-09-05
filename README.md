# Syllabus → Calendar

A Next.js 15 project that converts syllabus files into calendar events.

## Features
- **File upload**: Supports PDF, DOCX, and TXT (up to 10 MB).
- **Text extraction**: 
  - PDF → [`pdf-parse`](https://www.npmjs.com/package/pdf-parse)
  - DOCX → [`mammoth`](https://www.npmjs.com/package/mammoth)
  - TXT → UTF-8 decoding
- **Parsing**:
  - Dates recognized with [`chrono-node`](https://www.npmjs.com/package/chrono-node)
  - Lightweight heuristics for classifying items (`Reading`, `Assignment`, `Exam`, etc.)
  - Duplicate removal and stats collection
- **Review UI**:
  - Editable table of extracted items
  - Inline editing of title, type, due date, and notes
  - Warnings if parsing confidence is low
- **Export**:
  - Generates `.ics` calendar files with the [`ics`](https://www.npmjs.com/package/ics) package
  - Import directly into Google, Apple, or Outlook Calendar

## Project Structure
src/
app/
api/
extract/   # File extraction
parse/     # Syllabus parsing
ics/       # ICS file generation
page.tsx     # Upload → Preview → Parse → Review flow
components/    # UI components (UploadZone, ParsedTable, PageShell)
lib/           # Extraction + parsing helpers
types/         # Shared type definitions


## Tech Stack
- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Parsing libraries**: `pdf-parse`, `mammoth`, `chrono-node`, `ics`
- **Validation**: `zod`

## Running Locally
```bash
npm install
npm run dev