using Domain.Entities;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;


namespace Persistance.Repositories;
public class GameCommentRepository : BaseRepository<GameComment>, IGameCommentRepository
{
    private readonly AppDbContext appDbContext;

    public GameCommentRepository(AppDbContext appDbContext) : base(appDbContext)
    {
        this.appDbContext = appDbContext;
    }

    public async Task<GameComment?> GetGameCommentById(int reviewId)
    {
        return await appDbContext.GameComments.FirstOrDefaultAsync(r => r.Id == reviewId);
    }
    public async Task CreateComment(GameComment gameReview)
    {
        appDbContext.GameComments.Add(gameReview);
        await appDbContext.SaveChangesAsync();
    }

    public Task<bool> IfUserCreateComment(int gameId, int? userId)
    {
        return  appDbContext.GameComments.AnyAsync(g => g.BoardGameId == gameId && g.UserId == userId);      
    }
}
