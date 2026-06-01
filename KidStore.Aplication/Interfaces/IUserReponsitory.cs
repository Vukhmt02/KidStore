using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KidStore.Domain.Entities;

namespace KidStore.Application.Interfaces
{
    
        
      public interface IUserRepository
      {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task<bool> ExistsByEmailAsync(string email);
        Task<User> AddAsync(User user);
        Task UpdateAsync(User user);

        Task<RefreshToken?> GetActiveRefreshTokenByHashAsync(string tokenHash);
        Task AddRefreshTokenAsync(RefreshToken token);
        Task RevokeRefreshTokenAsync(RefreshToken token, string? revokedByIp = null);
        Task RevokeAllRefreshTokensAsync(int userId);
      }
}

