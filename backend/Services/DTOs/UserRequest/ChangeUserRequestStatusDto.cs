using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.UserRequest;
public class ChangeUserRequestStatusDto
{
    [Required]
    public string Status { get; set; }
}
