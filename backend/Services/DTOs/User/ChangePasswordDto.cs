using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.User;
public class ChangePasswordDto
{
    [Required]
    public string OldPassword { get; set; }
    [Required]
    public string NewPassword { get; set; }
    [Required]
    public string ConfirmNewPassword { get; set; }

}
