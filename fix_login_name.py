import re

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/handlers.go", "r") as f:
    content = f.read()

content = content.replace('''"SELECT id, password_hash, is_active, must_change_password FROM adatrack_gps_master.tm_users WHERE email = $1 AND deleted_at IS NULL",
		req.Email).Scan(&userID, &hash, &isActive, &mustChange)''', '''"SELECT id, full_name, password_hash, is_active, must_change_password FROM adatrack_gps_master.tm_users WHERE email = $1 AND deleted_at IS NULL",
		req.Email).Scan(&userID, &fullName, &hash, &isActive, &mustChange)''')

content = content.replace("var isActive, mustChange bool", "var isActive, mustChange bool\n\tvar fullName *string")

content = content.replace('"role":                 role,\n\t\t\t"email":                req.Email,', '"role":                 role,\n\t\t\t"email":                req.Email,\n\t\t\t"name":                 func() string { if fullName != nil { return *fullName } return "" }(),')

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/handlers.go", "w") as f:
    f.write(content)

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/admin_handlers.go", "r") as f:
    content2 = f.read()

content2 = content2.replace("type UserInfo struct {\n\tID                 int      `json:\"id\"`\n\tEmail              string   `json:\"email\"`", "type UserInfo struct {\n\tID                 int      `json:\"id\"`\n\tEmail              string   `json:\"email\"`\n\tFullName           string   `json:\"full_name\"`")

content2 = content2.replace("rows, err := dbclient.Pool.Query(ctx, `SELECT id, email, global_role, is_active, must_change_password, password_changed_at, last_login_at, created_at FROM adatrack_gps_master.tm_users WHERE deleted_at IS NULL`+filterQuery+` ORDER BY created_at DESC LIMIT $1 OFFSET $2`, args...)", "rows, err := dbclient.Pool.Query(ctx, `SELECT id, email, full_name, global_role, is_active, must_change_password, password_changed_at, last_login_at, created_at FROM adatrack_gps_master.tm_users WHERE deleted_at IS NULL`+filterQuery+` ORDER BY created_at DESC LIMIT $1 OFFSET $2`, args...)")

content2 = content2.replace("err := rows.Scan(&user.ID, &user.Email, &user.GlobalRole, &user.IsActive, &user.MustChangePassword, &user.PasswordChangedAt, &user.LastLoginAt, &user.CreatedAt)", "var fullName *string\n\t\terr := rows.Scan(&user.ID, &user.Email, &fullName, &user.GlobalRole, &user.IsActive, &user.MustChangePassword, &user.PasswordChangedAt, &user.LastLoginAt, &user.CreatedAt)\n\t\tif fullName != nil {\n\t\t\tuser.FullName = *fullName\n\t\t}")

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/admin_handlers.go", "w") as f:
    f.write(content2)

