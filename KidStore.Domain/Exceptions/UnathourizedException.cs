using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KidStore.Domain.Exceptions;

/// <summary>Exception khi user chưa được xác thực (401)</summary>
public class UnauthorizedException : AppException
{
    public UnauthorizedException(string message = "Bạn chưa được xác thực.")
        : base(message) { }
}
