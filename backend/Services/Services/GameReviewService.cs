using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Domain.IRepositories;
using Services.DTOs.Review;
using Services.Interfaces;

namespace Services.Services;
public class GameReviewService : IGameReviewService
{
    private readonly IGameReviewRepository gameReviewRepository;
    private readonly IBoardGameRepository boardGameRepository;
    private readonly IUserContextService userContextService;
    private readonly IMapper mapper;

    public GameReviewService(IGameReviewRepository gameReviewRepository, IBoardGameRepository boardGameRepository, IUserContextService userContextService, IMapper mapper)
    {
        this.gameReviewRepository = gameReviewRepository;
        this.boardGameRepository = boardGameRepository;
        this.userContextService = userContextService;
        this.mapper = mapper;
    }

    public async Task CreateReview(int gameId, AddGameReviewDto addGameReviewDto)
    {
        var game = await boardGameRepository.GetBoardGameById(gameId);
        if (game == null) throw new NotFoundException("Board game not found");
        var userId = userContextService.GetUserId;
        if (userId == null) throw new NotFoundException("User not found");

        var ifUserCreateReviewAlready = await IfUserCreatedReview(gameId);
        if (ifUserCreateReviewAlready) throw new BadRequestException("Game review can be added just once!");

        var gameReview = mapper.Map<GameReview>(addGameReviewDto);
        Console.WriteLine(gameReview.ReviewDescription);
        gameReview.BoardGameId = gameId;
        gameReview.UserId = (int)userId;

        await gameReviewRepository.CreateReview(gameReview);
    }

    public async Task<bool> IfUserCreatedReview(int gameId)
    {
        var userId = userContextService.GetUserId;
        if (userId == null) throw new NotFoundException("User not found!");
        var game = await boardGameRepository.GetBoardGameById(gameId);
        if (game == null) throw new NotFoundException("Board game not found!");

        return await gameReviewRepository.IfUserCreateReview(gameId, userId);
    }
}
