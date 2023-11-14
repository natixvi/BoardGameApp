using Domain.IRepositories;
using Services.DTOs.User;
using Services.Interfaces;

namespace Services.Services;
public class AccountService : IAccountService
{
    private readonly IAccountRepository accountRepository;

    public AccountService(IAccountRepository accountRepository) 
    {
        this.accountRepository = accountRepository;
    }

    public void RegisterUser(RegisterUserDto registerUserDto)
    {
        
    }
}
