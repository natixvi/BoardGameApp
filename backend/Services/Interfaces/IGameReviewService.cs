using Domain.Entities;
using Services.DTOs.Review;

namespace Services.Interfaces;
public interface IGameReviewService
{
     Task CreateReview(int gameId, AddGameReviewDto addGameReviewDto);
    Task<bool> IfUserCreatedReview(int gameId);
}
