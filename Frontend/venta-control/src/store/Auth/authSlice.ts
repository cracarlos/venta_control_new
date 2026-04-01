import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
interface AuthState {
    isAuthenticated: boolean,
    email: string,
    userId: number,
    fullName: string,
    passwordUpdate: boolean
}

// Define the initial state using that type
const initialState: AuthState = {
    isAuthenticated: false,
    email:"",
    userId: 0,
    fullName:"",
    passwordUpdate: false,
}

export const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSlice: (state, { payload }: PayloadAction<AuthState>) => {
            state.isAuthenticated = true
            state.email = payload.email
            state.userId = payload.userId
            state.fullName = payload.fullName
            state.passwordUpdate = payload.passwordUpdate
        },
        logoutSlice: (state) => {
            state.isAuthenticated = false
            state.email = ""
            state.userId = 0
            state.fullName = ""
            state.passwordUpdate = false
        },
        passwordUpdateSlice: (state, { payload }: PayloadAction<boolean>) => {
            state.passwordUpdate = payload
        }
    },
})

export const { loginSlice, logoutSlice, passwordUpdateSlice } = AuthSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectAuth = (state: RootState) => state.auth

export default AuthSlice.reducer