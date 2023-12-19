using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Domain.IRepositories;
using Services.DTOs.BoardGame;
using Services.Interfaces;

namespace Services.Services;
public class BoardGameService : IBoardGameService
{
    private readonly IBoardGameRepository gameRepository;
    private readonly IMapper mapper;
    private readonly IMyBoardGameRepository myBoardGameRepository;

    public BoardGameService(IBoardGameRepository gameRepository, IMapper mapper, IMyBoardGameRepository myBoardGameRepository)
    {
        this.gameRepository = gameRepository;
        this.mapper = mapper;
        this.myBoardGameRepository = myBoardGameRepository;
    }
    public async Task<List<BoardGameDto>> GetBoardGames()
    {
        var boardGames = await gameRepository.GetBoardGames();
        if (boardGames == null) throw new NotFoundException("Board games not found!");

        var boardGamesDto = mapper.Map<List<BoardGameDto>>(boardGames);

        foreach (var game in boardGamesDto)
        {

            List<MyBoardGame> ratingList = await myBoardGameRepository.GetRatingListForGameId(game.Id);
            double avgRating = ratingList.Any() ? ratingList.Average(r => r.Rate) : 0;
            game.Rating = Math.Round(Math.Floor(avgRating * 100d) / 100d, 2);
            game.NumOfVoters = ratingList.Count();
        } 
        
        return boardGamesDto;
    }

    public async Task<BoardGameDto> GetBoardGameById(int id)
    {
        var boardGame = await gameRepository.GetBoardGameById(id);
        if (boardGame == null) throw new NotFoundException("Board game not found!");
        var boardGameDto = mapper.Map<BoardGameDto>(boardGame);

        var ratingList = await myBoardGameRepository.GetRatingListForGameId(boardGameDto.Id);
        double avgRating = ratingList.Any() ? ratingList.Average(r => r.Rate) : 0;
        boardGameDto.Rating = avgRating;

        return boardGameDto;
    }
    public async Task UpdateBoardGame(int id, UpdateBoardGameDto updateBoardGameDto)
    {
        var boardGame = await gameRepository.GetBoardGameById(id);
        if (boardGame == null) throw new NotFoundException("Board game not found!");

        boardGame.Name = updateBoardGameDto.Name;
        boardGame.Publisher = updateBoardGameDto.Publisher;
        boardGame.Description = updateBoardGameDto.Description;
        boardGame.Players = updateBoardGameDto.Players;
        boardGame.Age = updateBoardGameDto.Age;
        boardGame.Time = updateBoardGameDto.Time;
        boardGame.ImageUrl = updateBoardGameDto.ImageUrl;
        
        await gameRepository.Update(boardGame);
    }

    public async Task DeleteBoardGame(int id)
    {
        var boardGame = await gameRepository.GetBoardGameById(id);
        if (boardGame == null) throw new NotFoundException("Board game not found!");

        await gameRepository.Delete(boardGame);
    }

    public async Task<int> CreateBoardGame(AddBoardGameDto addBoardGameDto)
    {
        var boardGameId = await gameRepository.CreateBoardGame(mapper.Map<BoardGame>(addBoardGameDto));
        return (boardGameId);
    }
}
