import agent from "@/utils/agent";
import { create } from "zustand";
import { LoginFormValues, User } from "../models/user";
import { useCommonStore } from "./commonStore";

interface userstoreProps{
    user:User | null,
    setUser:(user:User|null)=>void,
    login: (creds:LoginFormValues) => void,
    logout:()=>void
    LoggingIn:(user:User)=>void
    isLoggedIn:boolean
    getUser:()=>void,
}



export const useUserStore = create<userstoreProps>((set) => ({
    user : null,
    LoggingIn: (user:User) => {
        set((state) => ({isLoggedIn:true}))
    },
    isLoggedIn:false,
    setUser: (user:User|null) => {
        set((state) => ({user:user}))
    },
    getUser: async () =>{
        try {
            const user = await agent.Account.current();
            set((state) => ({user:user}))
        }
        catch(error) {
            console.log(error);
        }
    },
    login:async (creds:LoginFormValues) => {
        const user = await agent.Account.login(creds);
        const setToken = useCommonStore.getState().setToken;
        useUserStore.setState({user:user})
        setToken(user.token)
        const LoggingIn = useUserStore.getState().LoggingIn;
        LoggingIn(user);
        window.location.href="/"
    },
    logout:()=>{
        useCommonStore.setState((state)=> ({token:null}))
        window.localStorage.removeItem('jwt');
        const setUser = useUserStore.getState().setUser;
        setUser(null);
        useUserStore.setState((state)=> ({user:null}))
        window.location.href="/"
    },
}))
