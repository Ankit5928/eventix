export interface UserDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'OWNER' | 'ORGANIZER' | 'CHECK_IN_OPERATOR';
  isActive: boolean;
}

export interface OrganizationResponse {
  id: number;
  name: string;
  slug: string;
  users: UserDTO[];
  createdAt: string;
}

export interface AddUserRequest {
  email: string;
  role: 'ORGANIZER' | 'CHECK_IN_OPERATOR' | 'OWNER';
}