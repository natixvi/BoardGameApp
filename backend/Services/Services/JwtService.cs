using Domain.Entities;
using Microsoft.IdentityModel.Tokens;
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
    public string GenerateJwtToken(User user)
    {
        var claims = new List<Claim>(){

                new Claim("Id", user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email,user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.NickName),
                new Claim("role",  user.Role.Name)

        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.JwtKey));
        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var exp = DateTime.Now.AddMinutes(jwtSettings.JwtExpireTime);

        var token = new JwtSecurityToken(jwtSettings.JwtIssuer, jwtSettings.JwtIssuer,
            claims, expires : exp, signingCredentials: cred);
        return new JwtSecurityTokenHandler().WriteToken(token);

    }
}


