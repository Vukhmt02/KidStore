
namespace KidStore.Domain.Exceptions;

/// <summary>Exception khi user không có quyền truy cập (403)</summary>
public class ForbiddenException : AppException
{
    public ForbiddenException(string message = "Bạn không có quyền truy cập.")
        : base(message) { }
}