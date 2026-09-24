	if req.Email == "" || req.Password == "" {
		h.writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "email and password are required")
		return
	}

	if req.CompanyCode != "" && !tenant.IsValidCompanyCode(req.CompanyCode) {
		h.writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid company_code format")
		return
	}

	var userID int64
	var hash string
	var isActive, mustChange bool

	err := dbclient.Pool.QueryRow(r.Context(),
		"SELECT id, password_hash, is_active, must_change_password FROM adatrack_gps_master.tm_users WHERE email = $1 AND deleted_at IS NULL",
		req.Email).Scan(&userID, &hash, &isActive, &mustChange)
	if err != nil {
		h.writeError(w, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Invalid credentials")
		return
	}

	if !isActive {
		h.writeError(w, http.StatusForbidden, "USER_INACTIVE", "User account is inactive")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)); err != nil {
		h.writeError(w, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Invalid credentials")
		return
	}

	if req.CompanyCode == "" {
		rows, err := dbclient.Pool.Query(r.Context(), "SELECT code FROM adatrack_gps_master.tm_companies WHERE deleted_at IS NULL AND business_type = 'b2b'")
		if err != nil {
			h.writeError(w, http.StatusInternalServerError, "DB_ERROR", "Failed to query companies")
			return
		}
		
		var codes []string
		for rows.Next() {
			var code string
			if err := rows.Scan(&code); err == nil {
				codes = append(codes, code)
			}
		}
		rows.Close()

		if len(codes) > 0 {
			var queryParts []string
			for _, code := range codes {
				schema := fmt.Sprintf("adatrack_gps_%s", strings.ToLower(code))
				queryParts = append(queryParts, fmt.Sprintf("SELECT '%s' as company_code FROM %s.tm_user_company_access WHERE user_id = $1 AND deleted_at IS NULL AND is_active = true", code, schema))
			}
			
			query := strings.Join(queryParts, " UNION ALL ")
			rowsAccess, err := dbclient.Pool.Query(r.Context(), query, userID)
			if err == nil {
				var userCompanies []string
				for rowsAccess.Next() {
					var comp string
					if err := rowsAccess.Scan(&comp); err == nil {
						userCompanies = append(userCompanies, comp)
					}
				}
				rowsAccess.Close()

				if len(userCompanies) == 1 {
					req.CompanyCode = userCompanies[0]
				} else if len(userCompanies) > 1 {
					w.Header().Set("Content-Type", "application/json")
					w.WriteHeader(http.StatusOK)
					json.NewEncoder(w).Encode(map[string]interface{}{
						"status": "multiple_companies",
						"data": map[string]interface{}{
							"companies": userCompanies,
						},
					})
					return
				}
			}
		}
		
		if req.CompanyCode == "" {
			h.writeError(w, http.StatusForbidden, "COMPANY_ACCESS_DENIED", "No access to any company")
			return
		}
	}

	schema := fmt.Sprintf("adatrack_gps_%s", strings.ToLower(req.CompanyCode))
