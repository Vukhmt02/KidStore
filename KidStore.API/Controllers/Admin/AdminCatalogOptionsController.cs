using KidStore.Domain.Entities;
using KidStore.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KidStore.API.Controllers.Admin;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/catalog-options")]
public class AdminCatalogOptionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminCatalogOptionsController(AppDbContext context)
    {
        _context = context;
    }

    // ────────────────────────── SIZES ──────────────────────────

    [HttpGet("sizes")]
    public async Task<IActionResult> GetSizes()
    {
        var sizes = await _context.Set<Size>()
            .AsNoTracking()
            .OrderBy(x => x.Id)
            .Select(s => new
            {
                s.Id,
                s.Name,
                ProductCount = s.ProductVariants.Count
            })
            .ToListAsync();

        return Ok(sizes);
    }

    [HttpPost("sizes")]
    public async Task<IActionResult> CreateSize([FromBody] SizeDto dto)
    {
        var name = dto.Name?.Trim();
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest(new { message = "Tên size không được để trống." });

        var exists = await _context.Set<Size>().AnyAsync(x => x.Name.ToLower() == name.ToLower());
        if (exists)
            return Conflict(new { message = $"Size '{name}' đã tồn tại." });

        var size = new Size { Name = name };
        await _context.Set<Size>().AddAsync(size);
        await _context.SaveChangesAsync();

        return Created($"api/admin/catalog-options/sizes/{size.Id}", size);
    }

    [HttpPut("sizes/{id:int}")]
    public async Task<IActionResult> UpdateSize(int id, [FromBody] SizeDto dto)
    {
        var name = dto.Name?.Trim();
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest(new { message = "Tên size không được để trống." });

        var size = await _context.Set<Size>().FindAsync(id);
        if (size == null)
            return NotFound(new { message = "Không tìm thấy kích thước." });

        var exists = await _context.Set<Size>().AnyAsync(x => x.Id != id && x.Name.ToLower() == name.ToLower());
        if (exists)
            return Conflict(new { message = $"Size '{name}' đã tồn tại." });

        size.Name = name;
        await _context.SaveChangesAsync();

        return Ok(size);
    }

    [HttpDelete("sizes/{id:int}")]
    public async Task<IActionResult> DeleteSize(int id)
    {
        var size = await _context.Set<Size>()
            .Include(x => x.ProductVariants)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (size == null)
            return NotFound(new { message = "Không tìm thấy kích thước." });

        if (size.ProductVariants.Any())
            return Conflict(new { message = "Không thể xóa size này vì đang có sản phẩm sử dụng." });

        _context.Set<Size>().Remove(size);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // ────────────────────────── COLORS ──────────────────────────

    [HttpGet("colors")]
    public async Task<IActionResult> GetColors()
    {
        var colors = await _context.Set<Color>()
            .AsNoTracking()
            .OrderBy(x => x.Id)
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.HexCode,
                ProductCount = c.ProductVariants.Count
            })
            .ToListAsync();

        return Ok(colors);
    }

    [HttpPost("colors")]
    public async Task<IActionResult> CreateColor([FromBody] ColorDto dto)
    {
        var name = dto.Name?.Trim();
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest(new { message = "Tên màu không được để trống." });

        var exists = await _context.Set<Color>().AnyAsync(x => x.Name.ToLower() == name.ToLower());
        if (exists)
            return Conflict(new { message = $"Màu '{name}' đã tồn tại." });

        var color = new Color
        {
            Name = name,
            HexCode = string.IsNullOrWhiteSpace(dto.HexCode) ? "#000000" : dto.HexCode.Trim()
        };

        await _context.Set<Color>().AddAsync(color);
        await _context.SaveChangesAsync();

        return Created($"api/admin/catalog-options/colors/{color.Id}", color);
    }

    [HttpPut("colors/{id:int}")]
    public async Task<IActionResult> UpdateColor(int id, [FromBody] ColorDto dto)
    {
        var name = dto.Name?.Trim();
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest(new { message = "Tên màu không được để trống." });

        var color = await _context.Set<Color>().FindAsync(id);
        if (color == null)
            return NotFound(new { message = "Không tìm thấy màu sắc." });

        var exists = await _context.Set<Color>().AnyAsync(x => x.Id != id && x.Name.ToLower() == name.ToLower());
        if (exists)
            return Conflict(new { message = $"Màu '{name}' đã tồn tại." });

        color.Name = name;
        if (!string.IsNullOrWhiteSpace(dto.HexCode))
            color.HexCode = dto.HexCode.Trim();

        await _context.SaveChangesAsync();

        return Ok(color);
    }

    [HttpDelete("colors/{id:int}")]
    public async Task<IActionResult> DeleteColor(int id)
    {
        var color = await _context.Set<Color>()
            .Include(x => x.ProductVariants)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (color == null)
            return NotFound(new { message = "Không tìm thấy màu sắc." });

        if (color.ProductVariants.Any())
            return Conflict(new { message = "Không thể xóa màu này vì đang có sản phẩm sử dụng." });

        _context.Set<Color>().Remove(color);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class SizeDto
{
    public string Name { get; set; } = string.Empty;
}

public class ColorDto
{
    public string Name { get; set; } = string.Empty;
    public string? HexCode { get; set; }
}
