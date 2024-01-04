namespace Domain.Entities;
public class BoardGame
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Publisher { get; set; }
    public string Description { get; set; }
    public string Players { get; set; }
    public string Time { get; set; }
    public int Age { get; set; }
    public string ImageUrl { get; set; }
    public virtual List<GameReview> GameReviews { get; set; }
}
