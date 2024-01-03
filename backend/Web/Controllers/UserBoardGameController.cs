﻿using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.UserBoardGame;
using Services.Interfaces;

namespace Web.Controllers;
[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UserBoardGameController : ControllerBase
{
    private readonly IUserBoardGameService userBoardGameService;

    public UserBoardGameController(IUserBoardGameService userBoardGameService)
    {
        this.userBoardGameService = userBoardGameService;
    }

    [HttpGet("is-game-in-list/{gameId}")]
    public async Task<IActionResult> IsGameInUserList([FromRoute] int gameId)
    {
        var isGameInUserList = await userBoardGameService.IsGameInUserList(gameId);
        return Ok(isGameInUserList);
    }

    [HttpPost("add/{gameId}")]
    public async Task<IActionResult> AddGameToUserList([FromRoute] int gameId, [FromBody] AddUserBoardGameDto addUserBoardGameDto)
    {
        var userBoardGameId = await userBoardGameService.AddGameToUserList(gameId, addUserBoardGameDto);
        return Created($"/UserBoardGame/{userBoardGameId}", null);
    }

    [HttpDelete("delete/{gameId}")]
    public async Task<IActionResult> DeleteGameFromUserList([FromRoute] int gameId)
    {
        await userBoardGameService.DeleteGameFromUserList(gameId);
        return NoContent();
    }   
}