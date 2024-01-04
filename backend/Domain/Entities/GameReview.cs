namespace Domain.Entities;
public class GameReview
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public virtual User User { get; set; }
    public int BoardGameId { get; set; }
    public virtual BoardGame BoardGame { get; set; }
    public string ReviewDescription { get; set; }
}
