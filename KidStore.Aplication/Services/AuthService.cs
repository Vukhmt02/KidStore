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
using System.Security.Cryptography;
using KidStore.Domain.Exceptions;

namespace KidStore.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(
    IUserRepository userRepository,
    IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto, string? ipAddress = null)
    {
        ValidateRegistration(dto);

        var email = dto.Email.Trim().ToLowerInvariant();
        var exists = await _userRepository.ExistsByEmailAsync(email);

        if (exists)
        {
            throw new ConflictException("Email đã tồn tại.");
        }

        var user = new User
        {
            FullName = dto.FullName.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            PhoneNumber = dto.PhoneNumber,
            Address = dto.Address,
            Role = 0,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);

        return await CreateAuthResponseAsync(user, ipAddress);
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role.ToString())
    };

        var jwtKey = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key chưa được cấu hình.");

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey));

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
        var user = await _userRepository.GetByEmailAsync(dto.Email.Trim().ToLowerInvariant());
        if (user == null)
        {
            throw new UnauthorizedException("Email hoặc mật khẩu không đúng.");
        }

        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(
            dto.Password,
            user.PasswordHash
        );

        if (!isPasswordValid)
        {
            throw new UnauthorizedException("Email hoặc mật khẩu không đúng.");
        }

        if (!user.IsActive)
        {
            throw new ForbiddenException("Tài khoản đã bị khóa.");
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return await CreateAuthResponseAsync(user, ipAddress);
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, string? ipAddress = null)
    {
        var storedToken = await _userRepository.GetActiveRefreshTokenByHashAsync(HashToken(refreshToken));

        if (storedToken == null || !storedToken.IsActive)
        {
            throw new UnauthorizedException("Refresh token không hợp lệ hoặc đã hết hạn.");
        }

        if (!storedToken.User.IsActive)
        {
            throw new ForbiddenException("Tài khoản đã bị khóa.");
        }

        await _userRepository.RevokeRefreshTokenAsync(storedToken, ipAddress);

        return await CreateAuthResponseAsync(storedToken.User, ipAddress);
    }

    public async Task LogoutAsync(string refreshToken, string? ipAddress = null)
    {
        var storedToken = await _userRepository.GetActiveRefreshTokenByHashAsync(HashToken(refreshToken));

        if (storedToken != null)
        {
            await _userRepository.RevokeRefreshTokenAsync(storedToken, ipAddress);
        }
    }

    public async Task ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        ValidateNewPassword(dto);

        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new NotFoundException("Người dùng", userId);

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
        {
            throw new UnauthorizedException("Mật khẩu hiện tại không đúng.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _userRepository.UpdateAsync(user);
        await _userRepository.RevokeAllRefreshTokensAsync(userId);
    }

    public async Task<UserInfoDto> GetMeAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new NotFoundException("Người dùng", userId);

        return MapUser(user);
    }

    public async Task<UserInfoDto> UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new NotFoundException("Người dùng", userId);

        user.PhoneNumber = string.IsNullOrWhiteSpace(dto.PhoneNumber) ? null : dto.PhoneNumber.Trim();
        user.Address = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim();

        await _userRepository.UpdateAsync(user);

        return MapUser(user);
    }

    private async Task<AuthResponseDto> CreateAuthResponseAsync(User user, string? ipAddress)
    {
        var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        await _userRepository.AddRefreshTokenAsync(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = HashToken(refreshToken),
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedByIp = ipAddress
        });

        return new AuthResponseDto
        {
            AccessToken = GenerateJwtToken(user),
            RefreshToken = refreshToken,
            ExpiresIn = 3600,
            User = MapUser(user)
        };
    }

    private static string HashToken(string token)
    {
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
    }

    private static void ValidateRegistration(RegisterDto dto)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(dto.FullName))
            errors["fullName"] = new[] { "Họ tên không được để trống." };

        if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains('@'))
            errors["email"] = new[] { "Email không hợp lệ." };

        if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
            errors["password"] = new[] { "Mật khẩu phải có ít nhất 6 ký tự." };

        if (errors.Count > 0)
            throw new ApplicationValidationException(errors);
    }

    private static void ValidateNewPassword(ChangePasswordDto dto)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(dto.NewPassword) || dto.NewPassword.Length < 6)
            errors["newPassword"] = new[] { "Mật khẩu mới phải có ít nhất 6 ký tự." };

        if (dto.NewPassword != dto.ConfirmNewPassword)
            errors["confirmNewPassword"] = new[] { "Mật khẩu xác nhận không khớp." };

        if (errors.Count > 0)
            throw new ApplicationValidationException(errors);
    }

    private static UserInfoDto MapUser(User user)
    {
        return new UserInfoDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Address = user.Address,
            Role = user.Role,
            RoleName = user.Role == 1 ? "Admin" : "Customer"
        };
    }
}
