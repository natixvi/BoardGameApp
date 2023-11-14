using Microsoft.IdentityModel.Tokens;
using Services.DTOs.User;
using Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Services.Services;
public class JwtService : IJwtService
{
    private readonly IJwtSettings jwtSettings;

    public JwtService(IJwtSettings jwtSettings)
    {
        this.jwtSettings = jwtSettings;
    }
    public string GenerateJwtToken(UserDto user)
    {
        var claims = new List<Claim>(){

                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(ClaimTypes.Role, $"{user.Role}"),

        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.JwtKey));
        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddMinutes(jwtSettings.JwtExpireTime);

        var token = new JwtSecurityToken(jwtSettings.JwtIssuer, jwtSettings.JwtIssuer, claims, expires, signingCredentials: cred);
        return new JwtSecurityTokenHandler().WriteToken(token);

    }
}
