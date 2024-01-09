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
        var userId = GetUserContextId();
        await CheckIfGameExist(gameId);

        var ifUserCreateReviewAlready = await IfUserCreatedReview(gameId);
        if (ifUserCreateReviewAlready) throw new DuplicateDataException("Game review can be added just once!");

        var gameReview = mapper.Map<GameReview>(addGameReviewDto);

        gameReview.BoardGameId = gameId;
        gameReview.UserId = (int)userId;

        await gameReviewRepository.CreateReview(gameReview);
    }

    public async Task<bool> IfUserCreatedReview(int gameId)
    {
        var userId = GetUserContextId();
        await CheckIfGameExist(gameId);

        return await gameReviewRepository.IfUserCreateReview(gameId, userId);
    }

    private int? GetUserContextId()
    {
        var userId = userContextService.GetUserId;
        if (userId == null) throw new UnathorizedException("Incorrect or missing user ID, no authorization!");
        return userId;
    }

    private async Task CheckIfGameExist(int gameId)
    {
        var game = await boardGameRepository.GetBoardGameById(gameId);
        if (game == null) throw new NotFoundException("Board game not found!");
    }
}
