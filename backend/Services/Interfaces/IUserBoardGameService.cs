using Domain.Entities;
using Services.DTOs.UserBoardGame;

namespace Services.Interfaces;
public interface IUserBoardGameService
{
    Task<double> CalculateAverageRating(int gameId);
    Task<bool> IsGameInUserList(int gameId);
    Task<int> AddGameToUserList(int gameId, AddUserBoardGameDto addUserBoardGameDto);
    Task DeleteGameFromUserList(int gameId);
    Task<UserBoardGameDetails> GetUserBoardGameDetails(int gameId);
    Task UpdateUserBoardGameDetails(int gameId, EditUserBoardGameDetails editUserBoardGameDetails);
    Task<List<UserBoardGameDto>?> GetUserBoardGames(int userId);
    Task<List<UserBoardGameDto>?> GetUserFavouriteBoardGames(int userId);
    Task ChangeUserGameFavouriteStatus(int gameId);
}
