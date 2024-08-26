import { Photo } from "./photo";
import { User } from "./user";

export interface Profile {
    userName:string,
    displayName: string,
    bio: string,
    image?: string,
    photos?:Photo[];
}

export class Profile implements Profile {
    constructor(user:User){
        this.userName = user.username;
        this.displayName = user.displayName;
        this.image= user.image;
    }
}

