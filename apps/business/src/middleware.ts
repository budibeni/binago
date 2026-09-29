import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";

  // Reverse Proxy for API requests
  if (request.nextUrl.pathname.startsWith("/api/proxy/")) {
    const backendPath = request.nextUrl.pathname.replace("/api/proxy", "");
    
    // Default origin is service-websocket on port 8080
    let targetOrigin = "http://localhost:8080";
    
    // Map of routes to api-vehicle (port 8084)
    const vehicleRoutes = [
      "/api/v1/vehicles",
      "/api/v1/geofences",
      "/api/v1/routes",
      "/api/v1/speed-configs",
      "/api/v1/notification-preferences",
      "/api/v1/alerts",
      "/api/v1/fuel-configs",
      "/api/v1/media",
      "/api/v1/access",
      "/api/v1/drivers",
      "/api/v1/share-links",
      "/api/v1/groups",
      "/api/v1/assets",
      "/api/v1/organizations",
      "/api/v1/integrations"
    ];
    
    const isVehicleRoute = vehicleRoutes.some(route => backendPath.startsWith(route));
    if (isVehicleRoute && process.env.NODE_ENV !== "production") {
      targetOrigin = "http://api-vehicle:8084";
    }

    const backendUrl = new URL(
      backendPath + request.nextUrl.search,
      targetOrigin
    );

    const headers = new Headers(request.headers);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
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
