using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Domain.IRepositories;
using Services.DTOs.Comment;
using Services.Interfaces;

namespace Services.Services;
public class GameCommentService : IGameCommentService
{
    private readonly IGameCommentRepository gameCommentRepository;
    private readonly IBoardGameRepository boardGameRepository;
    private readonly IUserContextService userContextService;
    private readonly IMapper mapper;

    public GameCommentService(IGameCommentRepository gameCommentRepository, IBoardGameRepository boardGameRepository, IUserContextService userContextService, IMapper mapper)
    {
        this.gameCommentRepository = gameCommentRepository;
        this.boardGameRepository = boardGameRepository;
        this.userContextService = userContextService;
        this.mapper = mapper;
    }

    public async Task CreateComment(int gameId, AddGameCommentDto addGameCommentDto)
    {
        var userId = GetUserContextId();
        await CheckIfGameExist(gameId);

        var ifUserCreateCommentAlready = await IfUserCreatedComment(gameId);
        if (ifUserCreateCommentAlready) throw new DuplicateDataException("Game comment can be added just once!");

        var gameComment = mapper.Map<GameComment>(addGameCommentDto);

        gameComment.BoardGameId = gameId;
        gameComment.UserId = (int)userId;

        await gameCommentRepository.CreateComment(gameComment);
    }
     public async Task EditUserGameComment(int commentId, EditGameComment editGameComment)
     {
        var userId = GetUserContextId();
        var comment = await gameCommentRepository.GetGameCommentById(commentId);
        if (comment == null) throw new NotFoundException("Comment not found");
        if (comment.UserId != userId) throw new UnathorizedException("Unathorized! You cannot edit this comment");

        comment.CommentDescription = editGameComment.CommentDescription;
        await gameCommentRepository.Update(comment);
     }

    public async Task DeleteUserGameComment(int commentId)
    {
        var userId = GetUserContextId();
        var comment = await gameCommentRepository.GetGameCommentById(commentId);
        if (comment == null) throw new NotFoundException("Comment not found");
        if (comment.UserId != userId) throw new UnathorizedException("Unathorized! You cannot delete this comment");

        await gameCommentRepository.Delete(comment);
    }


    public async Task<bool> IfUserCreatedComment(int gameId)
    {
        var userId = GetUserContextId();
        await CheckIfGameExist(gameId);

        return await gameCommentRepository.IfUserCreateComment(gameId, userId);
    }

    private int? GetUserContextId()
    {
        var userId = userContextService.GetUserId;
        if (userId == null) throw new UnathorizedException("Incorrect or missing user ID, no authorization!");
        return userId;
    }

    private async Task CheckIfGameExist(int gameId)
    {
        var game = await boardGameRepository.GetBoardGameById(gameId);
        if (game == null) throw new NotFoundException("Board game not found!");
    }
}
