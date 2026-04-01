import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { UserByID } from '@/types/user'



const initialState: UserByID = {
    id: 0,
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    second_last_name: '',
    cedula_rif: '',
    is_active: true,
    groups: []
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<UserByID>) => {
            state.id = payload.id
            state.email = payload.email
            state.first_name = payload.first_name
            state.middle_name = payload.middle_name
            state.last_name = payload.last_name
            state.second_last_name = payload.second_last_name
            state.cedula_rif = payload.cedula_rif
            state.is_active = payload.is_active
            state.groups = payload.groups
        },
        cleanUser: (state) => {
            state.id = 0
            state.email = ''
            state.first_name = ''
            state.middle_name = ''
            state.last_name = ''
            state.second_last_name = ''
            state.cedula_rif = ''
            state.is_active = false
            state.groups = []
        }
    },
})

export const { setUser, cleanUser } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user

export default userSlice.reducer