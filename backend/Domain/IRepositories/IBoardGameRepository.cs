using Domain.Entities;

namespace Domain.IRepositories;
public interface IBoardGameRepository : IBaseRepository<BoardGame>
{
    Task<List<BoardGame>> GetBoardGames();
    Task<BoardGame?> GetBoardGameById(int id);
    Task<int> CreateBoardGame(BoardGame game);
    Task<BoardGame?> GetBoardGameByName(string name);
    Task DeleteBoardGames(IEnumerable<int> gameIds);
}
