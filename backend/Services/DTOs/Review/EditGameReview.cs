using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Review;
public class EditGameReview
{
    [Required]
    [StringLength(1000, MinimumLength = 1, ErrorMessage = "Review must be between 1 and 1000 characters.")]
    public string ReviewDescription { get; set; }
}
