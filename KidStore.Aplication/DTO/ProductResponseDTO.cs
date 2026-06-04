namespace KidStore.Application.DTO;

public class ProductResponseDTO
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<ProductVariantResponseDTO> Variants { get; set; } = new();
    public List<ProductImageResponseDTO> Images { get; set; } = new();
}

public class ProductVariantResponseDTO
{
    public int Id { get; set; }
    public int SizeId { get; set; }
    public string? SizeName { get; set; }
    public int ColorId { get; set; }
    public string? ColorName { get; set; }
    public int StockQuantity { get; set; }
    public decimal ExtraPrice { get; set; }
}

public class ProductImageResponseDTO
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsMain { get; set; }
    public int SortOrder { get; set; }
}
