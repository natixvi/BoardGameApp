using Microsoft.AspNetCore.Mvc;
using Services.DTOs.BoardGame;
using Services.Interfaces;

namespace Web.Controllers;

[Route("[controller]")]
[ApiController]
public class GameController : ControllerBase
{
    private readonly IGameService gameService;

    public GameController(IGameService gameService)
    {
        this.gameService = gameService;
    }
    [HttpGet]
    public async Task<ActionResult<List<BoardGameDto>>> GetAllGames() {
        return null;
    }

}

