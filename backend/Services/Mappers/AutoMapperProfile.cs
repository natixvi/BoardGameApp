using AutoMapper;
using Domain.Entities;
using Services.DTOs.BoardGame;
using Services.DTOs.Comment;
using Services.DTOs.FavUser;
using Services.DTOs.User;
using Services.DTOs.UserBoardGame;

namespace Services.Mappers;

public class AutoMapperProfile: Profile
{
    public AutoMapperProfile()
    {
        CreateMap<User, UserDto>();
        CreateMap<FavouriteUser, FavUserDto>()
            .ForMember(dest => dest.NickName, c => c.MapFrom(src => src.FavUser.NickName))
            .ForMember(dest => dest.Email, c => c.MapFrom(src => src.FavUser.Email));

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
