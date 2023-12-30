using Domain.Entities;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;

namespace Persistance.Repositories;
public class UserBoardGameRepository : IUserBoardGameRepository
{
    private readonly AppDbContext appDbContext;

    public UserBoardGameRepository(AppDbContext appDbContext)
    {
        this.appDbContext = appDbContext;
    }

    public async Task<List<UserBoardGame>> GetRatingListForGameId(int gameId)
    {
        return await appDbContext.UserBoardGames.Where(g => g.BoardGameId == gameId).ToListAsync();
    }
    public async Task<List<UserBoardGame>?> GetGameReviews(int gameId)
    {
        return await appDbContext.UserBoardGames.Include(g => g.User).Where(g => g.BoardGameId == gameId && !string.IsNullOrWhiteSpace(g.ReviewDescription)).ToListAsync();
    }

    public Task<bool> IsGameInUserList(int gameId, int? userId)
    {
        return appDbContext.UserBoardGames.AnyAsync(g => g.BoardGameId == gameId && g.UserId == userId);
    }


}
