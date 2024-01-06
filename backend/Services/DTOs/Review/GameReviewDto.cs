namespace Services.DTOs.Review;
public class GameReviewDto
{
    public int Id { get; set; }
    public string ReviewDescription { get; set; }
    public DateTime CreatedDate { get; set; }
    public int UserId { get; set; }
    public string NickName { get; set; }
}
