﻿using Domain.Entities;
using Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;

namespace Persistance.Repositories;
public class MyBoardGameRepository: IMyBoardGameRepository
{
    private readonly AppDbContext appDbContext;

    public MyBoardGameRepository(AppDbContext appDbContext)
    {
        this.appDbContext = appDbContext;
    }

    public async Task<List<MyBoardGame>> GetRatingListForGameId(int gameId)
    {
        return await appDbContext.MyBoardGames.Where(g => g.BoardGameId == gameId).ToListAsync();
    }
}
