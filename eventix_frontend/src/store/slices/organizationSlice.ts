import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import organizationService from "../../service/organizationService";
import {
  AddUserRequest,
  OrganizationResponse,
  UserDTO,
} from "../../types/organization.types";

interface OrganizationState {
  currentOrg: OrganizationResponse | null;
  teamMembers: UserDTO[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrganizationState = {
  currentOrg: null,
  teamMembers: [],
  isLoading: false,
  error: null,
};

// Fetch org details and team members
export const fetchOrgDetails = createAsyncThunk(
  "organization/fetchDetails",
  async (orgId: number, { rejectWithValue }) => {
    try {
      return await organizationService.getDetails(orgId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to load organization",
      );
    }
  },
);

// Add user to team
export const inviteUser = createAsyncThunk(
  "organization/addUser",
  async (
    { orgId, data }: { orgId: number; data: AddUserRequest },
    { rejectWithValue },
  ) => {
    try {
      // The service returns a UserDTO, so the thunk now "reads" the value
      return await organizationService.addUser(orgId, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to add user");
    }
  },
);

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    // Example of using UserDTO in a manual reducer
    removeUserLocally: (state, action: PayloadAction<number>) => {
      state.teamMembers = state.teamMembers.filter(
        (user) => user.id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      inviteUser.fulfilled,
      (state, action: PayloadAction<UserDTO>) => {
        state.isLoading = false;
        // Pushing the UserDTO into the state list
        state.teamMembers.push(action.payload);
        if (state.currentOrg) {
          state.currentOrg.users.push(action.payload);
        }
      },
    );
  },
});

export default organizationSlice.reducer;
