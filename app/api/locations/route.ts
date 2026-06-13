import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const locations = await prisma.location.findMany({
    orderBy: { waktuKlik: 'desc' },
    include: { link: true },
  });

  return NextResponse.json(locations);
}
