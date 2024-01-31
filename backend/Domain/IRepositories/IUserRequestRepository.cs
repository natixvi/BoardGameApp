using Domain.Entities;

namespace Domain.IRepositories;
public interface IUserRequestRepository : IBaseRepository<UserRequest>
{
    Task<List<UserRequest>> GetAll();
    Task<List<UserRequest>?> GetRequestByUserId(int userId);
    Task<int> CreateUserRequest(UserRequest userRequest);
    Task<UserRequest?> GetRequestById(int requestId);
}
