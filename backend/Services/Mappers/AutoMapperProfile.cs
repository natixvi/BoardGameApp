﻿using AutoMapper;
using Domain.Entities;
using Services.DTOs.User;

namespace Services.Mappers;

public class AutoMapperProfile: Profile
{
    public AutoMapperProfile()
    {
        CreateMap<LoginDto, User>();
        CreateMap<RegisterUserDto, User>();
    }
}
