import { create } from "zustand";

interface profileProps{
    loading:boolean;
    setLoading:(loading:boolean)=>void;
    cropper:Cropper|null,
    setCropper:(cropper:Cropper)=>void;
    mainPhotoUpdated:boolean
    setMainPhotoUpdated:(prev:boolean)=>void;
}

export const useProfileStore = create<profileProps>((set) => ({
    loading:false, 
    setLoading: (loading:boolean) => {
        set(() => ({loading:loading}))
    },
    cropper:null,
    setCropper: (cropper:Cropper) => {
        set(()=> ({cropper:cropper}))
    },
    mainPhotoUpdated:false,
    setMainPhotoUpdated: (prev:boolean) => {
        set((state) => ({mainPhotoUpdated:!prev}))
    },
}))