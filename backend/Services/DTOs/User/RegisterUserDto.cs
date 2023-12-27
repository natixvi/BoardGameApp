using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.User;
public class RegisterUserDto
{
    [Required]
    [StringLength(30, ErrorMessage = "Nickname can have at most 30 characters.")]
    public string NickName { get; set; }

    [Required]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    public string ConfirmPassword { get; set; }
   
    
}
