using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.BoardGameRequest;
using Services.DTOs.UserRequest;
using Services.Interfaces;

namespace Web.Controllers;


[Route("api/[controller]")]
[ApiController]
[Authorize]
public class BoardGameRequestController : ControllerBase
{
    private readonly IBoardGameRequestService boardGameRequestService;

    public BoardGameRequestController(IBoardGameRequestService boardGameRequestService)
    {
        this.boardGameRequestService = boardGameRequestService;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddBoardGameRequest([FromBody] AddBoardGameRequestDto addBoardGameRequestDto)
    {
        var boardGameRequestId = await boardGameRequestService.AddBoardGameRequest(addBoardGameRequestDto);
        return Created($"/addboardgamerequest/{boardGameRequestId}", null);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var boardGameRequests = await boardGameRequestService.GetAll();
        return Ok(boardGameRequests);
    }

    [HttpGet("user")]
    public async Task<IActionResult> GetRequestByUserId()
    {
        var boardGameRequests = await boardGameRequestService.GetBoardGameRequestsByUserId();
        return Ok(boardGameRequests);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserRequestById([FromRoute] int id)
    {
        var boardGameRequest = await boardGameRequestService.GetBoardGameRequestById(id);
        return Ok(boardGameRequest);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/change-status")]
    public async Task<IActionResult> ChangeRequestStatus([FromRoute] int id, ChangeUserRequestStatusDto statusDto)
    {
        await boardGameRequestService.ChangeStatus(id, statusDto);
        return Ok("Board game request with id: " + id + " has been updated.");
    }

}
