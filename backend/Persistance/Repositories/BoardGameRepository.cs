using Domain.Entities;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;

namespace Persistance.Repositories;
public class BoardGameRepository : BaseRepository<BoardGame>, IBoardGameRepository
{
    private readonly AppDbContext appDbContext;

    public BoardGameRepository(AppDbContext appDbContext) : base(appDbContext)
    {
        this.appDbContext = appDbContext;
    }

    public async Task<List<BoardGame>> GetBoardGames()
    {
        var games = await appDbContext.BoardGames.ToListAsync();
        return games;
    }
    public async Task<BoardGame?> GetBoardGameById(int id)
    {
        var game = await appDbContext.BoardGames.Include(g => g.GameComments).ThenInclude(review => review.User).FirstOrDefaultAsync(g => g.Id == id);
        return game;
    }

    public async Task<int> CreateBoardGame(BoardGame game)
    {
        appDbContext.BoardGames.Add(game);
        await appDbContext.SaveChangesAsync();
        return game.Id;
    }

    public async Task<BoardGame?> GetBoardGameByName(string name)
    {
        var game = await appDbContext.BoardGames.FirstOrDefaultAsync(g => g.Name == name);
        return game;
    }

    public async Task DeleteBoardGames(IEnumerable<int> gameIds) { 
        var gamesToDelete =  await appDbContext.BoardGames.Where(g => gameIds.Contains(g.Id)).ToListAsync();
        appDbContext.BoardGames.RemoveRange(gamesToDelete);
        await appDbContext.SaveChangesAsync();
    }

}
