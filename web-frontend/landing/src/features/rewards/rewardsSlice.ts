import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Reward } from '../../types';
import apiService from '../../api/apiService';

interface RewardsState {
  rewards: Reward[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RewardsState = {
  rewards: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchRewards = createAsyncThunk(
  'rewards/fetchRewards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getRewards();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch rewards');
    }
  }
);

export const claimReward = createAsyncThunk(
  'rewards/claimReward',
  async (rewardId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.claimReward(rewardId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to claim reward');
    }
  }
);

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch rewards
      .addCase(fetchRewards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRewards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rewards = action.payload;
      })
      .addCase(fetchRewards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Claim reward
      .addCase(claimReward.fulfilled, (state, action) => {
        const index = state.rewards.findIndex(reward => reward.id === action.payload.id);
        if (index !== -1) {
          state.rewards[index] = action.payload;
        }
      });
  },
});

export const { clearError } = rewardsSlice.actions;
export default rewardsSlice.reducer;
