import api from "@/api/Api";
import {type AuthLogin, type AuthApi } from '@/types/auth';
// import {type ApiResponse } from '@/types/apiResponse';

export const postLogin = async (authDate: Partial<AuthLogin>): Promise<AuthApi> => {
    try {
        const resp = await api.post<AuthApi>('auth/login/', authDate);
        return resp.data;
    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw new Error("Error de red o servidor no disponible");
    }
}

export const postLogout = async () => {
    try {
        const resp = await api.post<AuthApi>('auth/logout/', {refresh: localStorage.getItem("refresh")});
        console.log(resp)
        return resp;
    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw new Error("Error de red o servidor no disponible");
    }
}