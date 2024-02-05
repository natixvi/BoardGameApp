using Domain.Enums;

namespace Domain.Entities;
public class BoardGameRequest
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Publisher { get; set; }
    public string Description { get; set; }
    public string Players { get; set; }
    public string Time { get; set; }
    public int Age { get; set; }
    public string ImageUrl { get; set; }
    public int UserId { get; set; }
    public virtual User User { get; set; }
    public DateTime CreatedTime { get; set; }
    public UserRequestStatus Status { get; set; }

}
