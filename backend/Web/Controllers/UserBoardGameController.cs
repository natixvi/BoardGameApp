using Domain.Entities;
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

    [AllowAnonymous]
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserBoardGames([FromRoute] int userId)
    {
        var userBoardGames = await userBoardGameService.GetUserBoardGames(userId);
        return Ok(userBoardGames);
    }

    [AllowAnonymous]
    [HttpGet("{userId}/favourite")]
    public async Task<IActionResult> GetUserFavouriteBoardGames([FromRoute] int userId)
    {
        var userFavBoardGames = await userBoardGameService.GetUserFavouriteBoardGames(userId);
        return Ok(userFavBoardGames);
    }

    [HttpPost("favourite/{gameId}/change-fav-status")]
    public async Task<IActionResult> ChangeUserGameFavouriteStatus([FromRoute] int gameId)
    {
        await userBoardGameService.ChangeUserGameFavouriteStatus(gameId);
        return Ok("User boardgame with id: " + gameId + " has been updated.");
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

    [HttpGet("details/{gameId}")]
    public async Task<IActionResult> GetUserBoardGameDetails([FromRoute] int gameId)
    {
        var userBoardGameDetails = await userBoardGameService.GetUserBoardGameDetails(gameId);
        return Ok(userBoardGameDetails);
    }

    [HttpPut("edit/{gameId}")]
    public async Task<IActionResult> UpdateUserBoardGameDetails([FromRoute] int gameId, [FromBody] EditUserBoardGameDetails editUserBoardGameDetails)
    {
        await userBoardGameService.UpdateUserBoardGameDetails(gameId, editUserBoardGameDetails);
        return Ok("User boardgame with id: " + gameId + " has been updated.");
    }
}
