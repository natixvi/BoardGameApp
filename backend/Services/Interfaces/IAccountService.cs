using Services.DTOs.User;

namespace Services.Interfaces;
public interface IAccountService
{
    void RegisterUser(RegisterUserDto registerUserDto);
}
