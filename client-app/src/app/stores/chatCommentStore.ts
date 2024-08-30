import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { create } from "zustand";
import { chatComment } from "../models/chatComment";
import { User } from "../models/user";

interface chatCommentStore{
    comments: chatComment[],
    hubConnection: HubConnection | null,
    createHubConnection:(activityId:string,user:User)=>void,
    stopHubConnection: () => void,
    addComment:(values:any,activityId:string)=>void,
}


export const useChatCommentStore = create<chatCommentStore>((set,get) => ({
    comments:[],
    hubConnection: null,
    addComment:async(values:any,activityId:string) =>{
        values.activityId = Number(activityId);
        console.log("values: ",values);
     
            const hubConnection = get().hubConnection;
            if (hubConnection){
                await hubConnection.invoke("SendComment", values);
            }
    },
    createHubConnection: (activityId:string,user:User) => {
        console.log("User: ",user);
        console.log('createHubConnection called with activityId:', activityId);
        if (activityId && user?.token){
            const hubConnection = new HubConnectionBuilder().withUrl('http://localhost:5039/chat?activityId='+ activityId,{
                accessTokenFactory: () => user?.token,
                // skipNegotiation:true,
                // transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
            
            
            hubConnection.on("LoadComments",(comments:chatComment[])=>{
                set({comments:comments})
            });

            hubConnection.on("ReceiveComment", (comment: chatComment) => {
                const comments = get().comments;
                console.log("PrevComms: ",comments)
                const exists = comments.some(c => c.id === comment.id);
                if (!exists) {
                    set((state) => ({
                        comments: [...state.comments, comment]  // Return the new state with the updated comments array
                    }));
                }

                console.log("AfterComms: ",get().comments)
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
