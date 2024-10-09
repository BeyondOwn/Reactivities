import { convertUTCDateToLocalDate } from "@/utils/convertUTCDateToLocalDate";
import { formatDateToday } from "@/utils/formatDateToday";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { create } from "zustand";
import { chatComment } from "../models/chatComment";
import { Profile } from "../models/profile";
import { User } from "../models/user";

interface chatCommentStore{
    onlineUsers:Profile[],
    comments: chatComment[],
    hubConnection: HubConnection | null,
    createHubConnection:(activityId:string,user:User)=>void,
    stopHubConnection: () => void,
    addComment:(values:any,activityId:string,imageUrl?:string,link?:string[]|null)=>void,
    getUsersInGroup:(groupName:string)=>void;
    loadingImageDimensions:boolean,
    setLoadingImageDimensions:(load:boolean)=>void,
}


export const useChatCommentStore = create<chatCommentStore>((set,get) => ({
    loadingImageDimensions:true,
    setLoadingImageDimensions:(load:boolean)=>{
        set((state) => ({loadingImageDimensions:load}))
    },
    onlineUsers:[],
    comments:[],
    hubConnection: null,
    getUsersInGroup:async(groupName:string)=>{
        const hubConnection = get().hubConnection;
        if (hubConnection){
            await hubConnection.invoke("GetUsersInGroup",groupName)
        }
    },
    addComment:async(values:any,activityId:string,imageUrl?:string,link?:string[]|null) =>{
        values.activityId = Number(activityId);
        if(imageUrl){
            values.imageUrl = imageUrl;
        }
        if (link){
            values.link = link;
        }
        
     
            const hubConnection = get().hubConnection;
            if (hubConnection?.state === "Connected"){
                await hubConnection.invoke("SendComment", values);
            }
    },
    createHubConnection: (activityId:string,user:User) => {
        console.log("User: ",user);
        console.log('createHubConnection called with activityId:', activityId);
        if (activityId && user?.token){
            const hubConnection = new HubConnectionBuilder().withUrl(`https://localhost:7173/chat?activityId=`+ activityId,{
                accessTokenFactory: () => user?.token,
                // skipNegotiation:true,
                // transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
            
            
            hubConnection.on("LoadComments",(comments:chatComment[])=>{
                const formattedComments = comments.map(comm => ({
                    ...comm,
                    createdAt: formatDateToday(convertUTCDateToLocalDate(new Date(comm.createdAt)).toLocaleString()),
                }));
                set({ comments: formattedComments });
            });

            hubConnection.on("ReceiveUserProfiles",(info)=>{
                const onlineUsersNew = info as Profile[];
                set({ onlineUsers: onlineUsersNew });
                const onlineUsers = get().onlineUsers;
                console.log(onlineUsers);
            })

            hubConnection.on("UserJoined",(info)=>{
                const hubConnection = get().hubConnection;
                if (hubConnection?.state === "Connected"){
                    console.log("User Joined",info);
                    hubConnection.invoke("GetUsersInGroup",info[0]);
                }
                
            })

            hubConnection.on("UserLeft",(info)=>{
                const hubConnection = get().hubConnection;
                // console.log(info);
                if(hubConnection?.state === "Connected"){
                    console.log("User Left",info);
                    hubConnection.invoke("GetUsersInGroup",info[0]);
                    
                }
            })

            hubConnection.on("ReceiveComment", (comment: chatComment) => {
                const comments = get().comments;
                const exists = comments.some(c => c.id === comment.id);
                if (!exists) {
                    const formattedComment = {
                        ...comment,
                        createdAt: formatDateToday(new Date(comment.createdAt).toLocaleString()),
                    };
                    set((state) => ({
                        comments: [...state.comments, formattedComment]  // Return the new state with the updated comments array
                    }));
                }

            });

            hubConnection.start()
            .then(() => console.log('Connection started'))
            .catch(err => console.log('Error while establishing connection: ', err));

            set(() => ({hubConnection:hubConnection}))
        }
    },
    stopHubConnection: () => {
        const hubConnection = get().hubConnection;
        if (hubConnection) {
          hubConnection.stop()
            .then(() => console.log('Connection stopped'))
            .catch(err => console.log('Error while stopping connection: ', err));
          set({ hubConnection: null });
        }
      }
}))
