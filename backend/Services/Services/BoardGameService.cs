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

    public BoardGameService(IBoardGameRepository gameRepository, IMapper mapper)
    {
        this.gameRepository = gameRepository;
        this.mapper = mapper;
    }
    public async Task<List<BoardGameDto>> GetBoardGames()
    {
        var boardGames = await gameRepository.GetBoardGames();
        if (boardGames == null) throw new NotFoundException("Board games not found!");
        return mapper.Map<List<BoardGameDto>>(boardGames);
    }

    public async Task<BoardGameDto> GetBoardGameById(int id)
    {
        var boardGame = await gameRepository.GetBoardGameById(id);
        if (boardGame == null) throw new NotFoundException("Board game not found!");
        return mapper.Map<BoardGameDto>(boardGame);
    }
    public async Task UpdateBoardGame(int id, UpdateBoardGameDto updateBoardGameDto)
    {
        await gameRepository.UpdateBoardGame(id, mapper.Map<BoardGame>(updateBoardGameDto));

    }
}
