using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.BoardGame;
using Services.DTOs.Review;
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
    [HttpPost("add")]
    public async Task<IActionResult> AddBoardGame([FromBody] AddBoardGameDto addBoardGameDto)
    {
        var boardGameId = await gameService.CreateBoardGame(addBoardGameDto);
        return Created($"/boardgame/{boardGameId}", null);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateBoardGame([FromRoute] int id, [FromBody] UpdateBoardGameDto updateBoardGameDto)
    {
        await gameService.UpdateBoardGame(id, updateBoardGameDto);
        return Ok("Boardgame with id: "+ id + "has been updated.");
    }
    
    [Authorize(Roles = "Admin")]
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteBoardGame([FromRoute] int id)
    {
        await gameService.DeleteBoardGame(id);
        return NoContent();
    }

}

