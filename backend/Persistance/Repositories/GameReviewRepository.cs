using Domain.Entities;
using Domain.IRepositories;
using Persistance.Data;

namespace Persistance.Repositories;
public class GameReviewRepository : BaseRepository<GameReview>, IGameReviewRepository
{
    public GameReviewRepository(AppDbContext appDbContext) : base(appDbContext)
    {
    }
}
