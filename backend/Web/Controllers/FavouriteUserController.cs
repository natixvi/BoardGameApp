using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace Web.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class FavouriteUserController: ControllerBase
{
    private readonly IFavouriteUserService favouriteUserService;

    public FavouriteUserController(IFavouriteUserService favouriteUserService)
    {
        this.favouriteUserService = favouriteUserService;
    }
    [HttpGet("is-user-in-list/{favUserId}")]
    public async Task<IActionResult> IsUserInFavUserList([FromRoute] int favUserId)
    {
        var isUserInFavUserList = await favouriteUserService.IsUserInFavUserList(favUserId);
        return Ok(isUserInFavUserList);
    }

    [AllowAnonymous]
    [HttpGet("{userId}/user-on-other-profiles")]
    public async Task<IActionResult> GetUsersWhoAddedSelectUserToFriends([FromRoute] int userId)
    {
        var userWhoAddedSelectUserToFriends = await favouriteUserService.GetUsersWhoAddedSelectUserToFriends(userId);
        return Ok(userWhoAddedSelectUserToFriends);
    }

    [HttpPost("add/{favUserId}")]
    public async Task<IActionResult> AddGameToUserList([FromRoute] int favUserId)
    {

        var userFavUserId = await favouriteUserService.AddUserToFavList(favUserId); 
        return Created($"/FavouriteUser/{userFavUserId}", null);
    }

    [HttpDelete("delete/{favUserId}")]
    public async Task<IActionResult> DeleteGameFromUserList([FromRoute] int favUserId)
    {
        await favouriteUserService.DeleteUserFromFavList(favUserId);
        return NoContent();
    }
}
