namespace Domain.Entities;
public class GameComment
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public virtual User User { get; set; }
    public int BoardGameId { get; set; }
    public virtual BoardGame BoardGame { get; set; }
    public DateTime CreatedDate { get; set; }
    public string CommentDescription { get; set; }
}
