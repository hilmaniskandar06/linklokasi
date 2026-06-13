import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function randomSlug(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let slug = '';
  for (let i = 0; i < length; i += 1) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

async function generateUniqueSlug() {
  for (let i = 0; i < 6; i += 1) {
    const slug = randomSlug(6);
    const existing = await prisma.link.findUnique({ where: { id: slug } });
    if (!existing) return slug;
  }
  throw new Error('Unable to generate unique slug');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { urlAsli } = body;

    if (!urlAsli || typeof urlAsli !== 'string' || !urlAsli.trim()) {
      return NextResponse.json({ error: 'urlAsli is required' }, { status: 400 });
    }

    const slug = await generateUniqueSlug();
    const link = await prisma.link.create({
      data: {
        id: slug,
        urlAsli,
      },
    });

    return NextResponse.json({ redirectPath: `/r/${link.id}` });
  } catch (error) {
    console.error('Generate link error:', error);
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ error: `Server error: ${message}` }, { status: 500 });
  }
}
