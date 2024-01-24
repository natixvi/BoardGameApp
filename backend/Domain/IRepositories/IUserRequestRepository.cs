using Domain.Entities;

namespace Domain.IRepositories;
public interface IUserRequestRepository : IBaseRepository<UserRequest>
{
    Task<int> CreateUserRequest(UserRequest userRequest);
}
