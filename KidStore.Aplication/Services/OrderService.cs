using KidStore.Application.DTO;
using KidStore.Application.Interfaces;
using KidStore.Domain.Entities;
using KidStore.Domain.Exceptions;

namespace KidStore.Application.Services
{
    public class OrderService
    {
        private const decimal ShippingFee = 25000m;

        private readonly ICartRepository _cartRepository;
        private readonly IOrderRepository _orderRepository;

        public OrderService(ICartRepository cartRepository, IOrderRepository orderRepository)
        {
            _cartRepository = cartRepository;
            _orderRepository = orderRepository;
        }

        public async Task<OrderResponseDTO> CreateFromCartAsync(int userId, CreateOrderDTO dto)
        {
            ValidateOrder(dto);

            var cart = await _cartRepository.GetByUserIdAsync(userId)
                ?? throw new ConflictException("Gio hang dang trong.");

            if (cart.Items.Count == 0)
                throw new ConflictException("Gio hang dang trong.");

            var orderItems = new List<OrderItem>();

            foreach (var cartItem in cart.Items)
            {
                var variant = cartItem.ProductVariant;
                var product = variant.Product
                    ?? throw new NotFoundException("San pham", variant.ProductId);

                if (!product.IsActive)
                    throw new ConflictException($"San pham '{product.Name}' hien khong con duoc ban.");

                if (cartItem.Quantity > variant.StockQuantity)
                    throw new ConflictException($"San pham '{product.Name}' chi con {variant.StockQuantity} san pham trong kho.");

                var unitPrice = GetEffectiveProductPrice(product) + variant.ExtraPrice;

                variant.StockQuantity -= cartItem.Quantity;

                orderItems.Add(new OrderItem
                {
                    ProductId = product.Id,
                    ProductVariantId = variant.Id,
                    ProductName = product.Name,
                    SizeName = variant.Size?.Name,
                    ColorName = variant.Color?.Name,
                    Quantity = cartItem.Quantity,
                    UnitPrice = unitPrice,
                    LineTotal = unitPrice * cartItem.Quantity
                });
            }

            var subtotal = orderItems.Sum(item => item.LineTotal);
            var order = new Order
            {
                UserId = userId,
                CustomerName = dto.CustomerName.Trim(),
                PhoneNumber = dto.PhoneNumber.Trim(),
                ShippingAddress = dto.ShippingAddress.Trim(),
                Note = string.IsNullOrWhiteSpace(dto.Note) ? null : dto.Note.Trim(),
                PaymentMethod = string.IsNullOrWhiteSpace(dto.PaymentMethod) ? "COD" : dto.PaymentMethod.Trim(),
                Status = "Pending",
                Subtotal = subtotal,
                ShippingFee = ShippingFee,
                TotalPrice = subtotal + ShippingFee,
                CreatedAt = DateTime.UtcNow,
                Items = orderItems
            };

            await _orderRepository.AddAsync(order);

            foreach (var cartItem in cart.Items.ToList())
            {
                cart.Items.Remove(cartItem);
                _cartRepository.RemoveItem(cartItem);
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await _orderRepository.SaveChangesAsync();

            return MapOrder(order);
        }

        public async Task<List<OrderResponseDTO>> GetMyOrdersAsync(int userId)
        {
            var orders = await _orderRepository.GetByUserIdAsync(userId);

            return orders.Select(MapOrder).ToList();
        }

        public async Task<OrderResponseDTO> GetMyOrderByIdAsync(int userId, int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId)
                ?? throw new NotFoundException("Don hang", orderId);

            if (order.UserId != userId)
                throw new ForbiddenException("Ban khong co quyen xem don hang nay.");

            return MapOrder(order);
        }

        private static void ValidateOrder(CreateOrderDTO dto)
        {
            var errors = new Dictionary<string, string[]>();

            if (string.IsNullOrWhiteSpace(dto.CustomerName))
                errors["customerName"] = new[] { "Ho ten khong duoc de trong." };

            if (string.IsNullOrWhiteSpace(dto.PhoneNumber))
                errors["phoneNumber"] = new[] { "So dien thoai khong duoc de trong." };

            if (string.IsNullOrWhiteSpace(dto.ShippingAddress))
                errors["shippingAddress"] = new[] { "Dia chi giao hang khong duoc de trong." };

            if (errors.Count > 0)
                throw new ApplicationValidationException(errors);
        }

        private static decimal GetEffectiveProductPrice(Product product)
        {
            var discountAmount = product.DiscountPrice.GetValueOrDefault();

            if (discountAmount <= 0)
                return product.Price;

            return Math.Max(0, product.Price - discountAmount);
        }

        private static OrderResponseDTO MapOrder(Order order)
        {
            return new OrderResponseDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                CustomerName = order.CustomerName,
                PhoneNumber = order.PhoneNumber,
                ShippingAddress = order.ShippingAddress,
                Note = order.Note,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status,
                Subtotal = order.Subtotal,
                ShippingFee = order.ShippingFee,
                TotalPrice = order.TotalPrice,
                CreatedAt = order.CreatedAt,
                Items = order.Items.Select(item => new OrderItemResponseDTO
                {
                    Id = item.Id,
                    ProductId = item.ProductId,
                    ProductVariantId = item.ProductVariantId,
                    ProductName = item.ProductName,
                    SizeName = item.SizeName,
                    ColorName = item.ColorName,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    LineTotal = item.LineTotal
                }).ToList()
            };
        }
    }
}
