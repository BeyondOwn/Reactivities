import { LoginFormValues, RegisterFormValues, User } from "@/app/models/user"
import { useCommonStore } from "@/app/stores/commonStore"
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { toast } from "react-toastify"


const sleep = (delay: number) => {
    return new Promise((resolve) =>{
        setTimeout(resolve,delay)
    })
}

const axiosInstance = axios.create({
    baseURL:"http://localhost:5039/api",
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config=>{
    const token = useCommonStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config;
})

axios.interceptors.response.use(async response =>{
        await sleep(1000);
        // const url = response.config.url;

        // if (response.status >=200 && response.status<300){
        //     if (url?.includes('/activity/')){
        //         toast.success("you did something...")
        //     }
        // }
        return response;
    },(error:AxiosError) =>
    {
        const { data, status, config } = error.response as AxiosResponse;
        
        switch (status) {
            case 400:
                if (typeof data == 'string'){
                    toast.error(data)
                    break;
                }
                if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                    window.location.href='/not-found';
                }
                if (data.errors) {
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key])
                        }
                    }
                    throw modalStateErrors.flat();
                } else {
                    toast.error(data);
                }
                break;
            case 401:
                toast.error('Unauthorized')
                break;
            case 404:
                toast.error('Not found')
                break;
            case 500:
                // window.location.href="/server-error"
                break;
        }
        return Promise.reject(error);
    })

    const requests = {
        get: <T>(url: string) => axios.get<T>(url).then(responseBody),
        post: <T>(url: string, body: {}) =>
             axios.post<T>(url, body).then(responseBody),
        put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
        del: <T>(url: string, body?: {},config?: AxiosRequestConfig) => 
            axios.delete<T>(url, { data: body, ...config }).then(responseBody)
    }

  
    const Account = {
        current: () => requests.get<User>('http://localhost:5039/api/Account'),
        login: (user: LoginFormValues) => requests.post<User>('http://localhost:5039/api/Account/login', user),
        register: (user: RegisterFormValues) => requests.post<User>('http://localhost:5039/api/Account/register', user)
    }
    const agent = {
        Account,
        requests
    }
    
    export default agent;