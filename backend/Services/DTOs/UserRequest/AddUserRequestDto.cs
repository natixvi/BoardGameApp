namespace Services.DTOs.UserRequest;
public class AddUserRequestDto
{
    public string MessageTitle { get; set; }
    public string MessageBody { get; set; }
    public DateTime CreatedTime { get; set; }
}
