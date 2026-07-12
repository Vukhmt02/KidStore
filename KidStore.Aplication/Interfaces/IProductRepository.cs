using KidStore.Application.DTO;
using KidStore.Domain.Entities;

namespace KidStore.Application.Interfaces;

public interface IProductRepository
{
    Task<List<Product>> GetAllAsync();

    Task<(List<Product> Items, int TotalItems)> GetPublicPagedAsync(ProductQueryDTO query);

    Task<Product?> GetByIdAsync(int id);

    Task AddAsync(Product product);

    Task UpdateAsync(Product product);

    Task DeleteAsync(Product product);

    Task SaveChangesAsync();
}
