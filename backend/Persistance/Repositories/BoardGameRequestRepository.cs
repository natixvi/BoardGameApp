using Domain.Entities;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;
using System;

namespace Persistance.Repositories;
public class BoardGameRequestRepository : BaseRepository<BoardGameRequest>, IBoardGameRequestRepository
{
    private readonly AppDbContext appDbContext;

    public BoardGameRequestRepository(AppDbContext appDbContext) : base(appDbContext)
    {
        this.appDbContext = appDbContext;
    }
    public async Task<int> AddBoardGameRequest(BoardGameRequest game)
    {
        appDbContext.AddBoardGameRequests.Add(game);
        await appDbContext.SaveChangesAsync();
        return game.Id;
    }
    public async Task<List<BoardGameRequest>> GetAll()
    {
        var usersBoardGameRequests = await appDbContext.AddBoardGameRequests.Include(r => r.User).ToListAsync();
        return usersBoardGameRequests;
    }

    public async Task<List<BoardGameRequest>?> GetBoardGameRequestByUserId(int userId)
    {
        var userBoardGameRequests = await appDbContext.AddBoardGameRequests.Where(r => r.UserId == userId).ToListAsync();
        return userBoardGameRequests;
    }

    public async Task<BoardGameRequest?> GetBoardGameRequestById(int requestId)
    {
        var userBoardGameRequest = await appDbContext.AddBoardGameRequests.Include(r => r.User).FirstOrDefaultAsync(r => r.Id == requestId);
        return userBoardGameRequest;
    }
}
