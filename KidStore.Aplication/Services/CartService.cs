using KidStore.Application.DTO;
using KidStore.Application.Interfaces;
using KidStore.Domain.Entities;
using KidStore.Domain.Exceptions;

namespace KidStore.Application.Services
{
    public class CartService
    {
        private readonly ICartRepository _cartRepository;

        public CartService(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }

        public async Task<CartResponseDTO> GetAsync(int userId)
        {
            var cart = await _cartRepository.GetByUserIdAsync(userId);

            return cart == null
                ? new CartResponseDTO { UserId = userId }
                : MapCart(cart);
        }

        public async Task<CartResponseDTO> AddItemAsync(int userId, AddCartItemDTO dto)
        {
            ValidateQuantity(dto.Quantity);

            var variant = await _cartRepository.GetProductVariantByIdAsync(dto.ProductVariantId)
                ?? throw new NotFoundException("Biến thể sản phẩm", dto.ProductVariantId);

            if (variant.Product?.IsActive != true)
                throw new ConflictException("Sản phẩm hiện không còn được bán.");

            var cart = await _cartRepository.GetByUserIdAsync(userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                await _cartRepository.AddCartAsync(cart);
            }

            var item = cart.Items.FirstOrDefault(x => x.ProductVariantId == dto.ProductVariantId);
            var newQuantity = (item?.Quantity ?? 0) + dto.Quantity;

            ValidateStock(variant, newQuantity);

            if (item == null)
            {
                await _cartRepository.AddItemAsync(new CartItem
                {
                    Cart = cart,
                    ProductVariantId = dto.ProductVariantId,
                    Quantity = dto.Quantity
                });
            }
            else
            {
                item.Quantity = newQuantity;
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await _cartRepository.SaveChangesAsync();

            return MapCart((await _cartRepository.GetByUserIdAsync(userId))!);
        }

        public async Task<CartResponseDTO> UpdateItemAsync(int userId, int cartItemId, UpdateCartItemDTO dto)
        {
            ValidateQuantity(dto.Quantity);

            var cart = await _cartRepository.GetByUserIdAsync(userId)
                ?? throw new NotFoundException("Giỏ hàng không tồn tại.");

            var item = cart.Items.FirstOrDefault(x => x.Id == cartItemId)
                ?? throw new NotFoundException("Sản phẩm trong giỏ hàng", cartItemId);

            ValidateStock(item.ProductVariant, dto.Quantity);

            item.Quantity = dto.Quantity;
            cart.UpdatedAt = DateTime.UtcNow;
            await _cartRepository.SaveChangesAsync();

            return MapCart(cart);
        }

        public async Task<CartResponseDTO> RemoveItemAsync(int userId, int cartItemId)
        {
            var cart = await _cartRepository.GetByUserIdAsync(userId)
                ?? throw new NotFoundException("Giỏ hàng không tồn tại.");

            var item = cart.Items.FirstOrDefault(x => x.Id == cartItemId)
                ?? throw new NotFoundException("Sản phẩm trong giỏ hàng", cartItemId);

            cart.Items.Remove(item);
            _cartRepository.RemoveItem(item);
            cart.UpdatedAt = DateTime.UtcNow;
            await _cartRepository.SaveChangesAsync();

            return MapCart(cart);
        }

        private static void ValidateQuantity(int quantity)
        {
            if (quantity <= 0)
            {
                throw new ApplicationValidationException(new Dictionary<string, string[]>
                {
                    ["quantity"] = new[] { "Số lượng phải lớn hơn 0." }
                });
            }
        }

        private static void ValidateStock(ProductVariant variant, int requestedQuantity)
        {
            if (requestedQuantity > variant.StockQuantity)
            {
                throw new ConflictException($"Sản phẩm chỉ còn {variant.StockQuantity} sản phẩm trong kho.");
            }
        }

        private static CartResponseDTO MapCart(Cart cart)
        {
            var items = cart.Items.Select(item =>
            {
                var variant = item.ProductVariant;
                var product = variant.Product!;
                var unitPrice = GetEffectiveProductPrice(product) + variant.ExtraPrice;

                return new CartItemResponseDTO
                {
                    Id = item.Id,
                    ProductVariantId = variant.Id,
                    ProductId = product.Id,
                    ProductName = product.Name,
                    ImageUrl = product.Images
                        .OrderByDescending(image => image.IsMain)
                        .ThenBy(image => image.SortOrder)
                        .Select(image => image.ImageUrl)
                        .FirstOrDefault(),
                    SizeName = variant.Size?.Name,
                    ColorName = variant.Color?.Name,
                    Quantity = item.Quantity,
                    StockQuantity = variant.StockQuantity,
                    UnitPrice = unitPrice,
                    LineTotal = unitPrice * item.Quantity
                };
            }).ToList();

            return new CartResponseDTO
            {
                Id = cart.Id,
                UserId = cart.UserId,
                Items = items,
                TotalPrice = items.Sum(item => item.LineTotal)
            };
        }

        private static decimal GetEffectiveProductPrice(Product product)
        {
            var discountAmount = product.DiscountPrice.GetValueOrDefault();

            if (discountAmount <= 0)
                return product.Price;

            return Math.Max(0, product.Price - discountAmount);
        }
    }
}
