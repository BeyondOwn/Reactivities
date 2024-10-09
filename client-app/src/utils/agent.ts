import { Photo } from "@/app/models/photo"
import { Profile } from "@/app/models/profile"
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
    baseURL:"https://localhost:7173/api",
})

export const baseURL = "https://localhost:7173/api"

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
        get: <T>(url: string,config?:AxiosRequestConfig) => axios.get<T>(url,{...config}).then(responseBody),
        post: <T>(url: string, body: {}) =>
             axios.post<T>(url, body).then(responseBody),
        put: <T>(url: string, body: {}) => 
            axios.put<T>(url, body).then(responseBody),
        del: <T>(url: string, body?: {},config?: AxiosRequestConfig) => 
            axios.delete<T>(url, { data: body, ...config }).then(responseBody)
    }

  
    const Account = {
        current: () => requests.get<User>(`${baseURL}/Account`),
        login: (user: LoginFormValues) => requests.post<User>(`${baseURL}/Account/login`, user),
        register: (user: RegisterFormValues) => requests.post<User>(`${baseURL}/Account/register`, user)
    }

    const Profiles = {
        get: (username:string) => requests.get<Profile>(`${baseURL}/Profiles/${username}`),
        uploadPhoto: (file:Blob,fileId:string) =>{
            let formData = new FormData();
            formData.append('File',file);
            return axios.post<Photo>(`${baseURL}/Photos`,formData,{
                headers:{'Content-Type':'multipart/form-data'}
            });
        },
        setMainPhoto: (id:string) => requests.post(`${baseURL}/Photos/${id}/setMain`, {}),
        deletePhoto: (id:string) => requests.del(`${baseURL}/Photos/${id}`)
    }
    const agent = {
        Account,
        requests,
        Profiles
    }
    
    export default agent;