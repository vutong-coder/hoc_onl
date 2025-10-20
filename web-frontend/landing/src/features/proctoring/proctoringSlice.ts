import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProctoringSession } from '../../types';
import apiService from '../../api/apiService';

interface ProctoringState {
  sessions: ProctoringSession[];
  currentSession: ProctoringSession | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProctoringState = {
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchProctoringSessions = createAsyncThunk(
  'proctoring/fetchProctoringSessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getProctoringSessions();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch proctoring sessions');
    }
  }
);

export const startProctoringSession = createAsyncThunk(
  'proctoring/startProctoringSession',
  async (examId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.startProctoringSession(examId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start proctoring session');
    }
  }
);

export const endProctoringSession = createAsyncThunk(
  'proctoring/endProctoringSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.endProctoringSession(sessionId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to end proctoring session');
    }
  }
);

const proctoringSlice = createSlice({
  name: 'proctoring',
  initialState,
  reducers: {
    setCurrentSession: (state, action: PayloadAction<ProctoringSession>) => {
      state.currentSession = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch proctoring sessions
      .addCase(fetchProctoringSessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProctoringSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchProctoringSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Start proctoring session
      .addCase(startProctoringSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startProctoringSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
        state.sessions.push(action.payload);
      })
      .addCase(startProctoringSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // End proctoring session
      .addCase(endProctoringSession.fulfilled, (state, action) => {
        const index = state.sessions.findIndex(session => session.id === action.payload.id);
        if (index !== -1) {
          state.sessions[index] = action.payload;
        }
        if (state.currentSession?.id === action.payload.id) {
          state.currentSession = action.payload;
        }
      });
  },
});

export const { setCurrentSession, clearError } = proctoringSlice.actions;
export default proctoringSlice.reducer;
