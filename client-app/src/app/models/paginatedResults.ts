
export interface paginatedResults<T> {
    items:T[],
    pageNumber:number,
    pageSize:number,
    totalCount:number,
    totalPages:number,
    hasMore:boolean
}