using System;

namespace KidStore.Application.DTO
{
    public class CreateNewsArticleDTO
    {
        public string Title { get; set; } = string.Empty;

        public string? Slug { get; set; }

        public string? Summary { get; set; }

        public string? Content { get; set; }

        public string? ImageUrl { get; set; }

        public string? YoutubeUrl { get; set; }

        public bool IsPublished { get; set; } = true;
    }

    public class UpdateNewsArticleDTO
    {
        public string Title { get; set; } = string.Empty;

        public string? Slug { get; set; }

        public string? Summary { get; set; }

        public string? Content { get; set; }

        public string? ImageUrl { get; set; }

        public string? YoutubeUrl { get; set; }

        public bool IsPublished { get; set; } = true;
    }

    public class NewsArticleResponseDTO
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public string? Summary { get; set; }

        public string? Content { get; set; }

        public string? ImageUrl { get; set; }

        public string? YoutubeUrl { get; set; }

        public string? YoutubeVideoId { get; set; }

        public bool IsPublished { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
