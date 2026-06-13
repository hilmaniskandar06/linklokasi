import { prisma } from '@/lib/prisma';
import RedirectClient from '@/components/RedirectClient';

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params }: any) {
  const link = await prisma.link.findUnique({ where: { id: params.id } });

  if (!link) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 text-slate-900">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-10 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-rose-700">Link tidak ditemukan</h1>
          <p className="mt-3 text-sm text-rose-600">Pastikan link sudah benar atau buat ulang dari dashboard.</p>
        </div>
      </div>
    );
  }

  return <RedirectClient urlAsli={link.urlAsli} linkId={link.id} />;
}
