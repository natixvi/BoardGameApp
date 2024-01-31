using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.UserRequest;
public class AddUserRequestDto
{
    [Required]
    public string MessageTitle { get; set; }
    [Required]
    public string MessageBody { get; set; }
    [Required]
    public DateTime CreatedTime { get; set; }
}
