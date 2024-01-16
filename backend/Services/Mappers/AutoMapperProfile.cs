using AutoMapper;
using Domain.Entities;
using Services.DTOs.BoardGame;
using Services.DTOs.Comment;
using Services.DTOs.User;
using Services.DTOs.UserBoardGame;

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

        CreateMap<AddUserBoardGameDto, UserBoardGame>();
        CreateMap<AddUserBoardGameDto, BoardGame>();
        CreateMap<UserBoardGame, UserBoardGameDetails>();
        CreateMap<EditUserBoardGameDetails, UserBoardGame>();

        CreateMap<UserBoardGame, UserBoardGameDto>()
            .ForMember(dest => dest.Name, c => c.MapFrom(src => src.BoardGame.Name))
            .ForMember(dest => dest.ImageUrl, c => c.MapFrom(src => src.BoardGame.ImageUrl))
            .ForMember(dest => dest.UserRating, c => c.MapFrom(src => src.Rating));

        CreateMap<AddGameCommentDto, GameComment>();
    }
}
