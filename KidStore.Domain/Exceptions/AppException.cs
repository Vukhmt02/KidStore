using System;
namespace KidStore.Domain.Exceptions
{
    public class AppException : System.Exception
    {
        public AppException(string message) : base(message) { }

        public AppException(string message, System.Exception innerException)
            : base(message, innerException) { }
    }
}