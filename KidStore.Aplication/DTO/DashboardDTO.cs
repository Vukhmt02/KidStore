namespace KidStore.Application.DTO
{
    public class DashboardStatsDTO
    {
        // Tổng quan
        public decimal TotalRevenue { get; set; }
        public decimal RevenueToday { get; set; }
        public decimal RevenueThisMonth { get; set; }

        // Đơn hàng
        public int TotalOrders { get; set; }
        public int OrdersToday { get; set; }
        public int OrdersPending { get; set; }
        public int OrdersConfirmed { get; set; }
        public int OrdersShipping { get; set; }
        public int OrdersDelivered { get; set; }
        public int OrdersCancelled { get; set; }

        // Sản phẩm & khách hàng
        public int TotalProducts { get; set; }
        public int ActiveProducts { get; set; }
        public int TotalCustomers { get; set; }
        public int NewCustomersToday { get; set; }
        public int NewCustomersThisMonth { get; set; }

        // Đơn hàng gần đây
        public List<RecentOrderDTO> RecentOrders { get; set; } = new();

        // Sản phẩm bán chạy nhất
        public List<TopProductDTO> TopProducts { get; set; } = new();

        // Doanh thu 7 ngày gần nhất
        public List<RevenueDayDTO> RevenueChart { get; set; } = new();
    }

    public class RecentOrderDTO
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string? CustomerEmail { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class TopProductDTO
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int TotalSold { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class RevenueDayDTO
    {
        public string Date { get; set; } = string.Empty;   // "dd/MM"
        public decimal Revenue { get; set; }
        public int Orders { get; set; }
    }
}
