using Domain.Entities;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;

namespace Persistance.Repositories;
public class UserBoardGameRepository : BaseRepository<UserBoardGame>, IUserBoardGameRepository
{
    private readonly AppDbContext appDbContext;

    public UserBoardGameRepository(AppDbContext appDbContext) : base(appDbContext)
    {
        this.appDbContext = appDbContext;
    }

    public async Task<List<UserBoardGame>> GetRatingListForGameId(int gameId)
    {
        return await appDbContext.UserBoardGames.Where(g => g.BoardGameId == gameId).ToListAsync();
    }

    public Task<bool> IsGameInUserList(int gameId, int? userId)
    {
        return appDbContext.UserBoardGames.AnyAsync(g => g.BoardGameId == gameId && g.UserId == userId);
    }

    public async Task<int> AddGameToUserList(UserBoardGame userBoardGame)
    {
        appDbContext.UserBoardGames.Add(userBoardGame);
        await appDbContext.SaveChangesAsync();
        return userBoardGame.BoardGameId;
    }

    public async Task<UserBoardGame?> GetUserBoardGameById(int gameId, int userId)
    {
        return await appDbContext.UserBoardGames.FirstOrDefaultAsync(g => g.BoardGameId == gameId && g.UserId == userId);
    }

    public async Task<List<UserBoardGame>?> GetUserBoardGames(int userId)
    {
        return await appDbContext.UserBoardGames.Include(g => g.BoardGame).Where(g => g.UserId == userId).ToListAsync();
    }

    public async Task<List<UserBoardGame>?> GetUserFavouriteBoardGames(int userId)
    {
        return await appDbContext.UserBoardGames.Include(g => g.BoardGame).Where(g => g.UserId == userId && g.IsFavourite == true).ToListAsync();
    }

    public async Task ChangeUserGameFavouriteStatus(UserBoardGame userBoardGame)
    {
        appDbContext.UserBoardGames.Update(userBoardGame);
        await appDbContext.SaveChangesAsync();
    }


}
