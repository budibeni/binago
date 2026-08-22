export type Coordinate = {
  lat: number;
  lng: number;
};

export type RectangleGeometry = {
  type: 'rectangle';
  coordinates: [Coordinate, Coordinate]; // [southWest, northEast]
};

export type MultilineGeometry = {
  type: 'multiline';
  coordinates: Coordinate[]; // line string
};

export type PolygonGeometry = {
  type: 'polygon';
  coordinates: Coordinate[]; // outer ring
};

export type MapGeometry = RectangleGeometry | PolygonGeometry | MultilineGeometry;

export type GeometryEditorState = {
  mode: 'idle' | 'draw_polygon' | 'draw_rectangle' | 'draw_multiline' | 'edit';
  geometry: MapGeometry | null;
};
