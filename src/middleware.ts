import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/api/test-setup')) {
    return NextResponse.next();
  }
  
  if (pathname.startsWith('/handler')) {
    return NextResponse.next();
  }
  
  if (pathname.startsWith('/app/')) {
    return NextResponse.redirect(new URL('/cadastro', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
