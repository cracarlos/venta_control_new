export interface Sale {
    id: number,
    payment: string,
    sale_type?: { id: number, type: string } | null,
    user_creation: number,
    user_update: number | null,
    created_at: string,
    updated_at: string,
}

export interface SaleProduct {
    id: number,
    sale: number,
    product: number,
    quantity: number,
    price: string,
    user_creation: number,
    user_update: number | null,
    created_at: string,
    updated_at: string,
}

export interface SaleProductWithDetails extends SaleProduct {
    product_name?: string,
    product_description?: string,
}

export interface SaleRegister {
    payment: string,
    sale_type_id: number,
    products: {
        product: number,
        quantity: number,
        price: string,
    }[],
}
