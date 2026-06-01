using KidStore.Application.Interfaces;
using KidStore.Domain.Entities;
using KidStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
                .FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _context.Users
                .AnyAsync(x => x.Email == email);
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

        public Task<RefreshToken?> GetActiveRefreshTokenByHashAsync(string tokenHash)
        {
            throw new NotImplementedException();
        }

        public Task AddRefreshTokenAsync(RefreshToken token)
        {
            throw new NotImplementedException();
        }

        public Task RevokeRefreshTokenAsync(RefreshToken token, string? revokedByIp = null)
        {
            throw new NotImplementedException();
        }

        public Task RevokeAllRefreshTokensAsync(int userId)
        {
            throw new NotImplementedException();
        }
    }
}