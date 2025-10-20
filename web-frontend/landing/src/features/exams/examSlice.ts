import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Exam, ExamSession, Question, Answer } from '../../types';
import apiService from '../../api/apiService';

interface ExamState {
  exams: Exam[];
  currentExam: Exam | null;
  examSession: ExamSession | null;
  isLoading: boolean;
  error: string | null;
  questions: Question[];
  answers: Answer[];
  timeRemaining: number;
}

const initialState: ExamState = {
  exams: [],
  currentExam: null,
  examSession: null,
  isLoading: false,
  error: null,
  questions: [],
  answers: [],
  timeRemaining: 0,
};

// Async thunks
export const fetchExams = createAsyncThunk(
  'exams/fetchExams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getExams();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch exams');
    }
  }
);

export const fetchExamById = createAsyncThunk(
  'exams/fetchExamById',
  async (examId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getExamById(examId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch exam');
    }
  }
);

export const startExamSession = createAsyncThunk(
  'exams/startExamSession',
  async (examId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.startExamSession(examId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start exam session');
    }
  }
);

export const submitAnswer = createAsyncThunk(
  'exams/submitAnswer',
  async ({ sessionId, questionId, answer }: { sessionId: string; questionId: string; answer: string | number }, { rejectWithValue }) => {
    try {
      await apiService.submitAnswer(sessionId, questionId, answer);
      return { questionId, answer };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit answer');
    }
  }
);

export const endExamSession = createAsyncThunk(
  'exams/endExamSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.endExamSession(sessionId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to end exam session');
    }
  }
);

const examSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    setCurrentExam: (state, action: PayloadAction<Exam>) => {
      state.currentExam = action.payload;
      state.questions = action.payload.questions;
    },
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    updateAnswer: (state, action: PayloadAction<{ questionId: string; answer: string | number }>) => {
      const { questionId, answer } = action.payload;
      const existingAnswerIndex = state.answers.findIndex(a => a.questionId === questionId);
      
      if (existingAnswerIndex >= 0) {
        state.answers[existingAnswerIndex].answer = answer;
        state.answers[existingAnswerIndex].timestamp = new Date().toISOString();
      } else {
        state.answers.push({
          questionId,
          answer,
          timestamp: new Date().toISOString(),
        });
      }
    },
    clearExamSession: (state) => {
      state.examSession = null;
      state.answers = [];
      state.timeRemaining = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch exams
      .addCase(fetchExams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exams = action.payload;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch exam by ID
      .addCase(fetchExamById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExamById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentExam = action.payload;
        state.questions = action.payload.questions;
      })
      .addCase(fetchExamById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Start exam session
      .addCase(startExamSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startExamSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.examSession = action.payload;
        state.timeRemaining = action.payload.duration * 60; // Convert minutes to seconds
      })
      .addCase(startExamSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Submit answer
      .addCase(submitAnswer.fulfilled, (state, action) => {
        const { questionId, answer } = action.payload;
        const existingAnswerIndex = state.answers.findIndex(a => a.questionId === questionId);
        
        if (existingAnswerIndex >= 0) {
          state.answers[existingAnswerIndex].answer = answer;
          state.answers[existingAnswerIndex].timestamp = new Date().toISOString();
        } else {
          state.answers.push({
            questionId,
            answer,
            timestamp: new Date().toISOString(),
          });
        }
      })
      // End exam session
      .addCase(endExamSession.fulfilled, (state, action) => {
        state.examSession = action.payload;
        state.timeRemaining = 0;
      });
  },
});

export const { 
  setCurrentExam, 
  setTimeRemaining, 
  updateAnswer, 
  clearExamSession, 
  clearError 
} = examSlice.actions;

export default examSlice.reducer;
