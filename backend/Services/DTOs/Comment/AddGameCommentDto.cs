using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Comment;
public class AddGameCommentDto
{
    [Required]
    public DateTime CreatedDate { get; set; }
    [Required]
    [StringLength(1000, MinimumLength = 1, ErrorMessage = "Comment must be between 1 and 1000 characters.")]
    public string CommentDescription { get; set; }
}
