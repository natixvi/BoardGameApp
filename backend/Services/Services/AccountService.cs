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
    private readonly IJwtService jwtService;

    public AccountService(IAccountRepository accountRepository, IPasswordHasher<User> passwordHasher, IMapper mapper, IJwtService jwtService) 
    {
        this.accountRepository = accountRepository;
        this.passwordHasher = passwordHasher;
        this.mapper = mapper;
        this.jwtService = jwtService;
    }

    public async Task<string?> LoginUser(LoginUserDto loginUser)
    {
        var user = await accountRepository.GetUser(loginUser.Email);
        if (user == null) throw new BadRequestException("Invalid email or password");

        var verifyPassword = passwordHasher.VerifyHashedPassword(user, user.Password, loginUser.Password);
        if(verifyPassword == PasswordVerificationResult.Failed) throw new BadRequestException("Invalid email or password");

        var token = jwtService.GenerateJwtToken(user);
        return token;
    }

    public async Task RegisterUserAsync(RegisterUserDto registerUserDto)
    {
        if (await accountRepository.NickNameExist(registerUserDto.NickName)) throw new DuplicateUserDataException("This nickname is already taken.");
        if (await accountRepository.EmailExist(registerUserDto.Email)) throw new DuplicateUserDataException("For this email there is already an account.");

        if (registerUserDto.Password != registerUserDto.ConfirmPassword) throw new PasswordsMustBeTheSameException("Passwords must be the same!");

        var user = mapper.Map<User>(registerUserDto);
        var hashedPassword = passwordHasher.HashPassword(user, registerUserDto.Password);
        user.Password = hashedPassword;

        var defaultRole = await accountRepository.GetDefaultRegisterUserRole();
        if (defaultRole == null) throw new RoleDoesntExistException("Cannot register user at this moment!");

        user.Role = defaultRole;

        await accountRepository.RegisterUser(user);
    }

    
}
