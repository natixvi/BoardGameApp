using Domain.Enums;

namespace Domain.Entities;
public class UserRequest
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public virtual User User { get; set; }
    public string MessageTitle { get; set; }
    public string MessageBody { get; set; } 
    public DateTime CreatedTime { get; set; }
    public UserRequestState State { get; set; }
}
