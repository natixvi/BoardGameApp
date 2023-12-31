using Services.DTOs.BoardGame;
using Services.DTOs.UserBoardGame;

namespace Services.Interfaces;
public interface IUserBoardGameService
{
    Task<double> CalculateAverageRating(int gameId);
    Task<List<ReviewDto>?> GetGameReviews(int gameId);
    Task<bool> IsGameInUserList(int gameId);
    Task<int> AddGameToUserList(int gameId, AddUserBoardGameDto addUserBoardGameDto);
    Task DeleteGameFromUserList(int gameId);
}
