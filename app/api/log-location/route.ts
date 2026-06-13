import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { linkId, latitude, longitude } = body;

  if (!linkId || typeof linkId !== 'string' || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return NextResponse.json({ error: 'linkId, latitude, and longitude are required' }, { status: 400 });
  }

  const targetLink = await prisma.link.findUnique({ where: { id: linkId } });
  if (!targetLink) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }

  await prisma.location.create({
    data: {
      linkId: targetLink.id,
      latitude,
      longitude,
    },
  });

  return NextResponse.json({ success: true });
}
