import { create } from "zustand";
import { ServerError } from "../models/ServerError";

interface commonStoreProps{
    error: ServerError | null,
    setErrorValue:(newState:ServerError)=>void,
    token: string | null,
    setToken:(token:string|null) =>void,
    appLoaded: boolean,
    setAppLoaded:() =>void,
}

const getTokenFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
        return window.localStorage.getItem('jwt');
    }
    return null;
};

export const useCommonStore = create<commonStoreProps>((set) => ({
    error:null,
    setErrorValue: (newState:ServerError) => {
        set((state) => ({error:newState}))
    },
    token : getTokenFromLocalStorage(),
    appLoaded : false,
    setToken: (token:string|null) => {
        if (token) window.localStorage.setItem('jwt',token);
        set((state) => ({token:token}))
    },
    setAppLoaded: () =>{
        set((state) => ({appLoaded:true}))
    }
}))
