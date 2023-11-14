using Domain.Entities;
using Domain.IRepositories;
using Persistance.Data;

namespace Persistance.Repositories;
public class AccountRepository : IAccountRepository
{
    private readonly AppDbContext appDbContext;

    public AccountRepository(AppDbContext appDbContext)
    {
        this.appDbContext = appDbContext;
    }
    public async Task RegisterUser(User user)
    {
        appDbContext.Users.Add(user);
        await appDbContext.SaveChangesAsync(); 
    }
}
