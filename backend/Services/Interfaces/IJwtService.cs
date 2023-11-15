using Domain.Entities;


namespace Services.Interfaces;
public interface IJwtService
{
    string GenerateJwtToken(User user);
}
