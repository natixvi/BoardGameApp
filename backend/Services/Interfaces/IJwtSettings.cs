namespace Services.Interfaces;
public interface IJwtSettings
{
    string JwtKey { get; }
    string JwtIssuer { get; }
}
