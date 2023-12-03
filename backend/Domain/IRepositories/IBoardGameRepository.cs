using Domain.Entities;

namespace Domain.IRepositories;
public interface IBoardGameRepository
{
    Task<List<BoardGame>> GetBoardGames();
    Task<BoardGame?> GetBoardGameById(int id);
    Task UpdateBoardGame(int id, BoardGame boardGame);
}
