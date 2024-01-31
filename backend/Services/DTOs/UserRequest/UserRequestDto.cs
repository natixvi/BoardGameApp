namespace Services.DTOs.UserRequest;
public class UserRequestDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; }
    public string MessageTitle { get; set; }
    public string MessageBody { get; set; }
    public DateTime CreatedTime { get; set; }
    public string State { get; set; }
}
