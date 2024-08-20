import { create } from "zustand";
import { Attendance } from "../models/Attendance";

interface attendanceStoreProps{
    userAttendance: Attendance[] | null,
    setUserAttendance:(attendance:Attendance[])=>void,
    userAttendanceUpdated:boolean,
    setUserAttendanceUpdated:(prev:boolean)=>void,

    activityAttendance: Attendance[] | null,
    setActivityAttendance:(attendance:Attendance[])=>void,
    activityAttendanceUpdated:boolean,
    setActivityAttendanceUpdated:(prev:boolean)=>void
}


export const useAttendanceStore = create<attendanceStoreProps>((set) => ({
    userAttendanceUpdated:false,
    userAttendance:null,
    setUserAttendance: (attendance:Attendance[]) => {
        set((state) => ({userAttendance:attendance}))
    },
    setUserAttendanceUpdated: (prev:boolean) => {
        set((state) => ({userAttendanceUpdated:!prev}))
    },

    activityAttendanceUpdated:false,
    activityAttendance:null,
    setActivityAttendance: (attendance:Attendance[]) => {
        set((state) => ({activityAttendance:attendance}))
    },
    setActivityAttendanceUpdated: (prev:boolean) => {
        set((state) => ({activityAttendanceUpdated:!prev}))
    },
    
}))
