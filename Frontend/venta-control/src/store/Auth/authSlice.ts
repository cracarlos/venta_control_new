import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface AuthState {
    isAuthenticated: boolean,
    email: string,
    userId: number,
    fullName: string,
    passwordUpdate: boolean,
    groupName: string,
    groupId: number,
    permissions: string[]
}

const initialState: AuthState = {
    isAuthenticated: false,
    email:"",
    userId: 0,
    fullName:"",
    passwordUpdate: false,
    groupName: "",
    groupId: 0,
    permissions: []
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
            state.groupName = payload.groupName
            state.groupId = payload.groupId
            state.permissions = payload.permissions
        },
        logoutSlice: (state) => {
            state.isAuthenticated = false
            state.email = ""
            state.userId = 0
            state.fullName = ""
            state.passwordUpdate = false
            state.groupName = ""
            state.groupId = 0
            state.permissions = []
        },
        passwordUpdateSlice: (state, { payload }: PayloadAction<boolean>) => {
            state.passwordUpdate = payload
        }
    },
})

export const { loginSlice, logoutSlice, passwordUpdateSlice } = AuthSlice.actions

export const selectAuth = (state: RootState) => state.auth