import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const isChangePasswordPage = pathname === "/admin/change-password";
    const token = request.cookies.get("session_token")?.value;

    if (!token) {
      if (isLoginPage) return NextResponse.next();
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const payload = await verifySessionToken(token);
      if (!payload) throw new Error("Invalid session");

      const mustChange = Boolean(payload.mustChangePassword);

      if (mustChange && !isChangePasswordPage && !isLoginPage) {
        return NextResponse.redirect(new URL("/admin/change-password", request.url));
      }


      return NextResponse.next();
    } catch {
      // Invalid / expired token
      if (isLoginPage) return NextResponse.next();
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("session_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
