namespace Services.Interfaces;
public interface IFavouriteUserService
{
    Task<int> AddUserToFavList(int favUserId);
    Task<bool> IsUserInFavUserList(int favUserId);
    Task DeleteUserFromFavList(int deletedUserId);
}
