export interface AuthLogin {
    email: string;
    password: string;
}

export interface AuthApi {
    refresh: string,
    access: string,
    user_id: number,
    email: string,
    full_name: string,
    password_update: boolean,
}