using Domain.Entities;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
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

    public async Task<List<UserRequest>> GetAll()
    {
        var usersRequests = await appDbContext.UserRequests.Include(r => r.User).ToListAsync();
        return usersRequests;
    }

    public async Task<List<UserRequest>?> GetRequestByUserId(int userId)
    {
        var userRequests = await appDbContext.UserRequests.Where(r => r.UserId == userId).ToListAsync();
        return userRequests;
    }

    public async Task<UserRequest?> GetRequestById(int requestId)
    {
        var userRequest = await appDbContext.UserRequests.Include(r => r.User).FirstOrDefaultAsync(r => r.Id == requestId);
        return userRequest;
    }
}
