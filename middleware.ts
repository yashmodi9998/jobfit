import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/', '/api/auth/set-role']);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const { pathname } = request.nextUrl;

  // 1. If not logged in and trying to access a private page, Clerk handles redirect to sign-in
  if (!userId && !isPublicRoute(request)) {
    return NextResponse.next();
  }

  // 2. ONE-TIME REDIRECT: 
  // If logged in, has NO role, and NOT on onboarding yet -> Send to Onboarding
  if (userId && !role && pathname !== "/onboarding" && !isPublicRoute(request)) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 3. THE "EXIT" LOGIC:
  // If they HAVE a role and try to visit onboarding again -> Send to Home
  if (userId && role && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};