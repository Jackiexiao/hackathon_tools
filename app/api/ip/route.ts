import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';
  
  return NextResponse.json({ ip });
} 