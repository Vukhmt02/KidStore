using KidStore.Application.DTO;
using KidStore.Application.Interfaces;
using KidStore.Domain.Entities;
using KidStore.Domain.Exceptions;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace KidStore.Application.Services
{
    public class NewsService
    {
        private readonly INewsRepository _newsRepository;

        public NewsService(INewsRepository newsRepository)
        {
            _newsRepository = newsRepository;
        }

        public async Task<List<NewsArticleResponseDTO>> GetAllAsync()
        {
            var articles = await _newsRepository.GetAllAsync();

            return articles.Select(MapToResponse).ToList();
        }

        public async Task<List<NewsArticleResponseDTO>> GetPublishedAsync()
        {
            var articles = await _newsRepository.GetPublishedAsync();

            return articles.Select(MapToResponse).ToList();
        }

        public async Task<NewsArticleResponseDTO?> GetByIdAsync(int id)
        {
            var article = await _newsRepository.GetByIdAsync(id);

            return article == null ? null : MapToResponse(article);
        }

        public async Task<NewsArticleResponseDTO?> GetPublishedBySlugAsync(string slug)
        {
            var article = await _newsRepository.GetBySlugAsync(slug);

            if (article == null || !article.IsPublished)
                return null;

            return MapToResponse(article);
        }

        public async Task<NewsArticleResponseDTO> CreateAsync(CreateNewsArticleDTO dto)
        {
            ValidateTitle(dto.Title);

            var slug = await CreateUniqueSlugAsync(dto.Slug, dto.Title);
            var article = new NewsArticle
            {
                Title = dto.Title.Trim(),
                Slug = slug,
                Summary = NormalizeOptionalText(dto.Summary),
                Content = NormalizeOptionalText(dto.Content),
                ImageUrl = NormalizeOptionalText(dto.ImageUrl),
                YoutubeUrl = NormalizeOptionalText(dto.YoutubeUrl),
                YoutubeVideoId = ExtractYoutubeVideoId(dto.YoutubeUrl),
                IsPublished = dto.IsPublished,
                CreatedAt = DateTime.UtcNow
            };

            await _newsRepository.CreateAsync(article);

            return MapToResponse(article);
        }

        public async Task<NewsArticleResponseDTO> UpdateAsync(int id, UpdateNewsArticleDTO dto)
        {
            ValidateTitle(dto.Title);

            var article = await _newsRepository.GetByIdAsync(id);

            if (article == null)
                throw new NotFoundException("Tin tức", id);

            article.Title = dto.Title.Trim();
            article.Slug = await CreateUniqueSlugAsync(dto.Slug, dto.Title, id);
            article.Summary = NormalizeOptionalText(dto.Summary);
            article.Content = NormalizeOptionalText(dto.Content);
            article.ImageUrl = NormalizeOptionalText(dto.ImageUrl);
            article.YoutubeUrl = NormalizeOptionalText(dto.YoutubeUrl);
            article.YoutubeVideoId = ExtractYoutubeVideoId(dto.YoutubeUrl);
            article.IsPublished = dto.IsPublished;
            article.UpdatedAt = DateTime.UtcNow;

            await _newsRepository.UpdateAsync(article);

            return MapToResponse(article);
        }

        public async Task DeleteAsync(int id)
        {
            var article = await _newsRepository.GetByIdAsync(id);

            if (article == null)
                throw new NotFoundException("Tin tức", id);

            await _newsRepository.DeleteAsync(article);
        }

        private async Task<string> CreateUniqueSlugAsync(string? requestedSlug, string title, int? excludedId = null)
        {
            var baseSlug = Slugify(string.IsNullOrWhiteSpace(requestedSlug) ? title : requestedSlug);
            var slug = baseSlug;
            var suffix = 2;

            while (await _newsRepository.SlugExistsAsync(slug, excludedId))
            {
                slug = $"{baseSlug}-{suffix}";
                suffix++;
            }

            return slug;
        }

        private static void ValidateTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ApplicationValidationException("Vui lòng nhập tiêu đề tin tức");
        }

        private static string Slugify(string value)
        {
            var normalized = value.Normalize(NormalizationForm.FormD);
            var builder = new StringBuilder();

            foreach (var character in normalized)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(character);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                    builder.Append(character);
            }

            var withoutDiacritics = builder.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();
            var slug = Regex.Replace(withoutDiacritics, "[^a-z0-9]+", "-").Trim('-');

            return string.IsNullOrWhiteSpace(slug) ? "tin-tuc" : slug;
        }

        private static string? NormalizeOptionalText(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        }

        private static string? ExtractYoutubeVideoId(string? youtubeUrl)
        {
            if (string.IsNullOrWhiteSpace(youtubeUrl))
                return null;

            if (!Uri.TryCreate(youtubeUrl.Trim(), UriKind.Absolute, out var uri))
                return null;

            var host = uri.Host.ToLowerInvariant();

            if (host.Contains("youtu.be"))
                return uri.AbsolutePath.Trim('/').Split('/').FirstOrDefault();

            if (!host.Contains("youtube.com"))
                return null;

            if (uri.AbsolutePath.StartsWith("/embed/", StringComparison.OrdinalIgnoreCase) ||
                uri.AbsolutePath.StartsWith("/shorts/", StringComparison.OrdinalIgnoreCase))
            {
                return uri.AbsolutePath.Trim('/').Split('/').Skip(1).FirstOrDefault();
            }

            var query = uri.Query.TrimStart('?').Split('&', StringSplitOptions.RemoveEmptyEntries);
            foreach (var item in query)
            {
                var parts = item.Split('=', 2);
                if (parts.Length == 2 && parts[0] == "v")
                    return Uri.UnescapeDataString(parts[1]);
            }

            return null;
        }

        private static NewsArticleResponseDTO MapToResponse(NewsArticle article)
        {
            return new NewsArticleResponseDTO
            {
                Id = article.Id,
                Title = article.Title,
                Slug = article.Slug,
                Summary = article.Summary,
                Content = article.Content,
                ImageUrl = article.ImageUrl,
                YoutubeUrl = article.YoutubeUrl,
                YoutubeVideoId = article.YoutubeVideoId,
                IsPublished = article.IsPublished,
                CreatedAt = article.CreatedAt,
                UpdatedAt = article.UpdatedAt
            };
        }
    }
}
