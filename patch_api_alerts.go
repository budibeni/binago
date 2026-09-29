package main

import (
	"fmt"
	"io/ioutil"
	"strings"
)

func main() {
	routerFile := "../backend/services/api-vehicle/internal/api/router.go"
	routerContent, _ := ioutil.ReadFile(routerFile)
	routerStr := string(routerContent)
	if !strings.Contains(routerStr, "/vehicles/{id}/alerts") {
		routerStr = strings.Replace(routerStr, "r.Get(\"/vehicles/{id}/history\", h.GetVehicleHistory)", "r.Get(\"/vehicles/{id}/history\", h.GetVehicleHistory)\n\t\tr.Get(\"/vehicles/{id}/alerts\", h.GetVehicleAlerts)", 1)
		ioutil.WriteFile(routerFile, []byte(routerStr), 0644)
		fmt.Println("Patched router.go")
	}

	handlersFile := "../backend/services/api-vehicle/internal/api/handlers.go"
	handlersContent, _ := ioutil.ReadFile(handlersFile)
	handlersStr := string(handlersContent)
	
	if !strings.Contains(handlersStr, "GetVehicleAlerts") {
		newHandler := `
// GetVehicleAlerts handles GET /vehicles/{id}/alerts to fetch historical alerts.
func (h *Handler) GetVehicleAlerts(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(auth.ClaimsKey).(*auth.Claims)
	if !ok || claims == nil {
		h.writeError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}
	idStr := chi.URLParam(r, "id")
	id, _ := strconv.Atoi(idStr)

	startStr := r.URL.Query().Get("start")
	if startStr == "" {
		startStr = r.URL.Query().Get("from")
	}
	endStr := r.URL.Query().Get("end")
	if endStr == "" {
		endStr = r.URL.Query().Get("to")
	}

	var start, end time.Time
	var err error

	if startStr == "" || endStr == "" {
		end = time.Now().UTC()
		start = end.Add(-24 * time.Hour)
	} else {
		start, err = time.Parse(time.RFC3339, startStr)
		if err == nil {
			end, _ = time.Parse(time.RFC3339, endStr)
		}
	}

	schema := fmt.Sprintf("adatrack_gps_%s", claims.CompanyCode)
	query := fmt.Sprintf(` + "`" + `
		SELECT id, type, severity, metadata, created_at
		FROM %s.th_alerts
		WHERE vehicle_id = $1 AND created_at >= $2 AND created_at <= $3
		ORDER BY created_at DESC
		LIMIT 100
	` + "`" + `, schema)

	rows, err := tenant.NewReadRouter(claims.CompanyCode).Query(r.Context(), query, id, start, end)
	if err != nil {
		h.writeError(w, http.StatusInternalServerError, "DB_ERROR", "Failed to query alerts")
		return
	}
	defer rows.Close()

	type AlertResp struct {
		ID        string ` + "`" + `json:"id"` + "`" + `
		Category  string ` + "`" + `json:"category"` + "`" + `
		Type      string ` + "`" + `json:"type"` + "`" + `
		Title     string ` + "`" + `json:"title"` + "`" + `
		Message   string ` + "`" + `json:"message"` + "`" + `
		Timestamp string ` + "`" + `json:"timestamp"` + "`" + `
		VehicleID string ` + "`" + `json:"vehicleId"` + "`" + `
	}

	alerts := make([]AlertResp, 0)
	for rows.Next() {
		var (
			aID      int64
			aType    string
			severity string
			meta     []byte
			ts       time.Time
		)
		if err := rows.Scan(&aID, &aType, &severity, &meta, &ts); err == nil {
			
			category := "alarm_vehicle"
			if strings.HasPrefix(aType, "GEOFENCE") {
				category = "geofence"
			} else if aType == "OVERSPEEDING" || aType == "ROUTE_DEVIATION" {
				category = "operation"
			} else if aType == "BATTERY_LOW" || aType == "OFFLINE" {
				category = "sensor"
			}
			
			notifType := "info"
			if severity == "high" || severity == "critical" {
				notifType = "alert"
			} else if severity == "medium" {
				notifType = "warning"
			}

			message := string(meta)
			
			alerts = append(alerts, AlertResp{
				ID:        fmt.Sprintf("%d", aID),
				Category:  category,
				Type:      notifType,
				Title:     aType,
				Message:   message,
				Timestamp: ts.Format(time.RFC3339),
				VehicleID: idStr,
			})
		}
	}

	h.writeJSON(w, http.StatusOK, map[string]interface{}{
		"data": alerts,
	})
}
`
		handlersStr += newHandler
		ioutil.WriteFile(handlersFile, []byte(handlersStr), 0644)
		fmt.Println("Patched handlers.go")
	}
}
