import { Commentt } from "../comment/commentt";

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
    comments: Commentt[],
    isInUserList: boolean;
}