using KidStore.Domain.Entities;

namespace KidStore.Application.Interfaces
{
    public interface INewsRepository
    {
        Task<List<NewsArticle>> GetAllAsync();

        Task<List<NewsArticle>> GetPublishedAsync();

        Task<NewsArticle?> GetByIdAsync(int id);

        Task<NewsArticle?> GetBySlugAsync(string slug);

        Task<bool> SlugExistsAsync(string slug, int? excludedId = null);

        Task CreateAsync(NewsArticle article);

        Task UpdateAsync(NewsArticle article);

        Task DeleteAsync(NewsArticle article);
    }
}
