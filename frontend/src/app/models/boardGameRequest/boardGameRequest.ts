export interface BoardGameRequest{
    id: number,
    userId: number,
    userName: string,
    name: string,
    publisher: string, 
    description: string,
    players: string,
    time: string,
    age:string,
    imageUrl: string
    createdTime: Date,
    status: string
}