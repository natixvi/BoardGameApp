using Domain.Entities;
using Services.DTOs.Comment;

namespace Services.Interfaces;
public interface IGameCommentService
{
    Task CreateComment(int gameId, AddGameCommentDto addGameCommentDto);
    Task EditUserGameComment(int commentId, EditGameComment editGameComment);
    Task DeleteUserGameComment(int commentId);
    Task<bool> IfUserCreatedComment(int gameId);
}
