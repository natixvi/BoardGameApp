namespace Services.DTOs.BoardGame;
public class ReviewDto
{
    public double Rating { get; set; }
    public string ReviewDescription { get; set; }
    public DateTime CreatedDate { get; set; }
    public int UserId { get; set; }
    public string NickName { get; set; }
}
