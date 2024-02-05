using Services.DTOs.BoardGame;

namespace Services.Interfaces;
public interface IBoardGameRequestService
{
    Task<int> AddBoardGameRequest(AddBoardGameRequestDto game);
}
