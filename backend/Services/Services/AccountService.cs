﻿using AutoMapper;
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
    private readonly IUserContextService userContextService;
    private readonly IUserBoardGameService userBoardGameService;

    public AccountService(IAccountRepository accountRepository, IPasswordHasher<User> passwordHasher, IMapper mapper, IJwtService jwtService, IUserContextService userContextService, IUserBoardGameService userBoardGameService) 
    {
        this.accountRepository = accountRepository;
        this.passwordHasher = passwordHasher;
        this.mapper = mapper;
        this.jwtService = jwtService;
        this.userContextService = userContextService;
        this.userBoardGameService = userBoardGameService;
    }

    public async Task<string?> LoginUser(LoginUserDto loginUser)
    {
        var user = await accountRepository.GetUserByEmail(loginUser.Email);
        if (user == null) throw new BadRequestException("Invalid email or password");

        var verifyPassword = passwordHasher.VerifyHashedPassword(user, user.Password, loginUser.Password);
        if(verifyPassword == PasswordVerificationResult.Failed) throw new BadRequestException("Invalid email or password");

        var token = jwtService.GenerateJwtToken(user);
        return token;
    }

    public async Task RegisterUser(RegisterUserDto registerUserDto)
    {
        if (await accountRepository.NickNameExist(registerUserDto.NickName)) throw new DuplicateDataException("This nickname is already taken.");
        if (await accountRepository.EmailExist(registerUserDto.Email)) throw new DuplicateDataException("For this email there is already an account.");

        if (registerUserDto.Password != registerUserDto.ConfirmPassword) throw new PasswordsMustBeTheSameException("Passwords must be the same!");

        var user = mapper.Map<User>(registerUserDto);
        var hashedPassword = passwordHasher.HashPassword(user, registerUserDto.Password);
        user.Password = hashedPassword;

        var defaultRoleId = await accountRepository.GetDefaultRegisterUserRole();
        user.RoleId = defaultRoleId;

        await accountRepository.RegisterUser(user);
    }

    public async Task<UserInfoDto> GetUser()
    {
        var user = await IfUserExist();
        return mapper.Map<UserInfoDto>(user);

    }

    public async Task<string?> UpdateUser (UpdateUserDto updateUserDto)
    {

        var user = await IfUserExist();

        if (user.Email != updateUserDto.Email)
        {
            if (await accountRepository.EmailExist(updateUserDto.Email)) throw new DuplicateDataException("For this email there is already an account.");
            user.Email = updateUserDto.Email;
        }

        Console.WriteLine(user.NickName + "  dto: " + updateUserDto.NickName);
        if (user.NickName != updateUserDto.NickName)
        {
            if (await accountRepository.NickNameExist(updateUserDto.NickName)) throw new DuplicateDataException("This nickname is already taken.");
            user.NickName = updateUserDto.NickName;
        }
        await accountRepository.Update(user);   

        var token = jwtService.GenerateJwtToken(user);
        return token;
    }

    public async Task UpdateUserPassword(ChangePasswordDto updateUserPasswordDto)
    {
        var user = await IfUserExist();

        var verifyPassword = passwordHasher.VerifyHashedPassword(user, user.Password, updateUserPasswordDto.OldPassword);
        if (verifyPassword == PasswordVerificationResult.Failed) throw new BadRequestException("Invalid old password");  

        if (updateUserPasswordDto.Password != updateUserPasswordDto.ConfirmPassword) throw new PasswordsMustBeTheSameException("Passwords must be the same!");
        var hashedPassword = passwordHasher.HashPassword(user, updateUserPasswordDto.Password);
        user.Password = hashedPassword;

        await accountRepository.Update(user);

    }

    public async Task DeleteAccount()
    {
        var user = await IfUserExist();
        await accountRepository.Delete(user);
    }

    public async Task<UserDto> GetUserById(int id)
    {
        var user = await accountRepository.GetUserById(id);
        if (user == null) throw new NotFoundException("User not found!");

        var usersDto = mapper.Map<UserDto>(user);
        if(usersDto.UserBoardGames != null)
        {
            foreach (var game in usersDto.UserBoardGames)
            {
                game.Rating = await userBoardGameService.CalculateAverageRating(game.BoardGameId);
            }
        }
      
        return usersDto;
    }
    public async Task<List<UserDto>> GetUsers()
    {
        var users = await accountRepository.GetUsers();
        return mapper.Map<List<UserDto>>(users);
    }


    private async Task<User> IfUserExist()
    {
        var userId = userContextService.GetUserId;
        if (userId == null) throw new UnathorizedException("Incorrect or missing user ID, no authorization!");
        var user = await accountRepository.GetUserById((int)userId);
        if (user == null) throw new NotFoundException("User not found!");
        return user;
    }
 
}
