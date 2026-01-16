import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("admin");
  const pathname = req.nextUrl.pathname;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard",
    "/user/:path*",
    "/service-history/:path*",
    "/subscription/:path*",
    "/ticket/:path*",
    "/payment/:path*",
    "/store/:path*",
    "/coupon/:path*",
    "/coupon-info/:path*",
    "/issue-coupn",
    "/message",
    "/inquiry/:path*",
    "/notice/:path*",
  ],
};
