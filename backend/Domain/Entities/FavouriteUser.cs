namespace Domain.Entities;
public class FavouriteUser
{
    public int Id { get; set; } 
    public int UserId { get; set; }
    public virtual User User { get; set; }
    public int FavUserId { get; set; }
    public virtual User FavUser { get; set; }

}
