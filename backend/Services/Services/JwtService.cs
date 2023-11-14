using Services.DTOs.User;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services;
public class JwtService : IJwtService
{
    private readonly IJwtSettings jwtSettings;

    public JwtService(IJwtSettings jwtSettings)
    {
        this.jwtSettings = jwtSettings;
    }
    public string GenerateJwtToken(LoginDto dto)
    {
        throw new NotImplementedException();
    }
}
