using Domain.Entities;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;
using System;

namespace Persistance.Repositories;
public class FavouriteUserRepository : BaseRepository<FavouriteUser>, IFavouriteUserRepository
{
    private readonly AppDbContext appDbContext;

    public FavouriteUserRepository(AppDbContext appDbContext) : base(appDbContext)
    {
        this.appDbContext = appDbContext;
    }

    public async Task<int> AddUserToFavList(FavouriteUser favouriteUser)
    {
        appDbContext.FavouriteUsers.Add(favouriteUser);
        await appDbContext.SaveChangesAsync();
        return favouriteUser.Id;
    }

    public async Task<bool> IsUserInFavUserList(int userId, int favUserId)
    {
        return await appDbContext.FavouriteUsers.AnyAsync(u => u.UserId == userId && u.FavUserId == favUserId);
    }

    public async Task<FavouriteUser?> GetFavUser(int userId, int deletedUserId)
    {
        return await appDbContext.FavouriteUsers.FirstOrDefaultAsync(g => g.UserId == userId && g.FavUserId == deletedUserId);
    }

    public async Task<List<FavouriteUser>?> GetUsersWhoAddedSelectUserToFriends(int userId)
    {
        return await appDbContext.FavouriteUsers.Where(f => f.FavUserId == userId).Include(f => f.User).ToListAsync();
    }
}
