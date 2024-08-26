export interface User {
    username: string;
    displayName: string;
    token: string;
    image: string;
    id:string;
}

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface RegisterFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}