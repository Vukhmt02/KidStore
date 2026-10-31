using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KidStore.API.Controllers.Admin;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/uploads")]
public class AdminUploadsController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public AdminUploadsController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpPost("image")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Vui lòng chọn file ảnh để tải lên." });
        }

        // Kiểm tra kích thước (tối đa 5MB)
        if (file.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new { message = "Kích thước ảnh tối đa là 5MB." });
        }

        // Kiểm tra định dạng file
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Định dạng ảnh không hợp lệ (chỉ nhận .jpg, .jpeg, .png, .webp, .gif)." });
        }

        var webRoot = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var uploadsFolder = Path.Combine(webRoot, "uploads");

        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var request = HttpContext.Request;
        var baseUrl = $"{request.Scheme}://{request.Host}";
        var imageUrl = $"{baseUrl}/uploads/{fileName}";

        return Ok(new
        {
            url = imageUrl,
            fileName = fileName,
            size = file.Length
        });
    }
}
