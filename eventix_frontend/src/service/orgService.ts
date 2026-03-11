import apiClient from './api';

export interface AddUserRequest {
  email: string;
  role: 'ORGANIZER' | 'CHECK_IN_OPERATOR';
}

export const inviteUserToOrganization = async (orgId: string, payload: AddUserRequest) => {
  const response = await apiClient.post(`/organizations/${orgId}/users`, payload);
  return response.data;
};
