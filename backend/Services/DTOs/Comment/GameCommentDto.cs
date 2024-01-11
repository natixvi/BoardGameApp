namespace Services.DTOs.Comment;
public class GameCommentDto
{
    public int Id { get; set; }
    public string CommentDescription { get; set; }
    public DateTime CreatedDate { get; set; }
    public int UserId { get; set; }
    public string NickName { get; set; }
}
