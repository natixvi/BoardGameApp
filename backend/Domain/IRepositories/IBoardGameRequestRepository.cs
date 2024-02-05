using Domain.Entities;

namespace Domain.IRepositories;
public interface IBoardGameRequestRepository : IBaseRepository<BoardGameRequest>
{
    Task<int> AddBoardGameRequest(BoardGameRequest game);
    Task<List<BoardGameRequest>> GetAll();
    Task<List<BoardGameRequest>?> GetBoardGameRequestsByUserId(int userId);
    Task<BoardGameRequest?> GetBoardGameRequestById(int requestId);

}
