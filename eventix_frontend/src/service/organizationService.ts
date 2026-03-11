import axiosInstance from "../service/axiosConfig";
import {
  OrganizationResponse,
  UserDTO,
  AddUserRequest,
} from "../types/organization.types";

const organizationService = {
  // GET /{orgId}
  getDetails: async (orgId: number): Promise<OrganizationResponse> => {
    const response = await axiosInstance.get<OrganizationResponse>(
      `/organizations/${orgId}`,
    );
    return response.data;
  },

  // POST /{orgId}/users
  addUser: async (orgId: number, data: AddUserRequest): Promise<UserDTO> => {
    const response = await axiosInstance.post<UserDTO>(
      `/organizations/${orgId}/users`,
      data,
    );
    return response.data;
  },
};

export default organizationService;
