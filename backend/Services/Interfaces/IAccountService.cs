using Services.DTOs.User;
using System.Threading.Tasks;

namespace Services.Interfaces;
public interface IAccountService
{
    Task RegisterUser(RegisterUserDto registerUserDto);
    Task<string?> LoginUser(LoginUserDto loginUser);
    Task<string?> UpdateUser(UpdateUserDto updateUserDto);
    Task UpdateUserPassword(UpdateUserPasswordDto updateUserPasswordDto);
    Task DeleteAccount();
}
