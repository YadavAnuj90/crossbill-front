import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/lib/toast-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Crossbill — Invoicing & GST/FEMA compliance for Indian businesses',
  description:
    'Correct invoices for foreign (export) and Indian (GST) clients — CGST/SGST/IGST, LUT export declarations, FX capture and FEMA tracking, automatically. Built for Indian developers and agencies.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
