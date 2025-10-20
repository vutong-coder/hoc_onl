import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import examReducer from '../features/exams/examSlice';
import courseReducer from '../features/courses/courseSlice';
import userReducer from '../features/users/userSlice';
import organizationReducer from '../features/organizations/organizationSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';
import proctoringReducer from '../features/proctoring/proctoringSlice';
import rewardsReducer from '../features/rewards/rewardsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exams: examReducer,
    courses: courseReducer,
    users: userReducer,
    organizations: organizationReducer,
    analytics: analyticsReducer,
    proctoring: proctoringReducer,
    rewards: rewardsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;