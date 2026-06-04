namespace KidStore.Application.DTO
{
    public class AddCartItemDTO
    {
        public int ProductVariantId { get; set; }

        public int Quantity { get; set; }
    }

    public class UpdateCartItemDTO
    {
        public int Quantity { get; set; }
    }

    public class CartResponseDTO
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public List<CartItemResponseDTO> Items { get; set; } = new();

        public decimal TotalPrice { get; set; }
    }

    public class CartItemResponseDTO
    {
        public int Id { get; set; }

        public int ProductVariantId { get; set; }

        public int ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public string? SizeName { get; set; }

        public string? ColorName { get; set; }

        public int Quantity { get; set; }

        public int StockQuantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal LineTotal { get; set; }
    }
}
