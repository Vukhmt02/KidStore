using KidStore.Application.DTO;
using KidStore.Application.Interfaces;
using KidStore.Domain.Entities;
using KidStore.Domain.Exceptions;

namespace KidStore.Application.Services
{
    public class OrderService
    {
        private const decimal ShippingFee = 25000m;

        private static readonly string[] ValidStatuses =
            { "Pending", "Confirmed", "Shipping", "Delivered", "Cancelled" };

        private readonly ICartRepository _cartRepository;
        private readonly IOrderRepository _orderRepository;

        public OrderService(ICartRepository cartRepository, IOrderRepository orderRepository)
        {
            _cartRepository = cartRepository;
            _orderRepository = orderRepository;
        }

        // ── Customer ──────────────────────────────────────────────

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

        // ── Admin ─────────────────────────────────────────────────

        public async Task<List<OrderResponseDTO>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetAllAsync();

            return orders.Select(MapOrder).ToList();
        }

        public async Task<OrderResponseDTO> GetOrderByIdAsync(int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId)
                ?? throw new NotFoundException("Đơn hàng", orderId);

            return MapOrder(order);
        }

        public async Task<OrderResponseDTO> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusDTO dto)
        {
            var newStatus = dto.Status?.Trim();

            if (string.IsNullOrWhiteSpace(newStatus) || !ValidStatuses.Contains(newStatus))
            {
                throw new ApplicationValidationException(
                    new Dictionary<string, string[]>
                    {
                        ["status"] = new[] { $"Trạng thái không hợp lệ. Các trạng thái cho phép: {string.Join(", ", ValidStatuses)}" }
                    });
            }

            var order = await _orderRepository.GetByIdAsync(orderId)
                ?? throw new NotFoundException("Đơn hàng", orderId);

            if (order.Status == "Delivered" || order.Status == "Cancelled")
            {
                throw new ConflictException($"Không thể cập nhật đơn hàng đã ở trạng thái '{order.Status}'.");
            }

            // Hoàn trả tồn kho khi hủy đơn
            if (newStatus == "Cancelled" && order.Status != "Cancelled")
            {
                foreach (var item in order.Items)
                {
                    item.ProductVariant.StockQuantity += item.Quantity;
                }
            }

            order.Status = newStatus;
            order.UpdatedAt = DateTime.UtcNow;

            await _orderRepository.UpdateAsync(order);
            await _orderRepository.SaveChangesAsync();

            return MapOrder(order);
        }

        // ── Private helpers ───────────────────────────────────────

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
                CustomerEmail = order.User?.Email,
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

