export interface ApiResponse<T> {
    data: T;
    message: string
}

export interface ApiResponseNew<T> {
    data: T;
    status: number;

}