using KidStore.Application.Interfaces;
using KidStore.Domain.Entities;
using KidStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KidStore.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x => x.Email.ToLower() == email);
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _context.Users
                .AnyAsync(x => x.Email.ToLower() == email);
        }

        public async Task<User> AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        // ── Admin ─────────────────────────────────────────────────

        public async Task<List<User>> GetAllCustomersAsync()
        {
            return await _context.Users
                .AsNoTracking()
                .Where(u => u.Role == 0)
                .Include(u => u.Orders)
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> ToggleActiveAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null || user.Role == 1)
                return false;

            user.IsActive = !user.IsActive;

            // Thu hồi tất cả refresh token khi khóa tài khoản
            if (!user.IsActive)
            {
                var tokens = await _context.RefreshTokens
                    .Where(t => t.UserId == userId && !t.IsRevoked)
                    .ToListAsync();

                foreach (var token in tokens)
                {
                    token.IsRevoked = true;
                    token.RevokedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        // ── RefreshToken ──────────────────────────────────────────

        public async Task<RefreshToken?> GetActiveRefreshTokenByHashAsync(string tokenHash)
        {
            return await _context.RefreshTokens
                .Include(x => x.User)
                .FirstOrDefaultAsync(x =>
                    x.TokenHash == tokenHash
                    && !x.IsRevoked
                    && x.ExpiresAt > DateTime.UtcNow);
        }

        public async Task AddRefreshTokenAsync(RefreshToken token)
        {
            await _context.RefreshTokens.AddAsync(token);
            await _context.SaveChangesAsync();
        }

        public async Task RevokeRefreshTokenAsync(RefreshToken token, string? revokedByIp = null)
        {
            token.IsRevoked = true;
            token.RevokedAt = DateTime.UtcNow;
            token.RevokedByIp = revokedByIp;
            await _context.SaveChangesAsync();
        }

        public async Task RevokeAllRefreshTokensAsync(int userId)
        {
            var tokens = await _context.RefreshTokens
                .Where(x => x.UserId == userId && !x.IsRevoked)
                .ToListAsync();

            foreach (var token in tokens)
            {
                token.IsRevoked = true;
                token.RevokedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
        }
    }
}
