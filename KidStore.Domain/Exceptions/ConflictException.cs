namespace KidStore.Domain.Exceptions;

/// <summary>Exception khi xảy ra xung đột dữ liệu (409)</summary>
public class ConflictException : AppException
{
    public ConflictException(string message = "Dữ liệu bị xung đột.")
        : base(message) { }
}