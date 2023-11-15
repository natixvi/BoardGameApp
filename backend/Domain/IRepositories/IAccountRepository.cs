using Domain.Entities;
namespace Domain.IRepositories;
public interface IAccountRepository
{
    Task RegisterUser(User user);
    Task<bool> NickNameExist(string nickName);
    Task<bool> EmailExist(string email);
    Task<User?> GetUser(string email);
    Task<Role?> GetDefaultRegisterUserRole();
}
