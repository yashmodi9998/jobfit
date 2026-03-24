import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

// 1. Initialize Auth.js with your config
const { auth } = NextAuth(authConfig);
// 2. Middleware function to protect routes
export default auth((req) => {
  // Check if user is authenticated
  const isLoggedIn = !!req.auth;
  // Extract the next URL from the request
  const { nextUrl } = req;
// Define route patterns
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup");

  //  Protect the Dashboard
  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  //Protect API routes (except signup/login APIs)
  if (isApiRoute && !isLoggedIn && nextUrl.pathname.includes("/user/details")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Redirect logged-in users away from Login/Signup pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

//. The Matcher: Tells Next.js which paths trigger this file
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/dashboard/:path*", "/api/:path*","/results/:path*","/reviewresume/:path*"],
};