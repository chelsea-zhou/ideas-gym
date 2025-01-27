'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { ENDPOINT } from '@/app/constant';

export default function BillingPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  useEffect(() => {
    const createPortalSession = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${ENDPOINT.PROD}/stripe/create-portal-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          // todo: fetch customerId from backend
          body: JSON.stringify({ customerId: 'cus_RR4ZIsMweQnNR6' }), // todo: Replace with actual customer ID
        });

        if (!response.ok) {
          throw new Error('Failed to create portal session');
        }

        const data = await response.json();
        window.location.href = data.url;
      } catch (error) {
        console.error('Error:', error);
        router.push('/');
      }
    };

    createPortalSession();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">
        Redirecting to billing portal...
      </div>
    </div>
  );
}
