import { LegalShell, LegalSection } from '@/components/marketing/LegalShell';

export const metadata = { title: 'Compliance — Crossbill', description: 'How Crossbill approaches GST, FEMA and data-protection compliance.' };

const SECTIONS: LegalSection[] = [
  { id: 'commitment', title: 'Our compliance commitment', content: (
    <p>Compliance is the product. Crossbill exists to make export and domestic invoicing <strong>correct and audit-ready</strong> — encoding the rules so you don’t have to. This page explains how we approach that, and the safeguards we hold ourselves to.</p>
  )},
  { id: 'ca-signoff', title: 'CA sign-off gate', content: (
    <>
      <p>Tax rules change and the cost of getting them wrong is real. Before any compliance-affecting output is relied upon, the following are reviewed and signed off by a practising Chartered Accountant:</p>
      <ul>
        <li>The invoice template and <strong>export declaration</strong> wording.</li>
        <li>The <strong>exchange-rate basis</strong> used to convert foreign currency to INR.</li>
        <li>The <strong>GSTR-1</strong> export formats (Table 6A for exports; B2B/B2C for domestic).</li>
      </ul>
      <p>Declaration text, SAC/HSN defaults and the rate basis are kept in versioned configuration so they can be updated as the law evolves.</p>
    </>
  )},
  { id: 'export', title: 'Export (GST & FEMA)', content: (
    <ul>
      <li><strong>Zero-rated exports under LUT</strong> — export declaration, place of supply outside India, and 0% IGST handled automatically.</li>
      <li><strong>Exchange rate</strong> captured with rate, source and date, stored immutably on the invoice.</li>
      <li><strong>FEMA realisation</strong> — proceeds tracked against the one-year deadline, with reminders at 9, 10 and 11 months.</li>
      <li><strong>FIRC / e-FIRA</strong> captured as proof of inward remittance, and <strong>GSTR-1 Table 6A</strong> exports for filing.</li>
    </ul>
  )},
  { id: 'domestic', title: 'Domestic GST', content: (
    <ul>
      <li>Automatic <strong>CGST + SGST</strong> (intra-state) vs <strong>IGST</strong> (inter-state) based on supplier and client state.</li>
      <li>Per-line GST rates and HSN/SAC, with the correct tax breakup on every invoice.</li>
      <li>Support for both <strong>B2B</strong> (registered, with GSTIN) and <strong>B2C</strong> customers.</li>
    </ul>
  )},
  { id: 'data-protection', title: 'Data protection (DPDP Act)', content: (
    <p>We align with India’s Digital Personal Data Protection Act, 2023 — practising data minimisation, honouring deletion requests, and maintaining documented retention. See our <a href="/privacy">Privacy Policy</a> for details.</p>
  )},
  { id: 'security', title: 'Security practices', content: (
    <ul>
      <li>HTTPS everywhere; sensitive fields (bank details, tokens) encrypted at rest.</li>
      <li>Uploaded documents stored outside the web root, served via scoped, authenticated access.</li>
      <li>Idempotent, audited background jobs so compliance reminders never silently fail.</li>
      <li>An audit trail of security-relevant actions (sign-in, exports, billing, role changes).</li>
    </ul>
  )},
  { id: 'not-advice', title: 'Not a substitute for professional advice', content: (
    <p><strong>Crossbill assists with documentation and calculation; it is not a substitute for professional tax, legal or financial advice.</strong> You remain responsible for your filings. Always confirm specifics with your CA, especially as regulations change.</p>
  )},
  { id: 'report', title: 'Report an issue', content: (
    <p>Found a compliance concern or a security issue? Please tell us at <a href="mailto:compliance@anujali.tech">compliance@anujali.tech</a> — we take these seriously and respond promptly.</p>
  )},
];

export default function CompliancePage() {
  return (
    <LegalShell
      eyebrow="Trust" title="Compliance" updated="8 June 2026"
      intro="How we keep your invoicing correct and audit-ready — across GST, FEMA and data protection."
      sections={SECTIONS}
    />
  );
}
