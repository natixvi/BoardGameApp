using AutoMapper;
using Domain.IRepositories;
using Services.DTOs.BoardGame;
using Services.Interfaces;

namespace Services.Services;
public class MyBoardGameService : IMyBoardGameService
{
    private readonly IMyBoardGameRepository myBoardGameRepository;
    private readonly IMapper mapper;

    public MyBoardGameService(IMyBoardGameRepository myBoardGameRepository, IMapper mapper)
    {
        this.myBoardGameRepository = myBoardGameRepository;
        this.mapper = mapper;
    }

    public async Task<double> CalculateAverageRating(int gameId)
    {
        Console.WriteLine(gameId);
        var ratingList = await myBoardGameRepository.GetRatingListForGameId(gameId);
        double avgRating = ratingList.Any() ? ratingList.Average(r => r.Rating) : 0;
        Console.WriteLine(avgRating);
        return Math.Round(Math.Floor(avgRating * 100d) / 100d, 2);
    }

    public async Task<List<ReviewDto>?> GetGameReviews(int gameId)
    {
        var boardGameReviews = await myBoardGameRepository.GetGameReviews(gameId);
        return mapper.Map<List<ReviewDto>>(boardGameReviews);
    }
    
}
