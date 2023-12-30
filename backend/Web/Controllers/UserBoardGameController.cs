using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

}
