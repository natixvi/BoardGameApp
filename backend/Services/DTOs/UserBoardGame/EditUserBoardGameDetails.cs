using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.UserBoardGame;
public class EditUserBoardGameDetails
{
    [Range(0, 10, ErrorMessage = "Rate must be a number from 0 to 10.")]
    public int? Rating { get; set; }
    public bool? IsFavourite { get; set; } = false;
}
