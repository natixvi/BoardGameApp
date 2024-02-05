using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.IRepositories;
using Services.DTOs.BoardGameRequest;
using Services.DTOs.UserRequest;
using Services.Interfaces;

namespace Services.Services;
public class BoardGameRequestService : IBoardGameRequestService
{
    private readonly IBoardGameRequestRepository boardGameRequestRepository;
    private readonly IUserContextService userContextService;
    private readonly IMapper mapper;

    public BoardGameRequestService(IBoardGameRequestRepository boardGameRequestRepository ,IUserContextService userContextService, IMapper mapper)
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

    public async Task<List<BoardGameRequestDto>> GetAll()
    {
        var boardGameRequests = await boardGameRequestRepository.GetAll();
        return mapper.Map<List<BoardGameRequestDto>>(boardGameRequests);
    }

    public async Task<List<BoardGameRequestDto>?> GetBoardGameRequestsByUserId()
    {
        var userId = GetUserContextId();
        var boardGameRequests = await boardGameRequestRepository.GetBoardGameRequestsByUserId((int)userId);
        return mapper.Map<List<BoardGameRequestDto>>(boardGameRequests);
    }

    public async Task ChangeStatus(int requestId, ChangeUserRequestStatusDto stateDto)
    {
        var boardGameRequest = await boardGameRequestRepository.GetBoardGameRequestById(requestId);
        if (boardGameRequest == null) throw new NotFoundException("Boad game request not found");
        if (Enum.TryParse<UserRequestStatus>(stateDto.Status, out var newStatus) && Enum.IsDefined(typeof(UserRequestStatus), newStatus))
        {
            boardGameRequest.Status = newStatus;
            await boardGameRequestRepository.Update(boardGameRequest);
        }
        else
        {
            throw new BadRequestException("Invalid status");
        }

    }

    public async Task<BoardGameRequestDto?> GetBoardGameRequestById(int requestId)
    {
        var boardGameRequest = await boardGameRequestRepository.GetBoardGameRequestById(requestId);
        if (boardGameRequest == null) throw new NotFoundException("Boad game request not found");
        return mapper.Map<BoardGameRequestDto>(boardGameRequest);
    }

    private int? GetUserContextId()
    {
        var userId = userContextService.GetUserId;
        if (userId == null) throw new UnathorizedException("Incorrect or missing user ID, no authorization!");
        return userId;
    }

}
