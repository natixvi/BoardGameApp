using Microsoft.AspNetCore.Mvc;
using Services.DTOs.User;
using Services.Interfaces;

namespace Web.Controllers;

[Route("[controller]")]
[ApiController]
public class AccountController: ControllerBase
{
    private readonly IAccountService accountService;

    public AccountController(IAccountService accountService)
    {
        this.accountService = accountService;
    }

    [HttpPost("register")]
    public ActionResult RegisterUser([FromBody] RegisterUserDto registerUserDto)
    {
        accountService.RegisterUserAsync(registerUserDto);
        return Ok();
    }

 
}

