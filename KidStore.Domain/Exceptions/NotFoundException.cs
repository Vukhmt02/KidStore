namespace KidStore.Domain.Exceptions;

/// <summary>Exception khi resource không được tìm thấy (404)</summary>
public class NotFoundException : AppException
{
    public NotFoundException(string message = "Resource không tồn tại.")
        : base(message) { }

    public NotFoundException(string resourceName, object key)
        : base($"{resourceName} với id '{key}' không tồn tại.") { }
}