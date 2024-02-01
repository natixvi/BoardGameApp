using Domain.Entities;

namespace Domain.IRepositories;
public interface IFavouriteUserRepository: IBaseRepository<FavouriteUser>
{
    Task<int> AddUserToFavList(FavouriteUser favouriteUser);
    Task<bool> IsUserInFavUserList(int userId, int favUserId);
    Task<FavouriteUser?> GetFavUser(int userId, int deletedUserId);
    Task<List<FavouriteUser>?> GetUsersWhoAddedSelectUserToFriends(int userId);
}
