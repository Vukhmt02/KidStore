using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KidStore.Application.DTO;

namespace KidStore.Application.Interfaces
{
    /// <summary>Service xác thực và phép cấp người dùng.</summary>
    public interface IAuthService
    {
        /// <summary>Đăng ký tài khoản mới.</summary>
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto, string? ipAddress = null);

        /// <summary>Đăng nhập và nhận access token.</summary>
        Task<AuthResponseDto> LoginAsync(LoginDto dto, string? ipAddress = null);

        /// <summary>Làm mới access token từ refresh token.</summary>
        Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, string? ipAddress = null);

        /// <summary>Đăng xuất - thu hồi refresh token.</summary>
        Task LogoutAsync(string refreshToken, string? ipAddress = null);

        /// <summary>Thay đổi mật khẩu người dùng.</summary>
        Task ChangePasswordAsync(int userId, ChangePasswordDto dto);

        /// <summary>Lấy thông tin người dùng hiện tại.</summary>
        Task<UserInfoDto> GetMeAsync(int userId);
    }
}
