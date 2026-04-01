export interface Product {
    id: number,
    product_name: string,
    product_description: string,
    quantity: number,
    price: string,
    image: string | null,
    user_creation: number,
    user_update: number | null,
    created_at: string,
    updated_at: string,
}

export interface ProductRegister {
    id?: number,
    product_name: string,
    product_description: string,
    quantity: number,
    price: string,
    image?: File | null,
}
