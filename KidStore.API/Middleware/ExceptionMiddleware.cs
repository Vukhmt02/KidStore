using KidStore.Domain.Exceptions;
using System.Net;
using System.Text.Json;

namespace KidStore.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext ctx)
        {
            try
            {
                await _next(ctx);
            }
            catch (ApplicationValidationException ex)
            {
                await WriteResponseAsync(ctx, HttpStatusCode.BadRequest, new
                {
                    status = 400,
                    message = ex.Message,
                    errors = ex.Errors
                });
            }
            catch (UnauthorizedException ex)
            {
                await WriteResponseAsync(ctx, HttpStatusCode.Unauthorized, new
                {
                    status = 401,
                    message = ex.Message
                });
            }
            catch (ForbiddenException ex)
            {
                await WriteResponseAsync(ctx, HttpStatusCode.Forbidden, new
                {
                    status = 403,
                    message = ex.Message
                });
            }
            catch (NotFoundException ex)
            {
                await WriteResponseAsync(ctx, HttpStatusCode.NotFound, new
                {
                    status = 404,
                    message = ex.Message
                });
            }
            catch (ConflictException ex)
            {
                await WriteResponseAsync(ctx, HttpStatusCode.Conflict, new
                {
                    status = 409,
                    message = ex.Message
                });
            }
            catch (AppException ex)
            {
                _logger.LogWarning(ex, "Application exception: {Message}", ex.Message);
                await WriteResponseAsync(ctx, HttpStatusCode.InternalServerError, new
                {
                    status = 500,
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
                await WriteResponseAsync(ctx, HttpStatusCode.InternalServerError, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."
                });
            }
        }

        private static async Task WriteResponseAsync(HttpContext ctx, HttpStatusCode code, object body)
        {
            ctx.Response.ContentType = "application/json";
            ctx.Response.StatusCode = (int)code;

            var json = JsonSerializer.Serialize(body, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
            await ctx.Response.WriteAsync(json);
        }
    }
}