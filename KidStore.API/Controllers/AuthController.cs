using KidStore.Application.DTO;
using KidStore.Application.Services;
using KidStore.Application.Interfaces;
using KidStore.API.Extensions;

//using KidStore.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace KidStore.API.Controllers;

[ApiController]
[Route("api/auth")]
[Produces("application/json")]
[DebuggerDisplay($"{{{nameof(GetDebuggerDisplay)}(),nq}}")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
        => _authService = authService;

    // ─────────────────────────────────────────────────────────────
    // POST /api/auth/register
    // ─────────────────────────────────────────────────────────────
    /// <summary>Đăng ký tài khoản mới (Customer).</summary>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var ip = GetIpAddress();
        var result = await _authService.RegisterAsync(dto, ip);

        SetRefreshTokenCookie(result.RefreshToken);
        result.RefreshToken = string.Empty;

        return StatusCode(StatusCodes.Status201Created, result);
    }

    // ─────────────────────────────────────────────────────────────
    // POST /api/auth/login
    // ─────────────────────────────────────────────────────────────
    /// <summary>Đăng nhập, nhận access token.</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var ip = GetIpAddress();
        var result = await _authService.LoginAsync(dto, ip);

        SetRefreshTokenCookie(result.RefreshToken);
        result.RefreshToken = string.Empty;

        return Ok(result);
    }

    // ─────────────────────────────────────────────────────────────
    // POST /api/auth/refresh
    // ─────────────────────────────────────────────────────────────
    /// <summary>Lấy access token mới từ refresh token (trong cookie).</summary>
    [HttpPost("refresh")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];

        if (string.IsNullOrWhiteSpace(refreshToken))
            return Unauthorized(new { message = "Refresh token không tồn tại." });

        var ip = GetIpAddress();
        var result = await _authService.RefreshTokenAsync(refreshToken, ip);

        SetRefreshTokenCookie(result.RefreshToken);
        result.RefreshToken = string.Empty;

        return Ok(result);
    }

    // ─────────────────────────────────────────────────────────────
    // POST /api/auth/logout
    // ─────────────────────────────────────────────────────────────
    /// <summary>Đăng xuất — thu hồi refresh token hiện tại.</summary>
    [HttpPost("logout")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        var ip = GetIpAddress();

        if (!string.IsNullOrWhiteSpace(refreshToken))
            await _authService.LogoutAsync(refreshToken, ip);

        Response.Cookies.Delete("refreshToken");

        return Ok(new { message = "Đăng xuất thành công." });
    }

    // ─────────────────────────────────────────────────────────────
    // GET /api/auth/me
    // ─────────────────────────────────────────────────────────────
    /// <summary>Lấy thông tin tài khoản đang đăng nhập.</summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserInfoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMe()
    {
        var userId = User.GetUserId();
        var result = await _authService.GetMeAsync(userId);
        return Ok(result);
    }

    // ─────────────────────────────────────────────────────────────
    // PUT /api/auth/change-password
    // ─────────────────────────────────────────────────────────────
    /// <summary>Đổi mật khẩu — bắt đăng nhập lại trên tất cả thiết bị.</summary>
    [HttpPut("change-password")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = User.GetUserId();
        await _authService.ChangePasswordAsync(userId, dto);

        Response.Cookies.Delete("refreshToken");

        return Ok(new { message = "Đổi mật khẩu thành công. Vui lòng đăng nhập lại." });
    }

    // ─────────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────────────────────
    private void SetRefreshTokenCookie(string token)
    {
        Response.Cookies.Append("refreshToken", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        });
    }

    private string? GetIpAddress()
    {
        if (Request.Headers.TryGetValue("X-Forwarded-For", out var forwarded))
            return forwarded.FirstOrDefault()?.Split(',')[0].Trim();

        return HttpContext.Connection.RemoteIpAddress?.ToString();
    }

    private string GetDebuggerDisplay()
    {
        return ToString();
    }
}
