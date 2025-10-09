import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import MockAuthService, { User, LoginCredentials } from '../../services/mockAuthService'

export type UserRole = 'admin' | 'user' | null

type AuthState = {
	loggedIn: boolean
	role: UserRole
	user: User | null
	loading: boolean
	error: string | null
}

const initialState: AuthState = { 
	loggedIn: false, 
	role: null, 
	user: null,
	loading: false,
	error: null
}

// Async thunks
export const loginUser = createAsyncThunk(
	'auth/loginUser',
	async (credentials: LoginCredentials, { rejectWithValue }) => {
		try {
			const response = await MockAuthService.login(credentials)
			if (response.success && response.user) {
				return response.user
			} else {
				return rejectWithValue(response.message || 'Login failed')
			}
		} catch (error) {
			return rejectWithValue('Network error')
		}
	}
)

export const logoutUser = createAsyncThunk(
	'auth/logoutUser',
	async () => {
		await MockAuthService.logout()
	}
)

export const checkAuth = createAsyncThunk(
	'auth/checkAuth',
	async () => {
		const user = MockAuthService.getCurrentUser()
		if (user && MockAuthService.isAuthenticated()) {
			return user
		}
		throw new Error('Not authenticated')
	}
)

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearError(state) {
			state.error = null
		},
	},
	extraReducers: (builder) => {
		builder
			// Login
			.addCase(loginUser.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false
				state.loggedIn = true
				state.user = action.payload
				state.role = action.payload.role
				state.error = null
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false
				state.loggedIn = false
				state.user = null
				state.role = null
				state.error = action.payload as string
			})
			// Logout
			.addCase(logoutUser.fulfilled, (state) => {
				state.loggedIn = false
				state.user = null
				state.role = null
				state.error = null
			})
			// Check auth
			.addCase(checkAuth.fulfilled, (state, action) => {
				state.loggedIn = true
				state.user = action.payload
				state.role = action.payload.role
			})
			.addCase(checkAuth.rejected, (state) => {
				state.loggedIn = false
				state.user = null
				state.role = null
			})
	},
})

export const { clearError } = authSlice.actions
export default authSlice.reducer


