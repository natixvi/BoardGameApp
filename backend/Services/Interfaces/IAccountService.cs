using Services.DTOs.User;

namespace Services.Interfaces;
public interface IAccountService
{
    Task RegisterUser(RegisterUserDto registerUserDto);
    Task<string?> LoginUser(LoginUserDto loginUser);
    Task<UserInfoDto> GetUser();
    Task<string?> UpdateUser(UpdateUserDto updateUserDto);
    Task UpdateUserPassword(ChangePasswordDto updateUserPasswordDto);
    Task DeleteAccount();
    Task<UserDto> GetUserById(int id);
    Task<List<UserDto>> GetUsers();
}
