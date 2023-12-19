namespace Services.DTOs.BoardGame;
public class BoardGameDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Publisher { get; set; }
    public string Description { get; set; }
    public string Players { get; set; }
    public string Time { get; set; }
    public int Age { get; set; }
    public string ImageUrl { get; set; }
    public double Rating { get; set; }
    public List<ReviewDto>? Reviews { get; set; }
}
