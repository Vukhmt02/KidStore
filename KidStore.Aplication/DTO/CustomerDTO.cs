namespace KidStore.Application.DTO
{
    public class CustomerResponseDTO
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }

        // Thống kê đơn hàng của khách
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
    }
}
