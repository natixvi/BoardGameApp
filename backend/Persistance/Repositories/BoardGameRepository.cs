using Domain.Entities;
using Domain.Exceptions;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Persistance.Data;

namespace Persistance.Repositories;
public class BoardGameRepository : IBoardGameRepository
{
    private readonly AppDbContext appDbContext;

    public BoardGameRepository(AppDbContext appDbContext)
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

    public async Task UpdateBoardGame(int id, BoardGame boardGame)
    {
        var game = await appDbContext.BoardGames.FirstOrDefaultAsync(g => g.Id == id);
        if (game is null)
        {
            throw new NotFoundException($"Game with Id {id} does not exist!");
        }

        game.Name = boardGame.Name;
        game.Publisher = boardGame.Publisher;
        game.Description = boardGame.Description;
        game.Players = boardGame.Players;
        game.Age = boardGame.Age;
        game.ImageUrl = boardGame.ImageUrl;

        await appDbContext.SaveChangesAsync();
    } 

}
