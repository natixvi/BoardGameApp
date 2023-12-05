using Services.DTOs.User;

namespace Services.Interfaces;
public interface IAccountService
{
    Task RegisterUser(RegisterUserDto registerUserDto);
    Task<string?> LoginUser(LoginUserDto loginUser);
}
