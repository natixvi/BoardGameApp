import { FavUser } from "../favUser/favUser"
import { UserBoardGame } from "../userGame/userBoardGame"

export interface UserInfo{
    id: number,
    nickName: string,
    email: string,
    userBoardGames: UserBoardGame[],
    favouriteUsers: FavUser[]
}