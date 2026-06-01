using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KidStore.Domain.Entities
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string TokenHash { get; set; } = string.Empty; // lưu hash, không lưu plain
        public DateTime ExpiresAt { get; set; }
        public bool IsRevoked { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? CreatedByIp { get; set; }
        public string? RevokedByIp { get; set; }
        public DateTime? RevokedAt { get; set; }

        public bool IsActive => !IsRevoked && DateTime.UtcNow < ExpiresAt;

        // Navigation
        public User User { get; set; } = null!;
    }
}
