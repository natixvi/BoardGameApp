using Domain.Entities;
using System;

namespace Domain.IRepositories;
public interface IAccountRepository : IBaseRepository<User>
{
    Task RegisterUser(User user);
    Task<bool> NickNameExist(string nickName);
    Task<bool> EmailExist(string email);
    Task<User?> GetUserByEmail(string email);
    Task<User?> GetUserById(int id);
    Task<int> GetDefaultRegisterUserRole();
    Task<List<User>> GetUsers();
    Task<bool> CheckIfUserExist(int userId);
}
