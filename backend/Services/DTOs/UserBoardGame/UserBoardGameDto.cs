namespace Services.DTOs.UserBoardGame;
public class UserBoardGameDto
{
    public int BoardGameId { get; set; }
    public string Name { get; set; }
    public string ImageUrl { get; set; }
    public double Rating { get; set; }
    public double UserRating { get; set; }
    public bool IsFavourite { get; set; }
}
