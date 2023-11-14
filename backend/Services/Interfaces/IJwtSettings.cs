namespace Services.Interfaces;
public interface IJwtSettings
{
    string JwtKey { get; }
    int JwtExpireTime { get; }
    string JwtIssuer { get; }
}
