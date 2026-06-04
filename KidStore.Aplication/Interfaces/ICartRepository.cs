using KidStore.Domain.Entities;

namespace KidStore.Application.Interfaces
{
    public interface ICartRepository
    {
        Task<Cart?> GetByUserIdAsync(int userId);

        Task<CartItem?> GetItemByIdAsync(int cartItemId);

        Task<ProductVariant?> GetProductVariantByIdAsync(int productVariantId);

        Task AddCartAsync(Cart cart);

        Task AddItemAsync(CartItem item);

        void RemoveItem(CartItem item);

        Task SaveChangesAsync();
    }
}
