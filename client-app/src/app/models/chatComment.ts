export interface LinkInfo {
    success:boolean,
    href:string,
    siteName:string,
    title: string;
    description: string;
    imageUrl:string,
    }

export interface chatComment{
    id:number;
    createdAt: string;
    body:string;
    imageUrl:string;
    link:string[],
    metadata:LinkInfo|null,
    username:string;
    displayName:string;
    image:string;
};