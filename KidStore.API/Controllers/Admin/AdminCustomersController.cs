using KidStore.Application.DTO;
using KidStore.Application.Interfaces;
using KidStore.Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KidStore.API.Controllers.Admin;

[ApiController]
[Route("api/admin/customers")]
[Authorize(Roles = "1")]
public class AdminCustomersController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public AdminCustomersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    /// <summary>Lấy danh sách tất cả khách hàng (Role = 0).</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userRepository.GetAllCustomersAsync();

        var result = users.Select(u => new CustomerResponseDTO
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            PhoneNumber = u.PhoneNumber,
            Address = u.Address,
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt,
            LastLoginAt = u.LastLoginAt,
            TotalOrders = u.Orders.Count,
            TotalSpent = u.Orders
                .Where(o => o.Status == "Delivered")
                .Sum(o => o.TotalPrice)
        });

        return Ok(result);
    }

    /// <summary>Khóa hoặc mở khóa tài khoản khách hàng.</summary>
    [HttpPut("{id:int}/toggle-active")]
    public async Task<IActionResult> ToggleActive(int id)
    {
        var success = await _userRepository.ToggleActiveAsync(id);

        if (!success)
            throw new NotFoundException("Khách hàng", id);

        // Lấy lại thông tin user sau khi toggle
        var user = await _userRepository.GetByIdAsync(id);

        return Ok(new
        {
            id = user!.Id,
            isActive = user.IsActive,
            message = user.IsActive
                ? "Tài khoản đã được mở khóa."
                : "Tài khoản đã bị khóa và tất cả phiên đăng nhập bị thu hồi."
        });
    }
}
