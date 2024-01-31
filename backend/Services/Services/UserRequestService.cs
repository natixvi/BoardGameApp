using AutoMapper;
using Domain.Entities;
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
        userRequest.State = Domain.Enums.UserRequestState.Active;

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

    private int? GetUserContextId()
    {
        var userId = userContextService.GetUserId;
        if (userId == null) throw new UnathorizedException("Incorrect or missing user ID, no authorization!");
        return userId;
    }

}
