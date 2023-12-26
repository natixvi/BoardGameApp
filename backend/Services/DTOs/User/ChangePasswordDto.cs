using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.User;
public class ChangePasswordDto
{
    [Required]
    public string OldPassword { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    public string ConfirmPassword { get; set; }

}
