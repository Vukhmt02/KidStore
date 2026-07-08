using System;

namespace KidStore.Domain.Entities
{
    public class NewsArticle
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public string? Summary { get; set; }

        public string? Content { get; set; }

        public string? ImageUrl { get; set; }

        public string? YoutubeUrl { get; set; }

        public string? YoutubeVideoId { get; set; }

        public bool IsPublished { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
