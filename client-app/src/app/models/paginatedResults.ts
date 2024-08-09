import { Activity } from "./activity";

export interface paginatedResults {
    items:Activity[],
    pageNumber:number,
    pageSize:number,
    totalCount:number,
    totalPages:number,
    hasMore:boolean
}