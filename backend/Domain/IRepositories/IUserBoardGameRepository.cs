using Domain.Entities;

namespace Domain.IRepositories;
public interface IUserBoardGameRepository : IBaseRepository<UserBoardGame>
{
    Task<List<UserBoardGame>> GetRatingListForGameId(int gameId);
    Task<List<UserBoardGame>?> GetGameReviews(int gameId);
    Task<bool> IsGameInUserList(int gameId, int? userId);
    Task<int> AddGameToUserList(UserBoardGame userBoardGame);
    Task<UserBoardGame?> GetUserBoardGameById(int gameId, int userId);
}
