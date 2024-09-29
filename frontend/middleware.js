// middleware.js (Next.js Middleware)
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/utils/auth";

export function middleware(req) {
  if (!isAuthenticated()) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], 
};
