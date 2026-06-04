# Crossbill — Frontend

Next.js (App Router) + TypeScript + Tailwind UI for Crossbill: cross-border export invoicing
and GST/FEMA compliance for Indian service exporters. Talks to the NestJS backend in
`Crossbil-Backend`.

## Stack

- **Next.js 14** App Router, React 18, TypeScript
- **Tailwind CSS** with a small custom design system (`src/app/globals.css`, `tailwind.config.ts`)
- **lucide-react** icons, **recharts** (charts), **clsx + tailwind-merge** for class composition
- In-memory access token + HttpOnly refresh cookie, transparent refresh on 401 (`src/lib/api.ts`)

## Quick start

```bash
cp .env.example .env.local      # set NEXT_PUBLIC_API_URL to the backend (default http://localhost:3000)
npm install
npm run dev                      # http://localhost:3001
```

The dev server proxies `/api/*` to the backend (see `next.config.mjs`), so the SPA and API share
an origin and the refresh cookie works locally.

## Routes

- `/` — marketing landing
- `/login`, `/register`, `/auth/callback` — auth (email/password + Google OAuth)
- `/dashboard` — stats, FEMA-at-risk, recent invoices
- `/invoices`, `/invoices/new`, `/invoices/[id]` — list, creator with live compliance preview, detail + PDF
- `/clients` — foreign client management
- `/reports` — GSTR-1 6A export
- `/profile` — business profile (GSTIN, LUT, bank, default SAC)
- `/team`, `/settings` — RBAC invites (v2) and plan/billing

## Structure

```
src/
├── app/                 # routes (App Router); (app)/ is the authenticated shell
├── components/
│   ├── ui/              # Button, Input, Select, Card, Table, Modal, Badge, …
│   ├── layout/          # Sidebar, Topbar, PageHeader, AuthShell, ComplianceBanner
│   ├── invoices/        # CompliancePreview
│   └── dashboard/       # StatCard
└── lib/                 # api client, auth + toast contexts, types, format, compliance mirror
```

The `src/lib/compliance.ts` helpers mirror the backend compliance engine to power the live
invoice preview; the authoritative values are always recomputed server-side.
