namespace Services.DTOs.UserBoardGame;
public class AddUserBoardGameDto
{
    public double Rating { get; set; }
    public string? ReviewDescription { get; set; }
    public DateTime CreatedDate { get; set; }
    public bool IsFavourite { get; set; } = false;
}
