export interface Post {
    id:number,
    activityId:number,
    content:string,
    creatorId:string,
    creatorDisplayName:string,
    date:Date,
    parentPostId:number,
    replies?:Post[]
}