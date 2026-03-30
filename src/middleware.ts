import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/app/dashboard', '/app/clientes', '/app/orcamentos'];
const publicRoutes = ['/', '/login', '/cadastro', '/handler', '/api/auth', '/_next', '/favicon.ico', '/api/test-setup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  const stackToken = request.cookies.get('stack-session-token');
  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!stackToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
