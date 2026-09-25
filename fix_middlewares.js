const fs = require('fs');

const middlewareContent = `import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";

  // Reverse Proxy for API requests
  if (request.nextUrl.pathname.startsWith("/api/proxy/")) {
    const backendPath = request.nextUrl.pathname.replace("/api/proxy", "");
    const backendUrl = new URL(
      backendPath + request.nextUrl.search,
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088"
    );

    const headers = new Headers(request.headers);
    if (token) {
      headers.set("Authorization", \`Bearer \${token}\`);
    }

    return NextResponse.rewrite(backendUrl, {
      request: {
        headers,
      },
    });
  }

  // Auth Guard
  if (!token) {
    if (!isLoginPage && !request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    if (isLoginPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ],
};
`;

fs.writeFileSync('apps/business/src/middleware.ts', middlewareContent);
fs.writeFileSync('apps/personal/src/middleware.ts', middlewareContent);
