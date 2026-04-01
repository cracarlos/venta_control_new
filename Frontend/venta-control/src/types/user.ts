import type { Groups } from "./groups";

export interface User {
    id: number,
    password: string,
    last_login: string,
    email: string,
    first_name: string,
    middle_name: string,
    last_name: string,
    second_last_name: string,
    cedula_rif: string,
    is_active: boolean,
    is_staff: boolean,
    is_superuser: boolean,
    password_update: boolean,
    created_at: string,
    updated_at: string,
    groups: Groups[],
    // groups: any[],
    user_permissions: string[]
}

export interface UserRegister {
    id: number,
    email: string,
    password: string,
    first_name: string,
    middle_name: string,
    last_name: string,
    second_last_name: string,
    cedula_rif: string,
    is_active: boolean,
    groups: number[],
}

export interface UserByID {
    id: number,
    email: string,
    first_name: string,
    middle_name: string,
    last_name: string,
    second_last_name: string,
    cedula_rif: string,
    is_active: boolean,
    groups: Groups[],
}

export interface PasswordUpdate {
    password: string,
    passwordConfirm: string,
}