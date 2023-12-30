using Services.DTOs.BoardGame;

namespace Services.Interfaces;
public interface IUserBoardGameService
{
    Task<double> CalculateAverageRating(int gameId);
    Task<List<ReviewDto>?> GetGameReviews(int gameId);
    Task<bool> IsGameInUserList(int gameId);
}
