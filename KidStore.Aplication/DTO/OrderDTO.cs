namespace KidStore.Application.DTO
{
    public class CreateOrderDTO
    {
        public string CustomerName { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string ShippingAddress { get; set; } = string.Empty;

        public string? Note { get; set; }

        public string PaymentMethod { get; set; } = "COD";
    }

    public class UpdateOrderStatusDTO
    {
        public string Status { get; set; } = string.Empty;
    }

    public class OrderResponseDTO
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string? CustomerEmail { get; set; }

        public string CustomerName { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string ShippingAddress { get; set; } = string.Empty;

        public string? Note { get; set; }

        public string PaymentMethod { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public decimal Subtotal { get; set; }

        public decimal ShippingFee { get; set; }

        public decimal TotalPrice { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<OrderItemResponseDTO> Items { get; set; } = new();
    }

    public class OrderItemResponseDTO
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public int ProductVariantId { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public string? SizeName { get; set; }

        public string? ColorName { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal LineTotal { get; set; }
    }
}
