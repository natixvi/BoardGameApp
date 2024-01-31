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

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/change-state")]
    public async Task<IActionResult> ChangeRequestState([FromRoute] int id, ChangeUserRequestStatusDto statusDto)
    {
        await userRequestService.ChangeState(id, statusDto);
        return Ok("User request with id: " + id + " has been updated.");
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserRequestById([FromRoute] int id)
    {
        var userRequest =  await userRequestService.GetUserRequestById(id);
        return Ok(userRequest);
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
