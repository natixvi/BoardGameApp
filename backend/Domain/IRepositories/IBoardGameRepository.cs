using Domain.Entities;

namespace Domain.IRepositories;
public interface IBoardGameRepository : IBaseRepository<BoardGame>
{
    Task<List<BoardGame>> GetBoardGames();
    Task<BoardGame?> GetBoardGameById(int id);
}
