import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import env from './config/env';

export default function middleware(request: NextRequest) {
  const allowedOrigins = [env.NEXT_PUBLIC_SITE_URL];
  const origin = request.headers.get('origin');

  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
