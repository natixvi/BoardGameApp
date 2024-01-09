using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Review;
using Services.Interfaces;

namespace Web.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class BoardGameReviewController : ControllerBase
{
    private readonly IGameReviewService gameReviewService;

    public BoardGameReviewController(IGameReviewService gameReviewService)
    {
        this.gameReviewService = gameReviewService;
    }


    [HttpPost("{gameId}/add-review")]
    public async Task<IActionResult> CreateGameReview([FromRoute] int gameId, [FromBody] AddGameReviewDto addGameReviewDto)
    {
        await gameReviewService.CreateReview(gameId, addGameReviewDto);
        return Created($"/boardgame/{gameId}", null);
    }

    [HttpPut("edit/{reviewId}")]
    public async Task<IActionResult> EditUserGameReview([FromRoute] int reviewId, [FromBody] EditGameReview editGameReview)
    {
        await gameReviewService.EditUserGameReview(reviewId, editGameReview);
        return Ok("Review with id: " + reviewId + "has been updated.");
    }

    [HttpDelete("delete/{reviewId}")]
    public async Task<IActionResult> DeleteUserGameReview([FromRoute] int reviewId)
    {
        await gameReviewService.DeleteUserGameReview(reviewId);
        return NoContent();
    }
}
