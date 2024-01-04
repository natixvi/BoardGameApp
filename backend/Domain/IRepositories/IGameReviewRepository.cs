using Domain.Entities;

namespace Domain.IRepositories;
public interface IGameReviewRepository : IBaseRepository<GameReview>
{
    Task CreateReview(GameReview gameReview);
    Task<bool> IfUserCreateReview(int gameId, int? userId);
}
