import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Organization } from '../../types';
import apiService from '../../api/apiService';

interface OrganizationState {
  organizations: Organization[];
  currentOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrganizationState = {
  organizations: [],
  currentOrganization: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchOrganizations = createAsyncThunk(
  'organizations/fetchOrganizations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getOrganizations();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch organizations');
    }
  }
);

export const fetchOrganizationById = createAsyncThunk(
  'organizations/fetchOrganizationById',
  async (organizationId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getOrganizationById(organizationId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch organization');
    }
  }
);

export const createOrganization = createAsyncThunk(
  'organizations/createOrganization',
  async (organizationData: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await apiService.createOrganization(organizationData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create organization');
    }
  }
);

export const updateOrganization = createAsyncThunk(
  'organizations/updateOrganization',
  async ({ organizationId, organizationData }: { organizationId: string; organizationData: Partial<Organization> }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateOrganization(organizationId, organizationData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update organization');
    }
  }
);

export const deleteOrganization = createAsyncThunk(
  'organizations/deleteOrganization',
  async (organizationId: string, { rejectWithValue }) => {
    try {
      await apiService.deleteOrganization(organizationId);
      return organizationId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete organization');
    }
  }
);

const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    setCurrentOrganization: (state, action: PayloadAction<Organization>) => {
      state.currentOrganization = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch organizations
      .addCase(fetchOrganizations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch organization by ID
      .addCase(fetchOrganizationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrganization = action.payload;
      })
      .addCase(fetchOrganizationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create organization
      .addCase(createOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations.push(action.payload);
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update organization
      .addCase(updateOrganization.fulfilled, (state, action) => {
        const index = state.organizations.findIndex(org => org.id === action.payload.id);
        if (index !== -1) {
          state.organizations[index] = action.payload;
        }
        if (state.currentOrganization?.id === action.payload.id) {
          state.currentOrganization = action.payload;
        }
      })
      // Delete organization
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        state.organizations = state.organizations.filter(org => org.id !== action.payload);
        if (state.currentOrganization?.id === action.payload) {
          state.currentOrganization = null;
        }
      });
  },
});

export const { setCurrentOrganization, clearError } = organizationSlice.actions;
export default organizationSlice.reducer;
