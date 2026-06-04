'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { PageLoader } from '@/components/ui/Spinner';

/**
 * Google OAuth landing. The backend redirects here with the access token in the URL fragment
 * (#access_token=...). We capture it, hand it to the API client, and continue to the dashboard.
 * The HttpOnly refresh cookie was already set by the backend.
 */
export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const token = new URLSearchParams(hash.replace(/^#/, '')).get('access_token');
    if (token) {
      api.setAccessToken(token);
      // Clean the token out of the URL before moving on.
      window.history.replaceState(null, '', '/auth/callback');
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return <PageLoader label="Completing sign in…" />;
}
