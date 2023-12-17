using Domain.Entities;

namespace Domain.IRepositories;
public interface IMyBoardGameRepository
{
    Task<List<MyBoardGame>> GetRatingsByGameId(int gameId);
}
