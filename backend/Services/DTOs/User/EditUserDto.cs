using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.User;
public class EditUserDto
{
    public string NickName { get; set; }
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    public string Email { get; set; }
}
