import { create } from "zustand";

interface filterProps{
    filterValue:string;
    setFilterValue:(newState:string)=>void;
}


export const useFilterStore = create<filterProps>((set) => ({
    filterValue:"", 
    setFilterValue: (newState:string) => {
        set(() => ({filterValue:newState}))
    }
}))