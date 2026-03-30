import { createMiddleware } from "@stackframe/stack";

export default createMiddleware({
  publishableKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  secretKey: process.env.STACK_SECRET_SERVER_KEY!,
  autoSignIn: false,
});

export const config = {
  matcher: [
    '/app/:path*',
    '/api/test-setup/:path*',
  ],
};
