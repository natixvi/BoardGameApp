using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.UserRequest;
using Services.Interfaces;

namespace Web.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UserRequestController : ControllerBase
{
    private readonly IUserRequestService userRequestService;

    public UserRequestController(IUserRequestService userRequestService)
    {
        this.userRequestService = userRequestService;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var usersRequests = await userRequestService.GetAll();
        return Ok(usersRequests);
    }

    [HttpGet("user/messages")]
    public async Task<IActionResult> GetRequestByUserId()
    {
        var userRequests = await userRequestService.GetRequestByUserId();
        return Ok(userRequests);
    }
   
    [HttpPost("create")]
    public async Task<IActionResult> CreateUserRequest([FromBody] AddUserRequestDto addUserRequestDto)
    {
        var userRequestId  = await userRequestService.CreateUserRequest(addUserRequestDto);
        Console.WriteLine(userRequestId);   
        return Created($"/UserRequest/{userRequestId}", null);
    }
}
