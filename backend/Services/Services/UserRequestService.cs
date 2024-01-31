using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.IRepositories;
using Services.DTOs.UserRequest;
using Services.Interfaces;

namespace Services.Services;
public class UserRequestService : IUserRequestService
{
    private readonly IUserRequestRepository userRequestRepository;
    private readonly IUserContextService userContextService;
    private readonly IMapper mapper;

    public UserRequestService(IUserRequestRepository userRequestRepository, IUserContextService userContextService, IMapper mapper)
    {
        this.userRequestRepository = userRequestRepository;
        this.userContextService = userContextService;
        this.mapper = mapper;
    }
    public async Task<int> CreateUserRequest(AddUserRequestDto addUserRequestDto)
    {
        var userId = GetUserContextId();
        var userRequest = mapper.Map<UserRequest>(addUserRequestDto);
        userRequest.UserId = (int)userId;
        userRequest.Status = UserRequestStatus.Active;

        return await userRequestRepository.CreateUserRequest(userRequest);
    }

    public async Task<List<UserRequestDto>> GetAll()
    {
        var usersRequests = await userRequestRepository.GetAll();
        return mapper.Map<List<UserRequestDto>>(usersRequests);
    }

    public async Task<List<UserRequestDto>?> GetRequestByUserId()
    {
        var userId = GetUserContextId();
        var userRequests = await userRequestRepository.GetRequestByUserId((int)userId);
        return mapper.Map<List<UserRequestDto>>(userRequests);
    }

    public async Task ChangeStatus(int requestId, ChangeUserRequestStatusDto stateDto)
    {
        var userRequest = await userRequestRepository.GetRequestById(requestId);
        if (userRequest == null) throw new NotFoundException("User request not found");
        if (Enum.TryParse<UserRequestStatus>(stateDto.Status, out var newStatus) && Enum.IsDefined(typeof(UserRequestStatus), newStatus))
        {
            userRequest.Status = newStatus;
            await userRequestRepository.Update(userRequest);
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
