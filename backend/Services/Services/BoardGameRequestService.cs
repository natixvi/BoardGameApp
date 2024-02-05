using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.IRepositories;
using Services.DTOs.BoardGame;
using Services.DTOs.UserRequest;
using Services.Interfaces;

namespace Services.Services;
public class BoardGameRequestService : IBoardGameRequestService
{
    private readonly IBoardGameRequestRepository boardGameRequestRepository;
    private readonly IUserContextService userContextService;
    private readonly Mapper mapper;

    public BoardGameRequestService(IBoardGameRequestRepository boardGameRequestRepository ,IUserContextService userContextService, Mapper mapper)
    {
        this.boardGameRequestRepository = boardGameRequestRepository;
        this.userContextService = userContextService;
        this.mapper = mapper;
    }

    public async Task<int> AddBoardGameRequest(AddBoardGameRequestDto game)
    {
        var userId = GetUserContextId();
        var addBoardGameRequest = mapper.Map<BoardGameRequest>(game);
        addBoardGameRequest.UserId = (int)userId;
        addBoardGameRequest.Status = UserRequestStatus.Active;

        var addBoardGameRequestId = await boardGameRequestRepository.AddBoardGameRequest(addBoardGameRequest);

        return (addBoardGameRequestId);
    }

    public async Task<List<UserRequestDto>> GetAll()
    {
        var usersBoardGameRequests = await boardGameRequestRepository.GetAll();
        return mapper.Map<List<UserRequestDto>>(usersBoardGameRequests);
    }

    public async Task<List<UserRequestDto>?> GetRequestByUserId()
    {
        var userId = GetUserContextId();
        var userBoardGameRequests = await boardGameRequestRepository.GetBoardGameRequestByUserId((int)userId);
        return mapper.Map<List<UserRequestDto>>(userBoardGameRequests);
    }

    public async Task ChangeStatus(int requestId, ChangeUserRequestStatusDto stateDto)
    {
        var userBoardGameRequest = await boardGameRequestRepository.GetBoardGameRequestById(requestId);
        if (userBoardGameRequest == null) throw new NotFoundException("User request not found");
        if (Enum.TryParse<UserRequestStatus>(stateDto.Status, out var newStatus) && Enum.IsDefined(typeof(UserRequestStatus), newStatus))
        {
            userBoardGameRequest.Status = newStatus;
            await boardGameRequestRepository.Update(userBoardGameRequest);
        }
        else
        {
            throw new BadRequestException("Invalid status");
        }

    }

    public async Task<UserRequestDto?> GetUserRequestById(int requestId)
    {
        var userRequest = await userRequestRepository.GetRequestById(requestId);
        if (userRequest == null) throw new NotFoundException("User request not found");
        return mapper.Map<UserRequestDto>(userRequest);
    }
    private int? GetUserContextId()
    {
        var userId = userContextService.GetUserId;
        if (userId == null) throw new UnathorizedException("Incorrect or missing user ID, no authorization!");
        return userId;
    }

}
