// здесь будут функции с запросами на сервис

import $api from "../http";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse"; // указываем generic тип

export default class AuthService{
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> { // to get response from axios 
        return $api.post<AuthResponse>('/login', {email, password})
    }

    static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>> { // to get response from axios 
        return $api.post<AuthResponse>('/registration', {email, password})
    }

    static async logout(): Promise<void> { // to get response from axios 
        return $api.post('/logout')
    }
}