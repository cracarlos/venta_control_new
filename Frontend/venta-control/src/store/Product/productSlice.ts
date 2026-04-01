import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { Product } from '@/types/product'

interface ProductState {
    id: number,
    product_name: string,
    product_description: string,
    quantity: number,
    price: string,
    image: string | null,
}

const initialState: ProductState = {
    id: 0,
    product_name: '',
    product_description: '',
    quantity: 0,
    price: '',
    image: null,
}

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProduct: (state, { payload }: PayloadAction<Product>) => {
            state.id = payload.id
            state.product_name = payload.product_name
            state.product_description = payload.product_description
            state.quantity = payload.quantity
            state.price = payload.price
            state.image = payload.image
        },
        cleanProduct: (state) => {
            state.id = 0
            state.product_name = ''
            state.product_description = ''
            state.quantity = 0
            state.price = ''
            state.image = null
        }
    },
})

export const { setProduct, cleanProduct } = productSlice.actions

export const selectProduct = (state: RootState) => state.product

export default productSlice.reducer
