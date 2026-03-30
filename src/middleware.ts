import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { stackServerApp } from './lib/stack';

const PUBLIC_PATHS = ['/', '/cadastro', '/handler', '/_next', '/favicon.ico'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path) && path !== '/')) {
    if (pathname === '/' || pathname === '/cadastro' || pathname.startsWith('/handler')) {
      const user = await stackServerApp.getUser({ or: null });
      
      if (user && pathname !== '/handler') {
        return NextResponse.redirect(new URL('/app/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }
  
  const user = await stackServerApp.getUser({ or: null });
  
  if (!user && pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/cadastro', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
