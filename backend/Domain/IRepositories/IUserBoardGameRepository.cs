using Domain.Entities;

namespace Domain.IRepositories;
public interface IUserBoardGameRepository
{
    Task<List<UserBoardGame>> GetRatingListForGameId(int gameId);
    Task<List<UserBoardGame>?> GetGameReviews(int gameId);
    Task<bool> IsGameInUserList(int gameId, int? userId);
}
