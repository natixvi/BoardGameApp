using Domain.Entities;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;

namespace Persistance.Repositories;
public class AccountRepository : IAccountRepository
{
    private readonly AppDbContext appDbContext;

    public AccountRepository(AppDbContext appDbContext)
    {
        this.appDbContext = appDbContext;
    }

    public async void RegisterUser(User user)
    {
        appDbContext.Users.Add(user);
        await appDbContext.SaveChangesAsync(); 
    }

    public async Task<bool> EmailExist(string email)
    {
        return await appDbContext.Users.AnyAsync(e => e.Email == email);

    }

    public async Task<bool> NickNameExist(string nickName)
    {
        return await appDbContext.Users.AnyAsync(e => e.NickName == nickName);
    }
}
