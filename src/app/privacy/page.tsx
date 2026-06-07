import { LegalShell, LegalSection } from '@/components/marketing/LegalShell';

export const metadata = { title: 'Privacy Policy — Crossbill', description: 'How Crossbill collects, uses and protects your data.' };

const SECTIONS: LegalSection[] = [
  { id: 'overview', title: 'Overview', content: (
    <>
      <p>This Privacy Policy explains how <strong>Anujali Technologies Pvt. Ltd.</strong> (“Anujali”, “we”, “us”) collects, uses, shares and protects information when you use <strong>Crossbill</strong> (the “Service”). We are committed to handling your data responsibly and in line with India’s Digital Personal Data Protection Act, 2023 (“DPDP Act”).</p>
      <p>By creating an account or using the Service, you agree to the practices described here.</p>
    </>
  )},
  { id: 'data-we-collect', title: 'Information we collect', content: (
    <>
      <h3>Account information</h3>
      <p>Your name, email address, and authentication details (password hashes, or a Google account identifier if you sign in with Google).</p>
      <h3>Business profile</h3>
      <p>Information you provide to produce compliant invoices, including your legal name, <strong>GSTIN</strong>, registered address, default SAC/HSN code, <strong>LUT</strong> details (number, FY, ARN) and <strong>bank details</strong>.</p>
      <h3>Operational data</h3>
      <p>Clients you add, invoices you create, remittances you record, and documents you upload such as <strong>FIRC / e-FIRA</strong> files. This is your business content, controlled by you.</p>
      <h3>Usage &amp; technical data</h3>
      <p>Log data, device and browser information, IP address, and audit events (sign-ins, exports, billing changes) used to operate and secure the Service.</p>
    </>
  )},
  { id: 'how-we-use', title: 'How we use your information', content: (
    <ul>
      <li>To provide the Service — generating invoices, computing GST/FEMA fields, tracking deadlines, and producing filing exports.</li>
      <li>To authenticate you and keep your account and data secure.</li>
      <li>To send transactional and reminder emails (e.g. FEMA realisation nudges, LUT renewal).</li>
      <li>To process subscription payments and prevent fraud.</li>
      <li>To improve reliability and performance, and to comply with legal obligations.</li>
    </ul>
  )},
  { id: 'legal-basis', title: 'Legal basis (DPDP Act)', content: (
    <p>We process personal data on the basis of your consent and to perform our contract with you, and where necessary to comply with applicable law. You may withdraw consent at any time, subject to legal or contractual retention requirements.</p>
  )},
  { id: 'sharing', title: 'Sharing & sub-processors', content: (
    <>
      <p>We do <strong>not</strong> sell your personal data. We share data only with trusted sub-processors who help us run the Service, under appropriate safeguards:</p>
      <ul>
        <li><strong>Cloud hosting &amp; databases</strong> — to store and serve your data.</li>
        <li><strong>Email delivery (e.g. Resend)</strong> — to send transactional and reminder emails.</li>
        <li><strong>Payments (Razorpay)</strong> — to process subscriptions. We never store card details.</li>
        <li><strong>Document/object storage</strong> — to hold uploaded FIRC/e-FIRA files securely.</li>
      </ul>
      <p>We may disclose information where required by law or to protect our rights and users.</p>
    </>
  )},
  { id: 'retention', title: 'Data retention', content: (
    <p>We retain your data for as long as your account is active and as needed to provide the Service and meet tax, accounting and legal obligations. You can request deletion of your account; we will delete or anonymise personal data except where retention is legally required.</p>
  )},
  { id: 'security', title: 'Security', content: (
    <ul>
      <li>Encryption in transit (HTTPS) and at rest for sensitive fields such as bank details and tokens.</li>
      <li>Passwords hashed with strong algorithms; refresh tokens hashed and rotated.</li>
      <li>Uploaded documents stored outside the web root and served via scoped, authenticated access.</li>
      <li>An audit trail of security-relevant actions, and least-privilege access controls.</li>
    </ul>
  )},
  { id: 'rights', title: 'Your rights', content: (
    <p>You may access, correct, export or delete your personal data, and withdraw consent, by using in-app settings or emailing us. We will respond within the timelines required by applicable law.</p>
  )},
  { id: 'cookies', title: 'Cookies', content: (
    <p>We use strictly necessary cookies (for example, a secure session/refresh cookie) to keep you signed in. We do not use advertising cookies.</p>
  )},
  { id: 'changes', title: 'Changes & contact', content: (
    <p>We may update this policy from time to time; material changes will be notified in-app or by email. Questions or requests: <a href="mailto:privacy@anujali.tech">privacy@anujali.tech</a>.</p>
  )},
];

export default function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Legal" title="Privacy Policy" updated="8 June 2026"
      intro="Your data is yours. This policy explains what we collect, why, and the controls you have over it."
      note="This document is a template provided for transparency and should be reviewed by qualified legal counsel before you rely on it."
      sections={SECTIONS}
    />
  );
}
