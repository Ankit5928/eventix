import axiosInstance from "../service/axiosConfig";
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  SwitchOrganizationRequest,
} from "../types/auth.types";

const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      "/auth/login",
      data,
    );
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<string> => {
    const response = await axiosInstance.post<string>("/auth/register", data);
    return response.data;
  },

  switchOrganization: async (
    data: SwitchOrganizationRequest,
  ): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      "/auth/switch-organization",
      data,
    );
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authService;
