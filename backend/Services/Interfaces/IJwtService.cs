﻿using Services.DTOs.User;


namespace Services.Interfaces;
public interface IJwtService
{
    string GenerateJwtToken(UserDto dto);
}