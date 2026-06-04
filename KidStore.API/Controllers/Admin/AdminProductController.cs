

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KidStore.Application.Services;
using KidStore.Application.DTO;
namespace KidStore.API.Controllers.Admin;


[ApiController]
[Route("api/admin/products")]
[Authorize(Roles = "1")]
public class AdminProductsController : ControllerBase
{
    private readonly ProductService _productService;

    public AdminProductsController(ProductService productService)
    {
        _productService = productService;
    }

    // GET: api/admin/products
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _productService.GetAllAsync();

        return Ok(products);
    }

    // POST: api/admin/products
    [HttpPost]
    public async Task<IActionResult> Create(CreateProductDTO dto)
    {
        await _productService.CreateAsync(dto);

        return Ok(new
        {
            message = "Them san pham thanh cong"
        });
    }

    // PUT: api/admin/products/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateProductDTO dto)
    {
        var result = await _productService.UpdateAsync(id, dto);

        if (!result)
            return NotFound();

        return Ok(new
        {
            message = "Cap nhat san pham thanh cong"
        });
    }

    // DELETE: api/admin/products/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _productService.DeleteAsync(id);

        if (!result)
            return NotFound();

        return Ok(new
        {
            message = "Xóa sản phẩm thành công"
        });
    }
}