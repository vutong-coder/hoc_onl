import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type UserRole = 'student' | 'proctor' | 'admin' | null

type AuthState = {
	loggedIn: boolean
	role: UserRole
}

const initialState: AuthState = { loggedIn: false, role: null }

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login(state, action: PayloadAction<UserRole>) {
			state.loggedIn = true
			state.role = action.payload
		},
		logout(state) {
			state.loggedIn = false
			state.role = null
		},
	},
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer


