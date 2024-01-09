using Domain.Entities;
using Services.DTOs.Review;

namespace Services.Interfaces;
public interface IGameReviewService
{
    Task CreateReview(int gameId, AddGameReviewDto addGameReviewDto);
    Task EditUserGameReview(int reviewId, EditGameReview editGameReview);
    Task DeleteUserGameReview(int reviewId);
    Task<bool> IfUserCreatedReview(int gameId);
}
