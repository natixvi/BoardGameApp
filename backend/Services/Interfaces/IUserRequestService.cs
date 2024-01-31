
using Domain.Entities;
using Services.DTOs.UserRequest;

namespace Services.Interfaces;
public interface IUserRequestService
{
    Task<int> CreateUserRequest(AddUserRequestDto addUserRequestDto);
    Task<List<UserRequestDto>> GetAll();
    Task<List<UserRequestDto>?> GetRequestByUserId();
    Task ChangeState(int requestId, ChangeUserRequestStatusDto stateDto);
    Task<UserRequestDto?> GetUserRequestById(int requestId);
}
