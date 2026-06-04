using KidStore.Infrastructure.Data;
using KidStore.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KidStore.API.Controllers;

[ApiController]
[Route("api")]
public class CatalogOptionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CatalogOptionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("sizes")]
    public async Task<IActionResult> GetSizes()
    {
        var sizes = await _context.Set<Size>()
            .AsNoTracking()
            .OrderBy(x => x.Id)
            .ToListAsync();

        return Ok(sizes);
    }

    [HttpGet("colors")]
    public async Task<IActionResult> GetColors()
    {
        var colors = await _context.Set<Color>()
            .AsNoTracking()
            .OrderBy(x => x.Id)
            .ToListAsync();

        return Ok(colors);
    }
}
