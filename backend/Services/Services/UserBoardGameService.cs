using AutoMapper;
using Domain.Exceptions;
using Domain.IRepositories;
using Services.DTOs.BoardGame;
using Services.Interfaces;

namespace Services.Services;
public class UserBoardGameService : IUserBoardGameService
{
    private readonly IUserBoardGameRepository userBoardGameRepository;
    private readonly IMapper mapper;
    private readonly IUserContextService userContextService;
    private readonly IBoardGameRepository boardGameRepository;

    public UserBoardGameService(IUserBoardGameRepository userBoardGameRepository, IMapper mapper, IUserContextService userContextService, IBoardGameRepository boardGameRepository)
    {
        this.userBoardGameRepository = userBoardGameRepository;
        this.mapper = mapper;
        this.userContextService = userContextService;
        this.boardGameRepository = boardGameRepository;
    }

    public async Task<double> CalculateAverageRating(int gameId)
    {
        Console.WriteLine(gameId);
        var ratingList = await userBoardGameRepository.GetRatingListForGameId(gameId);
        double avgRating = ratingList.Any() ? ratingList.Average(r => r.Rating) : 0;
        Console.WriteLine(avgRating);
        return Math.Round(Math.Floor(avgRating * 100d) / 100d, 2);
    }

    public async Task<List<ReviewDto>?> GetGameReviews(int gameId)
    {
        var boardGameReviews = await userBoardGameRepository.GetGameReviews(gameId);
        return mapper.Map<List<ReviewDto>>(boardGameReviews);
    }

    public async Task<bool> IsGameInUserList(int gameId)
    {
        var userId = userContextService.GetUserId;
        if (userId == null) throw new NotFoundException("User not found!");
        var game = await boardGameRepository.GetBoardGameById(gameId);
        if (game == null) throw new NotFoundException("Board game not found!");
        return await userBoardGameRepository.IsGameInUserList(gameId, userId);
    }
}
