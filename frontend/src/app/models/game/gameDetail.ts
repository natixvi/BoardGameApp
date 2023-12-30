import { Review } from "./review";

export interface GameDetails{
    id : number,
    name : string,
    publisher : string,
    description : string,
    players : string,
    time  : string,
    age : number,
    imageUrl : string,
    rating: number,
    reviews: Review[],
    isInUserList: boolean
}