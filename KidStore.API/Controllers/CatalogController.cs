using KidStore.Application.DTO;
using KidStore.Application.Services;
using KidStore.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KidStore.API.Controllers;

[ApiController]
[Route("api/catalog")]
public class CatalogController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ProductService _productService;

    public CatalogController(AppDbContext context, ProductService productService)
    {
        _context = context;
        _productService = productService;
    }

    [HttpGet("products")]
    public async Task<IActionResult> GetProducts([FromQuery] ProductQueryDTO query)
    {
        return Ok(await _productService.GetPublicProductsAsync(query));
    }

    [HttpGet("products/{id:int}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _productService.GetPublicProductByIdAsync(id);

        return product == null ? NotFound() : Ok(product);
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Categories
            .AsNoTracking()
            .Where(category => category.IsActive)
            .OrderBy(category => category.Name)
            .Select(category => new
            {
                category.Id,
                category.Name
            })
            .ToListAsync();

        return Ok(categories);
    }
}
