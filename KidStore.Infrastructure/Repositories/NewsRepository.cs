using KidStore.Application.Interfaces;
using KidStore.Domain.Entities;
using KidStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KidStore.Infrastructure.Repositories
{
    public class NewsRepository : INewsRepository
    {
        private readonly AppDbContext _context;

        public NewsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<NewsArticle>> GetAllAsync()
        {
            return await _context.NewsArticles
                .AsNoTracking()
                .OrderByDescending(article => article.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<NewsArticle>> GetPublishedAsync()
        {
            return await _context.NewsArticles
                .AsNoTracking()
                .Where(article => article.IsPublished)
                .OrderByDescending(article => article.CreatedAt)
                .ToListAsync();
        }

        public async Task<NewsArticle?> GetByIdAsync(int id)
        {
            return await _context.NewsArticles.FindAsync(id);
        }

        public async Task<NewsArticle?> GetBySlugAsync(string slug)
        {
            return await _context.NewsArticles
                .AsNoTracking()
                .FirstOrDefaultAsync(article => article.Slug == slug);
        }

        public async Task<bool> SlugExistsAsync(string slug, int? excludedId = null)
        {
            return await _context.NewsArticles.AnyAsync(article =>
                article.Slug == slug && (!excludedId.HasValue || article.Id != excludedId.Value));
        }

        public async Task CreateAsync(NewsArticle article)
        {
            await _context.NewsArticles.AddAsync(article);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(NewsArticle article)
        {
            _context.NewsArticles.Update(article);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(NewsArticle article)
        {
            _context.NewsArticles.Remove(article);
            await _context.SaveChangesAsync();
        }
    }
}
