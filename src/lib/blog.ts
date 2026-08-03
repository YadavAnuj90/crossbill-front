// Shared blog data — used by the blog index and article pages.

export type BlogTone = 'brand' | 'blue' | 'violet' | 'amber' | 'cyan' | 'rose';
export type BlogIcon = 'file' | 'coins' | 'users' | 'qr' | 'notes' | 'shield' | 'rocket';

export interface BlogBlock {
  type: 'p' | 'h2' | 'ul' | 'quote';
  text?: string;
  items?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tone: BlogTone;
  icon: BlogIcon;
  author: string;
  initials: string;
  date: string;
  read: string;
  body: BlogBlock[];
}

export const BLOG_TONE: Record<BlogTone, { grad: string; soft: string; text: string }> = {
  brand:  { grad: 'from-brand-500 to-emerald-600',  soft: 'bg-brand-500/10 text-brand-700 dark:text-brand-300 ring-brand-500/20',   text: 'text-brand-600' },
  blue:   { grad: 'from-blue-500 to-indigo-600',    soft: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-blue-500/20',       text: 'text-blue-600' },
  violet: { grad: 'from-violet-500 to-purple-600',  soft: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-violet-500/20', text: 'text-violet-600' },
  amber:  { grad: 'from-amber-500 to-orange-600',   soft: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-500/20',    text: 'text-amber-600' },
  cyan:   { grad: 'from-cyan-500 to-teal-600',      soft: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 ring-cyan-500/20',        text: 'text-cyan-600' },
  rose:   { grad: 'from-rose-500 to-pink-600',      soft: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-rose-500/20',        text: 'text-rose-600' },
};

export const POSTS: BlogPost[] = [
  {
    slug: 'guide-invoicing-foreign-clients-india-2026',
    title: 'The 2026 guide to invoicing foreign clients from India',
    excerpt: 'LUT vs IGST, the right FX rate to capture, and the exact fields that keep your export invoices audit-proof.',
    category: 'Compliance', tone: 'brand', icon: 'file', author: 'Anjali Yadav', initials: 'AY', date: 'Jul 18, 2026', read: '8 min',
    body: [
      { type: 'p', text: 'Exporting services from India is one of the most tax-efficient ways to earn — but only if your paperwork is right. A single missing declaration can turn a zero-rated export into a taxable supply at assessment. Here is the short, practical version of what actually matters.' },
      { type: 'h2', text: 'LUT vs IGST: pick your lane' },
      { type: 'p', text: 'Under GST, exports are zero-rated. You can either export under a Letter of Undertaking (LUT) and charge 0% IGST, or pay IGST and claim a refund. For most service exporters the LUT route is simpler: no cash gets blocked and there is no refund to chase.' },
      { type: 'ul', items: [
        'File your LUT for the financial year before you raise your first export invoice.',
        'Quote the LUT number, ARN and FY on the invoice as your export declaration.',
        'Set Place of Supply to “Outside India (export of services)”.',
      ] },
      { type: 'h2', text: 'Capture the FX rate — and the source' },
      { type: 'p', text: 'Your invoice is in USD (or EUR, GBP…), but your books are in INR. The exchange rate you apply, the date, and the source all belong on the invoice. Crossbill captures a live ECB/CBIC reference rate automatically and stores it immutably, so the INR equivalent on your GSTR-1 and your books always agree.' },
      { type: 'quote', text: 'The rate you filed under is as important as the rate itself — record the basis, not just the number.' },
      { type: 'h2', text: 'The fields auditors look for' },
      { type: 'ul', items: [
        'SAC code for the service and a clear description.',
        'Gapless, per-financial-year invoice numbering.',
        'Export declaration text (LUT or with-IGST).',
        'FEMA realisation due date so payment can be tracked to the 1-year rule.',
      ] },
      { type: 'p', text: 'Get these right once and every export invoice you raise afterwards is filing-ready by default. That is exactly what Crossbill automates — so you think about the work, not the compliance.' },
    ],
  },
  {
    slug: 'fema-realisation-9-month-deadline',
    title: 'FEMA realisation: never miss the 9-month deadline again',
    excerpt: 'How the 1-year rule works, what counts as realisation, and how automated nudges save you from penalties.',
    category: 'Compliance', tone: 'amber', icon: 'coins', author: 'Priya Sharma', initials: 'PS', date: 'Jul 11, 2026', read: '6 min',
    body: [
      { type: 'p', text: 'When you export services, FEMA expects the money to actually arrive — within one year of the invoice date. Miss it, and you are technically in default, with compounding and penalties on the table. The good news: it is entirely avoidable with a little tracking.' },
      { type: 'h2', text: 'What “realisation” means' },
      { type: 'p', text: 'Realisation is the foreign currency landing in your bank and being converted, evidenced by a FIRC or e-FIRA from your bank. Until that document exists, the export is unrealised — no matter what your invoice or your client says.' },
      { type: 'h2', text: 'The timeline that matters' },
      { type: 'ul', items: [
        'Day 0 — invoice raised.',
        'Month 9, 10, 11 — the danger zone; chase payment hard.',
        'Month 12 — the FEMA deadline. After this you are in default territory.',
      ] },
      { type: 'quote', text: 'The cheapest compliance is a reminder that fires before the deadline, not an explanation after it.' },
      { type: 'p', text: 'Crossbill watches every unpaid export against its FEMA due date and nudges you at 9, 10 and 11 months, then lets you attach the FIRC to close the loop. Your aging report is always one click away.' },
    ],
  },
  {
    slug: 'one-click-payroll-attendance-statutory',
    title: 'One-click payroll: prorate by attendance, auto-compute PF/ESIC/TDS',
    excerpt: 'A look under the hood of attendance-linked payroll and the statutory engine that runs your month in seconds.',
    category: 'Payroll & HR', tone: 'rose', icon: 'users', author: 'Rahul Verma', initials: 'RV', date: 'Jul 4, 2026', read: '7 min',
    body: [
      { type: 'p', text: 'Running payroll by hand is where small teams lose an afternoon every month — and where mistakes quietly creep in. Crossbill turns it into a single button. Here is what happens when you press it.' },
      { type: 'h2', text: 'Attendance decides the pay' },
      { type: 'p', text: 'For each active employee we take the monthly salary from their CTC and prorate it by attendance: present days plus half-days plus approved leave, over the working days in that employee’s shift. A five-day-week employee and a six-day-week employee are handled correctly and separately.' },
      { type: 'h2', text: 'The statutory engine' },
      { type: 'ul', items: [
        'PF — 12% of basic, capped at the ₹15,000 wage ceiling.',
        'ESIC — 0.75% of gross while gross is within the ₹21,000 eligibility.',
        'TDS — a new-regime estimate with standard deduction, slabs, §87A rebate and cess.',
      ] },
      { type: 'quote', text: 'Payroll should be a decision, not a data-entry marathon.' },
      { type: 'p', text: 'Everything lands as draft slips you can review and tweak before finalising — and finalised slips lock, so numbers can’t drift. It’s indicative and CA-reviewable, not a black box.' },
    ],
  },
  {
    slug: 'e-invoicing-irn-signed-qr-explained',
    title: 'e-Invoicing without the pain: IRN + signed QR, explained',
    excerpt: 'When e-invoicing applies, what the IRP returns, and how Crossbill mints a GST-valid QR for your B2B invoices.',
    category: 'Product', tone: 'cyan', icon: 'qr', author: 'Aisha Khan', initials: 'AK', date: 'Jun 27, 2026', read: '5 min',
    body: [
      { type: 'p', text: 'e-Invoicing sounds intimidating, but it is really just a registration step: your invoice goes to the government’s Invoice Registration Portal (IRP), which returns a unique IRN and a signed QR you print on the invoice.' },
      { type: 'h2', text: 'Does it apply to you?' },
      { type: 'p', text: 'It applies to B2B invoices once your turnover crosses the notified threshold. B2C and export-of-services flows have their own rules. If in doubt, your CA can confirm in a minute.' },
      { type: 'h2', text: 'What the IRP returns' },
      { type: 'ul', items: [
        'IRN — a 64-character unique invoice reference.',
        'Signed QR — carries the seller/buyer GSTIN, doc details and IRN.',
        'Ack number and date — your proof of registration.',
      ] },
      { type: 'p', text: 'Crossbill wraps a licensed GSP so you press “Generate IRN” and the QR appears on your invoice PDF — no portal logins, no JSON wrangling. A sandbox mode lets you try the whole flow before going live.' },
    ],
  },
  {
    slug: 'credit-debit-notes-gst-section-34',
    title: 'Credit & debit notes under GST §34, done right',
    excerpt: 'Gapless numbering, the fields that matter, and a clean PDF your CA will actually thank you for.',
    category: 'Guides', tone: 'violet', icon: 'notes', author: 'Anjali Yadav', initials: 'AY', date: 'Jun 20, 2026', read: '6 min',
    body: [
      { type: 'p', text: 'A credit or debit note isn’t just a corrected invoice — under GST §34 it is a document with its own rules. Get the linkage and numbering right and adjustments flow cleanly into your returns.' },
      { type: 'h2', text: 'When to issue which' },
      { type: 'ul', items: [
        'Credit note — you over-charged, goods were returned, or a discount applies.',
        'Debit note — you under-charged and need to collect more tax.',
      ] },
      { type: 'h2', text: 'The details that keep it clean' },
      { type: 'ul', items: [
        'A reference to the original invoice number and date.',
        'Gapless, per-FY note numbering — separate from invoices.',
        'The same tax treatment (LUT/IGST/CGST-SGST) as the original.',
      ] },
      { type: 'quote', text: 'A note that can’t be traced back to its invoice is a note that fails at assessment.' },
      { type: 'p', text: 'Crossbill generates §34-compliant notes off the original invoice, keeps the numbering gapless, and renders a tidy PDF automatically.' },
    ],
  },
  {
    slug: 'contracts-esign-audit-trails-aadhaar',
    title: 'Contracts that hold up: eSign, audit trails & Aadhaar',
    excerpt: 'Native eSign vs Aadhaar eSign, what a tamper-evident trail contains, and when you need each.',
    category: 'Product', tone: 'blue', icon: 'shield', author: 'Priya Sharma', initials: 'PS', date: 'Jun 13, 2026', read: '9 min',
    body: [
      { type: 'p', text: 'A signature is only as strong as the evidence around it. For most agreements a well-logged electronic signature is plenty; for high-value or regulated ones, Aadhaar eSign adds identity-grade assurance.' },
      { type: 'h2', text: 'Native eSign' },
      { type: 'p', text: 'The signer opens a secure link, verifies with an email OTP, draws their signature, and the platform records a tamper-evident trail — timestamps, IP, geolocation and an optional selfie. That is enough to hold up for the vast majority of business contracts.' },
      { type: 'h2', text: 'Aadhaar eSign / DSC' },
      { type: 'p', text: 'When you need UIDAI-grade identity, Aadhaar eSign via a licensed ASP binds the signature to the signer’s verified identity. Crossbill supports both, and you choose per document.' },
      { type: 'quote', text: 'Sign fast by default; escalate to Aadhaar when the stakes demand it.' },
      { type: 'p', text: 'Every signed document also gets a public verification code, so anyone can confirm authenticity without an account.' },
    ],
  },
  {
    slug: 'crossbill-origin-story',
    title: 'From spreadsheets to a system: our origin story',
    excerpt: 'Why we built the compliance layer for India’s service economy — and where we’re headed next.',
    category: 'Company', tone: 'brand', icon: 'rocket', author: 'Team Crossbill', initials: 'CB', date: 'Jun 2, 2026', read: '4 min',
    body: [
      { type: 'p', text: 'Crossbill started with a frustration we kept hearing from founders, freelancers and agencies: billing a foreign client should be simple, but staying compliant with GST and FEMA turns it into a spreadsheet nightmare.' },
      { type: 'p', text: 'So we built the layer that sits between doing the work and staying on the right side of the rules — export and domestic invoicing, notes, e-invoicing, payments, and now a full HR and payroll suite for the teams growing around that work.' },
      { type: 'quote', text: 'Compliance shouldn’t be a tax on ambition.' },
      { type: 'p', text: 'We’re just getting started. Analytics, deeper integrations, and mobile are next — all in service of one idea: bill the world, run your team, stay compliant. Thanks for being here.' },
    ],
  },
];

export const getPost = (slug: string): BlogPost | undefined => POSTS.find((p) => p.slug === slug);
export const relatedPosts = (slug: string, n = 3): BlogPost[] => POSTS.filter((p) => p.slug !== slug).slice(0, n);
