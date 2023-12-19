using Domain.Entities;

namespace Domain.IRepositories;
public interface IMyBoardGameRepository
{
    Task<List<MyBoardGame>> GetRatingListForGameId(int gameId);
    Task<List<MyBoardGame>?> GetGameReviews(int gameId);
}
