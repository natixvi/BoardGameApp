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
        CreateMap<User, UserInfoDto>();

        CreateMap<BoardGame, BoardGameDto>();
        CreateMap<BoardGame, BoardGameDetailsDto>();
        CreateMap<UpdateBoardGameDto, BoardGame>();
        CreateMap<AddBoardGameDto, BoardGame>();

        CreateMap<MyBoardGame, ReviewDto>()
            .ForMember(dest => dest.NickName, c => c.MapFrom(src => src.User.NickName));
    }
}
