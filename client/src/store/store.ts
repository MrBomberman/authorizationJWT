// для взаимодействия с глобальным хранилищем

import axios from "axios";
import { makeAutoObservable } from "mobx";
import { API_URL } from "../http";
import { AuthResponse } from "../models/response/AuthResponse";
import { IUser } from "../models/response/IUser";
import AuthService from "../services/AuthService";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }
    // заменяем текущее значение на то, которое получаем в параметрах
    setAuth(bool: boolean){
        this.isAuth = bool;
    }

    setUser(user: IUser){
        this.user = user;
    }

    setLoading(loading: boolean) {
        this.isLoading = loading;
    }

    async login(email: string, password: string){
        try {
            const response = await AuthService.login(email, password);
            console.log(response)
            localStorage.setItem('token',response.data.accessToken ) // сохраняем в локалсторейдж наш accessToken
            this.setAuth(true);
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e)
        }
    }

    async registration(email: string, password: string){
        try {
            const response = await AuthService.registration(email, password);
            console.log(response)
            localStorage.setItem('token',response.data.accessToken ) // сохраняем в локалсторейдж наш accessToken
            this.setAuth(true);
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e)
        }
    }

    async logout(){
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token') // сохраняем в локалсторейдж наш accessToken
            this.setAuth(false);
            this.setUser({} as IUser)
        } catch (e) {
            console.log(e)
        }
    }

    async checkAuth() { // проверяем - авторизован ли пользователь
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true}); // автоматически также отправляем куки с запросом
            console.log(response);
            localStorage.setItem('token',response.data.accessToken ) // сохраняем в локалсторейдж наш accessToken
            this.setAuth(true);
            this.setUser(response.data.user)
        } catch(e) {
            console.log(e)
        } finally {
            this.setLoading(false);
        }
    }
}