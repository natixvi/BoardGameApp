using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Comment;
using Services.Interfaces;

namespace Web.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class BoardGameCommentController : ControllerBase
{
    private readonly IGameCommentService gameCommentService;

    public BoardGameCommentController(IGameCommentService gameCommentService)
    {
        this.gameCommentService = gameCommentService;
    }


    [HttpPost("{gameId}/add-comment")]
    public async Task<IActionResult> CreateGameComment([FromRoute] int gameId, [FromBody] AddGameCommentDto addGameCommentDto)
    {
        await gameCommentService.CreateComment(gameId, addGameCommentDto);
        return Created($"/boardgame/{gameId}", null);
    }

    [HttpPut("edit/{commentId}")]
    public async Task<IActionResult> EditUserGameComment([FromRoute] int commentId, [FromBody] EditGameComment editGameComment)
    {
        await gameCommentService.EditUserGameComment(commentId, editGameComment);
        return Ok("Comment with id: " + commentId + "has been updated.");
    }

    [HttpDelete("delete/{commentId}")]
    public async Task<IActionResult> DeleteUserGameComment([FromRoute] int commentId)
    {
        await gameCommentService.DeleteUserGameComment(commentId);
        return NoContent();
    }
}
