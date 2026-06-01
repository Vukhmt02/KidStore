using KidStore.Application.DTO;
using KidStore.Application.Interfaces;
using KidStore.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.Extensions.Configuration;

namespace KidStore.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    //public AuthService(IUserRepository userRepository)
    //{
    //    _userRepository = userRepository;
    //}
    public AuthService(
    IUserRepository userRepository,
    IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto, string? ipAddress = null)
    {
        var exists = await _userRepository.ExistsByEmailAsync(dto.Email);

        if (exists)
        {
            throw new Exception("Email already exists");
        }

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            PhoneNumber = dto.PhoneNumber,
            Address = dto.Address,
            Role = 0,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);

        return new AuthResponseDto
        {
            AccessToken = "demo-token"
        };
    }
    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role.ToString())
    };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"]));

        var creds = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }



    public async Task<AuthResponseDto> LoginAsync(LoginDto dto, string? ipAddress = null)
    {

        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user == null)
        {
            throw new Exception("Invalid email or password");
        }

        // Kiểm tra password
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(
            dto.Password,
            user.PasswordHash
        );

        if (!isPasswordValid)
        {
            throw new Exception("Invalid email or password");
        }

        return new AuthResponseDto
        {
            AccessToken = GenerateJwtToken(user),
            RefreshToken = "refresh-token",
            ExpiresIn = 3600,

            User = new UserInfoDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role
            }
        };
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, string? ipAddress = null)
    {
        return new AuthResponseDto
        {
            AccessToken = "refreshed-access-token",
            RefreshToken = "refreshed-refresh-token"
        };
    }

    public Task LogoutAsync(string refreshToken, string? ipAddress = null)
    {
        throw new NotImplementedException();
    }

    public Task ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        throw new NotImplementedException();
    }

    public Task<UserInfoDto> GetMeAsync(int userId)
    {
        throw new NotImplementedException();
    }
}