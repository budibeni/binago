import re

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/admin_handlers.go", "r") as f:
    content = f.read()

# Add FullName to struct
content = content.replace('Email       string `json:"email"`', 'Email       string `json:"email"`\n\tFullName    string `json:"full_name"`')

# Add FullName to INSERT
content = content.replace('err = tx.QueryRow(ctx, "INSERT INTO adatrack_gps_master.tm_users (email, password_hash) VALUES ($1, $2) RETURNING id", req.Email, string(hash)).Scan(&newUserID)', 'err = tx.QueryRow(ctx, "INSERT INTO adatrack_gps_master.tm_users (email, full_name, password_hash) VALUES ($1, $2, $3) RETURNING id", req.Email, req.FullName, string(hash)).Scan(&newUserID)')

with open("/home/arfian107/Projects/adatrack/backend/services/service-websocket/internal/api/admin_handlers.go", "w") as f:
    f.write(content)
