using Domain.Entities;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;


namespace Persistance.Repositories;
public class GameReviewRepository : BaseRepository<GameReview>, IGameReviewRepository
{
    private readonly AppDbContext appDbContext;

    public GameReviewRepository(AppDbContext appDbContext) : base(appDbContext)
    {
        this.appDbContext = appDbContext;
    }

    public async Task CreateReview(GameReview gameReview)
    {
        appDbContext.GameReviews.Add(gameReview);
        await appDbContext.SaveChangesAsync();
    }

    public Task<bool> IfUserCreateReview(int gameId, int? userId)
    {
        return  appDbContext.GameReviews.AnyAsync(g => g.BoardGameId == gameId && g.UserId == userId);      
    }
}
