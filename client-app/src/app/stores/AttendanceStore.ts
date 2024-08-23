import { create } from "zustand";
import { Attendance } from "../models/Attendance";

interface attendanceStoreProps{
    userAttendance: Attendance[] | null,
    setUserAttendance:(attendance:Attendance[] | null)=>void,
    userAttendanceUpdated:boolean,
    setUserAttendanceUpdated:(prev:boolean)=>void,

    activityAttendance: Attendance[] | null,
    setActivityAttendance:(attendance:Attendance[] | null)=>void,
    activityAttendanceUpdated:boolean,
    setActivityAttendanceUpdated:(prev:boolean)=>void

    JoinIsLoading:boolean,
    setJoinIsLoading:(isLoading:boolean)=>void

    LeaveIsLoading:boolean,
    setLeaveIsLoading:(isLoading:boolean)=>void
}


export const useAttendanceStore = create<attendanceStoreProps>((set) => ({
    userAttendanceUpdated:false,
    userAttendance:null,
    setUserAttendance: (attendance:Attendance[] | null) => {
        set((state) => ({userAttendance:attendance}))
    },
    setUserAttendanceUpdated: (prev:boolean) => {
        set((state) => ({userAttendanceUpdated:!prev}))
    },

    activityAttendanceUpdated:false,
    activityAttendance:null,
    setActivityAttendance: (attendance:Attendance[] | null) => {
        set((state) => ({activityAttendance:attendance}))
    },
    setActivityAttendanceUpdated: (prev:boolean) => {
        set((state) => ({activityAttendanceUpdated:!prev}))
    },
    JoinIsLoading:false,
    setJoinIsLoading: (isLoading:boolean) => {
        set((state) => ({JoinIsLoading:isLoading}))
    },
    LeaveIsLoading:false,
    setLeaveIsLoading: (isLoading:boolean) => {
        set((state) => ({LeaveIsLoading:isLoading}))
    },
    
}))
