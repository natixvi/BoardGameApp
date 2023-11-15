using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.User;
public class RegisterUserDto
{
    [Required]
    public string NickName { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    public string ConfirmPassword { get; set; }
    [Required]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    [RegularExpression(@"^[^@\s]+@[^@\s]+\.(com|net|org|gov)$", ErrorMessage = "Invalid email address")]
    public string Email { get; set; }
}
