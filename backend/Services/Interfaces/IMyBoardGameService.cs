using Services.DTOs.BoardGame;

namespace Services.Interfaces;
public interface IMyBoardGameService
{
    Task<double> CalculateAverageRating(int gameId);
    Task<List<ReviewDto>?> GetGameReviews(int gameId);
}
