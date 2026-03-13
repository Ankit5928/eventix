export interface User {
  userId: number;
  email: string;
  currentOrganizationId: number; // This fixes the 'Property does not exist' error
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password_hash: string; // Matches your backend field naming
}

export interface RegisterRequest {
  email: string;
  password_hash: string;
  organizationName: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  email: string;
  currentOrganizationId: number;
  roles: string[];
}

export interface SwitchOrganizationRequest {
  targetOrganizationId: number;
}
