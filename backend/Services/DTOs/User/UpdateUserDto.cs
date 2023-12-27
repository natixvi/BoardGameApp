using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.User;
public class UpdateUserDto
{
    [StringLength(30, ErrorMessage = "Nickname can have at most 30 characters.")]
    public string NickName { get; set; }
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    public string Email { get; set; }
}
