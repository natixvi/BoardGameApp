using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.BoardGame;
using Services.Interfaces;

namespace Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BoardGameController : ControllerBase
{
    private readonly IBoardGameService gameService;

    public BoardGameController(IBoardGameService gameService)
    {
        this.gameService = gameService;
    }
    [HttpGet]
    //public async Task<ActionResult<List<BoardGameDto>>> GetBoardGames() {
    public async Task<IActionResult> GetBoardGames() {
        var boardGames = await gameService.GetBoardGames();
        return Ok(boardGames);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetBoardGameById([FromRoute] int id)
    {
        var boardGame = await gameService.GetBoardGameById(id);
        return Ok(boardGame);
    }
    [Authorize(Roles = "Admin")]
    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateBoardGame([FromRoute] int id, [FromBody] UpdateBoardGameDto updateBoardGameDto)
    {
        await gameService.UpdateBoardGame(id, updateBoardGameDto);
        return Ok();
    }

}

