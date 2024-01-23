using Services.DTOs.FavUser;
using Services.DTOs.UserBoardGame;

namespace Services.DTOs.User;
public class UserDto
{
    public int Id { get; set; }
    public string NickName { get; set; }
    public string Email { get; set; }
    public List<UserBoardGameDto>? UserBoardGames { get; set; }
    public List<FavUserDto>? FavouriteUsers { get; set; }

}
