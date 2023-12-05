using Domain.Entities;
using Domain.Exceptions;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;

namespace Persistance.Repositories;
public class AccountRepository : BaseRepository<User>, IAccountRepository
{
    private readonly AppDbContext appDbContext;

    public AccountRepository(AppDbContext appDbContext) : base(appDbContext)
    {
        this.appDbContext = appDbContext;
    }

   
    public async Task RegisterUser(User user)
    {
        appDbContext.Users.Add(user);
        await appDbContext.SaveChangesAsync(); 
    }

    public async Task<bool> EmailExist(string email)
    {
        var existingUser = await appDbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        return existingUser != null;

    }

    public async Task<bool> NickNameExist(string nickName)
    {
        var existingUser = await appDbContext.Users.FirstOrDefaultAsync(u => u.NickName == nickName);
        return existingUser != null;
    }

    public async Task<int> GetDefaultRegisterUserRole()
    {
        var defaultRole = await appDbContext.Roles.FirstOrDefaultAsync(r => r.Name == "User");
        if (defaultRole == null) throw new RoleDoesntExistException("Cannot register user at this moment!");
        return defaultRole.Id;
    }

    public async Task<User?> GetUser(string email)
    {
        return await appDbContext.Users.Include(r => r.Role).FirstOrDefaultAsync(u => u.Email == email);
    }
}
