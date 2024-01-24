using Domain.Entities;
using Domain.IRepositories;
using Persistance.Data;

namespace Persistance.Repositories;
public class UserRequestRepository : BaseRepository<UserRequest>, IUserRequestRepository
{
    private readonly AppDbContext appDbContext;

    public UserRequestRepository(AppDbContext appDbContext) : base(appDbContext)
    {
        this.appDbContext = appDbContext;
    }

    public async Task<int> CreateUserRequest(UserRequest userRequest)
    {
        appDbContext.UserRequests.Add(userRequest);
        await appDbContext.SaveChangesAsync();
        return userRequest.Id;
    }
}
