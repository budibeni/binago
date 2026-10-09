import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";

  // Reverse Proxy for API requests
  if (request.nextUrl.pathname.startsWith("/api/v1/")) {
    try {
      const backendPath = request.nextUrl.pathname;
      
      let targetOrigin = "http://localhost:8080";
      
      // Safely parse NEXT_PUBLIC_API_URL
      const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
      if (configuredUrl) {
         try {
            // Check if it's absolute
            if (configuredUrl.startsWith("http")) {
               const urlObj = new URL(configuredUrl);
               targetOrigin = urlObj.origin;
            } else {
               // It's relative, assume we are proxying to the same host
               targetOrigin = request.nextUrl.origin;
            }
         } catch (e) {
            targetOrigin = "http://localhost:8080";
         }
      }

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
      
      // Force route internally in Docker
      // In both Local and Coolify Docker environments, these are the internal hostnames
      const internalVehicleUrl = process.env.INTERNAL_VEHICLE_URL || "http://api-vehicle:8084";
      const internalBackendUrl = process.env.INTERNAL_BACKEND_URL || "http://service-websocket:8080";
      
      if (isVehicleRoute) {
        targetOrigin = internalVehicleUrl;
      } else {
        targetOrigin = internalBackendUrl;
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
    } catch (error) {
      console.error("Middleware Proxy Error:", error);
      return new NextResponse(JSON.stringify({ error: "Proxy Error" }), { status: 500 });
    }
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
