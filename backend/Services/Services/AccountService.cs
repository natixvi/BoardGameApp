using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Domain.IRepositories;
using Microsoft.AspNetCore.Identity;
using Services.DTOs.User;
using Services.Interfaces;

namespace Services.Services;
public class AccountService : IAccountService
{
    private readonly IAccountRepository accountRepository;
    private readonly IPasswordHasher<User> passwordHasher;
    private readonly IMapper mapper;

    public AccountService(IAccountRepository accountRepository, IPasswordHasher<User> passwordHasher, IMapper mapper) 
    {
        this.accountRepository = accountRepository;
        this.passwordHasher = passwordHasher;
        this.mapper = mapper;
    }

    public async Task RegisterUserAsync(RegisterUserDto registerUserDto)
    {
        //Najpier chcemy sprawdzic czy uzytkownik o danym nicku juz nie itsniej pozniej sprawdzaymy email
        Console.WriteLine(registerUserDto.NickName);
        if (await accountRepository.NickNameExist(registerUserDto.NickName)) throw new DuplicateUserDataException("This nickname already exist.");
        if (await accountRepository.EmailExist(registerUserDto.Email)) throw new DuplicateUserDataException("For this email already exisits account");

        if (registerUserDto.Password != registerUserDto.ConfirmPassword) throw new PasswordsMustBeTheSameException("Passwords are diffrents");

        var user = mapper.Map<User>(registerUserDto);
        Console.WriteLine(user.NickName + "  " + user.Email+ "  "+  user.Password + "   "+  user.Role);
        var hashedPassword = passwordHasher.HashPassword(user, registerUserDto.Password);
        user.Password = hashedPassword;

        var defaultRole = accountRepository.GetDefaultRegisterUserRole();
        if (defaultRole == null) throw new RoleDoesntExistException("Cannot register user at this moment!");

        user.Role = defaultRole;

        await accountRepository.RegisterUser(user);
    }
}
