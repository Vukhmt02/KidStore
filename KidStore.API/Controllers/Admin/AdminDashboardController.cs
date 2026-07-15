using KidStore.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KidStore.API.Controllers.Admin;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "1")]
public class AdminDashboardController : ControllerBase
{
    private readonly DashboardService _dashboardService;

    public AdminDashboardController(DashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    /// <summary>Thống kê tổng quan kinh doanh (Admin).</summary>
    [HttpGet]
    public async Task<IActionResult> GetStats()
    {
        return Ok(await _dashboardService.GetStatsAsync());
    }
}
