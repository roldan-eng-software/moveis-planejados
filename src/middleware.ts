import { createMiddleware } from "@stackframe/stack";
import { stackServerApp } from "./lib/stack";

export default createMiddleware({
  publishableKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  secretKey: process.env.STACK_SECRET_SERVER_KEY!,
  autoSignIn: false,
});

export const config = {
  matcher: [
    '/app/:path*',
  ],
};
