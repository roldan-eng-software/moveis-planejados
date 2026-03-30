import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/app", "/dashboard", "/orcamentos", "/producao", "/clientes", "/financeiro", "/contratos", "/estoque", "/perfil", "/configuracoes"];

// Public routes that don't require authentication
const publicRoutes = ["/", "/auth/login", "/auth/cadastro", "/auth/forgot-password"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Stack Auth automatically handles its own routes at /handler/[...stack]
  if (pathname.startsWith("/handler")) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    // For protected routes, Stack Auth will handle redirects via its SDK
    // This middleware just allows the request to pass through
    return NextResponse.next();
  }

  // Allow public routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
