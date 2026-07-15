using KidStore.Application.DTO;
using KidStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KidStore.Infrastructure.Services
{
    public class DashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDTO> GetStatsAsync()
        {
            var now = DateTime.UtcNow;
            var todayStart = now.Date;
            var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            // ── Đơn hàng ─────────────────────────────────────────
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items)
                .AsNoTracking()
                .ToListAsync();

            var deliveredOrders = orders.Where(o => o.Status == "Delivered").ToList();

            var totalRevenue = deliveredOrders.Sum(o => o.TotalPrice);
            var revenueToday = deliveredOrders
                .Where(o => o.CreatedAt >= todayStart)
                .Sum(o => o.TotalPrice);
            var revenueThisMonth = deliveredOrders
                .Where(o => o.CreatedAt >= monthStart)
                .Sum(o => o.TotalPrice);

            // ── Khách hàng ─────────────────────────────────────
            var customers = await _context.Users
                .AsNoTracking()
                .Where(u => u.Role == 0)
                .Select(u => new { u.CreatedAt })
                .ToListAsync();

            // ── Sản phẩm ──────────────────────────────────────
            var products = await _context.Products
                .AsNoTracking()
                .Select(p => new { p.IsActive })
                .ToListAsync();

            // ── Top sản phẩm bán chạy ─────────────────────────
            var topProducts = await _context.OrderItems
                .AsNoTracking()
                .GroupBy(item => new { item.ProductId, item.ProductName })
                .Select(g => new TopProductDTO
                {
                    ProductId = g.Key.ProductId,
                    ProductName = g.Key.ProductName,
                    TotalSold = g.Sum(i => i.Quantity),
                    TotalRevenue = g.Sum(i => i.LineTotal)
                })
                .OrderByDescending(x => x.TotalSold)
                .Take(5)
                .ToListAsync();

            // ── Đơn hàng gần đây (10 đơn mới nhất) ───────────
            var recentOrders = orders
                .OrderByDescending(o => o.CreatedAt)
                .Take(10)
                .Select(o => new RecentOrderDTO
                {
                    Id = o.Id,
                    CustomerName = o.CustomerName,
                    CustomerEmail = o.User?.Email,
                    Status = o.Status,
                    TotalPrice = o.TotalPrice,
                    CreatedAt = o.CreatedAt
                })
                .ToList();

            // ── Doanh thu 7 ngày gần nhất ─────────────────────
            var revenueChart = Enumerable.Range(0, 7)
                .Select(i =>
                {
                    var day = todayStart.AddDays(-i);
                    var dayRevenue = deliveredOrders
                        .Where(o => o.CreatedAt >= day && o.CreatedAt < day.AddDays(1))
                        .Sum(o => o.TotalPrice);
                    var dayOrders = orders
                        .Count(o => o.CreatedAt >= day && o.CreatedAt < day.AddDays(1));

                    return new RevenueDayDTO
                    {
                        Date = day.ToString("dd/MM"),
                        Revenue = dayRevenue,
                        Orders = dayOrders
                    };
                })
                .Reverse()
                .ToList();

            return new DashboardStatsDTO
            {
                TotalRevenue = totalRevenue,
                RevenueToday = revenueToday,
                RevenueThisMonth = revenueThisMonth,

                TotalOrders = orders.Count,
                OrdersToday = orders.Count(o => o.CreatedAt >= todayStart),
                OrdersPending = orders.Count(o => o.Status == "Pending"),
                OrdersConfirmed = orders.Count(o => o.Status == "Confirmed"),
                OrdersShipping = orders.Count(o => o.Status == "Shipping"),
                OrdersDelivered = orders.Count(o => o.Status == "Delivered"),
                OrdersCancelled = orders.Count(o => o.Status == "Cancelled"),

                TotalProducts = products.Count,
                ActiveProducts = products.Count(p => p.IsActive),
                TotalCustomers = customers.Count,
                NewCustomersToday = customers.Count(c => c.CreatedAt >= todayStart),
                NewCustomersThisMonth = customers.Count(c => c.CreatedAt >= monthStart),

                RecentOrders = recentOrders,
                TopProducts = topProducts,
                RevenueChart = revenueChart
            };
        }
    }
}
