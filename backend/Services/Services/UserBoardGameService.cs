﻿using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Domain.IRepositories;
using Services.DTOs.BoardGame;
using Services.DTOs.UserBoardGame;
using Services.Interfaces;

namespace Services.Services;
public class UserBoardGameService : IUserBoardGameService
{
    private readonly IUserBoardGameRepository userBoardGameRepository;
    private readonly IMapper mapper;
    private readonly IUserContextService userContextService;
    private readonly IBoardGameRepository boardGameRepository;
    private readonly IAccountRepository accountRepository;

    public UserBoardGameService(IUserBoardGameRepository userBoardGameRepository, IMapper mapper, IUserContextService userContextService, IBoardGameRepository boardGameRepository, IAccountRepository accountRepository)
    {
        this.userBoardGameRepository = userBoardGameRepository;
        this.mapper = mapper;
        this.userContextService = userContextService;
        this.boardGameRepository = boardGameRepository;
        this.accountRepository = accountRepository;
    }

    public async Task<double> CalculateAverageRating(int gameId)
    {
        var ratingList = await userBoardGameRepository.GetRatingListForGameId(gameId);
        double avgRating = 0;
        if (ratingList.Any())
        {
            var filterRatingList = ratingList.Where(r => r.Rating > 0).ToList();
            if(filterRatingList.Any())
            {
                avgRating = filterRatingList.Average(r => r.Rating);
            }
            else
            {
                return 0;
            }
        }
        else
        {
            return 0;
        }
        return Math.Round(Math.Floor(avgRating * 100d) / 100d, 2);
    }


    public async Task<bool> IsGameInUserList(int gameId)
    {
        var userId = GetUserContextId();
        await CheckIfGameExist(gameId);

        return await userBoardGameRepository.IsGameInUserList(gameId, userId);
    }

    public async Task<int> AddGameToUserList(int gameId, AddUserBoardGameDto addUserBoardGameDto)
    {
        var userId = GetUserContextId();
        await CheckIfGameExist(gameId);

        var gameInUserList = await userBoardGameRepository.IsGameInUserList(gameId, userId);
        if (gameInUserList) throw new DuplicateDataException("Game can be added to user list just once!");

        var userBoardGame = mapper.Map<UserBoardGame>(addUserBoardGameDto);
        userBoardGame.UserId = (int)userId;
        userBoardGame.BoardGameId = gameId;
        return await userBoardGameRepository.AddGameToUserList(userBoardGame);
    }

    public async Task DeleteGameFromUserList(int gameId)
    {
        var userId = GetUserContextId();
        await CheckIfGameExist(gameId);

        var userBoardGame = await userBoardGameRepository.GetUserBoardGameById(gameId, (int)userId);
        if (userBoardGame == null) throw new BadRequestException("Game is not in user list");

        await userBoardGameRepository.Delete(userBoardGame);
    }

    public async Task<UserBoardGameDetails> GetUserBoardGameDetails(int gameId)
    {
        var userId = GetUserContextId();
        await CheckIfGameExist(gameId);

        var userBoardGame = await userBoardGameRepository.GetUserBoardGameById(gameId, (int)userId);
        if (userBoardGame == null) throw new BadRequestException("Game is not in user list");

        return mapper.Map<UserBoardGameDetails>(userBoardGame);

    }

    public async Task UpdateUserBoardGameDetails(int gameId, EditUserBoardGameDetails editUserBoardGameDetails)
    {
        
        var userId = GetUserContextId();
        await CheckIfGameExist(gameId);

        var userBoardGame = await userBoardGameRepository.GetUserBoardGameById(gameId, (int)userId);
        if (userBoardGame == null) throw new BadRequestException("Game is not in user list");


        if (editUserBoardGameDetails.Rating != null) userBoardGame.Rating = (double)editUserBoardGameDetails.Rating;
        if (editUserBoardGameDetails.IsFavourite != null) userBoardGame.IsFavourite = (bool)editUserBoardGameDetails.IsFavourite;


        await userBoardGameRepository.Update(userBoardGame);

    }


    public async Task ChangeUserGameFavouriteStatus(int gameId)
    {
        var userId = GetUserContextId();
        await CheckIfGameExist(gameId);

        var userBoardGame = await userBoardGameRepository.GetUserBoardGameById(gameId, (int)userId);
        if (userBoardGame == null) throw new BadRequestException("Board Game is not in user list");

        userBoardGame.IsFavourite = !userBoardGame.IsFavourite;
        await userBoardGameRepository.ChangeUserGameFavouriteStatus(userBoardGame);

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
