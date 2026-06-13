'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

const MapPanel = dynamic(() => import('@/components/MapPanel'), { ssr: false });

interface LocationRecord {
  id: number;
  latitude: number;
  longitude: number;
  waktuKlik: string;
  linkId: string;
  link: {
    id: string;
    urlAsli: string;
  };
}

export default function HomePage() {
  const [urlAsli, setUrlAsli] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const selectedLocation = useMemo(() => {
    return locations.find((item) => item.id === selectedLocationId) || null;
  }, [locations, selectedLocationId]);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Fetch lokasi error', error);
    }
  };

  useEffect(() => {
    fetchLocations();
    const interval = window.setInterval(fetchLocations, 5000);
    return () => window.clearInterval(interval);
  }, []);

  const handleGenerate = async () => {
    setMessage('Memproses...');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlAsli }),
      });
      const data = await response.json();
      if (response.ok) {
        setRedirectUrl(data.redirectPath);
        setMessage('Link berhasil dibuat. Salin URL di bawah.');
      } else {
        setMessage(data.error || 'Terjadi kesalahan saat membuat link');
      }
    } catch (error) {
      console.error(error);
      setMessage('Gagal membuat link. Coba lagi.');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${redirectUrl}`);
      setMessage('URL berhasil disalin ke clipboard.');
    } catch {
      setMessage('Salin clipboard gagal. Silakan salin manual.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Link Redirector & Location Tracker Dashboard</h1>
          <p className="mt-3 text-slate-600">Buat link pendek, lacak lokasi klik, dan lihat detail langsung di peta.</p>
        </header>

        <section className="mb-8 grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">URL Asli</label>
            <input
              value={urlAsli}
              onChange={(event) => setUrlAsli(event.target.value)}
              placeholder="https://example.com"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <div className="flex items-end gap-3">
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Proses
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">URL Redirect</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3">
              <input
                readOnly
                value={redirectUrl ? window.location.origin + redirectUrl : ''}
                className="w-full bg-transparent text-slate-900 outline-none"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                disabled={!redirectUrl}
                className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                Salin
              </button>
            </div>
          </div>
          {message ? <p className="sm:col-span-3 text-sm text-slate-600">{message}</p> : null}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Riwayat Lokasi</h2>
            <p className="mt-2 text-sm text-slate-600">Data terbarui setiap 5 detik otomatis.</p>
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">ID Link</th>
                    <th className="px-4 py-3">Koordinat</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {locations.map((item) => (
                    <tr
                      key={item.id}
                      className={`cursor-pointer hover:bg-slate-50 ${selectedLocationId === item.id ? 'bg-slate-100' : ''}`}
                      onClick={() => setSelectedLocationId(item.id)}
                    >
                      <td className="px-4 py-4 text-slate-700">{new Date(item.waktuKlik).toLocaleString('id-ID')}</td>
                      <td className="px-4 py-4 text-slate-700">{item.link.id}</td>
                      <td className="px-4 py-4 text-slate-700">{item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedLocationId(item.id);
                          }}
                          className="inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                        >
                          Lihat di Peta
                        </button>
                      </td>
                    </tr>
                  ))}
                  {locations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                        Belum ada data lokasi.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Peta Lokasi</h2>
            <p className="mt-2 text-sm text-slate-600">Klik baris untuk melihat posisi tepat di peta.</p>
            <div className="mt-6 h-[640px]">
              <MapPanel selectedLocation={selectedLocation} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
