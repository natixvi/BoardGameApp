using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.BoardGame;
public class UpdateBoardGameDto
{
    [Required]
    public string Name { get; set; }
    [Required]
    public string Publisher { get; set; }
    [Required]
    public string Description { get; set; }
    [Required]
    public string Players { get; set; }
    [Required]
    public string Time { get; set; }
    [Required]
    public int Age { get; set; }
    [Required]
    public string ImageUrl { get; set; }
}
