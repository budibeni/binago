const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/backend/internal/auth/middleware.go';
let content = fs.readFileSync(path, 'utf8');

const oldCode = `func EnsurePlatformAdminMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, ok := r.Context().Value(ClaimsKey).(*Claims)
		isPlatformTenant := claims.CompanyCode == "DEFAULT" || claims.CompanyCode == "TEMPLATE"
		if !ok || !isPlatformTenant || (claims.Role != "SUPER_ADMIN" && claims.Role != "ADMIN") {
			http.Error(w, "PLATFORM_SCOPE required", http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}`;

const newCode = `import "fmt"
func EnsurePlatformAdminMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, ok := r.Context().Value(ClaimsKey).(*Claims)
		if !ok || claims == nil {
		    if logger.Log != nil { logger.Log.Warn("PlatformAdminMiddleware: NO CLAIMS") }
			http.Error(w, "PLATFORM_SCOPE required", http.StatusForbidden)
			return
		}
		isPlatformTenant := claims.CompanyCode == "DEFAULT" || claims.CompanyCode == "TEMPLATE"
		if !isPlatformTenant || (claims.Role != "SUPER_ADMIN" && claims.Role != "ADMIN") {
		    if logger.Log != nil { logger.Log.Warn("PlatformAdminMiddleware: REJECTED", "role", claims.Role, "company", claims.CompanyCode) }
			http.Error(w, "PLATFORM_SCOPE required", http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}`;

// I need to be careful with imports. Let's just use the logger already imported.
const newCodeSafe = `func EnsurePlatformAdminMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, ok := r.Context().Value(ClaimsKey).(*Claims)
		if !ok || claims == nil {
			if logger.Log != nil { logger.Log.Warn("PlatformAdminMiddleware: NO CLAIMS") }
			http.Error(w, "PLATFORM_SCOPE required", http.StatusForbidden)
			return
		}
		isPlatformTenant := claims.CompanyCode == "DEFAULT" || claims.CompanyCode == "TEMPLATE"
		if !isPlatformTenant || (claims.Role != "SUPER_ADMIN" && claims.Role != "ADMIN") {
			if logger.Log != nil { logger.Log.Warn("PlatformAdminMiddleware: REJECTED", "role", claims.Role, "company", claims.CompanyCode) }
			http.Error(w, "PLATFORM_SCOPE required", http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}`;

content = content.replace(oldCode, newCodeSafe);
fs.writeFileSync(path, content);
console.log("Patched middleware");
