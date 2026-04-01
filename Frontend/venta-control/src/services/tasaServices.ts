import api from "@/api/Api";

export interface Tasa {
    id: number;
    valor: number;
    estatus: boolean;
    fechaHora: string;
}

export const getTasaDolar = async (): Promise<Tasa> => {
    try {
        const { data } = await api.get<Tasa>('tasa/dolar/');
        return data;
    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw new Error("Error de red o servidor no disponible");
    }
};
