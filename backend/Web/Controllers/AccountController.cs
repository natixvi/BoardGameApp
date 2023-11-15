using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.User;
using Services.Interfaces;

namespace Web.Controllers;

[Route("[controller]")]
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
    public async Task<ActionResult> RegisterUserAsync([FromBody] RegisterUserDto registerUserDto)
    {
        await accountService.RegisterUserAsync(registerUserDto);
        return Ok();
    }
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<string>> LoginUserAsync([FromBody] LoginUserDto loginUserDto)
    {
        var token =  await accountService.LoginUser(loginUserDto);
        return Ok(token);
    }


    [Authorize(Roles = "Admin")]
    [HttpGet("roles")]
    public ActionResult<string> GetRoles()
    {
        return Ok("działa kjuikyiuhui");
    }

 
}

