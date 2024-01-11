using Domain.Entities;

namespace Domain.IRepositories;
public interface IGameCommentRepository : IBaseRepository<GameComment>
{
    Task CreateComment(GameComment gameReview);
    Task<bool> IfUserCreateComment(int gameId, int? userId);

    Task<GameComment?> GetGameCommentById(int reviewId);
}
