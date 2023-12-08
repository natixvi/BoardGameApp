using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.User;
public class UpdateUserPasswordDto
{
    [Required]
    public string Password { get; set; }
    [Required]
    public string ConfirmPassword { get; set; }

}
