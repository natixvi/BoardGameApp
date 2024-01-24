using Domain.Entities;
using Services.DTOs.BoardGame;
using System.Threading.Tasks;

namespace Services.Interfaces;
public interface IBoardGameService
{
    Task<List<BoardGameDto>?> GetBoardGames();
    Task<BoardGameDetailsDto> GetBoardGameById(int id);
    Task<List<BoardGameDto>?> GetTopGames(int numberOfTopGames);
    Task UpdateBoardGame(int id, UpdateBoardGameDto updateBoardGameDto);
    Task DeleteBoardGame(int id);
    Task<int> CreateBoardGame(AddBoardGameDto addBoardGameDto);
}
