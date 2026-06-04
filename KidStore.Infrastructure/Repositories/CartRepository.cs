using KidStore.Application.Interfaces;
using KidStore.Domain.Entities;
using KidStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KidStore.Infrastructure.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly AppDbContext _context;

        public CartRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Cart?> GetByUserIdAsync(int userId)
        {
            return await _context.Carts
                .Include(cart => cart.Items)
                    .ThenInclude(item => item.ProductVariant)
                        .ThenInclude(variant => variant.Product)
                            .ThenInclude(product => product!.Images)
                .Include(cart => cart.Items)
                    .ThenInclude(item => item.ProductVariant)
                        .ThenInclude(variant => variant.Size)
                .Include(cart => cart.Items)
                    .ThenInclude(item => item.ProductVariant)
                        .ThenInclude(variant => variant.Color)
                .FirstOrDefaultAsync(cart => cart.UserId == userId);
        }

        public async Task<CartItem?> GetItemByIdAsync(int cartItemId)
        {
            return await _context.CartItems.FindAsync(cartItemId);
        }

        public async Task<ProductVariant?> GetProductVariantByIdAsync(int productVariantId)
        {
            return await _context.Set<ProductVariant>()
                .Include(variant => variant.Product)
                .FirstOrDefaultAsync(variant => variant.Id == productVariantId);
        }

        public async Task AddCartAsync(Cart cart)
        {
            await _context.Carts.AddAsync(cart);
        }

        public async Task AddItemAsync(CartItem item)
        {
            await _context.CartItems.AddAsync(item);
        }

        public void RemoveItem(CartItem item)
        {
            _context.CartItems.Remove(item);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
