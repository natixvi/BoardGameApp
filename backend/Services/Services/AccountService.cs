using Domain.Entities;
using Microsoft.AspNetCore.Identity;


namespace Services.Services;
public class AccountService
{
    private readonly IPasswordHasher<User> passwordHasher;

    //private readonly JwtSettings jwtSettings;

    public AccountService(IPasswordHasher<User> passwordHasher)
    {
        this.passwordHasher = passwordHasher;
    }
}
