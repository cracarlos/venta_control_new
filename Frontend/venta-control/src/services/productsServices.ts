import api from "@/api/Api";
import type { Product, ProductRegister } from "@/types/product";

export const getProducts = async (): Promise<Product[]> => {
    try {
        const { data } = await api.get<Product[]>('products/');
        return data;

    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw new Error("Error de red o servidor no disponible");
    }
};

export const getProductId = async (id: number): Promise<Product> => {
    try {
        const { data } = await api.get<Product>(`products/${id}/`);
        return data;

    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw new Error("Error de red o servidor no disponible");
    }
};

export const postProducts = async (productData: ProductRegister): Promise<any> => {
    try {
        const formData = new FormData()
        formData.append('product_name', productData.product_name)
        formData.append('product_description', productData.product_description)
        formData.append('quantity', String(productData.quantity))
        formData.append('price', productData.price)
        if (productData.image) {
            formData.append('image', productData.image)
        }
        const resp = await api.post('products/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return resp;

    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
        throw new Error("Error de red o servidor no disponible");
    }
};

export const putProducts = async (productData: ProductRegister): Promise<any> => {
    try {
        const formData = new FormData()
        formData.append('product_name', productData.product_name)
        formData.append('product_description', productData.product_description)
        formData.append('quantity', String(productData.quantity))
        formData.append('price', productData.price)
        if (productData.image) {
            formData.append('image', productData.image)
        }
        const resp = await api.put(`products/${productData.id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return resp;

    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
        throw new Error("Error de red o servidor no disponible");
    }
};

export const deleteProduct = async (id: number): Promise<any> => {
    try {
        const resp = await api.delete(`products/${id}/`);
        return resp;

    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
        throw new Error("Error de red o servidor no disponible");
    }
};
