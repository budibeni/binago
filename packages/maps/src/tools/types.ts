/**
 * @adatrack/maps — tools/types.ts
 *
 * Public types untuk abstraction layer tools.
 * Consumer (apps/personal) menggunakan types ini tanpa mengimpor maplibre-gl langsung.
 */

/**
 * Hasil pencarian lokasi (alamat atau koordinat).
 * Digunakan oleh SearchLocationTool.
 */
export interface LocationSearchResult {
  lat: number;
  lng: number;
  label: string;
}

/**
 * Opsi entitas/objek untuk GeofenceCheckTool.
 */
export interface MapEntityOption {
  id: string;
  label: string;
}

/**
 * Opsi geofence untuk GeofenceCheckTool.
 */
export interface MapGeofenceOption {
  id: string;
  label: string;
}

/**
 * Request untuk pengecekan unit vs geofence.
 */
export interface GeofenceCheckRequest {
  entityId: string;
  geofenceId: string;
}

/**
 * Hasil pengecekan unit vs geofence.
 */
export interface GeofenceCheckResult {
  inside: boolean;
  /** Jarak dari batas geofence dalam meter. Undefined jika tidak tersedia. */
  distance?: number;
  /** Label deskriptif hasil. */
  label?: string;
}
