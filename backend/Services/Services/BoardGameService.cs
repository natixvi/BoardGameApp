using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Domain.IRepositories;
using Services.DTOs.BoardGame;
using Services.DTOs.Comment;
using Services.Interfaces;

namespace Services.Services;
public class BoardGameService : IBoardGameService
{
    private readonly IBoardGameRepository gameRepository;
    private readonly IMapper mapper;
    private readonly IUserBoardGameService myBoardGameService;

    public BoardGameService(IBoardGameRepository gameRepository, IMapper mapper, IUserBoardGameService userBoardGameService)
    {
        this.gameRepository = gameRepository;
        this.mapper = mapper;
        this.myBoardGameService = userBoardGameService;
    }
    public async Task<List<BoardGameDto>?> GetBoardGames()
    {
        var boardGames = await gameRepository.GetBoardGames();
        if (boardGames == null) return null;
        var boardGamesDto = mapper.Map<List<BoardGameDto>>(boardGames);
        foreach (var game in boardGamesDto)
        {
            game.Rating = await myBoardGameService.CalculateAverageRating(game.Id);
        }

        return boardGamesDto;
    }

    public async Task<BoardGameDetailsDto> GetBoardGameById(int id)
    {
        var boardGame = await gameRepository.GetBoardGameById(id);
        if (boardGame == null) throw new NotFoundException("Board game not found!");
        var boardGameDetailsDto = mapper.Map<BoardGameDetailsDto>(boardGame);
        boardGameDetailsDto.Comments = boardGame.GameComments.Select(comment => new GameCommentDto
        {
            Id = comment.Id,
            CommentDescription = comment.CommentDescription,
            CreatedDate = comment.CreatedDate,
            UserId = comment.UserId,
            NickName = comment.User.NickName
        }).ToList();

        boardGameDetailsDto.Rating = await myBoardGameService.CalculateAverageRating(boardGameDetailsDto.Id);
        
        return boardGameDetailsDto;
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
