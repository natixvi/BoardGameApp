using Domain.Entities;
using Domain.Exceptions;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
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
        var game = await appDbContext.BoardGames.FirstOrDefaultAsync(g => g.Id == id);
        return game;
    }

}
