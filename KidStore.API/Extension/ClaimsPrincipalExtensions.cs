using System.Security.Claims;

namespace KidStore.API.Extensions
{
    /// <summary>Extension methods cho ClaimsPrincipal (User từ HttpContext)</summary>
    public static class ClaimsPrincipalExtensions
    {
        /// <summary>Lấy User ID từ JWT token claims</summary>
        /// <param name="user">ClaimsPrincipal (User) từ HttpContext</param>
        /// <returns>User ID (int), hoặc 0 nếu không tìm thấy</returns>
        public static int GetUserId(this ClaimsPrincipal user)
        {
            if (user == null)
                return 0;

            // Tìm claim "NameIdentifier" (đây là "sub" claim từ JWT)
            var idClaim = user.FindFirst(ClaimTypes.NameIdentifier)
                       ?? user.FindFirst("sub");

            if (idClaim != null && int.TryParse(idClaim.Value, out var userId))
                return userId;

            return 0;  // Không tìm thấy ID
        }

        /// <summary>Lấy Email từ JWT token claims</summary>
        public static string GetEmail(this ClaimsPrincipal user)
        {
            if (user == null)
                return string.Empty;

            return user.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty;
        }

        /// <summary>Lấy Role từ JWT token claims</summary>
        public static string GetRole(this ClaimsPrincipal user)
        {
            if (user == null)
                return string.Empty;

            return user.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
        }
    }
}