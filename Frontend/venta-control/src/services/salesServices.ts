import api from "@/api/Api";
import type { Sale, SaleRegister, SaleProductWithDetails } from "@/types/sale";

export const getSales = async (): Promise<Sale[]> => {
    try {
        const { data } = await api.get<Sale[]>('sales/');
        return data;

    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw new Error("Error de red o servidor no disponible");
    }
};

export const getSaleProducts = async (saleId: number): Promise<SaleProductWithDetails[]> => {
    try {
        const { data } = await api.get<SaleProductWithDetails[]>(`sales/${saleId}/products/`);
        return data;

    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw new Error("Error de red o servidor no disponible");
    }
};

export const getRecentSales = async (limit: number = 10): Promise<Sale[]> => {
    try {
        const { data } = await api.get<Sale[]>('sales/', { params: { limit } });
        return data;

    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw new Error("Error de red o servidor no disponible");
    }
};

export const getSalesByFilter = async (params: string): Promise<Sale[]> => {
    try {
        const { data } = await api.get<Sale[]>(`sales/?${params}`);
        return data;

    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw new Error("Error de red o servidor no disponible");
    }
};

export const createSale = async (saleData: SaleRegister): Promise<any> => {
    try {
        const resp = await api.post('sales/', saleData);
        return resp;

    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw new Error("Error de red o servidor no disponible");
    }
};
