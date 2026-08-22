export type Coordinate = {
  lat: number;
  lng: number;
};

export type CircleGeometry = {
  type: 'circle';
  center: Coordinate;
  radius: number; // in meters
};

export type PolygonGeometry = {
  type: 'polygon';
  coordinates: Coordinate[]; // outer ring
};

export type MapGeometry = CircleGeometry | PolygonGeometry;

export type GeometryEditorState = {
  mode: 'idle' | 'draw_polygon' | 'draw_circle' | 'edit';
  geometry: MapGeometry | null;
};
