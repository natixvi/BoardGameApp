using Domain.Entities;
using System.Threading.Tasks;

namespace Domain.IRepositories;
public interface IBoardGameRepository : IBaseRepository<BoardGame>
{
    Task<List<BoardGame>> GetBoardGames();
    Task<BoardGame?> GetBoardGameById(int id);
    Task<int> CreateBoardGame(BoardGame game);
}
