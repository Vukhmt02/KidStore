using KidStore.Domain.Entities;

namespace KidStore.Application.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order?> GetByIdAsync(int id);

        Task<List<Order>> GetByUserIdAsync(int userId);

        Task AddAsync(Order order);

        Task SaveChangesAsync();
    }
}
