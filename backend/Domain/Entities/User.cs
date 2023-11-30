using Microsoft.EntityFrameworkCore;

namespace Domain.Entities;

[Index(nameof(Email), IsUnique = true)]
public class User
{
    public int Id { get; set; }
    public string NickName { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }
    public int RoleId { get; set; }
    public virtual Role Role { get; set; }
    public virtual List<FavouriteUser> FavouriteUsers { get; set; }
    public virtual List<FavouriteGame> FavouriteGames { get; set; }
  
}

