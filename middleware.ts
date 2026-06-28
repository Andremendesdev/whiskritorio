import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "whiskritorio_admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAuthenticated = request.cookies.get(ADMIN_COOKIE)?.value === "authenticated";

  if (pathname.startsWith("/admin") && !isLoginPage && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
