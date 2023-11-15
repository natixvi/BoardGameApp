using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.IRepositories;
public interface IAccountRepository
{
    Task RegisterUser(User user);
    Task<bool> NickNameExist(string nickName);
    Task<bool> EmailExist(string email);
    Role? GetDefaultRegisterUserRole();
}
