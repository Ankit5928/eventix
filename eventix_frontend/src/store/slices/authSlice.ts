import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  roles: string[];
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  currentOrganizationId: string | null;
  organizationIds: string[];
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null, // In a real app we'd decode the JWT to get the user info initially
  isAuthenticated: !!localStorage.getItem('token'),
  currentOrganizationId: localStorage.getItem('currentOrganizationId'),
  organizationIds: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User; organizationIds: string[] }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.organizationIds = action.payload.organizationIds;
      if (action.payload.organizationIds.length > 0) {
        state.currentOrganizationId = action.payload.organizationIds[0];
        localStorage.setItem('currentOrganizationId', state.currentOrganizationId);
      }
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.currentOrganizationId = null;
      state.organizationIds = [];
      localStorage.removeItem('token');
      localStorage.removeItem('currentOrganizationId');
    },
    switchOrganization: (state, action: PayloadAction<string>) => {
      state.currentOrganizationId = action.payload;
      localStorage.setItem('currentOrganizationId', action.payload);
    },
  },
});

export const { setCredentials, logout, switchOrganization } = authSlice.actions;
export default authSlice.reducer;
