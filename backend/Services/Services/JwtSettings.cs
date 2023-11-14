using Services.Interfaces;

namespace Services.Services;
public class JwtSettings : IJwtSettings
{
    public string JwtKey { get; set; }

    public string JwtIssuer { get; set; }
}
