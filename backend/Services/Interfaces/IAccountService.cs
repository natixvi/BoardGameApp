using Domain.Entities;
using Services.DTOs.User;

namespace Services.Interfaces;
public interface IAccountService
{
    Task RegisterUserAsync(RegisterUserDto registerUserDto);
}
