export interface Tenant {
  id: string;
  name: string;
}

export interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
  };
  activeTenant: Tenant;
}
