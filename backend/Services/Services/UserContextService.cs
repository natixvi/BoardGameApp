using Microsoft.AspNetCore.Http;
using Services.Interfaces;
using System.Security.Claims;

namespace Services.Services;
public class UserContextService : IUserContextService
{
    private readonly IHttpContextAccessor httpContextAccessor;

    public UserContextService(IHttpContextAccessor httpContextAccessor)
    {
        this.httpContextAccessor = httpContextAccessor;
    }
    public ClaimsPrincipal User => httpContextAccessor.HttpContext?.User;

    public int? GetUserId => User is null ? null: int.Parse(User.FindFirst(c => c.Type == "Id").Value);

}
