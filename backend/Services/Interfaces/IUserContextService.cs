using System.Security.Claims;

namespace Services.Interfaces;
public interface IUserContextService
{
    ClaimsPrincipal User { get; }
    int? GetUserId { get; }
}
