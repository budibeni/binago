import re

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/admin_handlers.go", "r") as f:
    content = f.read()

replacement = """	if req.RoleCode != "SUPER_ADMIN" && req.CompanyCode != "" {
		schema := fmt.Sprintf("adatrack_gps_%s", strings.ToLower(req.CompanyCode))
		var existingAccess int
		errCheck := tx.QueryRow(ctx, fmt.Sprintf("SELECT 1 FROM %s.tm_user_company_access WHERE user_id = $1 AND deleted_at IS NULL", schema), newUserID).Scan(&existingAccess)
		if errCheck == nil {
			h.writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "User already registered in this company.")
			return
		}
		
		// If they were soft deleted, we should restore them instead of inserting!
		// Let's use an upsert (ON CONFLICT) if there is a unique constraint, but we only have uq_user_role on (user_id, role_code).
		// Wait, instead of ON CONFLICT, let's just insert and if it fails, catch the error explicitly.
		_, err = tx.Exec(ctx, fmt.Sprintf("INSERT INTO %s.tm_user_company_access (user_id, role_code, is_active, deleted_at) VALUES ($1, $2, true, NULL) ON CONFLICT (user_id, role_code) DO UPDATE SET is_active = true, deleted_at = NULL", schema), newUserID, req.RoleCode)
		if err != nil {
			h.writeError(w, http.StatusInternalServerError, "DB_ERROR", "Failed to link user to company schema: " + err.Error())
			return
		}
	}"""

content = re.sub(
    r'\tif req\.RoleCode != "SUPER_ADMIN" && req\.CompanyCode != "" \{\n\t\tschema := fmt\.Sprintf\("adatrack_gps_%s", strings\.ToLower\(req\.CompanyCode\)\)\n\t\tvar existingAccess int\n\t\terrCheck := tx\.QueryRow\(ctx, fmt\.Sprintf\("SELECT 1 FROM %s\.tm_user_company_access WHERE user_id = \$1", schema\), newUserID\)\.Scan\(&existingAccess\)\n\t\tif errCheck == nil \{\n\t\t\th\.writeError\(w, http\.StatusBadRequest, "VALIDATION_ERROR", "User already registered in this company\."\)\n\t\t\treturn\n\t\t\}\n\t\t_, err = tx\.Exec\(ctx, fmt\.Sprintf\("INSERT INTO %s\.tm_user_company_access \(user_id, role_code, is_active\) VALUES \(\$1, \$2, true\)", schema\), newUserID, req\.RoleCode\)\n\t\tif err != nil \{\n\t\t\th\.writeError\(w, http\.StatusInternalServerError, "DB_ERROR", "Failed to link user to company schema: " \+ err\.Error\(\)\)\n\t\t\treturn\n\t\t\}\n\t\}',
    replacement,
    content,
    flags=re.DOTALL
)

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/admin_handlers.go", "w") as f:
    f.write(content)
