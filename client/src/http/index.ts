// будем настраивать axios

import axios, { AxiosRequestConfig } from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';

export const API_URL = `http://localhost:5000/api`;

const $api = axios.create({ // создаем instance axios - экземпляр
    withCredentials: true, // чтобы к каждому запросу куки цеплялись автоматически
    baseURL: API_URL
})

$api.interceptors.request.use((config: AxiosRequestConfig) => {
    if(config.headers === undefined){
        config.headers = {}
    }
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
});

$api.interceptors.response.use((config: AxiosRequestConfig) => {
    return config;

}, async (error) => {
    const originalRequest = error.config; // повторяем исходный запрос - получаем 401 - перезаписываем токен и снова делаем запрос на сервер
    if(error.response.status == 401 && error.config && error.config._isRetry ){ // чтобы постоянно не перезаписывался токен и не происходило зацикливания
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true}); // автоматически также отправляем куки с запросом
            // для получения access токена, так как рефреш токен у нас все еще есть
            localStorage.setItem('token', response.data.accessToken);
            return $api.request(originalRequest);
        } catch (e){
            console.log(e)
        }
    }
    throw error;
});


export default $api;