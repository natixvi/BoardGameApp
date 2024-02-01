using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Domain.IRepositories;
using Services.DTOs.FavUser;
using Services.Interfaces;

namespace Services.Services;
public class FavouriteUserService : IFavouriteUserService
{
    private readonly IAccountRepository accountRepository;
    private readonly IUserContextService userContextService;
    private readonly IFavouriteUserRepository favouriteUserRepository;
    private readonly IMapper mapper;

    public FavouriteUserService(IAccountRepository accountRepository, IUserContextService userContextService, IFavouriteUserRepository favouriteUserRepository, IMapper mapper)
    {
        this.accountRepository = accountRepository;
        this.userContextService = userContextService;
        this.favouriteUserRepository = favouriteUserRepository;
        this.mapper = mapper;
    }

    public async Task<int> AddUserToFavList(int favUserId)
    {
        var userId = await IfUserExist();
        if (! await accountRepository.CheckIfUserExist(favUserId)) throw new NotFoundException("Added user not found!");

        if (await IsUserInFavUserList(favUserId)) throw new DuplicateDataException("User can be added to fav user list just once!");

        var favUser = new FavouriteUser
        {
            UserId = userId,
            FavUserId = favUserId,
        };

        var addedFavUserId = await favouriteUserRepository.AddUserToFavList(favUser);
        return addedFavUserId;

    }

    public async Task DeleteUserFromFavList(int deletedUserId)
    {
        var userId = await IfUserExist();
        if (! await accountRepository.CheckIfUserExist(deletedUserId)) throw new NotFoundException("Deleted user not found!");

        var favUser = await favouriteUserRepository.GetFavUser((int)userId, deletedUserId);
        if (favUser == null) throw new BadRequestException("User is not in fav user list");
        await favouriteUserRepository.Delete(favUser);

    }

    public async Task<List<UserOnOtherProfile>?> GetUsersWhoAddedSelectUserToFriends(int userId)
    {
        if (!await accountRepository.CheckIfUserExist(userId)) throw new NotFoundException("User not found!");
        var userWhoAddedSelectUserToFriends = await favouriteUserRepository.GetUsersWhoAddedSelectUserToFriends(userId);
        return mapper.Map<List<UserOnOtherProfile>>(userWhoAddedSelectUserToFriends);
    }

    public async Task<bool> IsUserInFavUserList(int favUserId)
    {
        var userId = await IfUserExist();
        if (! await accountRepository.CheckIfUserExist(favUserId)) throw new NotFoundException("Fav user not found!");

        return await favouriteUserRepository.IsUserInFavUserList(userId, favUserId);
    }

    private async Task<int> IfUserExist()
    {
        var userId = userContextService.GetUserId;
        if (userId == null) throw new UnathorizedException("Incorrect or missing user ID, no authorization!");
        if(! await accountRepository.CheckIfUserExist((int)userId)) throw new NotFoundException("User not found!");
        return (int)userId;

    }

}
