using AutoMapper;
using Domain.Entities;
using Services.DTOs.BoardGame;
using Services.DTOs.User;

namespace Services.Mappers;

public class AutoMapperProfile: Profile
{
    public AutoMapperProfile()
    {
        CreateMap<User, UserDto>();
        CreateMap<LoginUserDto, User>();
        CreateMap<RegisterUserDto, User>();
        CreateMap<BoardGame, BoardGameDto>();
        CreateMap<UpdateBoardGameDto, BoardGame>();
        CreateMap<AddBoardGameDto, BoardGame>();
    }
}
