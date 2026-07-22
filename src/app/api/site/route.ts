import { NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/data';

export async function GET() {
  const site = await getSiteConfig();
  return NextResponse.json(site);
}
