using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.BoardGame;
using Services.Interfaces;

namespace Web.Controllers;


[Route("api/[controller]")]
[ApiController]
[Authorize]
public class BoardGameRequestController : ControllerBase
{
    private readonly IBoardGameRequestService addBoardGameRequestService;

    public BoardGameRequestController(IBoardGameRequestService addBoardGameRequestService)
    {
        this.addBoardGameRequestService = addBoardGameRequestService;
    }

    [Authorize(Roles = "User")]
    [HttpPost("add")]
    public async Task<IActionResult> AddBoardGameRequest([FromBody] AddBoardGameRequestDto addBoardGameRequestDto)
    {
        var boardGameId = await addBoardGameRequestService.AddBoardGameRequest(addBoardGameRequestDto);
        return Created($"/addboardgamerequest/{boardGameId}", null);
    }

}
