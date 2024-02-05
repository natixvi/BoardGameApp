using Services.DTOs.BoardGameRequest;
using Services.DTOs.UserRequest;

namespace Services.Interfaces;
public interface IBoardGameRequestService
{
    Task<int> AddBoardGameRequest(AddBoardGameRequestDto game);
    Task<List<BoardGameRequestDto>> GetAll();
    Task<List<BoardGameRequestDto>?> GetBoardGameRequestsByUserId();
    Task ChangeStatus(int requestId, ChangeUserRequestStatusDto stateDto);
    Task<BoardGameRequestDto?> GetBoardGameRequestById(int requestId);
}
