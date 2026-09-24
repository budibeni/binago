import re

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/admin_handlers.go", "r") as f:
    content = f.read()

replacement = """	var newUserID int
	err = tx.QueryRow(ctx, "SELECT id FROM adatrack_gps_master.tm_users WHERE email = $1", req.Email).Scan(&newUserID)
	if err != nil {
		hash, _ := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
		err = tx.QueryRow(ctx, "INSERT INTO adatrack_gps_master.tm_users (email, password_hash) VALUES ($1, $2) RETURNING id", req.Email, string(hash)).Scan(&newUserID)
		if err != nil {
			h.writeError(w, http.StatusInternalServerError, "DB_ERROR", "Failed to create user in master: " + err.Error())
			return
		}
	}

	if req.RoleCode != "SUPER_ADMIN" && req.CompanyCode != "" {
		schema := fmt.Sprintf("adatrack_gps_%s", strings.ToLower(req.CompanyCode))
		var existingAccess int
		errCheck := tx.QueryRow(ctx, fmt.Sprintf("SELECT 1 FROM %s.tm_user_company_access WHERE user_id = $1", schema), newUserID).Scan(&existingAccess)
		if errCheck == nil {
			h.writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "User already registered in this company.")
			return
		}
		_, err = tx.Exec(ctx, fmt.Sprintf("INSERT INTO %s.tm_user_company_access (user_id, role_code, is_active) VALUES ($1, $2, true)", schema), newUserID, req.RoleCode)
		if err != nil {
			h.writeError(w, http.StatusInternalServerError, "DB_ERROR", "Failed to link user to company schema: " + err.Error())
			return
		}
	}
	if err := tx.Commit(ctx); err != nil {
		h.writeError(w, http.StatusInternalServerError, "DB_ERROR", "Failed to commit user creation: " + err.Error())
		return
	}"""

content = re.sub(
    r'\tvar newUserID int\n\terr = tx\.QueryRow\(ctx, "SELECT id FROM adatrack_gps_master\.tm_users WHERE email = \$1", req\.Email\)\.Scan\(&newUserID\)\n\tif err != nil \{\n\t\thash, _ := bcrypt\.GenerateFromPassword\(\[\]byte\(req\.Password\), 12\)\n\t\terr = tx\.QueryRow\(ctx, "INSERT INTO adatrack_gps_master\.tm_users \(email, password_hash\) VALUES \(\$1, \$2\) RETURNING id", req\.Email, string\(hash\)\)\.Scan\(&newUserID\)\n\t\tif err != nil \{\n\t\t\th\.writeError\(w, http\.StatusInternalServerError, "DB_ERROR", "Failed to create user in master\."\)\n\t\t\treturn\n\t\t\}\n\t\}\n\n\tif req\.RoleCode != "SUPER_ADMIN" && req\.CompanyCode != "" \{\n\t\tschema := fmt\.Sprintf\("adatrack_gps_%s", strings\.ToLower\(req\.CompanyCode\)\)\n\t\tvar existingAccess int\n\t\terrCheck := tx\.QueryRow\(ctx, fmt\.Sprintf\("SELECT 1 FROM %s\.tm_user_company_access WHERE user_id = \$1", schema\), newUserID\)\.Scan\(&existingAccess\)\n\t\tif errCheck == nil \{\n\t\t\th\.writeError\(w, http\.StatusBadRequest, "VALIDATION_ERROR", "User already registered in this company\."\)\n\t\t\treturn\n\t\t\}\n\t\t_, err = tx\.Exec\(ctx, fmt\.Sprintf\("INSERT INTO %s\.tm_user_company_access \(user_id, role_code, is_active\) VALUES \(\$1, \$2, true\)", schema\), newUserID, req\.RoleCode\)\n\t\tif err != nil \{\n\t\t\th\.writeError\(w, http\.StatusInternalServerError, "DB_ERROR", "Failed to link user to company schema\."\)\n\t\t\treturn\n\t\t\}\n\t\}\n\tif err := tx\.Commit\(ctx\); err != nil \{\n\t\th\.writeError\(w, http\.StatusInternalServerError, "DB_ERROR", "Failed to commit user creation"\)\n\t\treturn\n\t\}',
    replacement,
    content,
    flags=re.DOTALL
)

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/admin_handlers.go", "w") as f:
    f.write(content)
