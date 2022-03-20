export interface Day {
    date: Date,
    dayRating:number,
    tags: Tag[],
}
export interface Tag {
    name: String,
    color: String
}