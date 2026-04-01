import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
interface uiState {
    isLoading: boolean,
    modalOpen: boolean,
    modalName: string
}

// Define the initial state using that type
const initialState: uiState = {
    isLoading: false,
    modalOpen: false,
    modalName: ''
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setIsLoading: (state, { payload }: PayloadAction<boolean>) => {
            state.isLoading = payload
        },
        setModalOpen: (state, { payload }: PayloadAction<boolean>) => {
            state.modalOpen = payload
        },
        setModalName: (state, { payload }: PayloadAction<string>) => {
            state.modalName = payload
        },
    },
})

export const { setIsLoading, setModalOpen, setModalName } = uiSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUI = (state: RootState) => state.ui

export default uiSlice.reducer