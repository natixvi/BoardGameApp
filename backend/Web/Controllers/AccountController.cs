using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.User;
using Services.Interfaces;
using System.Text.Json;

namespace Web.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class AccountController: ControllerBase
{
    private readonly IAccountService accountService;

    public AccountController(IAccountService accountService)
    {
        this.accountService = accountService;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto registerUserDto)
    {
        await accountService.RegisterUser(registerUserDto);
        return Ok("User has been register.");
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> LoginUser([FromBody] LoginUserDto loginUserDto)
    {
        var token =  await accountService.LoginUser(loginUserDto);
        return Ok(JsonSerializer.Serialize(new {token = token}));
    }

    [HttpPut("update/data")]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto updateUserDto)
    {
        var token = await accountService.UpdateUser(updateUserDto);
        return Ok(JsonSerializer.Serialize(new {token = token}));
    }

    [HttpPut("update/password")]
    public async Task<IActionResult> UpdateUserPassword([FromBody] UpdateUserPasswordDto updateUserPasswordDto)
    {
       await accountService.UpdateUserPassword(updateUserPasswordDto);
       return Ok("User password has been changed.");
       
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> DeleteAccount()
    {
       await accountService.DeleteAccount();
       return NoContent();

    }

    [HttpGet("roles")]
    public IActionResult GetRoles()
    {
        var roles = new List<string> { "Admin", "User" };
        return Ok(roles);
    }

 
}

