using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Domain.IRepositories;
using Services.DTOs.UserBoardGame;
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
        double avgRating = (ratingList.Any() ? ratingList.Where(r => r.Rating > 0).Average(r => r.Rating) : 0);
        Console.WriteLine(avgRating);
        return Math.Round(Math.Floor(avgRating * 100d) / 100d, 2);
    }


    public async Task<bool> IsGameInUserList(int gameId)
    {
        var userId = userContextService.GetUserId;
        if (userId == null) throw new NotFoundException("User not found!");
        var game = await boardGameRepository.GetBoardGameById(gameId);
        if (game == null) throw new NotFoundException("Board game not found!");
        return await userBoardGameRepository.IsGameInUserList(gameId, userId);
    }

    public async Task<int> AddGameToUserList(int gameId, AddUserBoardGameDto addUserBoardGameDto)
    {
        var userId = userContextService.GetUserId;
        if (userId == null) throw new NotFoundException("User not found!");

        var game = await boardGameRepository.GetBoardGameById(gameId);
        if (game == null) throw new NotFoundException("Board game not found!");

        var gameInUserList = await userBoardGameRepository.IsGameInUserList(gameId, userId);
        if (gameInUserList) throw new BadRequestException("Game can be added to user list just once!");

        var userBoardGame = mapper.Map<UserBoardGame>(addUserBoardGameDto);
        userBoardGame.UserId = (int)userId;
        userBoardGame.BoardGameId = gameId;
        return await userBoardGameRepository.AddGameToUserList(userBoardGame);
    }

    public async Task DeleteGameFromUserList(int gameId)
    {
        var userId = userContextService.GetUserId;
        if (userId == null) throw new NotFoundException("User not found!");

        var game = await boardGameRepository.GetBoardGameById(gameId);
        if (game == null) throw new NotFoundException("Board game not found!");

        var userBoardGame = await userBoardGameRepository.GetUserBoardGameById(gameId, (int)userId);
        if (userBoardGame == null) throw new BadRequestException("Game is not in user list");

        await userBoardGameRepository.Delete(userBoardGame);
    }

    public async Task<UserBoardGameDetails> GetUserBoardGameDetails(int gameId)
    {
        var userId = userContextService.GetUserId;
        if (userId == null) throw new NotFoundException("User not found!");

        var game = await boardGameRepository.GetBoardGameById(gameId);
        if (game == null) throw new NotFoundException("Board game not found!");

        var userBoardGame = await userBoardGameRepository.GetUserBoardGameById(gameId, (int)userId);
        if (userBoardGame == null) throw new BadRequestException("Game is not in user list");

        return mapper.Map<UserBoardGameDetails>(userBoardGame);

    }

    public async Task UpdateUserBoardGameDetails(int gameId, EditUserBoardGameDetails editUserBoardGameDetails)
    {
        var userId = userContextService.GetUserId;
        if (userId == null) throw new NotFoundException("User not found!");

        var game = await boardGameRepository.GetBoardGameById(gameId);
        if (game == null) throw new NotFoundException("Board game not found!");

        var userBoardGame = await userBoardGameRepository.GetUserBoardGameById(gameId, (int)userId);
        if (userBoardGame == null) throw new BadRequestException("Game is not in user list");


        if (editUserBoardGameDetails.Rating != null) userBoardGame.Rating = (double)editUserBoardGameDetails.Rating;
        Console.WriteLine(userBoardGame.Rating);
        if (editUserBoardGameDetails.IsFavourite != null) userBoardGame.IsFavourite = (bool)editUserBoardGameDetails.IsFavourite;


        await userBoardGameRepository.Update(userBoardGame);

    }
}
