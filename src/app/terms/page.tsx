import { LegalShell, LegalSection } from '@/components/marketing/LegalShell';

export const metadata = { title: 'Terms of Service — Crossbill', description: 'The terms that govern your use of Crossbill.' };

const SECTIONS: LegalSection[] = [
  { id: 'acceptance', title: 'Acceptance of terms', content: (
    <p>These Terms of Service (“Terms”) are a binding agreement between you and <strong>Anujali Technologies Pvt. Ltd.</strong> (“Anujali”, “we”) governing your use of <strong>Crossbill</strong> (the “Service”). By creating an account or using the Service, you agree to these Terms.</p>
  )},
  { id: 'service', title: 'The Service', content: (
    <p>Crossbill helps Indian developers and agencies create export and domestic invoices and maintain the related GST/FEMA compliance trail — including auto-filled compliance fields, exchange-rate capture, FEMA aging reminders, FIRC capture and filing exports. Features may evolve over time.</p>
  )},
  { id: 'accounts', title: 'Eligibility & accounts', content: (
    <ul>
      <li>You must be at least 18 and able to form a binding contract.</li>
      <li>You are responsible for the accuracy of your account and business profile (including GSTIN, LUT and bank details) and for activity under your account.</li>
      <li>Keep your credentials secure and notify us of any unauthorised use.</li>
    </ul>
  )},
  { id: 'not-advice', title: 'Compliance is assistance, not advice', content: (
    <>
      <p><strong>Crossbill assists with documentation and calculation. It is not a substitute for professional tax, legal or financial advice.</strong> Compliance templates, the exchange-rate basis, and filing formats should be reviewed and signed off by a practising Chartered Accountant before you rely on them.</p>
      <p>You remain responsible for the correctness of your filings and for meeting your statutory obligations. We do not guarantee any particular tax outcome.</p>
    </>
  )},
  { id: 'acceptable-use', title: 'Acceptable use', content: (
    <ul>
      <li>Do not use the Service for unlawful, fraudulent or infringing purposes.</li>
      <li>Do not attempt to breach security, disrupt the Service, or reverse-engineer it.</li>
      <li>Do not upload malicious files or content you have no right to use.</li>
    </ul>
  )},
  { id: 'billing', title: 'Subscriptions & billing', content: (
    <>
      <p>Paid plans are billed in INR via <strong>Razorpay</strong>. Subscriptions renew automatically until cancelled. Entitlements are resolved from your active subscription; downgrading or cancelling may remove access to paid features without deleting your data.</p>
      <p>Except where required by law, payments are non-refundable. We may change pricing with reasonable notice.</p>
    </>
  )},
  { id: 'your-data', title: 'Your data & content', content: (
    <p>You own your business content (clients, invoices, documents). You grant us a limited licence to host and process it solely to provide the Service. Our handling of personal data is described in our <a href="/privacy">Privacy Policy</a>.</p>
  )},
  { id: 'ip', title: 'Intellectual property', content: (
    <p>The Service, including its software, design and trademarks, is owned by Anujali and protected by law. These Terms grant you a limited, non-exclusive, non-transferable right to use the Service; no other rights are granted.</p>
  )},
  { id: 'disclaimers', title: 'Disclaimers', content: (
    <p>The Service is provided “as is” and “as available” without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or that outputs will satisfy every regulatory requirement.</p>
  )},
  { id: 'liability', title: 'Limitation of liability', content: (
    <p>To the maximum extent permitted by law, Anujali will not be liable for indirect, incidental, special or consequential damages, or for lost profits, revenue, data or goodwill. Our aggregate liability for any claim is limited to the amount you paid us for the Service in the 12 months preceding the claim.</p>
  )},
  { id: 'indemnity', title: 'Indemnity', content: (
    <p>You agree to indemnify and hold Anujali harmless from claims arising out of your content, your use of the Service, or your breach of these Terms or applicable law.</p>
  )},
  { id: 'termination', title: 'Termination', content: (
    <p>You may stop using the Service at any time. We may suspend or terminate access for breach of these Terms or to protect the Service. On termination you may export your data for a reasonable period, after which it may be deleted.</p>
  )},
  { id: 'law', title: 'Governing law', content: (
    <p>These Terms are governed by the laws of India. The courts at our registered office location shall have exclusive jurisdiction, subject to applicable law.</p>
  )},
  { id: 'changes', title: 'Changes & contact', content: (
    <p>We may update these Terms; material changes will be notified in-app or by email, and continued use constitutes acceptance. Questions: <a href="mailto:legal@anujali.tech">legal@anujali.tech</a>.</p>
  )},
];

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow="Legal" title="Terms of Service" updated="8 June 2026"
      intro="The ground rules for using Crossbill — what we provide, what you’re responsible for, and the limits that apply."
      note="This document is a template provided for transparency and should be reviewed by qualified legal counsel before you rely on it."
      sections={SECTIONS}
    />
  );
}
