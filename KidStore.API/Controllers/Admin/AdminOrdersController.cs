using KidStore.Application.DTO;
using KidStore.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KidStore.API.Controllers.Admin;

[ApiController]
[Route("api/admin/orders")]
[Authorize(Roles = "1")]
public class AdminOrdersController : ControllerBase
{
    private readonly OrderService _orderService;

    public AdminOrdersController(OrderService orderService)
    {
        _orderService = orderService;
    }

    /// <summary>Lấy tất cả đơn hàng (Admin).</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _orderService.GetAllOrdersAsync());
    }

    /// <summary>Lấy chi tiết đơn hàng theo ID (Admin).</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await _orderService.GetOrderByIdAsync(id));
    }

    /// <summary>Cập nhật trạng thái đơn hàng (Admin).</summary>
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateOrderStatusDTO dto)
    {
        var order = await _orderService.UpdateOrderStatusAsync(id, dto);

        return Ok(order);
    }
}
