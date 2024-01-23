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

    public async Task<User?> GetUserByEmail(string email)
    {
        return await appDbContext.Users.Include(r => r.Role).FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetUserById(int id)
    {
        return await appDbContext.Users.Include(u => u.Role).Include(u => u.UserBoardGames).ThenInclude(ubg => ubg.BoardGame).Include(u => u.FavouriteUsers).ThenInclude(u => u.FavUser).FirstOrDefaultAsync(u => u.Id == id);
    }
    
    public async Task<List<User>> GetUsers()
    {
        return await appDbContext.Users.ToListAsync();
    }

    public async Task<bool> CheckIfUserExist(int userId)
    {
        return await appDbContext.Users.AnyAsync(u => u.Id == userId);
    }
}
