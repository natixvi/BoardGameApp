using Services.DTOs.BoardGame;

namespace Services.Interfaces;
public interface IBoardGameService
{
    Task<List<BoardGameDto>> GetBoardGames();
    Task<BoardGameDto> GetBoardGameById(int id);
}
