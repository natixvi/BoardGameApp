using Domain.Entities;

namespace Services.DTOs.User;
public class UserDto
{
    public int Id { get; set; }
    public string NickName { get; set; }
    public string Email { get; set; }
    public virtual List<FavouriteUser>? FavouriteUsers { get; set; }
    public virtual List<MyBoardGame>? FavouriteGames { get; set; }
}
