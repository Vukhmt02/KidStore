
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KidStore.Domain.Exceptions;

/// <summary>Exception khi validation dữ liệu thất bại (400)</summary>
public class ApplicationValidationException : AppException
{
    public Dictionary<string, string[]> Errors { get; }

    public ApplicationValidationException(string message = "Dữ liệu không hợp lệ.")
        : base(message)
    {
        Errors = new Dictionary<string, string[]>();
    }

    public ApplicationValidationException(Dictionary<string, string[]> errors)
        : base("Dữ liệu không hợp lệ.")
    {
        Errors = errors ?? new Dictionary<string, string[]>();
    }
}
