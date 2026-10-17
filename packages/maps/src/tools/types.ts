/**
 * @adatrack/maps - tools/types.ts
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

/**
 * Opsi geofence untuk pencarian armada di SearchLocationTool.
 */
export interface SearchGeofenceOption {
  id: string;
  label: string;
  coordinates?: { lat: number; lng: number }[];
  type?: 'polygon' | 'circle';
  radius?: number;
}

/**
 * Opsi rute untuk pencarian armada di SearchLocationTool.
 */
export interface SearchRouteOption {
  id: string;
  label: string;
  coordinates?: { lat: number; lng: number }[];
}

/**
 * Hasil kendaraan yang berada di geofence atau rute terpilih.
 */
export interface SearchAreaVehicleResult {
  id: string;
  plateNumber: string;
  lat: number;
  lng: number;
  status?: 'driving' | 'idle' | 'parking' | 'offline' | string;
  vehicleType?: string;
  distance?: number;
}

/**
 * Hasil geofence yang berada di dalam radius tertentu dari titik pencarian.
 */
export interface SearchAreaGeofenceResult {
  id: string;
  name: string;
  groupName?: string;
  geometryType?: 'polygon' | 'circle' | 'rectangle' | 'multiline';
  distance: number; // Jarak dalam meter dari titik pencarian
  status?: 'active' | 'inactive';
  coordinates?: { lat: number; lng: number }[];
}

/**
 * Hasil rute yang berada di dalam radius tertentu dari titik pencarian.
 */
export interface SearchAreaRouteResult {
  id: string;
  name: string;
  groupName?: string;
  distance: number; // Jarak terdekat dalam meter dari titik pencarian ke rute
  status?: 'active' | 'inactive';
  coordinates?: { lat: number; lng: number }[];
  plannedDistance?: number;
  estimatedDuration?: number;
}

/**
 * Highlight area atau rute aktif di atas kanvas peta.
 */
export interface ActiveSearchAreaHighlight {
  type: 'geofence' | 'route';
  coordinates: { lat: number; lng: number }[];
  geofenceType?: 'polygon' | 'circle';
  radius?: number;
}
