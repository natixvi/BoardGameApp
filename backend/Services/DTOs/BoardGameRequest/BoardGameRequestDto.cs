namespace Services.DTOs.BoardGameRequest;
public class BoardGameRequestDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; }
    public string Name { get; set; }
    public string Publisher { get; set; }
    public string Description { get; set; }
    public string Players { get; set; }
    public string Time { get; set; }
    public int Age { get; set; }
    public string ImageUrl { get; set; }
    public DateTime CreatedTime { get; set; }
    public string Status { get; set; }
}
